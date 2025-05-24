const express = require('express');
const router = express.Router();
const authenticateAdmin = require('../middleware/authenticateAdmin');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
// For admin routes, especially those modifying user data or accessing all users,
// it's highly recommended to use the Supabase Service Role Key.
// The Anon key might be too restrictive due to RLS, even if the user is an admin in our app logic.
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Supabase URL or Service Role Key is missing for adminUsers routes. Ensure SUPABASE_SERVICE_ROLE_KEY is set.');
  // This route will not function correctly without proper Supabase config.
}
// Use service role key for admin operations to bypass RLS if necessary
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);


// GET /api/admin/users - Retrieve a list of all users
router.get('/users', authenticateAdmin, async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const offset = (page - 1) * limit;

  if (page < 1) return res.status(400).json({ error: 'Page number must be 1 or greater.' });
  if (limit < 1 || limit > 100) return res.status(400).json({ error: 'Limit must be between 1 and 100.' });

  try {
    // Fetch users from auth.users
    // Note: Directly querying auth.users might be restricted or require specific Supabase client setup.
    // Supabase provides admin functions for user listing if direct query is problematic.
    // For this example, we assume direct query with service role key is possible.
    // If not, use `supabase.auth.admin.listUsers()` which has its own pagination.
    
    // First, get total count of users (this is a simplified way, listUsers might be better)
    // This approach of getting all users then slicing is not scalable for large user bases.
    // `supabase.auth.admin.listUsers({ page, perPage: limit })` is the preferred method.
    // However, to join with profiles easily, a direct query approach is shown here,
    // which implies the service role key has sufficient permissions.
    
    // Let's try to use supabase.auth.admin.listUsers and then enrich with profiles
    const { data: usersResponse, error: usersError } = await supabase.auth.admin.listUsers({
        page: page,
        perPage: limit,
    });

    if (usersError) {
        console.error('Supabase error listing users:', usersError);
        return res.status(500).json({ error: `Failed to retrieve users: ${usersError.message}` });
    }
    
    const users = usersResponse.users;
    const totalCount = usersResponse.aud.length > 0 ? users.length : 0; // This is not total users in DB, but in current response.
                                                                         // listUsers() does not return total count directly without more logic.
                                                                         // For accurate totalCount, a separate count query or logic is needed.
                                                                         // For simplicity, we'll use the length of the returned array for this page count.
                                                                         // A proper total count might require a separate query like:
                                                                         // const { count, error } = await supabase.from('users').select('*', { count: 'exact', head: true }); (if 'users' view exists)

    if (!users || users.length === 0) {
      return res.status(200).json({ data: [], pagination: { totalItems: 0, currentPage: page, totalPages: 0, itemsPerPage: limit } });
    }

    // Get profile information for these users
    const userIds = users.map(u => u.id);
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, business_name, is_admin, stripe_customer_id') // Add other fields if needed from profiles
      .in('id', userIds);

    if (profilesError) {
      console.error('Supabase error fetching profiles for users:', profilesError);
      // Continue without profile data or return error? For admin, profile is important.
      return res.status(500).json({ error: `Failed to retrieve profiles: ${profilesError.message}` });
    }

    // Combine user data with profile data
    const combinedUsers = users.map(user => {
      const profile = profiles.find(p => p.id === user.id);
      return {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        last_sign_in_at: user.last_sign_in_at,
        // From profiles table:
        business_name: profile ? profile.business_name : null,
        is_admin: profile ? profile.is_admin : false,
        stripe_customer_id: profile ? profile.stripe_customer_id : null,
      };
    });
    
    // For accurate pagination, `totalCount` should be the total number of users in the system.
    // `supabase.auth.admin.listUsers` does not directly give total count of all users, only for the current page.
    // This is a known limitation. A workaround is to fetch all users (not feasible for large numbers)
    // or to perform a separate count, e.g. `SELECT count(*) FROM auth.users;` if allowed.
    // For this exercise, we'll use a placeholder for totalCount or acknowledge this limitation.
    // Let's assume a way to get total users for pagination calculation:
    // This is a conceptual placeholder for total user count
    const { data: totalUsersData, error: countError } = await supabase.rpc('count_users'); // Assuming an RPC function `count_users` exists
    const totalSystemUsers = countError ? 0 : totalUsersData;


    res.status(200).json({
      data: combinedUsers,
      pagination: {
        totalItems: totalSystemUsers, // This should be the actual total number of users in your system
        currentPage: page,
        totalPages: Math.ceil(totalSystemUsers / limit),
        itemsPerPage: limit,
      },
    });

  } catch (err) {
    console.error('Unexpected error retrieving users:', err);
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});


// PUT /api/admin/users/:userId/set-admin-status - Set or unset admin status for a user
router.put('/users/:userId/set-admin-status', authenticateAdmin, async (req, res) => {
  const { userId } = req.params;
  const { is_admin } = req.body; // Expecting { "is_admin": true } or { "is_admin": false }

  if (typeof is_admin !== 'boolean') {
    return res.status(400).json({ error: 'is_admin field (boolean) is required in the request body.' });
  }

  // Prevent admin from accidentally revoking their own admin status via this specific endpoint
  // They should manage their own status through other means or directly in DB if necessary.
  if (req.user.id === userId) {
    return res.status(403).json({ error: 'Admins cannot change their own admin status via this endpoint.' });
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_admin: is_admin, updated_at: new Date() })
      .eq('id', userId)
      .select('id, email, profiles(is_admin, business_name)') // Fetch updated profile to confirm
      .single(); // Ensure we are updating one user

    if (error) {
      console.error(`Supabase error updating admin status for user ${userId}:`, error);
      if (error.code === 'PGRST116') { // User profile not found
        return res.status(404).json({ error: 'User profile not found.' });
      }
      return res.status(500).json({ error: `Failed to update admin status: ${error.message}` });
    }

    if (!data) {
        return res.status(404).json({ error: 'User profile not found after update attempt.' });
    }

    // Re-fetch the user with profile to return full details
    const { data: updatedUser, error: fetchError } = await supabase.auth.admin.getUserById(userId);
    if (fetchError) throw fetchError; // Propagate error to main catch

    const { data: updatedProfile, error: profileFetchError } = await supabase
        .from('profiles')
        .select('is_admin, business_name')
        .eq('id', userId)
        .single();
    if (profileFetchError) throw profileFetchError;


    res.status(200).json({
      message: `User admin status updated successfully. User ${userId} is_admin set to ${is_admin}.`,
      user: {
        id: updatedUser.user.id,
        email: updatedUser.user.email,
        is_admin: updatedProfile.is_admin,
        business_name: updatedProfile.business_name,
      },
    });

  } catch (err) {
    console.error(`Unexpected error updating admin status for user ${userId}:`, err);
    res.status(500).json({ error: `An unexpected error occurred: ${err.message}` });
  }
});


module.exports = router;
