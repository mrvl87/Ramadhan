import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
    try {
        const text = await req.text();
        const signature = req.headers.get("x-signature");
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

        if (!signature || !secret) {
            return NextResponse.json({ error: "Missing Signature/Secret" }, { status: 400 });
        }

        // Verify Signature
        const hmac = crypto.createHmac("sha256", secret);
        const digest = Buffer.from(hmac.update(text).digest("hex"), "utf8");
        const signatureBuffer = Buffer.from(signature, "utf8");

        if (!crypto.timingSafeEqual(digest, signatureBuffer)) {
            return NextResponse.json({ error: "Invalid Signature" }, { status: 403 });
        }

        const body = JSON.parse(text);
        const eventName = body.meta.event_name;

        if (eventName === 'order_created' || eventName === 'subscription_created') {
            const { custom } = body.data.attributes.checkout_data || {};
            const userId = custom?.user_id;

            if (userId) {
                // Initialize Service Role Client
                const { createClient } = require('@supabase/supabase-js');
                const supabaseAdmin = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL,
                    process.env.SUPABASE_SERVICE_ROLE_KEY
                );

                // Activate Pro
                const { error } = await supabaseAdmin
                    .from('public.users')
                    .update({
                        plan: 'pro',
                        pro_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        payment_gateway: 'lemonsqueezy',
                        payment_status: 'paid'
                    })
                    .eq('id', userId);

                if (error) {
                    console.error("DB Update Failed:", error);
                    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
                }

                console.log(`[LemonSqueezy] Activated Pro for user ${userId}`);
            }
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error("LemonSqueezy Webhook Error:", error);
        return NextResponse.json({ error: "Webhook Failed" }, { status: 500 });
    }
}
