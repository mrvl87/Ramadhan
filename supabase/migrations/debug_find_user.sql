-- DEBUG: Find Your User in Database
-- Run this FIRST to get your actual user ID and email

-- Step 1: List all users (to find your email)
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Step 2: Search for your email (case-insensitive)
SELECT 
  id,
  email,
  created_at
FROM auth.users
WHERE LOWER(email) LIKE '%glenlatuni%'
OR LOWER(email) LIKE '%official%';

-- Step 3: Get total user count
SELECT COUNT(*) as total_users FROM auth.users;
