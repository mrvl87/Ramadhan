import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    console.log('[AUTH CONFIRM] Processing request:', { type, hasToken: !!token_hash, hasCode: !!code, next })

    // Use implicit flow (token_hash)
    if (token_hash && type) {
        const supabase = await createClient()

        const { data, error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })

        if (error) {
            console.error('[AUTH CONFIRM] Verification failed:', error)
        } else {
            console.log('[AUTH CONFIRM] Verification successful for user:', data?.user?.id)
        }

        if (!error && data?.user) {
            // Check if user has a complete profile
            const { data: profile } = await supabase
                .from('users')
                .select('full_name')
                .eq('id', data.user.id)
                .single()

            // If profile is incomplete (no full_name), redirect to onboarding
            if (!profile?.full_name) {
                console.log('[AUTH CONFIRM] Profile incomplete, redirecting to onboarding')
                return NextResponse.redirect(new URL('/onboarding', request.url))
            }

            // redirect user to specified redirect URL or root of app
            console.log('[AUTH CONFIRM] Redirecting to:', next)
            return NextResponse.redirect(new URL(next, request.url))
        }
    } else if (code) {
        // Use PKCE flow (code)
        // Redirect to callback route which handles code exchange
        const callbackUrl = new URL('/auth/callback', request.url)
        callbackUrl.searchParams.set('code', code)
        callbackUrl.searchParams.set('next', next)

        console.log('[AUTH CONFIRM] Redirecting to callback with code')
        return NextResponse.redirect(callbackUrl)
    } else {
        console.error('[AUTH CONFIRM] Missing token_hash, type, or code')
    }

    // redirect the user to an error page with some instructions
    return NextResponse.redirect(new URL('/auth/auth-code-error', request.url))
}
