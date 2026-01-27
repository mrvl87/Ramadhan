// Admin Dashboard Stats API
// GET /api/admin/stats - Aggregated metrics for dashboard

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/admin/auth'

export async function GET() {
    try {
        // Check admin access
        await requireAdmin()

        const supabase = await createClient()

        // Get metrics in parallel
        const [
            usersResult,
            transactionsResult,
            generationsResult,
            revenueResult
        ] = await Promise.all([
            // Total users
            supabase.from('users').select('id', { count: 'exact', head: true }),

            // Total transactions
            supabase.from('transactions').select('*', { count: 'exact' }).eq('status', 'paid'),

            // Total generations
            supabase.from('generations').select('id', { count: 'exact', head: true }),

            // Revenue summary
            supabase.from('transactions')
                .select('amount_idr, credits_purchased')
                .eq('status', 'paid')
        ])

        // Calculate metrics
        const totalUsers = usersResult.count || 0
        const totalTransactions = transactionsResult.count || 0
        const totalGenerations = generationsResult.count || 0

        const transactions = transactionsResult.data || []
        const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount_idr || 0), 0)
        const totalCreditsSold = transactions.reduce((sum, t) => sum + (t.credits_purchased || 0), 0)
        const avgTransactionValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0

        // Get today's stats
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { count: todayUsers } = await supabase
            .from('users')
            .select('id', { count: 'exact', head: true })
            .gte('created_at', today.toISOString())

        const { data: todayTransactions } = await supabase
            .from('transactions')
            .select('amount_idr')
            .eq('status', 'paid')
            .gte('created_at', today.toISOString())

        const todayRevenue = (todayTransactions || []).reduce((sum, t) => sum + (t.amount_idr || 0), 0)

        // Get active users (generated in last 30 days)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data: activeUserIds } = await supabase
            .from('generations')
            .select('user_id')
            .gte('created_at', thirtyDaysAgo.toISOString())

        const activeUsers = new Set(activeUserIds?.map(g => g.user_id)).size

        return NextResponse.json({
            users: {
                total: totalUsers,
                active: activeUsers,
                today: todayUsers || 0
            },
            revenue: {
                total: totalRevenue,
                today: todayRevenue,
                avgTransaction: Math.round(avgTransactionValue)
            },
            credits: {
                totalSold: totalCreditsSold,
                totalUsed: totalGenerations
            },
            transactions: {
                total: totalTransactions
            },
            generations: {
                total: totalGenerations
            }
        })
    } catch (error: any) {
        console.error('Admin stats error:', error)

        if (error.message === 'Unauthorized: Admin access required') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
