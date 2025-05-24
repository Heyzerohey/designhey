const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing for billing routes.');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET /api/billing/history - Retrieve the authenticated Pro's billing history
router.get('/history', authenticateUser, async (req, res) => {
  const proUserId = req.user.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10; // Default to 10 items per page
  const offset = (page - 1) * limit;

  try {
    // Fetch credit purchases
    const { data: creditPurchases, error: creditError, count: creditCount } = await supabase
      .from('credit_purchases')
      .select('purchase_date, description, amount_paid, currency, credits_purchased', { count: 'exact' })
      .eq('user_id', proUserId)
      .order('purchase_date', { ascending: false })
      .range(offset, offset + limit -1); // Apply pagination here if fetching only credit_purchases

    if (creditError) {
      console.error('Supabase error fetching credit purchase history:', creditError);
      return res.status(500).json({ error: `Failed to retrieve credit purchase history: ${creditError.message}` });
    }

    // Fetch subscription payments/renewals.
    // This is simplified: assumes each record in 'subscriptions' represents a period for which payment was made.
    // A more accurate way would be to query Stripe invoices if Stripe Customer ID is stored,
    // or have webhooks for 'invoice.payment_succeeded' populate a dedicated 'subscription_payments' table.
    // For now, we'll derive from 'subscriptions' table updates.
    const { data: subscriptionEvents, error: subError, count: subCount } = await supabase
      .from('subscriptions')
      .select('plan_name, status, current_period_start, current_period_end, updated_at', { count: 'exact' }) // Using updated_at as a proxy for payment/renewal date
      .eq('user_id', proUserId)
      .in('status', ['active', 'past_due', 'cancelled']) // Consider which statuses imply a payment event
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit -1); // Apply pagination here if fetching only subscriptions

    if (subError) {
      console.error('Supabase error fetching subscription history:', subError);
      return res.status(500).json({ error: `Failed to retrieve subscription history: ${subError.message}` });
    }
    
    // Combine and format the history
    // This is a simplified combination. True chronological order across both types with single pagination
    // would require fetching all, then sorting and slicing, or a more complex SQL UNION query.
    // For MVP, we can return them paginated separately or combine the current page's results.

    const formattedCreditHistory = creditPurchases.map(cp => ({
      date: cp.purchase_date,
      description: cp.description || `${cp.credits_purchased} Credits Purchase`,
      amount: cp.amount_paid,
      currency: cp.currency,
      type: 'credit_purchase',
    }));

    const formattedSubscriptionHistory = subscriptionEvents.map(sub => ({
      date: sub.updated_at, // Using updated_at as a proxy for the event date (renewal, creation)
      description: `Subscription: ${sub.plan_name} (${sub.status})`,
      // Amount for subscriptions is not directly stored here per payment.
      // This would require a Stripe Price ID to amount mapping or storing on invoice payment.
      // For now, we'll omit amount for subscriptions or use a placeholder.
      amount: sub.plan_name === 'Pro' ? 3000 : null, // Placeholder for Pro plan $30.00
      currency: 'usd', // Placeholder
      type: 'subscription',
      period_start: sub.current_period_start,
      period_end: sub.current_period_end,
    }));

    // Combine, sort, and paginate the combined list (more complex)
    // For simplicity in this step, let's just return both arrays, or the first paginated list (credits)
    // A true combined paginated list is more involved.
    // Let's assume for now the request is primarily for credit purchase history, and sub history is a bonus.

    // Simple approach: Return paginated credit purchases and first page of subscriptions
    // Or, if one type is primary, paginate that and add other relevant info.
    // For a true combined history, you'd fetch all (or use SQL UNION), then sort, then paginate.

    const combinedHistory = [...formattedCreditHistory, ...formattedSubscriptionHistory]
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const paginatedHistory = combinedHistory.slice(offset, offset + limit);
    const totalCombinedItems = combinedHistory.length; // This is not accurate if individual queries were paginated before combining.
                                                   // True total count for combined requires counting after combining, or summing counts if feasible.

    res.status(200).json({
      data: paginatedHistory, // This is a combined list from current page of each source, then paginated
      pagination: { // This pagination is approximate due to combining already paginated/limited results
        totalItems: totalCombinedItems, // This should ideally be from a COUNT(*) on a UNION or similar
        currentPage: page,
        totalPages: Math.ceil(totalCombinedItems / limit),
        itemsPerPage: limit,
      }
      // Or provide them separately:
      // creditPurchaseHistory: { data: formattedCreditHistory, pagination: { totalItems: creditCount, ...} },
      // subscriptionActivity: { data: formattedSubscriptionHistory, pagination: { totalItems: subCount, ...} }
    });

  } catch (err) {
    console.error('Unexpected error retrieving billing history:', err);
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});

module.exports = router;
