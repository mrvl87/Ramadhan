-- Migration: 007_uploads_bucket.sql
-- Purpose: Create a public storage bucket for user uploads with strict RLS.

-- 1. Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS (It's enabled by default on new buckets usually, but good to be explicit for objects)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Public Read Access
-- Anyone can view the images (required for Fal.ai)
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'uploads' );

-- 4. Policy: Authenticated Upload Access
-- Users can only insert files into their own folder: uploads/{user_id}/*
CREATE POLICY "User Upload Access"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'uploads' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- 5. Policy: Authenticated Update/Delete (Optional, for cleanup)
-- Users can delete their own files
CREATE POLICY "User Delete Access"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'uploads' AND
    (storage.foldername(name))[1] = auth.uid()::text
);
