-- Gift Ideas Emotional Imagery Database
-- Stores AI-generated images for hero sections, wizard steps, and emotional moments

-- Table for emotional images
CREATE TABLE IF NOT EXISTS gift_emotional_images (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Image metadata
    image_type text NOT NULL CHECK (image_type IN (
        'hero_background',      -- Landing page hero
        'hero_moment',          -- Emotional moment illustration
        'wizard_recipient',     -- Recipient type illustrations
        'testimonial_visual',   -- Visual for testimonials
        'joy_moment',          -- Gift-giving joy scenes
        'ramadan_spiritual'    -- Ramadan/Eid spiritual imagery
    )),
    
    -- Image details
    title text NOT NULL,
    description text,
    prompt_used text NOT NULL,
    
    -- Supabase storage
    storage_path text NOT NULL UNIQUE,
    public_url text NOT NULL,
    
    -- Metadata
    width integer,
    height integer,
    file_size integer,
    
    -- Association
    recipient_type text CHECK (recipient_type IN (
        'parent', 'spouse', 'child', 'sibling', 
        'friend', 'colleague', 'religious_leader', 'general'
    )),
    
    -- Flags
    is_active boolean DEFAULT true NOT NULL,
    view_count integer DEFAULT 0 NOT NULL,
    
    -- Timestamps
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_emotional_images_type ON gift_emotional_images(image_type);
CREATE INDEX idx_emotional_images_recipient ON gift_emotional_images(recipient_type);
CREATE INDEX idx_emotional_images_active ON gift_emotional_images(is_active);

-- RLS Policies (public read for images)
ALTER TABLE gift_emotional_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_emotional_images" 
    ON gift_emotional_images 
    FOR SELECT 
    USING (is_active = true);

CREATE POLICY "admin_manage_emotional_images" 
    ON gift_emotional_images 
    FOR ALL 
    USING (auth.uid() IS NOT NULL);

-- Auto-update timestamp trigger
-- Create function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_gift_emotional_images_updated_at
    BEFORE UPDATE ON gift_emotional_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RPC function to increment view count atomically
CREATE OR REPLACE FUNCTION increment_image_view(image_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE gift_emotional_images
    SET view_count = view_count + 1
    WHERE id = image_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments
COMMENT ON TABLE gift_emotional_images IS 'AI-generated emotional imagery for Gift Ideas feature';
COMMENT ON COLUMN gift_emotional_images.image_type IS 'Type of emotional image (hero, wizard, testimonial, etc.)';
COMMENT ON COLUMN gift_emotional_images.prompt_used IS 'fal.ai prompt used to generate this image';
COMMENT ON COLUMN gift_emotional_images.recipient_type IS 'Associated recipient type if applicable';
