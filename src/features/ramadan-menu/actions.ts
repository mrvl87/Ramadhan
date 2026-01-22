'use server';

import { generateContent } from '@/lib/ai/generate';
import { createClient } from '@/lib/supabase/server';
import { constructMenuPrompt, MenuInput } from './prompts';

export async function generateMenuAction(input: MenuInput) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const prompt = constructMenuPrompt(input);

    try {
const result = await generateContent({
            featureType: 'ramadan-menu',
            userId: user.id,
            userInput: {
                featureType: 'ramadan-menu',
                prompt,
                preferences: [input.theme], // Use theme as preference
                dietaryRestrictions: input.dietary ? [input.dietary] : []
            }
        });

        return { success: true, data: result };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
