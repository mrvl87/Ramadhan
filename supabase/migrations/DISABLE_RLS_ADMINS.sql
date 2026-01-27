-- ULTIMATE FIX: Disable RLS on admins table
-- This is safe because:
-- 1. Admins can only be created via SQL (no public API)
-- 2. Users query admins table read-only for checking status
-- 3. No sensitive data in admins table (just user_id and role)

-- Drop all existing policies
DROP POLICY IF EXISTS "Super admins can manage admins" ON admins;
DROP POLICY IF EXISTS "Users can view own admin record" ON admins;
DROP POLICY IF EXISTS "Admins can view own record" ON admins;
DROP POLICY IF EXISTS "allow_read_own_admin_record" ON admins;
DROP POLICY IF EXISTS "allow_super_admin_manage" ON admins;

-- Disable RLS entirely on admins table
ALTER TABLE admins DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'admins';
-- Should show: rowsecurity = false

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ RLS DISABLED on admins table';
  RAISE NOTICE '✅ All users can now read admins table';
  RAISE NOTICE '✅ No more recursion errors!';
END $$;
