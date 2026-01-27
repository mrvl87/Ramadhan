'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, DollarSign, Coins, Zap, TrendingUp, Activity } from 'lucide-react'

interface DashboardStats {
    users: {
        total: number
        active: number
        today: number
    }
    revenue: {
        total: number
        today: number
        avgTransaction: number
    }
    credits: {
        totalSold: number
        totalUsed: number
    }
    transactions: {
        total: number
    }
    generations: {
        total: number
    }
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        fetchStats()
    }, [])

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats')

            if (res.status === 401) {
                router.push('/login?redirect=/admin/dashboard')
                return
            }

            if (!res.ok) throw new Error('Failed to fetch stats')

            const data = await res.json()
            setStats(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Admin Dashboard</h1>
                    <div className="text-slate-600 dark:text-slate-400">Loading...</div>
                </div>
            </div>
        )
    }

    if (error || !stats) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">Admin Dashboard</h1>
                    <div className="text-red-600 dark:text-red-400">Error: {error || 'Failed to load'}</div>
                </div>
            </div>
        )
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Admin Dashboard</h1>
                    <p className="text-slate-600 dark:text-slate-400">RamadanHub AI Analytics & Management</p>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {/* Total Revenue */}
                    <Card className="border-emerald-200 dark:border-emerald-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Total Revenue
                            </CardTitle>
                            <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency(stats.revenue.total)}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                +{formatCurrency(stats.revenue.today)} today
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Users */}
                    <Card className="border-blue-200 dark:border-blue-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Total Users
                            </CardTitle>
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.users.total.toLocaleString()}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {stats.users.active} active • +{stats.users.today} today
                            </p>
                        </CardContent>
                    </Card>

                    {/* Credits Sold */}
                    <Card className="border-amber-200 dark:border-amber-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Credits Sold
                            </CardTitle>
                            <Coins className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.credits.totalSold.toLocaleString()}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {stats.credits.totalUsed.toLocaleString()} used ({Math.round((stats.credits.totalUsed / stats.credits.totalSold) * 100)}%)
                            </p>
                        </CardContent>
                    </Card>

                    {/* Total Generations */}
                    <Card className="border-purple-200 dark:border-purple-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                AI Generations
                            </CardTitle>
                            <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.generations.total.toLocaleString()}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Total content created
                            </p>
                        </CardContent>
                    </Card>

                    {/* Avg Transaction */}
                    <Card className="border-orange-200 dark:border-orange-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Avg Transaction
                            </CardTitle>
                            <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {formatCurrency(stats.revenue.avgTransaction)}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {stats.transactions.total} total transactions
                            </p>
                        </CardContent>
                    </Card>

                    {/* Conversion Rate */}
                    <Card className="border-pink-200 dark:border-pink-800">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                Conversion Rate
                            </CardTitle>
                            <Activity className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-slate-900 dark:text-white">
                                {stats.users.total > 0
                                    ? Math.round((stats.transactions.total / stats.users.total) * 100)
                                    : 0}%
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                Users who purchased
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Coming Soon */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-slate-900 dark:text-white">More Features Coming Soon</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                            <li>📊 Revenue charts and trends</li>
                            <li>👥 User management table</li>
                            <li>💳 Transaction log viewer</li>
                            <li>🤖 AI generation analytics</li>
                            <li>📧 Email marketing tools</li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
