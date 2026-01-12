import { NextResponse } from 'next/server'
import { requireEntitlement } from '@/lib/gatekeeper'

export async function GET() {
    // 1. Ask Gatekeeper
    const result = await requireEntitlement('test_gate_usage')

    // 2. Handle Rejection (Paywall)
    if (!result.allowed) {
        return NextResponse.json(
            {
                status: "PAYWALL",
                reason: result.reason,
                upgrade_url: result.upgrade_url
            },
            { status: 403 }
        )
    }

    // 3. Allow Access
    return NextResponse.json({
        status: "SUCCESS",
        data: {
            message: "AI Generation Allowed!",
            is_pro: result.is_pro,
            remaining_credits: result.remaining_credits
        }
    })
}
