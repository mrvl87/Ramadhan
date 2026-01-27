'use client'

import Link from 'next/link'
import { Moon, Sun, Menu, X, User, LogOut, Coins } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function Navbar() {
    const [mounted, setMounted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [user, setUser] = useState<any>(null)
    const [credits, setCredits] = useState<number>(0)
    const { theme, setTheme } = useTheme()
    const router = useRouter()

    useEffect(() => {
        setMounted(true)
        fetchUserData()
    }, [])

    const fetchUserData = async () => {
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (authUser) {
            setUser(authUser)

            // Fetch credits from users table
            const { data: userData } = await supabase
                .from('users')
                .select('credits')
                .eq('id', authUser.id)
                .single()

            if (userData) {
                setCredits(userData.credits || 0)
            }
        }
    }

    const handleLogout = async () => {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/login')
        router.refresh()
    }

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/kartu/family', label: 'AI Card Generator' },
        { href: '/menu', label: 'Menu Planner' },
        { href: '/gift', label: 'Gift Ideas' },
        { href: '/pricing', label: 'Pricing' },
    ]

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-600 dark:text-emerald-400">
                        <Moon className="w-6 h-6 fill-emerald-600 dark:fill-emerald-400" />
                        <span className="hidden sm:inline">RamadanHub AI</span>
                        <span className="sm:hidden">RHAI</span>
                    </Link>

                    {/* Desktop Navigation - Centered */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side: Credits + Theme + Profile */}
                    <div className="flex items-center gap-3">
                        {/* Credits Badge */}
                        {user && (
                            <Link href="/pricing">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="hidden md:flex items-center gap-2 font-semibold border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                                >
                                    <Coins className="w-4 h-4" />
                                    <span>{credits}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">credits</span>
                                </Button>
                            </Link>
                        )}

                        {/* Theme Toggle */}
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                className="text-slate-700 dark:text-slate-300"
                            >
                                {theme === 'dark' ? (
                                    <Sun className="w-5 h-5" />
                                ) : (
                                    <Moon className="w-5 h-5" />
                                )}
                            </Button>
                        )}

                        {/* Profile Dropdown */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="hidden md:flex rounded-full border-2 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 dark:hover:border-emerald-600"
                                    >
                                        <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium">My Account</span>
                                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                                {user.email}
                                            </span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href="/profile" className="flex items-center gap-2 cursor-pointer">
                                            <User className="w-4 h-4" />
                                            <span>My Profile</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/pricing" className="flex items-center gap-2 cursor-pointer">
                                            <Coins className="w-4 h-4" />
                                            <span>{credits} Credits</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login">
                                <Button size="sm" className="hidden md:flex">
                                    Login
                                </Button>
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden text-slate-700 dark:text-slate-300"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="px-4 py-4 space-y-2">
                        {/* User Info (Mobile) */}
                        {user && (
                            <>
                                <div className="px-4 py-3 bg-emerald-50 dark:bg-emerald-950 rounded-lg mb-2">
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                                        {user.email}
                                    </div>
                                    <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                                        <div className="flex items-center gap-2 mt-2 text-emerald-700 dark:text-emerald-400">
                                            <Coins className="w-4 h-4" />
                                            <span className="text-sm font-semibold">{credits} Credits</span>
                                        </div>
                                    </Link>
                                </div>
                            </>
                        )}

                        {/* Nav Links */}
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {user && (
                            <>
                                <Link
                                    href="/profile"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg transition-colors"
                                >
                                    My Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        setMobileMenuOpen(false)
                                        handleLogout()
                                    }}
                                    className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition-colors"
                                >
                                    Logout
                                </button>
                            </>
                        )}

                        {!user && (
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <Button className="w-full">Login</Button>
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
