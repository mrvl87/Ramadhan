'use client'

import Link from 'next/link'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

export function Navbar() {
    const [mounted, setMounted] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/kartu/family', label: 'AI Card Generator' },
        { href: '/menu', label: 'Menu Planner' },
        { href: '/gift', label: 'Gift Ideas' },
        { href: '/profile', label: 'Profile' },
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

                    {/* Desktop Navigation */}
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

                    {/* Right Side: Theme Toggle + Mobile Menu Button */}
                    <div className="flex items-center gap-2">
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
                    </div>
                </div>
            )}
        </nav>
    )
}
