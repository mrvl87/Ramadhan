-- FIX: Remove circular dependency in admins RLS policy
-- The is_admin() function queries admins table, which triggers RLS policy,
-- which calls is_admin() again → infinite recursion!

-- ============================================================================
-- SOLUTION: Drop problematic policies and recreate with simpler logic
-- ============================================================================

-- Step 1: Drop existing policies
DROP POLICY IF EXISTS "Super admins can manage admins" ON admins;
DROP POLICY IF EXISTS "Admins can view all transactions" ON transactions;
DROP POLICY IF EXISTS "Admins can view all generations" ON generations;
DROP POLICY IF EXISTS "Admins can view webhook logs" ON webhook_logs;
DROP POLICY IF EXISTS "Admins can view analytics" ON analytics_events;
DROP POLICY IF EXISTS "Admins can manage all content" ON cms_content;

-- Step 2: Recreate admins policies WITHOUT is_admin() function
-- Allow admins to read their own record (no recursion)
CREATE POLICY "Admins can view own record"
  ON admins FOR SELECT
  USING (user_id = auth.uid());

-- Super admins can manage all admins (simple check, no function call)
CREATE POLICY "Super admins can manage admins"
  ON admins FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM admins 
      WHERE role = 'super_admin' 
      AND revoked_at IS NULL
    )
  );

-- Step 3: Recreate other policies with direct query (not is_admin() function)
CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM admins WHERE revoked_at IS NULL
    )
  );

CREATE POLICY "Admins can view all generations"
  ON generations FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM admins WHERE revoked_at IS NULL
    )
  );

CREATE POLICY "Admins can view webhook logs"
  ON webhook_logs FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM admins WHERE revoked_at IS NULL
    )
  );

CREATE POLICY "Admins can view analytics"
  ON analytics_events FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM admins WHERE revoked_at IS NULL
    )
  );

CREATE POLICY "Admins can manage all content"
  ON cms_content FOR ALL
  USING (
    auth.uid() IN (
      SELECT user_id FROM admins WHERE revoked_at IS NULL
    )
  );

-- Step 4: Drop the problematic is_admin() function (we don't need it for RLS)
DROP FUNCTION IF EXISTS is_admin();

-- ============================================================================
-- VERIFY
-- ============================================================================

-- Check policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename IN ('admins', 'transactions', 'generations')
ORDER BY tablename, policyname;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Fixed infinite recursion in admins RLS policy';
  RAISE NOTICE '✅ Recreated all admin policies without is_admin() function';
END $$;
