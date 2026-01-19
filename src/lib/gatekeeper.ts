import { createClient } from '@/lib/supabase/server'

export type GatekeeperResult =
    | { allowed: true; is_pro: boolean; remaining_credits: number; userId: string; reason?: never; upgrade_url?: never }
    | { allowed: false; reason: "NO_CREDITS" | "NOT_LOGGED_IN"; upgrade_url: string; is_pro?: never; remaining_credits?: never; userId?: never }

/**
 * STRICT GATEKEEPER
 * strictly enforces simple access control:
 * - Must be logged in.
 * - Must have entitlement (Pro or Credits).
 * - Logs usage to DB.
 */
export async function requireEntitlement(feature_name: string): Promise<GatekeeperResult> {
    const supabase = await createClient()

    // 1. Auth Check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return {
            allowed: false,
            reason: "NOT_LOGGED_IN",
            upgrade_url: "/login"
        }
    }

    // 2. Consume Credit (Transactional Check & Log)
    // We call consume_credit immediately because it:
    // - Locks the row (prevents race conditions)
    // - Checks entitlement (get_user_entitlement) internally
    // - Consumes credit IF not pro
    // - Logs usage ALWAYS (for Pro and Free)
    // - Returns the new state
    const { data, error } = await supabase.rpc('consume_credit', {
        target_user_id: user.id,
        feature_name: feature_name
    })

    // 3. Handle Rejection (DB Exception)
    if (error) {
        console.error("Gatekeeper Rejection:", error.message)
        return {
            allowed: false,
            reason: "NO_CREDITS",
            upgrade_url: "/pricing" // In the future, this could be dynamic
        }
    }

    // 4. Success
    return {
        allowed: true,
        is_pro: data.is_pro,
        remaining_credits: data.remaining_credits,
        userId: user.id
    }
}
