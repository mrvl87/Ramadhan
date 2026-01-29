import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Download, Heart, Share2, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { GiftCard } from '@/features/gift-ideas/components/results/GiftCard'
import type { GiftGeneration } from '@/features/gift-ideas/types'

interface PageProps {
    params: {
        id: string
    }
}

export default async function GiftResultsPage({ params }: PageProps) {
    // Next.js 15+: params is a Promise
    const { id } = await params
    const supabase = await createClient()

    // Get current user
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?redirect=/gift-ideas/results/' + id)
    }

    // Fetch gift generation
    const { data: generation, error } = await supabase
        .from('gift_generations')
        .select('*')
        .eq('id', id)
        .eq('user_id', user.id) // Security: only show user's own generations
        .single()

    if (error || !generation) {
        console.error('[GIFT RESULTS] Fetch error:', error)
        redirect('/gift-ideas')
    }

    const typedGeneration = generation as unknown as GiftGeneration

    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Back Button */}
                <Link href="/gift-ideas">
                    <Button variant="ghost" className="mb-6 gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Gift Ideas
                    </Button>
                </Link>

                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                                🎁 Your Perfect Gift Ideas
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 text-lg">
                                Personalized recommendations for your{' '}
                                <Badge variant="secondary" className="mx-1">
                                    {typedGeneration.recipient_type}
                                </Badge>
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Heart className="w-4 h-4" />
                                Save
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Share2 className="w-4 h-4" />
                                Share
                            </Button>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Download className="w-4 h-4" />
                                PDF
                            </Button>
                        </div>
                    </div>

                    {/* Generation Summary Card */}
                    <Card className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-white">
                                <Sparkles className="w-5 h-5" />
                                Generation Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <p className="text-purple-100 mb-1">Budget Range</p>
                                <p className="font-bold">
                                    Rp {typedGeneration.budget_min.toLocaleString('id-ID')} -{' '}
                                    Rp {typedGeneration.budget_max.toLocaleString('id-ID')}
                                </p>
                            </div>
                            <div>
                                <p className="text-purple-100 mb-1">Occasion</p>
                                <p className="font-bold capitalize">{typedGeneration.occasion}</p>
                            </div>
                            <div>
                                <p className="text-purple-100 mb-1">Interests</p>
                                <p className="font-bold">
                                    {typedGeneration.interests.length > 0
                                        ? typedGeneration.interests.slice(0, 2).join(', ') +
                                        (typedGeneration.interests.length > 2 ? '...' : '')
                                        : 'Any'}
                                </p>
                            </div>
                            <div>
                                <p className="text-purple-100 mb-1">Credits Used</p>
                                <p className="font-bold">💎 {typedGeneration.credits_used}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Gift Cards Grid */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                        5 Perfect Gift Recommendations
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {typedGeneration.gift_ideas.map((gift, index) => (
                            <GiftCard key={index} gift={gift} index={index} />
                        ))}
                    </div>
                </div>

                {/* Additional Notes */}
                {typedGeneration.additional_notes && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="text-lg">Your Notes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-slate-600 dark:text-slate-400">
                                {typedGeneration.additional_notes}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* CTA Section */}
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800">
                    <CardContent className="p-8 text-center">
                        <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-3">
                            Need More Ideas?
                        </h3>
                        <p className="text-purple-700 dark:text-purple-300 mb-6">
                            Generate another set of personalized gift recommendations
                        </p>
                        <Link href="/gift-ideas/create">
                            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2">
                                <Sparkles className="w-4 h-4" />
                                Generate More Gifts
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
