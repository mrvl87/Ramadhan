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
                preferences: [input.theme],
                dietaryRestrictions: input.dietary ? [input.dietary] : []
            }
        });

        if (!result) throw new Error("No response from AI");

        // Robust JSON Extraction
        let cleanJson = result;
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanJson = jsonMatch[0];
        }

        try {
            const parsedData = JSON.parse(cleanJson);

            // Basic validation
            if (!parsedData.menu || !Array.isArray(parsedData.menu)) {
                throw new Error("Invalid menu format received from AI");
            }

            return { success: true, data: parsedData };
        } catch (parseError) {
            console.error("JSON Parse Error:", parseError, "Raw:", result);
            throw new Error("Failed to parse AI menu response. Please try again.");
        }

    } catch (error: any) {
        console.error("Generation Action Error:", error);
        return { success: false, error: error.message || "An unexpected error occurred" };
    }
}
