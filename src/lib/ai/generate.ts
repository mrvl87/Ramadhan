import { createClient } from '@/lib/supabase/server';
import { fal } from '@fal-ai/serverless-client';
import { openRouter } from '@/lib/openrouter';
import { NextResponse } from 'next/server';

export type FeatureType = 'family-photo' | 'ramadan-menu' | 'gift-recommendation';

interface GenerateOptions {
    featureType: FeatureType;
    userInput: any;
    userId: string;
}

export async function generateContent({ featureType, userInput, userId }: GenerateOptions) {
    const supabase = await createClient();

    // 1. Check & Consume Credits (Unified Logic)
    // We assume the DB function 'consume_credits' handles the check and deduction
    const { data: creditResult, error: creditError } = await supabase
        .rpc('consume_credits', {
            p_user_id: userId,
            p_amount: 1 // Standard cost, can be dynamic
        });

    if (creditError || !creditResult) {
        throw new Error('Insufficient credits or error checking balance.');
    }

    // 2. Dispatch to specific AI Provider based on feature
    try {
        let result;

        switch (featureType) {
            case 'family-photo':
                // Fal.ai Generation
                result = await fal.subscribe('fal-ai/flux/schnell', {
                    input: {
                        prompt: userInput.prompt,
                        image_url: userInput.imageUrl,
                        // Add other flux params if needed
                    }
                });
                break;

            case 'ramadan-menu':
            case 'gift-recommendation':
                // OpenRouter (LLM) Generation
                result = await openRouter.chat(userInput.prompt);
                break;

            default:
                throw new Error('Invalid feature type');
        }

        return result;

    } catch (error) {
        // Refund credit on failure? (Optional, advanced logic)
        console.error("AI Generation Failed:", error);
        throw error;
    }
}
