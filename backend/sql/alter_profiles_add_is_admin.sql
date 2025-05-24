-- SQL to add is_admin column to profiles table
ALTER TABLE profiles
ADD COLUMN is_admin BOOLEAN DEFAULT FALSE NOT NULL;

COMMENT ON COLUMN profiles.is_admin IS 'Flags if the user has administrative privileges.';

-- Optional: Grant an existing user admin rights manually in Supabase SQL editor after running this:
-- UPDATE profiles SET is_admin = TRUE WHERE id = 'your_user_id_to_be_admin';
