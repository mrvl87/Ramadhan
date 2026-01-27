// Admin Authentication Utilities
// Checks if current user has admin access

import { createClient } from '@/lib/supabase/server'

export async function isAdmin(): Promise<boolean> {
    try {
        // Get current user from regular client
        const supabase = await createClient()
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        console.log('[ADMIN DEBUG] User check:', { userId: user?.id, email: user?.email, userError })

        if (!user) {
            console.log('[ADMIN DEBUG] No user - not logged in')
            return false
        }

        // Use service role to bypass RLS and avoid infinite recursion
        const { createClient: createServiceClient } = await import('@supabase/supabase-js')
        const supabaseAdmin = createServiceClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // Check if user is in admins table with active access (bypasses RLS)
        const { data: adminData, error } = await supabaseAdmin
            .from('admins')
            .select('role, revoked_at')
            .eq('user_id', user.id)
            .is('revoked_at', null)
            .single()

        console.log('[ADMIN DEBUG] Admin table query:', { adminData, error })

        if (error) {
            console.error('[ADMIN DEBUG] Query error:', error)
            return false
        }

        if (!adminData) {
            console.log('[ADMIN DEBUG] User not in admins table')
            return false
        }

        console.log('[ADMIN DEBUG] ✅ Admin access granted:', adminData.role)
        return true
    } catch (error) {
        console.error('[ADMIN DEBUG] Exception:', error)
        return false
    }
}

export async function getAdminRole(): Promise<string | null> {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return null

        const { data: adminData } = await supabase
            .from('admins')
            .select('role')
            .eq('user_id', user.id)
            .is('revoked_at', null)
            .single()

        return adminData?.role || null
    } catch (error) {
        return null
    }
}

export async function requireAdmin() {
    const hasAccess = await isAdmin()

    if (!hasAccess) {
        throw new Error('Unauthorized: Admin access required')
    }

    return true
}
