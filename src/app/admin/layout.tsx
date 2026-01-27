'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, CreditCard, Zap, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Users', href: '/admin/users', icon: Users },
        { name: 'Transactions', href: '/admin/transactions', icon: CreditCard },
        { name: 'Generations', href: '/admin/generations', icon: Zap },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
    ]

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
                {/* Logo */}
                <div className="flex items-center gap-2 p-6 border-b border-slate-200 dark:border-slate-800">
                    <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold">A</span>
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 dark:text-white">Admin Panel</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">RamadanHub AI</div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                        ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-medium'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <item.icon className="w-5 h-5" />
                                <span>{item.name}</span>
                            </Link>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-200 dark:border-slate-800">
                    <Link href="/">
                        <Button variant="ghost" className="w-full justify-start text-slate-700 dark:text-slate-300">
                            <LogOut className="w-5 h-5 mr-3" />
                            Back to App
                        </Button>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}
