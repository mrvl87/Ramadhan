-- VERIFICATION SCRIPT FOR CREDIT CONSUMPTION
-- Replace 'YOUR_UUID_HERE' with your actual User ID

DO $$
DECLARE
  target_uuid UUID := 'YOUR_UUID_HERE'; -- <--- PASTE UUID HERE
  result jsonb;
BEGIN
  -- 1. Simulate Auth
  EXECUTE 'set request.jwt.claim.sub = ''' || target_uuid || '''';
  EXECUTE 'set role authenticated';

  -- 2. Call consume_credit
  -- Try to consume 1 credit for 'greeting_card_generation'
  SELECT public.consume_credit(target_uuid, 'greeting_card_generation') INTO result;
  
  -- 3. Show Result
  RAISE NOTICE 'Transaction Result: %', result;
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Transaction Failed: %', SQLERRM;
END $$;
