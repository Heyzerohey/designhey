const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

// Initialize Supabase client
// Ensure .env file is created in the backend directory with these variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Please check your .env file in the backend directory.');
  // Optionally, throw an error to prevent the app from starting without Supabase config
  // throw new Error('Supabase URL or Anon Key is missing.');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Signup Route
router.post('/signup', async (req, res) => {
  const { email, password, business_name, contact_info } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      // Check for specific errors if needed, e.g., authError.message.includes('User already registered')
      return res.status(400).json({ error: authError.message });
    }

    if (!authData.user) {
        return res.status(500).json({ error: 'Signup successful, but no user data returned.' });
    }

    // User created in Supabase Auth. Now create entries in profiles and signature_credits.
    const userId = authData.user.id;

    // Create profile
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([{ 
        id: userId, 
        business_name: business_name || '', // Allow optional fields
        contact_info: contact_info || ''  // Allow optional fields
        // logo_url can be updated later
      }])
      .select(); // Important to select to get the inserted data or errors properly

    if (profileError) {
      console.error('Error creating profile:', profileError);
      // Potentially delete the auth user if profile creation fails to avoid orphaned auth user
      // await supabase.auth.api.deleteUser(userId); // Requires admin privileges
      return res.status(500).json({ error: `Signup succeeded but failed to create profile: ${profileError.message}` });
    }

    // Create signature credits
    const { data: creditsData, error: creditsError } = await supabase
      .from('signature_credits')
      .insert([{ user_id: userId, balance: 0 }]) // Free plan starts with 0 credits, or a defined free tier amount
      .select();

    if (creditsError) {
      console.error('Error creating signature credits:', creditsError);
      // Potentially delete the auth user and profile if credit creation fails
      return res.status(500).json({ error: `Signup succeeded but failed to initialize credits: ${creditsError.message}` });
    }

    // If using email confirmation, user object might be null until confirmed.
    // The session might also be null.
    // authData.session will be null if email confirmation is enabled in Supabase settings.
    // authData.user will contain the user details.

    // After creating Supabase user, profile, and initial credits, create Stripe customer
    let stripeCustomerId;
    try {
      const { getOrCreateStripeCustomer } = require('../services/stripeService'); // Supabase client is already initialized above
      // authData.user.email should be available and non-null here
      stripeCustomerId = await getOrCreateStripeCustomer(userId, authData.user.email, supabase);
      // The stripe_customer_id is already updated in the profile by getOrCreateStripeCustomer
    } catch (stripeError) {
      console.error(`Stripe customer creation failed for user ${userId}: ${stripeError.message}`);
      // This is not a fatal error for signup, so we'll log it and continue.
      // The customer can be created later upon first purchase attempt.
    }

    res.status(201).json({ 
        message: 'Signup successful. Please check your email for confirmation if enabled.', 
        user: authData.user, 
        profile: profileData ? profileData[0] : null, // This profile data might not yet have stripe_customer_id if it was just created by getOrCreateStripeCustomer
        credits: creditsData ? creditsData[0] : null,
        stripeCustomerId: stripeCustomerId // Return for immediate use if needed, though profile will have it too
    });

  } catch (error) {
    console.error('Unexpected error during signup:', error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred.' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // On successful login, data contains the session object and user details
    // data.session: { access_token, refresh_token, expires_in, token_type, user }
    // data.user: { id, email, created_at, ... }
    res.status(200).json({ message: 'Login successful', session: data.session, user: data.user });

  } catch (error) {
    console.error('Unexpected error during login:', error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred.' });
  }
});

// Logout Route
router.post('/logout', async (req, res) => {
  // The Supabase client needs a valid session (JWT) to logout the user.
  // This token is typically sent in the Authorization header.
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token is missing or malformed.' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // Use the token to set the session for the Supabase client instance for this request
    // This is one way to handle it; another is to have client-side call signOut directly.
    // For a stateless backend, the client should manage its token and remove it upon logout.
    // The backend's role here is to invalidate the token on Supabase's side if necessary.

    // const { error } = await supabase.auth.signOut(token); // Pass token if required by your setup
    const { error } = await supabase.auth.signOut(); // Often, client-side SDK handles token for signOut

    if (error) {
      // This error might occur if the token is already invalid or expired
      console.error('Error during logout:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ message: 'Logout successful' });

  } catch (error) {
    console.error('Unexpected error during logout:', error);
    res.status(500).json({ error: error.message || 'An unexpected error occurred.' });
  }
});

module.exports = router;
