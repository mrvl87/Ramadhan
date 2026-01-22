'use server';

import { generateContent, FamilyPhotoInput } from '@/lib/ai/generate';
import { createSupabaseServerClient } from '@/lib/supabase/factory';
import { constructFamilyPrompt, FamilyPhotoInput as LocalFamilyPhotoInput } from './prompts';
import { generateFalLLM } from '@/lib/fal';
import { withActionErrorHandling, ApiErrorHandler } from '@/lib/error-handling';

import { FAMILY_PHOTO_CONFIG } from './ai-config';

export const generateGreetingAction = withActionErrorHandling(async () => {
    const themes = FAMILY_PHOTO_CONFIG.GREETING_THEMES;
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];

    const prompt = FAMILY_PHOTO_CONFIG.GREETING_PROMPT_TEMPLATE(randomTheme);

    // Use model from config
    const greeting = await generateFalLLM(prompt, FAMILY_PHOTO_CONFIG.GREETING_MODEL);
    return greeting?.replace(/["']/g, '').trim();
});

export const generateFamilyPhotoAction = withActionErrorHandling(
    async (input: LocalFamilyPhotoInput & { imageUrls: string[] }) => {
        const supabase = await createSupabaseServerClient();
        const user = await ApiErrorHandler.validateUser(supabase);

        // 1. Construct Prompt
        const prompt = (input as any).promptOverride || constructFamilyPrompt(input);
        console.log("Constructed Prompt:", prompt);

        // 2. Call Unified Pipeline
        console.log("Calling generateContent pipeline...");
        const result = await generateContent({
            featureType: 'family-photo',
            userId: user.id,
            userInput: {
                featureType: 'family-photo',
                prompt,
                imageUrls: input.imageUrls,
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

return imageUrl;
    }
);

export async function getUserStats() {
    const supabase = await createSupabaseServerClient();
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
