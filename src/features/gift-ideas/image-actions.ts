'use server'

import { createClient } from '@/lib/supabase/server'

export interface EmotionalImage {
    id: string
    image_type: string
    title: string
    description: string | null
    prompt_used: string
    storage_path: string
    public_url: string
    width: number | null
    height: number | null
    file_size: number | null
    recipient_type: string | null
    is_active: boolean
    view_count: number
    created_at: string
    updated_at: string
}

/**
 * Get emotional images by type
 */
export async function getEmotionalImages(imageType: string): Promise<EmotionalImage[]> {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('gift_emotional_images')
            .select('*')
            .eq('image_type', imageType)
            .eq('is_active', true)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('[EMOTIONAL IMAGES] Fetch error:', error)
            return []
        }

        return data as EmotionalImage[]
    } catch (error) {
        console.error('[EMOTIONAL IMAGES] Error:', error)
        return []
    }
}

/**
 * Get emotional image for specific recipient type
 */
export async function getRecipientImage(recipientType: string): Promise<EmotionalImage | null> {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('gift_emotional_images')
            .select('*')
            .eq('image_type', 'wizard_recipient')
            .eq('recipient_type', recipientType)
            .eq('is_active', true)
            .single()

        if (error) {
            console.error('[RECIPIENT IMAGE] Fetch error:', error)
            return null
        }

        return data as EmotionalImage
    } catch (error) {
        console.error('[RECIPIENT IMAGE] Error:', error)
        return null
    }
}

/**
 * Get hero images for landing page
 */
export async function getHeroImages(): Promise<{
    background: EmotionalImage | null
    moment: EmotionalImage | null
}> {
    try {
        const supabase = await createClient()

        const [backgroundResult, momentResult] = await Promise.all([
            supabase
                .from('gift_emotional_images')
                .select('*')
                .eq('image_type', 'hero_background')
                .eq('is_active', true)
                .limit(1)
                .single(),

            supabase
                .from('gift_emotional_images')
                .select('*')
                .eq('image_type', 'hero_moment')
                .eq('is_active', true)
                .limit(1)
                .single()
        ])

        return {
            background: backgroundResult.data as EmotionalImage | null,
            moment: momentResult.data as EmotionalImage | null
        }
    } catch (error) {
        console.error('[HERO IMAGES] Error:', error)
        return { background: null, moment: null }
    }
}

/**
 * Increment view count for analytics
 */
export async function incrementImageView(imageId: string): Promise<void> {
    try {
        const supabase = await createClient()

        // Use RPC to atomically increment view count
        await supabase.rpc('increment_image_view', { image_id: imageId })
    } catch (error) {
        // Silently fail - analytics shouldn't break the app
        console.debug('[IMAGE VIEW] Could not increment view count:', error)
    }
}

