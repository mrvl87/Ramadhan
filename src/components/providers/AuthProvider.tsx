"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface UserProfile {
    full_name: string | null
    credits: number
    free_generations: number
    // Add other profile fields as needed
}

interface AuthContextType {
    user: User | null
    profile: UserProfile | null
    isAdmin: boolean
    isLoading: boolean
    refreshAuth: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    isAdmin: false,
    isLoading: true,
    refreshAuth: async () => { },
    signOut: async () => { },
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    const supabase = createClient()

    const fetchProfile = async (userId: string) => {
        try {
            // 1. Fetch Request: User Profile (Credits, etc.)
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('full_name, credits, free_generations')
                .eq('id', userId)
                .single()

            if (userData) {
                setProfile({
                    full_name: userData.full_name,
                    credits: userData.credits || 0,
                    free_generations: userData.free_generations || 0
                })
            }

            // 2. Fetch Request: Admin Status
            const { data: adminData } = await supabase
                .from('admins')
                .select('role')
                .eq('user_id', userId)
                .is('revoked_at', null)
                .single()

            setIsAdmin(!!adminData)
        } catch (error) {
            console.error('[AUTH] Error fetching profile:', error)
        }
    }

    const refreshAuth = async () => {
        setIsLoading(true)
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (authUser) {
            setUser(authUser)
            await fetchProfile(authUser.id)
        } else {
            setUser(null)
            setProfile(null)
            setIsAdmin(false)
        }
        setIsLoading(false)
    }

    const signOut = async () => {
        await supabase.auth.signOut()
        setUser(null)
        setProfile(null)
        setIsAdmin(false)
        router.refresh()
        router.replace('/login')
    }

    useEffect(() => {
        // Initial Fetch
        refreshAuth()

        // Listener for Auth Changes (Sign In, Sign Out, etc)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('[AUTH] Auth State Changed:', event)

            if (session?.user) {
                setUser(session.user)
                // We re-fetch profile on sign-in or token refresh to ensure credits are up to date
                if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
                    await fetchProfile(session.user.id)
                }
            } else {
                setUser(null)
                setProfile(null)
                setIsAdmin(false)
            }
            setIsLoading(false)

            // Trigger router refresh to update Server Components if any
            router.refresh()
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, profile, isAdmin, isLoading, refreshAuth, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}
