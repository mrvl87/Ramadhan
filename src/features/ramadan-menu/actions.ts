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
        const resultString = await generateContent({
            featureType: 'ramadan-menu',
            userId: user.id,
            userInput: {
                featureType: 'ramadan-menu',
                prompt,
                preferences: [input.theme],
                dietaryRestrictions: input.dietary ? [input.dietary] : []
            }
        });

        // 1. Parse & Validate JSON
        let structuredData;
        try {
            // Some AI might wrap JSON in markdown blocks
            const jsonMatch = resultString.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : resultString;
            structuredData = JSON.parse(jsonString);
        } catch (parseError) {
            console.error("AI returned invalid JSON:", resultString);
            throw new Error("Failed to parse AI response. Please try again.");
        }

        // 2. Save to History (Public.menus table)
        const { data: savedMenu, error: saveError } = await supabase
            .from('menus')
            .insert({
                user_id: user.id,
                title: structuredData.title || `Ramadan Plan (${input.theme})`,
                days: input.days,
                people: input.people,
                theme: input.theme,
                content: structuredData
            })
            .select()
            .single();

        if (saveError) {
            console.error("Failed to save menu history:", saveError);
            // We still return the data even if saving history fails, but log it
        }

        return {
            success: true,
            data: structuredData,
            id: savedMenu?.id
        };

    } catch (error: any) {
        console.error("Menu generation error:", error);
        return { success: false, error: error.message };
    }
}
