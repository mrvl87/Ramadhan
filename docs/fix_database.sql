-- 1. Reset: Drop possible conflicting triggers (Ignore error if they don't exist)
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

-- 2. Ensure the table exists (based on your schema)
create table if not exists public.users (
  id uuid not null primary key references auth.users(id) on delete cascade,
  email text,
  plan text default 'free'::text,
  credits integer default 3,
  referral_code text,
  created_at timestamp without time zone default now()
);

-- 3. Create the Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

-- 4. Create the Trigger
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Fix Permissions (Crucial for the error "saving new user")
alter table public.users enable row level security;

-- Allow users to read their own data
create policy "Users can view own profile"
  on public.users for select
  using ( auth.uid() = id );

-- Allow users to update their own data
create policy "Users can update own profile"
  on public.users for update
  using ( auth.uid() = id );

-- (Optional) If you need public read access, adjust accordingly.
