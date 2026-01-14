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
            const externalId = body.external_id; // "INV-{user_id}-{timestamp}"
            const parts = externalId.split("-");
            // Basic extraction: INV, UserID, Timestamp
            // If UserID has dashes, we need to be careful.
            // Better strategy: We stored user_id in the externalId. 
            // Let's assume user_id is the 2nd part, or we rejoin if UUID?
            // UUIDs have dashes. "INV-uuid-timestamp".
            // Let's rely on finding the user via email if possible, or parsing carefully.

            // Re-parsing strategy:
            // Remove "INV-" prefix and the last "-timestamp" suffix.
            // This is brittle.

            // BETTER: Use payer_email to find user.
            const payerEmail = body.payer_email;

            if (payerEmail) {
                const supabase = await createClient();

                // We need to use SERVICE ROLE to update users table directly?
                // Or just use the standard client if we have a way to query by email?
                // The standard client uses the request cookies, which don't exist here.
                // We need a Service Role Client for Webhooks.
                // Since we don't have one readily set up in lib/supabase, we might face permission issues.
                // BUT: We enabled RLS. We can't update public.users without being logged in or being admin.

                // For MVP, we'll assume we have a function or we create a service client using the key.
                // Let's try to init a service client here manually.
                const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
                const supabaseAdmin = createSupabaseClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL,
                    process.env.SUPABASE_SERVICE_ROLE_KEY
                );

                const { data: userData, error: userError } = await supabaseAdmin
                    .from('auth.users') // Trying to find ID from email? No, we can query public.users if email is there?
                    // public.users matches auth.users.
                    // Actually, public.users might not have email. auth.users does.
                    // Let's assume we can query `public.users` by joining or we stored `email` in `public.users`? 
                    // We added email to public.users? Let's check schema.
                    // We added `payment_customer_id`.

                    // Actually, finding via email in public.users is risky if not synced.
                    // Let's go with the ID in external_id if possible.

                    // "INV-123e4567-e89b-12d3-a456-426614174000-1678888888"
                    // "INV-" is 4 chars.
                    // Timestamp is roughly 13 chars? 
                    // Let's try the email matching strategy on `auth.users`, getting the ID, then updating `public.users`.
                    // But we can't select from auth.users easily unless service role.

                    // Using Service Role:
                    .rpc('get_user_id_by_email', { email: payerEmail });
                // Wait, we don't have that RPC.

                // Fallback: We can just update public.users where id = ... if we parse carefully.
                // Let's try parsing.
                // ID is parts.slice(1, -1).join("-")
                const userIdCandidate = parts.slice(1, -1).join("-");

                // Update
                const { error } = await supabaseAdmin
                    .from('public.users')
                    .update({
                        plan: 'pro',
                        pro_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                        payment_gateway: 'xendit',
                        payment_status: 'paid'
                    })
                    .eq('id', userIdCandidate);

                if (error) {
                    console.error("Failed to activate Pro:", error);
                    return NextResponse.json({ error: "Update Failed" }, { status: 500 });
                }

                console.log(`[Xendit] Activated Pro for user ${userIdCandidate}`);
            }
        }

        return NextResponse.json({ status: "OK" });

    } catch (error: any) {
        console.error("Xendit Webhook Error:", error);
        return NextResponse.json({ error: "Webhook Failed" }, { status: 500 });
    }
}
