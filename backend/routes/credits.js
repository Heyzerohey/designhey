const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing for credits routes.');
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// GET /api/credits/balance - Retrieve the authenticated Pro's signature credit balance
router.get('/balance', authenticateUser, async (req, res) => {
  const proUserId = req.user.id;

  try {
    const { data: credits, error } = await supabase
      .from('signature_credits')
      .select('balance, updated_at, last_purchased_at') // Include other relevant fields if needed
      .eq('user_id', proUserId)
      .single();

    if (error) {
      console.error('Supabase error fetching credit balance:', error);
      // If the user has no entry in signature_credits (e.g., signup process failed to create one),
      // PGRST116 "Row to be returned was not found" would occur.
      // This should ideally not happen if signup guarantees a credits row.
      if (error.code === 'PGRST116') {
        // Consider returning a default of 0 credits or an error indicating no credit account.
        // For now, let's assume a record should exist. If not, it's an issue.
        return res.status(404).json({ error: 'Signature credit record not found for this user.' });
      }
      return res.status(500).json({ error: `Failed to retrieve credit balance: ${error.message}` });
    }

    if (!credits) {
      // Fallback if Supabase returns null data without an error (e.g. if .maybeSingle() was used and no row)
      // With .single(), an error (PGRST116) is typically thrown if no row.
      return res.status(404).json({ error: 'Signature credit record not found.' });
    }

    res.status(200).json({
      user_id: proUserId, // For confirmation
      balance: credits.balance,
      last_updated_at: credits.updated_at,
      last_purchased_at: credits.last_purchased_at,
    });

  } catch (err) {
    console.error('Unexpected error retrieving credit balance:', err);
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});

module.exports = router;
