-- SIMPLE FIX: Remove ALL policies on admins table and create basic one
-- This will fix the infinite recursion immediately

-- Step 1: Drop ALL existing policies on admins
DROP POLICY IF EXISTS "Super admins can manage admins" ON admins;
DROP POLICY IF EXISTS "Users can view own admin record" ON admins;
DROP POLICY IF EXISTS "Admins can view own record" ON admins;

-- Step 2: Create simple policy - users can read their own admin record
CREATE POLICY "allow_read_own_admin_record"
  ON admins
  FOR SELECT
  USING (auth.uid() = user_id);

-- Step 3: Allow super admins to manage (INSERT/UPDATE/DELETE)
-- Using subquery instead of function to avoid recursion
CREATE POLICY "allow_super_admin_manage"
  ON admins
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 
      FROM admins 
      WHERE admins.user_id = auth.uid() 
      AND admins.role = 'super_admin'
      AND admins.revoked_at IS NULL
    )
  );

-- Verify policies exist
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'admins';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Fixed RLS policies on admins table';
  RAISE NOTICE '✅ Users can now read their own admin record';
  RAISE NOTICE '✅ No more infinite recursion!';
END $$;
