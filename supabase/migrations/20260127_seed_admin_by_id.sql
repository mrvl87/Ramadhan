-- ALTERNATIVE: Seed Admin User by USER ID (More Reliable)
-- Use this if email lookup fails

-- Step 1: Find your user ID first by running debug_find_user.sql
-- Step 2: Replace YOUR_USER_ID_HERE with the UUID from Step 1
-- Step 3: Run this query

DO $$
DECLARE
  admin_user_id uuid := 'YOUR_USER_ID_HERE'; -- Replace with actual UUID
BEGIN
  -- Verify user exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = admin_user_id) THEN
    RAISE EXCEPTION 'User ID % not found in auth.users', admin_user_id;
  END IF;

  -- Insert admin record
  INSERT INTO admins (user_id, role, permissions, granted_by)
  VALUES (
    admin_user_id,
    'super_admin',
    '["*"]'::jsonb,
    admin_user_id
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    role = 'super_admin',
    permissions = '["*"]'::jsonb,
    revoked_at = NULL;

  RAISE NOTICE '✅ Super Admin granted to user ID: %', admin_user_id;
END $$;

-- Verify admin was created
SELECT 
  a.id,
  a.role,
  a.permissions,
  u.email,
  u.id as user_id,
  a.granted_at
FROM admins a
JOIN auth.users u ON a.user_id = u.id
WHERE a.revoked_at IS NULL;
