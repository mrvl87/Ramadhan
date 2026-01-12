-- VERIFICATION SCRIPT
-- The error "Access Denied" means the security check IS WORKING! 
-- To test the function successfully, we must "pretend" to be a logged-in user.

-- 1. First, run this to get a valid User ID:
select id, email from auth.users limit 1;

-- 2. Copy the UUID from step 1.
-- 3. Replace 'YOUR_UUID_HERE' below with that ID and Run the whole block:

DO $$
DECLARE
  target_uuid UUID := 'ba726e14-7a20-4e44-8a66-8c6e892c1644'; -- <--- PASTE UUID HERE
  result jsonb;
BEGIN
  -- Simulate being logged in as this user
  EXECUTE 'set request.jwt.claim.sub = ''' || target_uuid || '''';
  EXECUTE 'set role authenticated';

  -- Call the function safely
  SELECT public.get_user_entitlement(target_uuid) INTO result;
  
  -- Show the result (in Messages/Output)
  RAISE NOTICE 'Result: %', result;
END $$;
