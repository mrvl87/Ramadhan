import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateFalImage } from "@/lib/fal"; // We reuse the generic FAL wrapper or create new?
// Reusing generateFalImage might be tricky if it has hardcoded "CardType" logic.
// Let's inspect src/lib/fal.ts first or just use a direct call here for specific "flux/schnell" tuning.
// Actually, I'll use a direct call to keep this pipeline isolated and specific.
import { fal } from "@fal-ai/client";
import { constructPoliticalPrompt } from "@/lib/political-prompts";
import { requireEntitlement } from "@/lib/gatekeeper";

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const {
            image_url,
            party,
            costume,
            attributes,
            user_gender,
            user_name
        } = body;

        // 1. Validation & Entitlement
        const hasPremiumAssets = party.is_premium || costume.is_premium || attributes.some((a: any) => a.is_premium);

        if (hasPremiumAssets) {
            const entitlement = await requireEntitlement(user.id);
            if (!entitlement.allowed) {
                return NextResponse.json({ error: "PAYWALL: Premium assets require Pro or Credits", reason: entitlement.reason }, { status: 403 });
            }
        } else {
            // Even for free assets, we might want to check daily limits or just allow it.
            // For now, let's allow free tier for free assets, but maybe consume credits?
            // "Nano Banana Edit Pro" implies it might always cost credits?
            // Let's assume Free assets are Free for now to encourage usage.
        }

        // 2. Prompt Construction
        const prompt = constructPoliticalPrompt({
            userGender: user_gender || 'male',
            party,
            costume,
            attributes,
            userName: user_name
        });

        // 3. Generate with Fal.ai (Image-to-Image)
        // We use the image_url provided (User's selfie) as the base
        console.log("Generating Political Card...");
        // Nano Banana Pro (Edit) - Real Endpoint
        // Schema: https://fal.ai/models/fal-ai/nano-banana-pro/edit/api
        const result: any = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
            input: {
                prompt: prompt,
                image_urls: [image_url], // Must be an array
                aspect_ratio: "auto",
                sync_mode: true
            },
        });

        const generatedImageUrl = result.data.images[0].url;

        // 4. Save to Storage & DB
        // Fetch the image
        const imageRes = await fetch(generatedImageUrl);
        const imageBuffer = await imageRes.arrayBuffer();

        const filename = `${user.id}/${Date.now()}_political`;
        const storagePath = `cards/${filename}`; // Base path

        // Upload HD
        const { error: uploadError } = await supabase.storage
            .from('cards')
            .upload(`${filename}_hd.jpg`, imageBuffer, { contentType: 'image/jpeg' });

        if (uploadError) throw uploadError;

        // Insert Record
        const { data: insertData, error: dbError } = await supabase
            .from('ai_cards')
            .insert({
                user_id: user.id,
                type: 'political',
                theme: party.slug,
                storage_path: storagePath,
                is_hd_unlocked: hasPremiumAssets ? false : true, // Free assets = Unlocked? Or maybe Pro unlocked?
                // Let's say: If User is Pro, it's unlocked. If paid credits, unlocked.
                // For now, default false unless is_pro.
                metadata: { party: party.name, costume: costume.name }
            })
            .select()
            .single();

        if (dbError) throw dbError;

        // 5. Entitlement Consumption (If needed)
        // If not Pro, and used credits? 
        // For this MVP, we did the check at step 1. If we need to DEDUCT credits:
        // await consumeCredits(user.id, 1);

        return NextResponse.json({
            status: "SUCCESS",
            data: {
                imageUrl: generatedImageUrl, // Return the FAL URL for speed, or signed URL?
                cardId: insertData.id
            }
        });

    } catch (error: any) {
        console.error("Political Gen Error:", error);
        return NextResponse.json({ error: error.message || "Internal Error" }, { status: 500 });
    }
}
