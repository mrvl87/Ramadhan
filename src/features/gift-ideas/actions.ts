'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { WizardState, GiftGeneration, GenerateGiftResponse, SaveGiftResponse } from './types'
import { buildGiftPrompt } from './utils/prompt-builder'
import { GIFT_GENERATION_COST } from './utils/constants'

/**
 * Generate AI gift ideas based on wizard input
 * Deducts 10 credits from user account
 */
export async function generateGiftIdeas(data: WizardState): Promise<GenerateGiftResponse> {
    try {
        const supabase = await createClient()

        // 1. Check user authentication
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            console.error('[GIFT] Auth error:', authError)
            return { error: 'Please log in to generate gift ideas' }
        }

        // 2. Check user credits
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('credits')
            .eq('id', user.id)
            .single()

        if (userError) {
            console.error('[GIFT] User fetch error:', userError)
            return { error: 'Failed to check your credits' }
        }

        if (!userData || userData.credits < GIFT_GENERATION_COST) {
            return { error: `Insufficient credits. You need ${GIFT_GENERATION_COST} credits to generate gift ideas.` }
        }

        console.log(`[GIFT] User ${user.id} has ${userData.credits} credits, generating gifts...`)

        // 3. Call OpenRouter API to generate gift ideas
        const giftIdeas = await callOpenRouterAPI(data)

        if (!giftIdeas || giftIdeas.length === 0) {
            return { error: 'Failed to generate gift ideas. Please try again.' }
        }

        // 4. Save generation to database
        const { data: generation, error: dbError } = await supabase
            .from('gift_generations')
            .insert({
                user_id: user.id,
                recipient_type: data.recipient_type,
                budget_min: data.budget_min,
                budget_max: data.budget_max,
                interests: data.interests,
                occasion: data.occasion,
                additional_notes: data.additional_notes,
                gift_ideas: giftIdeas,
                credits_used: GIFT_GENERATION_COST
            })
            .select()
            .single()

        if (dbError) {
            console.error('[GIFT] Database error:', dbError)
            return { error: 'Failed to save gift ideas. Please try again.' }
        }

        // 5. Deduct credits from user account
        const { error: updateError } = await supabase
            .from('users')
            .update({ credits: userData.credits - GIFT_GENERATION_COST })
            .eq('id', user.id)

        if (updateError) {
            console.error('[GIFT] Credit deduction error:', updateError)
            // Note: Generation already saved, but credits not deducted
            // Could implement rollback here, but for now just log
        }

        console.log(`[GIFT] ✅ Generated ${giftIdeas.length} gifts for ${data.recipient_type}, ID: ${generation.id}`)

        revalidatePath('/gift-ideas')
        return { data: generation as GiftGeneration }

    } catch (error: any) {
        console.error('[GIFT] Generation error:', error)
        return { error: error.message || 'An unexpected error occurred' }
    }
}

/**
 * Call OpenRouter API with Claude 3.5 Sonnet to generate gifts
 */
async function callOpenRouterAPI(data: WizardState) {
    const prompt = buildGiftPrompt(data)

    console.log('[GIFT] Calling OpenRouter API...')
    console.log('[GIFT] 📝 Final Prompt being sent to OpenRouter:')
    console.log('='.repeat(80))
    console.log(prompt)
    console.log('='.repeat(80))

    // Retry logic for network errors
    const maxRetries = 3
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:3000',
                    'X-Title': 'RamadhanHub AI - Gift Ideas'
                },
                body: JSON.stringify({
                    model: 'anthropic/claude-3.5-sonnet',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert gift consultant in Indonesia specializing in Ramadan and Eid gifts. Always return valid JSON only.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                }),
                // Disable Next.js caching to avoid cache-related errors
                cache: 'no-store',
                // Add timeout
                signal: AbortSignal.timeout(30000) // 30 second timeout
            })

            if (!response.ok) {
                const errorText = await response.text()
                console.error('[GIFT] OpenRouter API error:', errorText)
                throw new Error(`API request failed: ${response.status}`)
            }

            const result = await response.json()
            console.log('[GIFT] OpenRouter response received, parsing...')

            // Parse JSON response
            try {
                const content = result.choices[0].message.content
                // Remove markdown code blocks if present
                const jsonContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
                const parsed = JSON.parse(jsonContent)

                if (!parsed.gifts || !Array.isArray(parsed.gifts)) {
                    throw new Error('Invalid response format: missing gifts array')
                }

                console.log(`[GIFT] ✅ Parsed ${parsed.gifts.length} gifts successfully`)
                return parsed.gifts
            } catch (parseError: any) {
                console.error('[GIFT] JSON parse error:', parseError)
                console.error('[GIFT] Raw content:', result.choices[0].message.content)
                throw new Error('Failed to parse AI response')
            }
        } catch (error: any) {
            lastError = error
            console.error(`[GIFT] Attempt ${attempt}/${maxRetries} failed:`, error.message)

            // Don't retry on parse errors or non-network errors
            if (error.message.includes('parse') || error.message.includes('Invalid response')) {
                throw error
            }

            // Wait before retry (exponential backoff)
            if (attempt < maxRetries) {
                const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000) // Max 5s
                console.log(`[GIFT] Retrying in ${delay}ms...`)
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }
    }

    // All retries failed
    throw new Error(`Failed to generate gifts after ${maxRetries} attempts: ${lastError?.message || 'Unknown error'}`)
}

/**
 * Save/bookmark a gift generation
 */
export async function saveGiftGeneration(generationId: string): Promise<SaveGiftResponse> {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return { success: false, error: 'Not authenticated' }
        }

        const { error } = await supabase
            .from('gift_generations')
            .update({ is_saved: true })
            .eq('id', generationId)
            .eq('user_id', user.id) // Security: only update own generations

        if (error) {
            console.error('[GIFT] Save error:', error)
            return { success: false, error: 'Failed to save' }
        }

        revalidatePath('/gift-ideas/saved')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

/**
 * Unsave a gift generation
 */
export async function unsaveGiftGeneration(generationId: string): Promise<SaveGiftResponse> {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return { success: false, error: 'Not authenticated' }
        }

        const { error } = await supabase
            .from('gift_generations')
            .update({ is_saved: false })
            .eq('id', generationId)
            .eq('user_id', user.id)

        if (error) {
            console.error('[GIFT] Unsave error:', error)
            return { success: false, error: 'Failed to unsave' }
        }

        revalidatePath('/gift-ideas/saved')
        return { success: true }
    } catch (error: any) {
        return { success: false, error: error.message }
    }
}

/**
 * Get a gift generation by ID (for results page)
 */
export async function getGiftGeneration(id: string): Promise<GiftGeneration | null> {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()

        const { data, error } = await supabase
            .from('gift_generations')
            .select('*')
            .eq('id', id)
            .single()

        if (error || !data) {
            console.error('[GIFT] Fetch error:', error)
            return null
        }

        // Verify ownership
        if (data.user_id !== user?.id) {
            console.error('[GIFT] Unauthorized access attempt')
            return null
        }

        return data as GiftGeneration
    } catch (error) {
        console.error('[GIFT] Get generation error:', error)
        return null
    }
}

/**
 * Get user's saved gift generations
 */
export async function getSavedGifts(): Promise<GiftGeneration[]> {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return []

        const { data, error } = await supabase
            .from('gift_generations')
            .select('*')
            .eq('user_id', user.id)
            .eq('is_saved', true)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('[GIFT] Fetch saved error:', error)
            return []
        }

        return data as GiftGeneration[]
    } catch (error) {
        console.error('[GIFT] Get saved gifts error:', error)
        return []
    }
}

/**
 * Increment view count for analytics
 */
export async function incrementViewCount(generationId: string): Promise<void> {
    try {
        const supabase = await createClient()

        await supabase.rpc('increment_gift_view', { generation_id: generationId })
    } catch (error) {
        console.error('[GIFT] View count error:', error)
    }
}
