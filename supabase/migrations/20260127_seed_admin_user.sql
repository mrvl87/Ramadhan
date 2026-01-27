-- Seed Initial Admin User
-- Run this AFTER the main migration completes successfully
-- Replace YOUR_EMAIL_HERE with your actual admin email

-- First, get your user ID from auth.users
DO $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Find user by email (replace with your email)
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'official.glenlatuni@gmail.com'
  LIMIT 1;

  -- Check if user exists
  IF admin_user_id IS NULL THEN
    RAISE EXCEPTION 'User not found. Please replace YOUR_EMAIL_HERE with your actual email.';
  END IF;

  -- Insert admin record
  INSERT INTO admins (user_id, role, permissions, granted_by)
  VALUES (
    admin_user_id,
    'super_admin',
    '["*"]'::jsonb,  -- Full permissions
    admin_user_id    -- Self-granted
  )
  ON CONFLICT (user_id) DO NOTHING;

  RAISE NOTICE '✅ Super Admin granted to user: %', admin_user_id;
END $$;

-- Verify admin was created
SELECT 
  a.id,
  a.role,
  u.email,
  a.granted_at
FROM admins a
JOIN auth.users u ON a.user_id = u.id
WHERE a.revoked_at IS NULL;
