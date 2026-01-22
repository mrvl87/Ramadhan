'use server';

import { generateContent } from '@/lib/ai/generate';
import { createClient } from '@/lib/supabase/server';
import { constructGiftPrompt, GiftInput } from './prompts';

export async function generateGiftAction(input: GiftInput) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('Unauthorized');
    }

    const prompt = constructGiftPrompt(input);

    try {
const result = await generateContent({
            featureType: 'gift-recommendation',
            userId: user.id,
            userInput: {
                featureType: 'gift-recommendation',
                prompt,
                recipient: input.recipient,
                budget: input.budget,
                interests: input.interests ? input.interests.split(',').map(i => i.trim()).filter(Boolean) : []
            }
        });

        return { success: true, data: result };

    } catch (error: any) {
        return { success: false, error: error.message };
    }
}
