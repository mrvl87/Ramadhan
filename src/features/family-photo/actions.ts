'use server';

import { generateContent } from '@/lib/ai/generate';
import { createClient } from '@/lib/supabase/server';
import { constructFamilyPrompt, FamilyPhotoInput } from './prompts';

export async function generateFamilyPhotoAction(input: FamilyPhotoInput & { imageUrl: string }) {
    const supabase = await createClient(); // Wait for promise
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    // 1. Construct Prompt
    const prompt = constructFamilyPrompt(input);

    // 2. Call Unified Pipeline
    try {
        const result = await generateContent({
            featureType: 'family-photo',
            userId: user.id,
            userInput: {
                prompt,
                imageUrl: input.imageUrl
            }
        });

        // 3. Save to History (Optional, but good practice. `generateContent` inside `uplodImageToSupabase` might handle saving, 
        // but `generate.ts` currently just returns the Fal URL. We might need to save it to DB here or in `generate.ts`)
        // For now, simple return.

        return { success: true, data: result };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
