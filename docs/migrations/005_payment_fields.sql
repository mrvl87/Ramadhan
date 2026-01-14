-- Migration: 005_payment_fields.sql
-- Purpose: Add fields to support Xendit and LemonSqueezy integration

ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS payment_gateway text, -- 'xendit' or 'lemonsqueezy'
ADD COLUMN IF NOT EXISTS payment_customer_id text,
ADD COLUMN IF NOT EXISTS subscription_id text,
ADD COLUMN IF NOT EXISTS payment_status text; -- 'active', 'unpaid', etc. (Optional, mostly relies on Plan)

-- Add index for webhooks to find user by customer/subscription id quickly
CREATE INDEX IF NOT EXISTS idx_users_payment_customer_id ON public.users(payment_customer_id);
