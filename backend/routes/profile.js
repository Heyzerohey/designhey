const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser'); // Adjust path as needed
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Using anon key for server-side is okay if RLS is strong.
                                                    // For user-specific actions where RLS is based on auth.uid(),
                                                    // it's better to use the user's JWT passed to the Supabase client.
                                                    // However, for simple updates by ID where user is already authenticated by middleware, this can work.
                                                    // For more secure RLS, always use the user's token for Supabase client instance.

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing for profile routes. Please check your .env file.');
  // Consider throwing an error or ensuring app doesn't start if Supabase isn't configured.
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// PUT /api/profile - Setup or Update User Profile
router.put('/', authenticateUser, async (req, res) => {
  const userId = req.user.id;
  const { business_name, logo_url, contact_info } = req.body;

  if (!business_name && !logo_url && !contact_info) {
    return res.status(400).json({ error: 'At least one field (business_name, logo_url, contact_info) must be provided for update.' });
  }

  const profileDataToUpdate = {};
  if (business_name !== undefined) profileDataToUpdate.business_name = business_name;
  if (logo_url !== undefined) profileDataToUpdate.logo_url = logo_url;
  if (contact_info !== undefined) profileDataToUpdate.contact_info = contact_info;
  
  // Ensure `updated_at` is set. The DB trigger should handle this, but explicit is fine.
  profileDataToUpdate.updated_at = new Date();

  try {
    // Upsert logic: Insert if not exists (based on ID), or update if exists.
    // The `profiles` table should have `id` as PRIMARY KEY referencing `auth.users.id`.
    // A simple update is fine here since the profile row is expected to be created during signup.
    // If it might not exist, then an upsert is safer.
    // For this task, assuming profile row is created at signup.

    const { data, error } = await supabase
      .from('profiles')
      .update(profileDataToUpdate)
      .eq('id', userId)
      .select() // Return the updated profile
      .single(); // Expect a single row

    if (error) {
      console.error('Supabase error updating profile:', error);
      if (error.code === 'PGRST116' || error.message.includes('JSON object requested, multiple (or no) rows returned')) {
        // This means no profile found for the user ID, which shouldn't happen if signup creates it.
        // Or, multiple rows, which indicates a data integrity issue.
        return res.status(404).json({ error: 'Profile not found for this user. It should be created during signup.' });
      }
      return res.status(500).json({ error: `Failed to update profile: ${error.message}` });
    }

    if (!data) {
        // Fallback if Supabase returns null data without an error (unlikely for update with .single())
        return res.status(404).json({ error: 'Profile not found after update attempt.' });
    }

    res.status(200).json({ message: 'Profile updated successfully.', profile: data });

  } catch (err) {
    console.error('Unexpected error updating profile:', err);
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});


// GET /api/profile - Retrieve User Profile
router.get('/', authenticateUser, async (req, res) => {
  const userId = req.user.id;

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*') // Select all profile fields
      .eq('id', userId)
      .single(); // Expect one profile row per user

    if (error) {
      console.error('Supabase error fetching profile:', error);
      if (error.code === 'PGRST116' || error.message.includes('JSON object requested, multiple (or no) rows returned')) {
        return res.status(404).json({ error: 'Profile not found for this user.' });
      }
      return res.status(500).json({ error: `Failed to retrieve profile: ${error.message}` });
    }
    
    if (!profile) {
         // Fallback if Supabase returns null data without an error
        return res.status(404).json({ error: 'Profile not found.' });
    }

    res.status(200).json(profile);

  } catch (err) {
    console.error('Unexpected error retrieving profile:', err);
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});

module.exports = router;
