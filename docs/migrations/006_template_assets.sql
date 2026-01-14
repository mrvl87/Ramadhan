-- Migration: 006_template_assets.sql
-- Purpose: Create tables for Nano Banana Edit Pro templates (Parties, Costumes, Attributes)

-- 1. Party Templates
CREATE TABLE IF NOT EXISTS public.party_templates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    logo_url text,
    primary_color text DEFAULT '#000000',
    secondary_color text DEFAULT '#ffffff',
    is_premium boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- 2. Costume Templates
CREATE TABLE IF NOT EXISTS public.costume_templates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    gender text CHECK (gender IN ('male', 'female', 'unisex')),
    base_image_url text, -- URL to the underlying costume image/mask
    is_premium boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Attribute Templates
CREATE TABLE IF NOT EXISTS public.attribute_templates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    type text CHECK (type IN ('headwear', 'accessory', 'badge')),
    overlay_image_url text,
    is_premium boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.party_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.costume_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_templates ENABLE ROW LEVEL SECURITY;

-- Public Read Policy
CREATE POLICY "Public Read Parties" ON public.party_templates FOR SELECT USING (true);
CREATE POLICY "Public Read Costumes" ON public.costume_templates FOR SELECT USING (true);
CREATE POLICY "Public Read Attributes" ON public.attribute_templates FOR SELECT USING (true);

-- Seed Data: Parties
INSERT INTO public.party_templates (name, slug, primary_color, secondary_color, is_premium) VALUES
('Partai Bebas (Free)', 'partai-bebas', '#ef4444', '#ffffff', false),
('Partai Rakyat (Free)', 'partai-rakyat', '#3b82f6', '#ffffff', false),
('Partai Sultan (Premium)', 'partai-sultan', '#eab308', '#000000', true)
ON CONFLICT (slug) DO NOTHING;

-- Seed Data: Costumes
INSERT INTO public.costume_templates (name, gender, is_premium) VALUES
('Baju Koko Polos', 'male', false),
('Jas Pejabat Emas', 'male', true)
ON CONFLICT DO NOTHING;
-- Note: Avoiding ON CONFLICT on ID since we don't fix IDs. Duplicates might happen if re-run without truncation or slug constraint on name. 
-- Adding unique constraint on name for costumes/attributes strictly for seed idempotency isn't schema-required but good practices.
-- For this MVP seed, we assume clean run.

-- Seed Data: Attributes
INSERT INTO public.attribute_templates (name, type, is_premium) VALUES
('Peci Hitam', 'headwear', false),
('Kerudung Simpel', 'headwear', false),
('Pin Partai', 'badge', false),
('Mahkota Emas', 'headwear', true)
ON CONFLICT DO NOTHING;
