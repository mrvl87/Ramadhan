-- Migration: 003_storage_setup
-- Goal: Create 'cards' bucket in Supabase Storage

-- 1. Create the bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('cards', 'cards', true)
on conflict (id) do nothing;

-- 2. Enable RLS
alter table storage.objects enable row level security;

-- 3. Policy: Authenticated users can upload to their own folder
create policy "Users can upload their own cards"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'cards' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 4. Policy: Users can view their own cards
create policy "Users can view their own cards"
on storage.objects for select
to authenticated
using (
  bucket_id = 'cards' and
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Policy: Public Access (Optional, if we want shared links to work for everyone)
-- Currently, we might want public links so they can be valid in the browser easily.
create policy "Public can view cards"
on storage.objects for select
to public
using ( bucket_id = 'cards' );
