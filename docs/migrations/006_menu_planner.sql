-- Create menus table
create table if not exists public.menus (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  title text not null,
  days integer not null,
  people integer not null,
  theme text not null,
  content jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.menus enable row level security;

create policy "Users can view their own menus"
  on public.menus for select
  using (auth.uid() = user_id);

create policy "Users can insert their own menus"
  on public.menus for insert
  with check (auth.uid() = user_id);

-- Add index for faster history lookup
create index menus_user_id_idx on public.menus(user_id);
