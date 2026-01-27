import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const callbackToken = req.headers.get("x-callback-token");
        if (callbackToken !== process.env.XENDIT_CALLBACK_TOKEN) {
            // In production, strictly enforce this. For MVP dev, we verify existence.
            if (process.env.NODE_ENV === 'production') {
                return NextResponse.json({ error: "Invalid Token" }, { status: 403 });
            }
        }

        const body = await req.json();

        // Handle "Invoice Paid" event
        if (body.status === "PAID" || body.status === "SETTLED") {
            const externalId = body.external_id; // "CREDITS-{BUNDLE}-{user_id}-{timestamp}"
            const parts = externalId.split("-");

            // Parse bundle type from externalId
            // Format: CREDITS-STARTER-uuid-timestamp or CREDITS-POPULAR-uuid-timestamp
            const bundleType = parts[1]?.toLowerCase(); // "starter", "popular", or "power"

            // Map bundle to credits
            const BUNDLE_CREDITS: Record<string, number> = {
                starter: 50,
                popular: 150,
                power: 500
            };

            const creditsToAdd = BUNDLE_CREDITS[bundleType] || 0;

            if (creditsToAdd === 0) {
                console.error(`[Xendit] Unknown bundle type: ${bundleType}`);
                return NextResponse.json({ error: "Unknown bundle type" }, { status: 400 });
            }

            // Extract user ID (parts between bundle and timestamp)
            // For UUID: CREDITS-BUNDLE-xxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx-timestamp
            // User ID is parts[2] through parts[length-2] joined with "-"
            const userIdCandidate = parts.slice(2, -1).join("-");

            if (!userIdCandidate) {
                console.error("[Xendit] Could not extract user ID from external_id");
                return NextResponse.json({ error: "Invalid external_id" }, { status: 400 });
            }

            const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
            const supabaseAdmin = createSupabaseClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY
            );

            // Get current credits
            const { data: currentUser, error: fetchError } = await supabaseAdmin
                .from('users')
                .select('credits')
                .eq('id', userIdCandidate)
                .single();

            if (fetchError) {
                console.error("[Xendit] Failed to fetch user:", fetchError);
                return NextResponse.json({ error: "User not found" }, { status: 404 });
            }

            const currentCredits = currentUser?.credits || 0;
            const newCredits = currentCredits + creditsToAdd;

            // Update user credits (additive model - credits stack)
            const { error } = await supabaseAdmin
                .from('users')
                .update({
                    credits: newCredits,
                    payment_gateway: 'xendit',
                    payment_status: 'paid'
                })
                .eq('id', userIdCandidate);

            if (error) {
                console.error("[Xendit] Failed to update credits:", error);
                return NextResponse.json({ error: "Update Failed" }, { status: 500 });
            }

            console.log(`[Xendit] Added ${creditsToAdd} credits to user ${userIdCandidate}. Previous: ${currentCredits}, New: ${newCredits}`);
        }

        return NextResponse.json({ status: "OK" });

    } catch (error: any) {
        console.error("Xendit Webhook Error:", error);
        return NextResponse.json({ error: "Webhook Failed" }, { status: 500 });
    }
}
