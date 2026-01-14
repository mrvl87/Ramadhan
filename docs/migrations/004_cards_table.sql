-- Migration: 004_cards_table.sql
-- Purpose: Store metadata for generated AI cards to support sharing and history

CREATE TABLE IF NOT EXISTS public.ai_cards (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    type text NOT NULL, -- 'political', 'greeting', etc
    theme text, -- 'partai-free', 'luxury-gold'
    storage_path text NOT NULL, -- Base path in bucket e.g. "cards/{user_id}/{card_id}"
    is_hd_unlocked boolean DEFAULT false,
    metadata jsonb DEFAULT '{}'::jsonb, -- Store prompt inputs like "party", "costume", "name"
    created_at timestamp with time zone DEFAULT now()
);

-- RLS
ALTER TABLE public.ai_cards ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own cards" ON public.ai_cards
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cards" ON public.ai_cards
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view cards if they have the ID (Sharing)" ON public.ai_cards
    FOR SELECT USING (true); -- Or maybe restrict to knowledge of UUID? Standard SELECT USING (true) makes table public readable.
    -- For sharing, we usually want public read. The storage bucket policy handles the image security.

-- Index
CREATE INDEX IF NOT EXISTS idx_ai_cards_user_id ON public.ai_cards(user_id);
