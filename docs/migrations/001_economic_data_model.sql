-- Migration: 001_economic_data_model
-- Goal: Add 'pro_expires_at' and 'get_user_entitlement' function

-- 1. Add pro_expires_at column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'pro_expires_at') THEN
        ALTER TABLE public.users ADD COLUMN pro_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
    END IF;
END $$;

-- 2. Create get_user_entitlement function
CREATE OR REPLACE FUNCTION public.get_user_entitlement(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  u_plan text;
  u_credits int;
  u_expires_at timestamptz;
  is_pro boolean;
  can_generate boolean;
  can_download_hd boolean;
BEGIN
  -- Strict Access Control: Only allow if the requestor is the user themselves
  -- Note: We use auth.uid() which is available in Supabase context
  IF auth.uid() IS NULL OR auth.uid() <> target_user_id THEN
    RAISE EXCEPTION 'Access Denied: You can only check your own entitlement.';
  END IF;

  -- Fetch user data
  SELECT plan, credits, pro_expires_at
  INTO u_plan, u_credits, u_expires_at
  FROM public.users
  WHERE id = target_user_id;

  -- Determine IS_PRO
  -- User is pro if plan is 'pro' AND the expiration date is in the future
  is_pro := (u_plan = 'pro' AND u_expires_at > now());

  -- Determine CAN_GENERATE
  -- Allowed if PRO or if VALID CREDITS exist
  can_generate := (is_pro OR u_credits > 0);

  -- Determine CAN_DOWNLOAD_HD
  -- Only PRO users can download HD
  can_download_hd := is_pro;

  -- Return JSON
  RETURN jsonb_build_object(
    'is_pro', is_pro,
    'credits', COALESCE(u_credits, 0),
    'pro_expires_at', u_expires_at,
    'can_generate', can_generate,
    'can_download_hd', can_download_hd
  );
END;
$$;

-- 3. Verification Queries (Run these separately to test)

/*
-- TEST 1: Check your own current status
SELECT get_user_entitlement(auth.uid());

-- TEST 2: Simulate becoming PRO (Run as a specific user or adjust data manually)
-- UPDATE public.users SET plan = 'pro', pro_expires_at = now() + interval '30 days' WHERE id = 'YOUR_USER_ID';
-- SELECT get_user_entitlement('YOUR_USER_ID');

-- TEST 3: Simulate Expired PRO
-- UPDATE public.users SET plan = 'pro', pro_expires_at = now() - interval '1 day' WHERE id = 'YOUR_USER_ID';
-- SELECT get_user_entitlement('YOUR_USER_ID');
*/
