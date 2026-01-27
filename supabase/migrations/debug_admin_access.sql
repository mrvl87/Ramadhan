-- Quick Admin Debug & Fix
-- Run this in Supabase SQL Editor to diagnose and fix admin access

-- ============================================================================
-- STEP 1: VERIFY SETUP
-- ============================================================================

-- Check if admins table exists
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.tables 
      WHERE table_name = 'admins'
    ) 
    THEN '✅ admins table exists'
    ELSE '❌ admins table NOT found - run migration first!'
  END as table_status;

-- ============================================================================
-- STEP 2: FIND YOUR USER
-- ============================================================================

-- List all users
SELECT 
  id as user_id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- ============================================================================
-- STEP 3: CHECK ADMIN STATUS
-- ============================================================================

-- Check who is admin
SELECT 
  u.id as user_id,
  u.email,
  a.role,
  a.granted_at,
  a.revoked_at
FROM admins a
JOIN auth.users u ON a.user_id = u.id;

-- ============================================================================
-- STEP 4: GRANT ADMIN ACCESS (if needed)
-- ============================================================================

-- Replace the email below with your actual email
DO $$
DECLARE
  target_email TEXT := 'official.glenlatuni@gmail.com'; -- CHANGE THIS
  target_user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE email = target_email
  LIMIT 1;

  -- Check if user exists
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found. Please login first.', target_email;
  END IF;

  -- Grant admin access
  INSERT INTO admins (user_id, role, permissions, granted_by)
  VALUES (
    target_user_id,
    'super_admin',
    '["*"]'::jsonb,
    target_user_id
  )
  ON CONFLICT (user_id) DO UPDATE
  SET 
    role = 'super_admin',
    permissions = '["*"]'::jsonb,
    revoked_at = NULL;

  RAISE NOTICE '✅ Super admin granted to: % (ID: %)', target_email, target_user_id;
END $$;

-- ============================================================================
-- STEP 5: VERIFY IT WORKED
-- ============================================================================

-- Check admins again
SELECT 
  u.email,
  a.role,
  a.permissions
FROM admins a
JOIN auth.users u ON a.user_id = u.id
WHERE a.revoked_at IS NULL;
