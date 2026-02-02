import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error && data?.user) {
            // Check if user has a complete profile
            const { data: profile } = await supabase
                .from('users')
                .select('full_name')
                .eq('id', data.user.id)
                .single()

            const isLocalEnv = process.env.NODE_ENV === 'development'
            const forwardedHost = request.headers.get('x-forwarded-host')
            const base = isLocalEnv ? origin : `https://${forwardedHost}`

            // If profile is incomplete (no full_name), redirect to onboarding
            if (!profile?.full_name) {
                return NextResponse.redirect(`${base}/onboarding`)
            }

            // Otherwise proceed to requested page
            return NextResponse.redirect(`${base}${next}`)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
