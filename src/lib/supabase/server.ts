import { createServerClient } from '@supabase/ssr'

export async function createClient() {
    try {
        const { cookies } = await import('next/headers')
        const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
}
        )
    } catch (error) {
        // Fallback for when cookies() is not available (e.g., during build)
        console.warn('Cookie store not available, using fallback client')
        return createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll() {
                        return []
                    },
                    setAll() {
                        // No-op for fallback
                    }
                }
            }
        )
    }
}
