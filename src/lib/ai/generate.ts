import { createClient } from '@/lib/supabase/server';
import { generateFalImage, uploadImageToSupabase } from '@/lib/fal';
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
    const { data: creditResult, error: creditError } = await supabase
        .rpc('consume_credit', {
            target_user_id: userId,
            feature_name: featureType
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
                console.log("Triggering Fal.ai generation (via generateFalImage wrapper)...");
                try {
                    const tempImageUrl = await generateFalImage(userInput.prompt, {
                        imageUrl: userInput.imageUrl,
                        aspectRatio: userInput.aspectRatio
                    });

                    // 3. Persistent Save & Watermark Logic
                    // We name it 'family_photo' to match bucket structure expectations if any
                    // Use the 'is_pro' flag returned by consume_credit
                    const isPro = creditResult.is_pro || false;
                    console.log("Credit Check Result:", JSON.stringify(creditResult, null, 2));
                    console.log("Determined isPro Status:", isPro);

                    console.log("Saving to Supabase Storage...");
                    const finalUrl = await uploadImageToSupabase(tempImageUrl, userId, 'family_photo', isPro);

                    // Standardize result format
                    // Return the PERMANENT URL, not the temp Fal URL
                    result = {
                        images: [{ url: finalUrl }]
                    };

                    console.log("Generation completed. Final URL:", finalUrl);
                } catch (falError) {
                    console.error("Fal.ai generation error:", falError);
                    throw falError;
                }

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
