import { createClient } from '@/lib/supabase/server';
import { generateFalImage, uploadImageToSupabase } from '@/lib/fal';
import { openRouter } from '@/lib/openrouter';
import { NextResponse } from 'next/server';

export type FeatureType = 'family-photo' | 'ramadan-menu' | 'gift-recommendation';

// Export these types for use in other files
export type { FamilyPhotoInput, RamadanMenuInput, GiftRecommendationInput };

// Base interface for all feature inputs
interface BaseFeatureInput {
    prompt: string;
}

// Specific interfaces for each feature type
interface FamilyPhotoInput extends BaseFeatureInput {
    imageUrls?: string[];
    aspectRatio?: string;
    style?: string;
}

interface RamadanMenuInput extends BaseFeatureInput {
    preferences?: string[];
    dietaryRestrictions?: string[];
}

interface GiftRecommendationInput extends BaseFeatureInput {
    recipient?: string;
    budget?: string;
    interests?: string[];
}

// Union type for all feature inputs
type FeatureInput =
    | (FamilyPhotoInput & { featureType: 'family-photo' })
    | (RamadanMenuInput & { featureType: 'ramadan-menu' })
    | (GiftRecommendationInput & { featureType: 'gift-recommendation' });

interface GenerateOptions {
    featureType: FeatureType;
    userInput: FeatureInput;
    userId: string;
}

export async function generateContent({ featureType, userInput, userId }: GenerateOptions) {
    const supabase = await createClient();

    // 1. Check & Consume Credits (Unified Logic)
    let creditResult: any = { is_pro: false };

    // START: Free Quota Logic for Family Photo
    let usedFreeQuota = false;
    if (featureType === 'family-photo') {
        const { data: isFreeSuccess, error: freeError } = await supabase
            .rpc('decrement_free_generations', { target_user_id: userId });

        if (!freeError && isFreeSuccess === true) {
            usedFreeQuota = true;
            creditResult = { is_pro: true }; // Treat free generations as Pro quality
            console.log(`[GENERATE] User ${userId} used FREE quota for ${featureType}`);
        }
    }
    // END: Free Quota Logic

    // If not using free quota, consume credits normally
    if (!usedFreeQuota) {
        const { data: cr, error: creditError } = await supabase
            .rpc('consume_credit', {
                target_user_id: userId,
                feature_name: featureType
            });

        if (creditError || !cr) {
            throw new Error('Insufficient credits or error checking balance.');
        }
        creditResult = cr;
    }

    // 2. Dispatch to specific AI Provider based on feature
    try {
        let result;

        switch (featureType) {
            case 'family-photo':
                // Fal.ai Generation
                console.log("Triggering Fal.ai generation (via generateFalImage wrapper)...");
                try {
                    const photoInput = userInput as FamilyPhotoInput;
                    const tempImageUrl = await generateFalImage(photoInput.prompt, {
                        imageUrls: photoInput.imageUrls,
                        aspectRatio: photoInput.aspectRatio
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

                    // 4. Save to History Table (NEW)
                    const { error: historyError } = await supabase
                        .from('generated_images')
                        .insert({
                            user_id: userId,
                            image_url: finalUrl,
                            prompt: userInput.prompt,
                            feature_type: featureType,
                            metadata: {
                                aspectRatio: photoInput.aspectRatio,
                                style: photoInput.style, // if available in userInput
                                promptOverride: photoInput.prompt !== photoInput.prompt // rough check or just store full prompt
                            }
                        });

                    if (historyError) {
                        console.error("Failed to save history:", historyError);
                        // Don't fail the whole request, but warn
                    }
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
        // Refund credit on failure to avoid charging users for failed generations
        console.error("AI Generation Failed:", error);

        try {
            if (usedFreeQuota) {
                // Refund free quota (Increment back)
                const { error: refundError } = await supabase
                    .rpc('increment_free_generations', { target_user_id: userId });

                if (refundError) {
                    console.error("Failed to refund free quota:", refundError);
                } else {
                    console.log("Free quota refunded successfully for failed generation");
                }
            } else {
                const { error: refundError } = await supabase
                    .rpc('refund_credit', {
                        target_user_id: userId,
                        feature_name: featureType
                    });

                if (refundError) {
                    console.error("Failed to refund credit:", refundError);
                    // Log the refund failure but don't fail the request again
                } else {
                    console.log("Credit refunded successfully for failed generation");
                }
            }
        } catch (refundError) {
            console.error("Error during credit/quota refund:", refundError);
        }

        throw error;
    }
}
