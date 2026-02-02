-- Create a trigger to sync auth.users with public.users
-- This ensures that when a new user signs up, a corresponding row is created in public.users

-- 1. Create the function that will be called by the trigger
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, credits)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name',
    0 -- Default credits
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. Backfill existing users if they don't exist in public.users (Optional safety measure)
INSERT INTO public.users (id, email, credits)
SELECT id, email, 0
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
