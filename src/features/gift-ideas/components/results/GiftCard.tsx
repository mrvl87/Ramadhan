'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ExternalLink, ShoppingCart, Sparkles } from 'lucide-react'
import type { GiftIdea } from '../../types'
import { ECOMMERCE_STORES } from '../../utils/constants'

interface GiftCardProps {
    gift: GiftIdea
    index: number
}

export function GiftCard({ gift, index }: GiftCardProps) {
    const handleBuyClick = (store: string) => {
        const storeConfig = ECOMMERCE_STORES[store as keyof typeof ECOMMERCE_STORES]
        if (storeConfig) {
            const url = storeConfig.searchUrl(gift.keywords)
            window.open(url, '_blank', 'noopener,noreferrer')

            // Track analytics (optional)
            console.log(`[GIFT] User clicked ${store} for: ${gift.name}`)
        }
    }

    return (
        <Card className="overflow-hidden hover:shadow-xl transition-all border-purple-100 dark:border-purple-900 group">
            {/* Card Header with Rank Badge */}
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 pb-4">
                <div className="flex items-start justify-between">
                    <Badge className="bg-purple-600 text-white px-3 py-1">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Gift #{index + 1}
                    </Badge>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            Rp {gift.price.toLocaleString('id-ID')}
                        </p>
                    </div>
                </div>
            </CardHeader>

            {/* Gift Details */}
            <CardContent className="pt-6 pb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {gift.name}
                </h3>

                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                    {gift.reason}
                </p>

                {/* Where to Buy Section */}
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                        Where to Buy:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {gift.where_to_buy.map((store) => {
                            const storeConfig = ECOMMERCE_STORES[store as keyof typeof ECOMMERCE_STORES]
                            return (
                                <Button
                                    key={store}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBuyClick(store)}
                                    className="gap-2 hover:bg-purple-50 dark:hover:bg-purple-950 hover:border-purple-300 dark:hover:border-purple-700 transition-colors"
                                >
                                    <span className="text-base">{storeConfig?.icon || '🛒'}</span>
                                    <span className="text-xs">{store}</span>
                                    <ExternalLink className="w-3 h-3" />
                                </Button>
                            )
                        })}
                    </div>
                </div>
            </CardContent>

            {/* Main CTA Footer */}
            <CardFooter className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
                    onClick={() => handleBuyClick(gift.where_to_buy[0])}
                >
                    <ShoppingCart className="w-4 h-4" />
                    Buy Now on {gift.where_to_buy[0]}
                </Button>
            </CardFooter>
        </Card>
    )
}
