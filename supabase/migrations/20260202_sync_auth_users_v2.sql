-- 1. Add free_generations column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'free_generations') THEN
        ALTER TABLE public.users ADD COLUMN free_generations INTEGER DEFAULT 10;
    END IF;
END $$;

-- 2. Create the function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, age, gender, credits, free_generations)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    (new.raw_user_meta_data->>'age')::int,
    new.raw_user_meta_data->>'gender',
    0, -- Default credits
    10 -- Default 10 free generations
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the trigger (Re-creation ensures it uses the new function)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. RPC to decrement free generations
CREATE OR REPLACE FUNCTION public.decrement_free_generations(target_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_free INTEGER;
BEGIN
  SELECT free_generations INTO current_free FROM public.users WHERE id = target_user_id;
  
  IF current_free > 0 THEN
    UPDATE public.users SET free_generations = free_generations - 1 WHERE id = target_user_id;
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
