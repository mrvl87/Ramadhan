import { NextResponse } from 'next/server'
import { requireEntitlement } from '@/lib/gatekeeper'
import { constructPrompt, generateFalImage, uploadImageToSupabase, CardType } from '@/lib/fal'

export async function POST(req: Request) {
    try {
        // 1. Parse Request
        const body = await req.json()
        const { type, theme, text, style } = body

        if (!type) {
            return NextResponse.json({ error: "Missing card type" }, { status: 400 })
        }

        // 2. Gatekeeper Check (Consumes Credit!)
        // We assume 'generate_card' is the feature name
        const gate = await requireEntitlement('generate_card')

        if (!gate.allowed) {
            return NextResponse.json(
                {
                    status: "PAYWALL",
                    reason: gate.reason,
                    upgrade_url: gate.upgrade_url
                },
                { status: 403 }
            )
        }

        // Get Current User ID from the session that gatekeeper checked? 
        // Wait, requireEntitlement checks user but returns result. 
        // We need user ID for storage path. 
        // Let's get user again or refactor gatekeeper to return user ID.
        // For now, simple: get user again (Supabase client caches session, it's cheap)
        // Or better, let's just assume we are authenticated if gate allowed.
        // But we need the ID.

        // Refetching user for ID (Using the same logic as gatekeeper would be ideal, but for speed implementation:)
        // We already have auth logic in `lib/supabase/server`.
        // Let's rely on `requireEntitlement` enforcing auth, and just fetch ID here for storage.
        // OR: Update gatekeeper to return userId.
        /* 
           For now, let's keep it simple and just re-fetch user.
        */
        const { createClient } = await import('@/lib/supabase/server')
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) throw new Error("User not found despite gatekeeper passing (Impossible event)")

        // 3. Construct Prompt
        const prompt = constructPrompt(type as CardType, theme, { text, style })

        // 4. Generate Image (Fal.ai)
        // NOTE: In a real production app, this might timeout on Vercel (10s limit on free tier).
        // Schnell is fast (~2s), so it should be fine.
        // If it's slow, we'd need background jobs.
        const tempImageUrl = await generateFalImage(prompt)

        // 5. Upload to Storage (Supabase)
        // Pass is_pro to determine watermark logic
        const permanentUrl = await uploadImageToSupabase(tempImageUrl, user.id, type, gate.is_pro)

        // 6. Return Success
        return NextResponse.json({
            status: "SUCCESS",
            data: {
                imageUrl: permanentUrl,
                remaining_credits: gate.remaining_credits,
                is_pro: gate.is_pro
            }
        })

    } catch (error: any) {
        console.error("Generation Error:", error)
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
    }
}
