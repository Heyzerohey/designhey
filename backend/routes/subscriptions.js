const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing for subscriptions routes.');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET /api/subscriptions/status - Retrieve the authenticated Pro's current subscription status
router.get('/status', authenticateUser, async (req, res) => {
  const proUserId = req.user.id;

  try {
    // Fetch the most recent active/trialing/past_due subscription for the user.
    // Ordering by created_at or current_period_end might be useful if multiple records could exist.
    // For simplicity, assuming a user has at most one "definitive" subscription record we care about.
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('plan_name, status, current_period_start, current_period_end, stripe_subscription_id')
      .eq('user_id', proUserId)
      // Filter for statuses that are considered "current" or "relevant for display"
      // e.g., 'active', 'trialing', 'past_due'. 'cancelled' might be relevant too.
      // This depends on how much history/detail the user should see here.
      // For "current status", active or trialing is most common.
      .in('status', ['active', 'trialing', 'past_due', 'incomplete']) // Add other relevant statuses
      .order('created_at', { ascending: false }) // Get the latest one if multiple match
      .maybeSingle(); // Use maybeSingle as user might have no active subscription or multiple records over time

    if (error) {
      console.error('Supabase error fetching subscription status:', error);
      return res.status(500).json({ error: `Failed to retrieve subscription status: ${error.message}` });
    }

    if (!subscription) {
      // No current active, trialing, or past_due subscription found.
      // This could mean they are on a free plan, or subscription was cancelled and fully ended.
      return res.status(200).json({ 
        message: 'No active subscription found.',
        status: 'inactive', // A custom status to indicate no current paid/trialing plan
        plan_name: 'Free Plan', // Or simply null
        current_period_start: null,
        current_period_end: null,
        stripe_subscription_id: null,
      });
    }

    res.status(200).json({
      plan_name: subscription.plan_name,
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      stripe_subscription_id: subscription.stripe_subscription_id, // For potential "manage billing" link
    });

  } catch (err) {
    console.error('Unexpected error retrieving subscription status:', err);
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});

module.exports = router;
