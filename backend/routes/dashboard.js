const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing for dashboard routes.');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET /api/dashboard/stats - Retrieve dashboard statistics for the authenticated Pro
router.get('/stats', authenticateUser, async (req, res) => {
  const proUserId = req.user.id;

  try {
    // Fetch total packages sent
    const { count: totalPackages, error: totalError } = await supabase
      .from('packages')
      .select('id', { count: 'exact', head: true }) // head:true to only get count
      .eq('pro_user_id', proUserId);

    if (totalError) {
      console.error('Supabase error fetching total packages count:', totalError);
      return res.status(500).json({ error: 'Failed to retrieve total packages count.' });
    }

    // Fetch packages pending/in-progress (e.g., 'sent', 'viewed', 'partially_signed', 'documents_pending_review', 'payment_pending')
    // The exact statuses considered "in-progress" might need refinement based on the package lifecycle.
    const inProgressStatuses = ['sent', 'viewed', 'partially_signed', 'documents_pending_review', 'payment_pending', 'documents_pending_upload'];
    const { count: pendingPackages, error: pendingError } = await supabase
      .from('packages')
      .select('id', { count: 'exact', head: true })
      .eq('pro_user_id', proUserId)
      .in('status', inProgressStatuses);

    if (pendingError) {
      console.error('Supabase error fetching pending packages count:', pendingError);
      return res.status(500).json({ error: 'Failed to retrieve pending packages count.' });
    }

    // Fetch packages completed
    const { count: completedPackages, error: completedError } = await supabase
      .from('packages')
      .select('id', { count: 'exact', head: true })
      .eq('pro_user_id', proUserId)
      .eq('status', 'completed');

    if (completedError) {
      console.error('Supabase error fetching completed packages count:', completedError);
      return res.status(500).json({ error: 'Failed to retrieve completed packages count.' });
    }
    
    // Fetch current credit balance
    const { data: credits, error: creditError } = await supabase
      .from('signature_credits')
      .select('balance')
      .eq('user_id', proUserId)
      .single();

    if (creditError) {
        // If PGRST116, it means no record, which implies 0 credits if signup didn't create one.
        // Or it's a genuine error. For stats, we can report 0 if not found or on error.
        console.warn('Supabase error fetching credits for dashboard stats (or no record):', creditError.message);
    }


    res.status(200).json({
      totalPackages: totalPackages || 0,
      pendingPackages: pendingPackages || 0,
      completedPackages: completedPackages || 0,
      signatureCreditsAvailable: credits ? credits.balance : 0,
      // More stats can be added here:
      // - Packages declined
      // - Revenue from packages (if direct payments to Pro were tracked)
      // - Average completion time etc.
    });

  } catch (err) {
    console.error('Unexpected error retrieving dashboard stats:', err);
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});

module.exports = router;
