-- Migration: 008_seed_female_costumes.sql
-- Purpose: Add Female costumes since 006 only had Male ones.

INSERT INTO public.costume_templates (name, gender, is_premium) VALUES
('Kebaya Nasional (Free)', 'female', false),
('Hijab Pejabat (Premium)', 'female', true),
('Batik Modern (Unisex)', 'unisex', false);
