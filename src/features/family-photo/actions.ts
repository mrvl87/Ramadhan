'use server';

import { generateContent } from '@/lib/ai/generate';
import { createClient } from '@/lib/supabase/server';
import { constructFamilyPrompt, FamilyPhotoInput } from './prompts';
import { generateFalLLM } from '@/lib/fal';

import { FAMILY_PHOTO_CONFIG } from './ai-config';

export async function generateGreetingAction() {
    try {
        const themes = FAMILY_PHOTO_CONFIG.GREETING_THEMES;
        const randomTheme = themes[Math.floor(Math.random() * themes.length)];

        const prompt = FAMILY_PHOTO_CONFIG.GREETING_PROMPT_TEMPLATE(randomTheme);

        // Use model from config
        const greeting = await generateFalLLM(prompt, FAMILY_PHOTO_CONFIG.GREETING_MODEL);
        return { success: true, data: greeting?.replace(/["']/g, '').trim() };
    } catch (error: any) {
        console.error("Greeting Gen Error:", error);
        return { success: false, error: error.message };
    }
}

export async function generateFamilyPhotoAction(input: FamilyPhotoInput & { imageUrl: string }) {
    const supabase = await createClient(); // Wait for promise
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    // 1. Construct Prompt
    const prompt = constructFamilyPrompt(input);
    console.log("Constructed Prompt:", prompt);

    // 2. Call Unified Pipeline
    try {
        console.log("Calling generateContent pipeline...");
        const result = await generateContent({
            featureType: 'family-photo',
            userId: user.id,
            userInput: {
                prompt,
                imageUrl: input.imageUrl,
                aspectRatio: input.aspectRatio,
                // caption is woven into prompt, so we don't strictly need to pass it separately as a param unless prompt engine changes
            }
        });

        // 3. Save to History (Optional)
        // Extract URL from standard format { images: [{ url: '...' }] }
        const imageUrl = result.images?.[0]?.url;

        if (!imageUrl) {
            throw new Error('No image URL returned from generation pipeline');
        }

        return { success: true, data: imageUrl };

    } catch (error: any) {
        console.error("Server Action Error:", error);
        return { success: false, error: error.message };
    }
}

export async function getUserStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    try {
        const { data, error } = await supabase.rpc('get_user_entitlement', {
            target_user_id: user.id
        });

        if (error) {
            console.error("Error fetching stats:", error);
            return null;
        }

        return data; // Returns { is_pro, credits, pro_expires_at, ... }
    } catch (e) {
        console.error("Error in getUserStats:", e);
        return null;
    }
}
