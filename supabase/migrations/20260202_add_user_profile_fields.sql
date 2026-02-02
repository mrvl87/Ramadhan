-- Add profile fields to public.users table
-- These fields will be populated during the onboarding flow

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS full_name text,
ADD COLUMN IF NOT EXISTS age integer,
ADD COLUMN IF NOT EXISTS gender text CHECK (gender IN ('male', 'female', 'other'));

-- Add comment
COMMENT ON COLUMN public.users.full_name IS 'User''s display name collected during onboarding';
COMMENT ON COLUMN public.users.age IS 'User''s age for demographic analysis';
COMMENT ON COLUMN public.users.gender IS 'User''s gender for personalized content';
