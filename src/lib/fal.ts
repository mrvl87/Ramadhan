import { createClient } from "@/lib/supabase/server";
import { constructEmotionalPrompt, NEGATIVE_PROMPT, CardType, ThemeKey } from "./prompt-engine";

const FAL_KEY = process.env.FAL_KEY;

if (!FAL_KEY) {
    throw new Error("FAL_KEY is missing in environment variables! Please add it to .env.local");
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

export async function generateFalImage(prompt: string, options?: { imageUrls?: string[]; aspectRatio?: string }) {
    // Switching to fal-ai/nano-banana/edit as requested
    const url = "https://fal.run/fal-ai/nano-banana/edit";

    console.log("Calling Fal.ai (Nano Banana Edit)...");

    try {
        // Map user aspect ratio to Fal image_size
        let imageSize = "square_hd";
        if (options?.aspectRatio) {
            switch (options.aspectRatio) {
                case "portrait":
                case "4:5":
                    imageSize = "portrait_4_3";
                    break;
                case "landscape":
                case "16:9":
                    imageSize = "landscape_16_9";
                    break;
                case "9:16":
                    imageSize = "portrait_16_9";
                    break;
                case "square":
                case "1:1":
                default:
                    imageSize = "square_hd";
                    break;
            }
        }

        const body: any = {
            prompt: prompt,
            image_size: imageSize,
            // Nano Banana Edit expects 'image_urls' (plural, array)
        };

        if (options?.imageUrls && options.imageUrls.length > 0) {
            body.image_urls = options.imageUrls;
        }

        console.log("Fal Request Body:", JSON.stringify(body, null, 2));

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Key ${FAL_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Fal API Error ${response.status}:`, errorText);
            throw new Error(`Fal.ai HTTP Error: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        console.log("Fal Response:", JSON.stringify(result, null, 2));

        // Nano Banana returns { images: [{ url: "..." }] } similar to others
        if (result.images && result.images.length > 0) {
            return result.images[0].url;
        } else {
            console.error("Fal Response missing image URL:", result);
            throw new Error("No image URL in Fal response: " + JSON.stringify(result));
        }

    } catch (error: any) {
        console.error("Fal Generation Failed:", error);
        throw new Error(error.message || "Unknown Fal Error");
    }
}

import { fal } from "@fal-ai/client";

// ... other imports

export async function generateFalLLM(prompt: string, model: string = "google/gemini-2.0-flash-exp:free") {
    console.log(`Calling Fal LLM Proxy via SDK (${model})...`);

    // Ensure config is set if not already global (though safe to set again)
    fal.config({
        credentials: FAL_KEY, // Use the extracted key string 
    });

    try {
        const result: any = await fal.subscribe("openrouter/router", {
            input: {
                prompt: prompt, // Use 'prompt' as per user example (though 'messages' is standard for chat, user example used 'prompt')
                // Wait, user example: prompt: "Write...", model: "..."
                // Use user example structure exactly.
                model: model,
                temperature: 1
            },
            logs: true,
            onQueueUpdate: (update) => {
                if (update.status === "IN_PROGRESS") {
                    update.logs.map((log) => log.message).forEach(console.log);
                }
            },
        });

        console.log("Fal LLM SDK Result:", JSON.stringify(result, null, 2));

        // Result data structure from Fal usually wraps the output. 
        // Based on user example snippet: console.log(result.data);
        // We need to extracting the text. OpenRouter usually returns standard OpenAI chat completion json.
        // If result.data is that JSON, we look for choices[0].message.content or similar.
        // Let's inspect result.data in logs if possible, but for code we'll try to be robust.

        if (result.data) {
            // Handle if result.data is a string (rare) or object
            if (typeof result.data === 'string') return result.data;

            // Check for 'output' field (User reported structure)
            if (result.data.output) {
                return result.data.output;
            }

            if (result.data.choices && result.data.choices[0]?.message?.content) {
                return result.data.choices[0].message.content;
            }

            // Fallback
            return JSON.stringify(result.data);
        }

        return null;

    } catch (error: any) {
        console.error("Fal LLM SDK Failed:", error);
        throw new Error(error.message || "Unknown Fal LLM SDK Error");
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
