-- Create RPC to increment free generations (for refunds)
CREATE OR REPLACE FUNCTION public.increment_free_generations(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- We don't need a cap? Or should we cap it at some reasonable number? 
  -- For refund purposes, uncapped is safer to ensure they get it back even if they were given extra somehow.
  -- But generally, it should just be +1.
  
  UPDATE public.users 
  SET free_generations = free_generations + 1 
  WHERE id = target_user_id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
