-- Admin Dashboard Database Schema Migration
-- Version: 1.0
-- Date: 2026-01-27
-- Description: Complete admin dashboard schema with analytics, transactions, and CMS support

-- ============================================================================
-- 1. ADMINS TABLE - Role-based access control
-- ============================================================================

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  
  -- Role & Permissions
  role text NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
  permissions jsonb DEFAULT '["view_dashboard", "view_users", "view_transactions"]'::jsonb,
  
  -- Audit Trail
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamp DEFAULT now(),
  revoked_at timestamp,
  
  -- Constraints
  CONSTRAINT valid_role CHECK (role IN ('super_admin', 'admin', 'moderator'))
);

-- Indexes
CREATE INDEX idx_admins_user_id ON admins(user_id);
CREATE INDEX idx_admins_role ON admins(role);

-- RLS Policies
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage admins"
  ON admins FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM admins
      WHERE user_id = auth.uid() 
      AND role = 'super_admin'
      AND revoked_at IS NULL
    )
  );

-- Helper function to check admin access
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admins
    WHERE user_id = auth.uid()
    AND revoked_at IS NULL
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE admins IS 'Admin user management with role-based permissions';

-- ============================================================================
-- 2. TRANSACTIONS TABLE - Payment & purchase logs
-- ============================================================================

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Payment Details
  external_id text UNIQUE NOT NULL,
  bundle_type text NOT NULL CHECK (bundle_type IN ('starter', 'popular', 'power')),
  credits_purchased integer NOT NULL CHECK (credits_purchased > 0),
  amount_idr integer NOT NULL CHECK (amount_idr > 0),
  
  -- Status Tracking
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method text,
  payment_gateway text DEFAULT 'xendit',
  
  -- Timestamps
  created_at timestamp DEFAULT now(),
  paid_at timestamp,
  
  -- Extensible metadata
  metadata jsonb DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_external_id ON transactions(external_id);
CREATE INDEX idx_transactions_paid_at ON transactions(paid_at DESC) WHERE paid_at IS NOT NULL;

-- RLS Policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all transactions"
  ON transactions FOR SELECT
  USING (is_admin());

COMMENT ON TABLE transactions IS 'Credit purchase transactions with full audit trail';

-- ============================================================================
-- 3. GENERATIONS TABLE - AI generation activity log
-- ============================================================================

CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Generation Details
  feature_type text NOT NULL CHECK (feature_type IN ('family_photo', 'menu_planner', 'gift_ideas')),
  prompt text,
  model text DEFAULT 'fal-ai/flux-schnell',
  
  -- Status & Performance
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message text,
  generation_time_ms integer,
  
  -- Output
  output_url text,
  output_metadata jsonb DEFAULT '{}'::jsonb,
  
  -- Cost Tracking
  cost_idr integer DEFAULT 95,
  credits_used integer DEFAULT 1,
  
  -- Timestamps
  created_at timestamp DEFAULT now(),
  completed_at timestamp
);

-- Indexes
CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_feature_type ON generations(feature_type);
CREATE INDEX idx_generations_status ON generations(status);
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);
CREATE INDEX idx_generations_completed_at ON generations(completed_at DESC) WHERE completed_at IS NOT NULL;

-- RLS Policies
ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own generations"
  ON generations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all generations"
  ON generations FOR SELECT
  USING (is_admin());

COMMENT ON TABLE generations IS 'AI generation activity log with performance and cost tracking';

-- ============================================================================
-- 4. WEBHOOK_LOGS TABLE - Webhook debugging
-- ============================================================================

CREATE TABLE IF NOT EXISTS webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Webhook Details
  source text NOT NULL,
  event_type text NOT NULL,
  external_id text,
  
  -- Request Details
  payload jsonb NOT NULL,
  headers jsonb,
  
  -- Processing
  status text NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'processed', 'failed')),
  error_message text,
  processed_at timestamp,
  
  -- Timestamp
  received_at timestamp DEFAULT now()
);

-- Indexes
CREATE INDEX idx_webhook_logs_source ON webhook_logs(source);
CREATE INDEX idx_webhook_logs_external_id ON webhook_logs(external_id);
CREATE INDEX idx_webhook_logs_received_at ON webhook_logs(received_at DESC);
CREATE INDEX idx_webhook_logs_status ON webhook_logs(status);

-- RLS Policies
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view webhook logs"
  ON webhook_logs FOR SELECT
  USING (is_admin());

COMMENT ON TABLE webhook_logs IS 'Webhook request logs for debugging payment issues';

-- ============================================================================
-- 5. ANALYTICS_EVENTS TABLE - User behavior tracking
-- ============================================================================

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Event Details
  event_name text NOT NULL,
  event_category text,
  
  -- Context
  page_url text,
  referrer text,
  device_type text,
  user_agent text,
  
  -- Custom Properties
  properties jsonb DEFAULT '{}'::jsonb,
  
  -- Timestamp
  created_at timestamp DEFAULT now()
);

-- Indexes
CREATE INDEX idx_analytics_events_event_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_category ON analytics_events(event_category);

-- RLS Policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view analytics"
  ON analytics_events FOR SELECT
  USING (is_admin());

CREATE POLICY "System can insert analytics"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

COMMENT ON TABLE analytics_events IS 'User behavior tracking for funnel analysis';

-- ============================================================================
-- 6. CMS_CONTENT TABLE - Content management system
-- ============================================================================

CREATE TABLE IF NOT EXISTS cms_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content Details
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  content jsonb NOT NULL,
  excerpt text,
  
  -- Type & Status
  content_type text NOT NULL DEFAULT 'page' CHECK (content_type IN ('page', 'blog', 'faq', 'landing_page')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  
  -- SEO Metadata
  meta_title text,
  meta_description text,
  og_image_url text,
  
  -- Author & Timestamps
  author_id uuid REFERENCES auth.users(id),
  published_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Indexes
CREATE INDEX idx_cms_content_slug ON cms_content(slug);
CREATE INDEX idx_cms_content_status ON cms_content(status);
CREATE INDEX idx_cms_content_type ON cms_content(content_type);
CREATE INDEX idx_cms_content_published_at ON cms_content(published_at DESC) WHERE published_at IS NOT NULL;

-- RLS Policies
ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published content"
  ON cms_content FOR SELECT
  USING (status = 'published');

CREATE POLICY "Admins can manage all content"
  ON cms_content FOR ALL
  USING (is_admin());

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_cms_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER cms_content_updated_at
  BEFORE UPDATE ON cms_content
  FOR EACH ROW
  EXECUTE FUNCTION update_cms_content_updated_at();

COMMENT ON TABLE cms_content IS 'Content management for pages, blogs, and landing pages';

-- ============================================================================
-- ANALYTICS VIEWS
-- ============================================================================

-- Revenue Summary View
CREATE OR REPLACE VIEW admin_revenue_summary AS
SELECT
  DATE_TRUNC('day', paid_at) AS date,
  COUNT(*) AS total_transactions,
  SUM(amount_idr) AS revenue_idr,
  SUM(credits_purchased) AS total_credits_sold,
  ROUND(AVG(amount_idr)) AS avg_transaction_value,
  COUNT(DISTINCT user_id) AS unique_buyers
FROM transactions
WHERE status = 'paid' AND paid_at IS NOT NULL
GROUP BY DATE_TRUNC('day', paid_at)
ORDER BY date DESC;

COMMENT ON VIEW admin_revenue_summary IS 'Daily revenue aggregation for admin dashboard';

-- User Statistics View
CREATE OR REPLACE VIEW admin_user_stats AS
SELECT
  u.id,
  u.email,
  u.created_at,
  u.credits,
  COALESCE(g.total_generations, 0) AS total_generations,
  COALESCE(g.last_generation, NULL) AS last_generation,
  COALESCE(t.total_spent, 0) AS total_spent_idr,
  COALESCE(t.total_purchases, 0) AS total_purchases,
  CASE
    WHEN t.total_spent > 0 THEN 'paying'
    WHEN g.total_generations > 0 THEN 'active_free'
    ELSE 'inactive'
  END AS user_segment
FROM users u
LEFT JOIN (
  SELECT
    user_id,
    COUNT(*) AS total_generations,
    MAX(created_at) AS last_generation
  FROM generations
  WHERE status = 'completed'
  GROUP BY user_id
) g ON u.id = g.user_id
LEFT JOIN (
  SELECT
    user_id,
    SUM(amount_idr) AS total_spent,
    COUNT(*) AS total_purchases
  FROM transactions
  WHERE status = 'paid'
  GROUP BY user_id
) t ON u.id = t.user_id;

COMMENT ON VIEW admin_user_stats IS 'Comprehensive user statistics with segmentation';

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Admin Dashboard Schema Migration Completed Successfully!';
  RAISE NOTICE 'Tables Created: admins, transactions, generations, webhook_logs, analytics_events, cms_content';
  RAISE NOTICE 'Views Created: admin_revenue_summary, admin_user_stats';
  RAISE NOTICE 'Next Step: Seed initial admin user';
END $$;
