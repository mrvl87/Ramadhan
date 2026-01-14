import { createClient } from "@/lib/supabase/server";
import { constructEmotionalPrompt, NEGATIVE_PROMPT, CardType, ThemeKey } from "./prompt-engine";

// Fallback if environment variable is missing (but it should be set!)
// Fallback if environment variable is missing (but it should be set!)
// TEMPORARY: Hardcoding key back to unblock testing
const FAL_KEY = "df5731f7-b814-437e-a95b-7fb45c3f206a:ed38492af34d4ddb8cac35ce628eb1e8";

if (!FAL_KEY) {
    console.warn("FAL_KEY is missing in environment variables! Please add it to .env.local");
}

// Re-export types so api route can use them
export type { CardType };

export function constructPrompt(type: string, theme: string, inputs: { text?: string; style?: string }) {
    // Adapter to match the new engine signature
    // We treat 'style' input as potential family_desc for now if needed, or ignore it.
    // Ideally the API route should pass structured data.
    return constructEmotionalPrompt(
        type as CardType,
        (theme as ThemeKey) || 'luxury_gold',
        {
            text: inputs.text,
            // Simple heuristic for demo: if text contains commas, treat as family desc for photo cards?
            // For now, let's just stick to defaults in the engine if not provided.
        }
    );
}

export async function generateFalImage(prompt: string) {
    // Switching to DIRECT HTTP CALL to diagnose Auth issues
    // Endpoint: fal-ai/flux/schnell (Fast, cheap, synchronous)

    const url = "https://fal.run/fal-ai/flux/schnell";

    console.log("Calling Fal.ai (Flux Schnell)...");

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Key ${FAL_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: prompt,
                image_size: "square_hd",
                enable_safety_checker: true,
                num_inference_steps: 4,
                // Add safety net
                // negative_prompt: NEGATIVE_PROMPT // Flux Schnell sometimes ignores this, but simpler Flux Pro supports it.
                // We'll trust the prompt engine's positive guidance for Schnell.
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Fal API Error ${response.status}:`, errorText);
            throw new Error(`Fal.ai HTTP Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();

        // Flux Schnell usually returns { images: [{ url: "..." }] }
        if (result.images && result.images.length > 0) {
            return result.images[0].url;
        } else {
            throw new Error("No image URL in Fal response: " + JSON.stringify(result));
        }

    } catch (error: any) {
        console.error("Fal Generation Failed:", error);
        throw new Error(error.message || "Unknown Fal Error");
    }
}

import { applyWatermark } from "./watermark";

export async function uploadImageToSupabase(imageUrl: string, userId: string, type: string, isPro: boolean) {
    const supabase = await createClient();

    // 1. Download Raw Image
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const rawBuffer = await blob.arrayBuffer();

    const timestamp = Date.now();
    const basePath = `${userId}/${timestamp}_${type}`;

    // 2. Save HD Version (Always Save, but might not return it)
    // We name it _hd.jpg. 
    // Security Note: In production, use private bucket or signed URLs. Here we rely on obscurity/policy.
    const hdFilename = `${basePath}_hd.jpg`;
    const { error: hdError } = await supabase.storage
        .from('cards')
        .upload(hdFilename, rawBuffer, {
            contentType: 'image/jpeg',
            upsert: false
        });

    if (hdError) {
        console.error("Supabase Upload Error (HD):", hdError);
        throw new Error("Failed to save image");
    }

    // 3. Determine Output
    let finalUrl = "";

    if (isPro) {
        // PRO: Return HD URL
        const { data } = supabase.storage.from('cards').getPublicUrl(hdFilename);
        finalUrl = data.publicUrl;
    } else {
        // FREE: Generate & Save Preview (Watermarked)
        try {
            const watermarkedBuffer = await applyWatermark(rawBuffer);
            const previewFilename = `${basePath}_preview.jpg`;

            const { error: previewError } = await supabase.storage
                .from('cards')
                // @ts-ignore - Supabase types are picky about Buffer vs ArrayBuffer, but it works
                .upload(previewFilename, watermarkedBuffer, {
                    contentType: 'image/jpeg',
                    upsert: false
                });

            if (previewError) throw previewError;

            const { data } = supabase.storage.from('cards').getPublicUrl(previewFilename);
            finalUrl = data.publicUrl;

        } catch (wmError) {
            console.error("Watermark generation failed:", wmError);
            // Fallback: Return HD but log error? Or fail? 
            // We should fail to enforce paywall.
            throw new Error("Failed to process watermarked image");
        }
    }

    return finalUrl;
}
