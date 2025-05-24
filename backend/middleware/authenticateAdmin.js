const authenticateUser = require('./authenticateUser'); // Assumes authenticateUser.js is in the same directory
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client (needed to check the profiles table)
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY; // Using anon key as this middleware might run before user-specific RLS is fully needed for this check.
                                                    // Or, could use service_role key if available and preferred for admin checks.

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing for authenticateAdmin middleware.');
  // This middleware will not function correctly without Supabase config.
}
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const authenticateAdmin = async (req, res, next) => {
  // First, ensure the user is authenticated.
  // Calling authenticateUser middleware directly.
  authenticateUser(req, res, async () => {
    // If authenticateUser calls next(), then req.user should be populated.
    // If it sends a response (e.g. 401), this part won't be reached.
    // Need to check if req.user exists in case authenticateUser had an issue but didn't end response.
    if (!req.user || !req.user.id) {
      // This case should ideally be handled by authenticateUser sending a response.
      // If it reaches here, it means authenticateUser failed to set req.user or didn't stop the chain.
      return res.status(401).json({ error: 'User authentication failed before admin check.' });
    }

    const userId = req.user.id;

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single();

      if (error) {
        console.error(`Admin Check: Supabase error fetching profile for user ${userId}:`, error);
        return res.status(500).json({ error: 'Error verifying admin privileges.' });
      }

      if (!profile || !profile.is_admin) {
        return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
      }

      // User is an admin, proceed to the next handler.
      next();

    } catch (err) {
      console.error(`Admin Check: Unexpected error for user ${userId}:`, err);
      res.status(500).json({ error: 'An unexpected error occurred during admin verification.' });
    }
  });
};

module.exports = authenticateAdmin;
