const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/authenticateAdmin');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client with Service Role Key for admin-level data access
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Supabase URL or Service Role Key is missing for adminReports routes.');
}
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// GET /api/admin/credits-overview - Monitor signature credit usage
router.get('/credits-overview', authenticateAdmin, async (req, res) => {
  try {
    // Total credits purchased by all users
    const { data: totalPurchasedData, error: totalPurchasedError } = await supabase
      .from('credit_purchases')
      .select('credits_purchased')
      .then(response => {
        if (response.error) return response;
        const sum = response.data.reduce((acc, curr) => acc + (curr.credits_purchased || 0), 0);
        return { data: { sum }, error: null };
      });

    if (totalPurchasedError) {
      console.error('Supabase error fetching total credits purchased:', totalPurchasedError);
      return res.status(500).json({ error: 'Failed to retrieve total credits purchased.' });
    }
    const totalCreditsPurchased = totalPurchasedData ? totalPurchasedData.sum : 0;

    // Total credits remaining across all users
    const { data: totalRemainingData, error: totalRemainingError } = await supabase
      .from('signature_credits')
      .select('balance') // balance is NUMERIC(10,2)
      .then(response => {
        if (response.error) return response;
        const sum = response.data.reduce((acc, curr) => acc + (parseFloat(curr.balance) || 0), 0);
        return { data: { sum: parseFloat(sum.toFixed(2)) }, error: null }; // Ensure sum is also float with 2 decimal places
      });

    if (totalRemainingError) {
      console.error('Supabase error fetching total credits remaining:', totalRemainingError);
      return res.status(500).json({ error: 'Failed to retrieve total credits remaining.' });
    }
    const totalCreditsRemaining = totalRemainingData ? totalRemainingData.sum : 0;
    
    // Number of users with low balances (e.g., < 5 credits)
    const lowBalanceThreshold = 5.00;
    const { count: lowBalanceUsersCount, error: lowBalanceError } = await supabase
      .from('signature_credits')
      .select('user_id', { count: 'exact', head: true })
      .lt('balance', lowBalanceThreshold); // Less than threshold

    if (lowBalanceError) {
      console.error('Supabase error fetching low balance users count:', lowBalanceError);
      // Non-fatal for the whole endpoint, can return 0 or null for this stat
    }

    res.status(200).json({
      totalCreditsPurchased: totalCreditsPurchased,
      totalCreditsRemaining: totalCreditsRemaining,
      usersWithLowBalanceCount: lowBalanceUsersCount !== null ? lowBalanceUsersCount : 'Error fetching count',
      lowBalanceThreshold: lowBalanceThreshold,
    });

  } catch (err) {
    console.error('Unexpected error retrieving credits overview:', err);
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});

// GET /api/admin/billing-reports - Retrieve billing report data
router.get('/billing-reports', authenticateAdmin, async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1; // For recent transactions list
  const limit = parseInt(req.query.limit, 10) || 10; // For recent transactions list
  const offset = (page - 1) * limit;

  try {
    // 1. Total revenue from credit pack purchases
    const { data: creditRevenueData, error: creditRevenueError } = await supabase
      .from('credit_purchases')
      .select('amount_paid') // amount_paid is in cents
      .then(response => {
        if (response.error) return response;
        const sum = response.data.reduce((acc, curr) => acc + (curr.amount_paid || 0), 0);
        return { data: { sum }, error: null };
      });

    if (creditRevenueError) {
      console.error('Supabase error fetching total credit purchase revenue:', creditRevenueError);
      return res.status(500).json({ error: 'Failed to retrieve credit purchase revenue.' });
    }
    const totalRevenueFromCredits = creditRevenueData ? creditRevenueData.sum : 0;

    // 2. Total revenue from subscriptions (Simplified for MVP)
    // This is a very rough estimation. True revenue requires tracking each Stripe invoice payment.
    // For MVP: Count active "Pro" subscriptions and multiply by assumed plan price.
    // Assuming Pro plan is $30 (3000 cents).
    const PRO_PLAN_MONTHLY_PRICE_CENTS = 3000; 
    const { count: activeProSubscriptions, error: activeSubError } = await supabase
      .from('subscriptions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('plan_name', 'Pro'); // Assuming plan_name 'Pro' for the $30 plan

    if (activeSubError) {
      console.error('Supabase error fetching active Pro subscriptions count:', activeSubError);
      return res.status(500).json({ error: 'Failed to retrieve active Pro subscriptions count.' });
    }
    // This is not total historical revenue, but an estimate of current monthly recurring revenue (MRR) from active Pro plans.
    const estimatedCurrentMrrFromProSubs = (activeProSubscriptions || 0) * PRO_PLAN_MONTHLY_PRICE_CENTS;


    // 3. List recent transactions (credit purchases and new subscriptions)
    // Fetch recent credit purchases
    const { data: recentCreditPurchases, error: recentCreditError } = await supabase
      .from('credit_purchases')
      .select('user_id, purchase_date, description, amount_paid, currency, credits_purchased, profiles(email, business_name)')
      .order('purchase_date', { ascending: false })
      .limit(limit); // Get X recent ones, pagination for full list would be separate

    if (recentCreditError) {
      console.error('Supabase error fetching recent credit purchases:', recentCreditError);
      // Non-fatal for the whole report
    }

    // Fetch recent new subscriptions (using created_at for "new")
    // This is a simplification. True "new subscription payments" would come from Stripe webhooks logging to a payments table.
    const { data: recentNewSubscriptions, error: recentSubError } = await supabase
      .from('subscriptions')
      .select('user_id, plan_name, status, created_at, current_period_start, current_period_end, profiles(email, business_name)')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (recentSubError) {
      console.error('Supabase error fetching recent new subscriptions:', recentSubError);
      // Non-fatal
    }
    
    // Format recent transactions for combined list (simplified, not paginated as a combined set here)
    const formattedRecentTransactions = [];
    if (recentCreditPurchases) {
        recentCreditPurchases.forEach(cp => formattedRecentTransactions.push({
            date: cp.purchase_date,
            type: 'Credit Purchase',
            description: cp.description || `${cp.credits_purchased} Credits`,
            amount: cp.amount_paid,
            currency: cp.currency,
            userEmail: cp.profiles?.email,
            userBusinessName: cp.profiles?.business_name,
        }));
    }
    if (recentNewSubscriptions) {
        recentNewSubscriptions.forEach(sub => formattedRecentTransactions.push({
            date: sub.created_at,
            type: 'New Subscription',
            description: `Plan: ${sub.plan_name} (${sub.status})`,
            // Amount for new sub is estimated, not from a direct payment record here
            amount: sub.plan_name === 'Pro' ? PRO_PLAN_MONTHLY_PRICE_CENTS : 0, 
            currency: 'usd',
            userEmail: sub.profiles?.email,
            userBusinessName: sub.profiles?.business_name,
        }));
    }
    // Sort combined recent transactions by date
    formattedRecentTransactions.sort((a,b) => new Date(b.date) - new Date(a.date));
    const paginatedRecentTransactions = formattedRecentTransactions.slice(0, limit); // Show top N combined for this MVP


    res.status(200).json({
      totalRevenueFromCredits: totalRevenueFromCredits / 100, // Convert to dollars
      estimatedCurrentMrrFromProSubs: estimatedCurrentMrrFromProSubs / 100, // Convert to dollars
      // Note: True total subscription revenue is complex and would ideally come from Stripe invoice data.
      recentTransactions: paginatedRecentTransactions, // This is a combined list of the most recent X of each type, then sorted.
                                                      // True pagination over combined items is more complex.
      // For more accurate paginated recent transactions (combined):
      // Would need a UNION query in SQL or fetch more data and paginate in code.
    });

  } catch (err) {
    console.error('Unexpected error retrieving billing reports:', err);
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});

module.exports = router;
