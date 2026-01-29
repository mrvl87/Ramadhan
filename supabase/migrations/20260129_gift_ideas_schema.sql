-- Gift Ideas Generator Database Schema
-- Creates table for storing AI-generated gift recommendations

-- ============================================================================
-- MAIN TABLE: gift_generations
-- ============================================================================

CREATE TABLE IF NOT EXISTS gift_generations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    
    -- Input parameters from wizard
    recipient_type text NOT NULL CHECK (recipient_type IN (
        'parent', 'spouse', 'child', 'sibling', 
        'friend', 'colleague', 'religious_leader'
    )),
    budget_min integer NOT NULL CHECK (budget_min >= 0),
    budget_max integer NOT NULL CHECK (budget_max >= budget_min),
    interests text[] DEFAULT '{}',
    occasion text DEFAULT 'ramadan' CHECK (occasion IN ('ramadan', 'eid', 'both')),
    additional_notes text,
    
    -- AI Output - Array of gift ideas
    gift_ideas jsonb NOT NULL,
    -- Structure: [{ name, price, reason, where_to_buy, keywords }]
    
    -- Metadata
    credits_used integer DEFAULT 10 NOT NULL,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL,
    
    -- User actions
    is_saved boolean DEFAULT false NOT NULL,
    share_token text UNIQUE DEFAULT gen_random_uuid()::text,
    
    -- Analytics tracking
    view_count integer DEFAULT 0 NOT NULL,
    share_count integer DEFAULT 0 NOT NULL
);

-- ============================================================================
-- INDEXES for Performance
-- ============================================================================

-- User's gift generations ordered by date
CREATE INDEX idx_gift_gen_user_created 
    ON gift_generations(user_id, created_at DESC);

-- Shared gift generations (for public access)
CREATE INDEX idx_gift_gen_share_token 
    ON gift_generations(share_token) 
    WHERE share_token IS NOT NULL;

-- Saved gifts for quick filtering
CREATE INDEX idx_gift_gen_saved 
    ON gift_generations(user_id, is_saved, created_at DESC) 
    WHERE is_saved = true;

-- Analytics: most popular recipient types
CREATE INDEX idx_gift_gen_recipient 
    ON gift_generations(recipient_type, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE gift_generations ENABLE ROW LEVEL SECURITY;

-- Policy 1: Users can view their own gift generations
CREATE POLICY "users_view_own_gifts" 
    ON gift_generations 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy 2: Users can create their own gift generations
CREATE POLICY "users_create_gifts" 
    ON gift_generations 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own gift generations (save/unsave)
CREATE POLICY "users_update_own_gifts" 
    ON gift_generations 
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can delete their own gift generations
CREATE POLICY "users_delete_own_gifts" 
    ON gift_generations 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Note: Public sharing via share_token is handled in API route, not RLS
-- This allows unauthenticated users to view shared links

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_gift_generation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gift_generation_updated_at
    BEFORE UPDATE ON gift_generations
    FOR EACH ROW
    EXECUTE FUNCTION update_gift_generation_updated_at();

-- ============================================================================
-- ANALYTICS VIEW (for admin dashboard)
-- ============================================================================

CREATE OR REPLACE VIEW admin_gift_stats AS
SELECT 
    DATE(created_at) as date,
    recipient_type,
    COUNT(*) as total_generations,
    SUM(credits_used) as total_credits_used,
    SUM(view_count) as total_views,
    SUM(share_count) as total_shares,
    AVG((budget_min + budget_max) / 2) as avg_budget
FROM gift_generations
GROUP BY DATE(created_at), recipient_type
ORDER BY date DESC, total_generations DESC;

-- ============================================================================
-- SAMPLE DATA (for testing)
-- ============================================================================

-- Insert sample gift generation (commented out for production)
/*
INSERT INTO gift_generations (
    user_id,
    recipient_type,
    budget_min,
    budget_max,
    interests,
    occasion,
    gift_ideas
) VALUES (
    '00000000-0000-0000-0000-000000000000'::uuid, -- Replace with test user ID
    'parent',
    100000,
    500000,
    ARRAY['quran', 'cooking', 'gardening'],
    'ramadan',
    '[
        {
            "name": "Al-Quran Premium dengan Tafsir",
            "price": 450000,
            "reason": "Sempurna untuk orangtua yang gemar membaca Al-Quran. Dilengkapi dengan tafsir berbahasa Indonesia yang mudah dipahami, dan sampul leather yang elegan.",
            "where_to_buy": ["Tokopedia", "Shopee"],
            "keywords": "al quran premium tafsir leather indonesia"
        },
        {
            "name": "Set Peralatan Masak Premium",
            "price": 380000,
            "reason": "Untuk ibu yang suka memasak, set lengkap dengan wajan anti lengket, spatula silikon, dan pisau chef berkualitas tinggi.",
            "where_to_buy": ["Tokopedia", "Shopee", "Lazada"],
            "keywords": "set peralatan masak premium anti lengket"
        },
        {
            "name": "Gardening Tool Set & Seeds",
            "price": 250000,
            "reason": "Paket lengkap alat berkebun dengan benih tanaman herbs organik, sempurna untuk hobby gardening.",
            "where_to_buy": ["Tokopedia", "Shopee"],
            "keywords": "gardening tool set benih organik herbs"
        },
        {
            "name": "Kurma Premium Ajwa Madinah",
            "price": 180000,
            "reason": "Kurma terbaik dari Madinah, dikemas elegan, cocok untuk hadiah Ramadan yang bermakna.",
            "where_to_buy": ["Tokopedia", "Shopee"],
            "keywords": "kurma ajwa madinah premium gift box"
        },
        {
            "name": "Sajadah Sutra dengan Tasbih",
            "price": 350000,
            "reason": "Sajadah sutra berkualitas tinggi dengan motif islami elegant, dilengkapi tasbih kayu wangi.",
            "where_to_buy": ["Tokopedia", "Shopee"],
            "keywords": "sajadah sutra premium tasbih gift set"
        }
    ]'::jsonb
);
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check table created successfully
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'gift_generations';

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'gift_generations';

-- Check RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'gift_generations';

-- Check policies
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies 
WHERE tablename = 'gift_generations';

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ Gift Ideas Generator schema created successfully!';
    RAISE NOTICE '✅ Table: gift_generations';
    RAISE NOTICE '✅ Indexes: 4 performance indexes';
    RAISE NOTICE '✅ RLS: 4 security policies';
    RAISE NOTICE '✅ Ready for gift generation!';
END $$;
