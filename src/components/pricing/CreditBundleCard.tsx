"use client"

import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreditBundleCardProps {
    bundle: "starter" | "popular" | "power"
    credits: number
    price: number
    originalPrice?: number
    perCredit: number
    savings?: number
    badge?: string
    highlighted?: boolean
    features: string[]
    onPurchase: (bundle: string) => void
    isLoading?: boolean
    disabled?: boolean
}

const TIER_COLORS = {
    starter: {
        bg: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
        border: "border-blue-200 dark:border-blue-800",
        hover: "hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-blue-100 dark:hover:shadow-blue-900/20",
        badge: "bg-blue-500 text-white",
        button: "bg-blue-600 hover:bg-blue-700 text-white",
        icon: "🌙"
    },
    popular: {
        bg: "from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30",
        border: "border-amber-300 dark:border-amber-700 ring-2 ring-amber-400/50 dark:ring-amber-600/50",
        hover: "hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-amber-200 dark:hover:shadow-amber-900/30",
        badge: "bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse",
        button: "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg",
        icon: "⭐"
    },
    power: {
        bg: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
        border: "border-purple-200 dark:border-purple-800",
        hover: "hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-purple-100 dark:hover:shadow-purple-900/20",
        badge: "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
        button: "bg-purple-600 hover:bg-purple-700 text-white",
        icon: "💎"
    }
}

export function CreditBundleCard({
    bundle,
    credits,
    price,
    originalPrice,
    perCredit,
    savings,
    badge,
    highlighted = false,
    features,
    onPurchase,
    isLoading = false,
    disabled = false
}: CreditBundleCardProps) {
    const colors = TIER_COLORS[bundle]

    return (
        <div
            className={cn(
                "relative rounded-2xl border-2 p-6 transition-all duration-300",
                "hover:scale-[1.02] hover:shadow-2xl",
                `bg-gradient-to-br ${colors.bg}`,
                colors.border,
                colors.hover,
                highlighted && "scale-105"
            )}
        >
            {/* Badge */}
            {badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className={cn(
                        "px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-md",
                        colors.badge
                    )}>
                        {badge}
                    </span>
                </div>
            )}

            {/* Icon & Title */}
            <div className="text-center mb-4">
                <div className="text-4xl mb-2">{colors.icon}</div>
                <h3 className="text-2xl font-bold capitalize text-slate-900 dark:text-white">
                    {bundle} Pack
                </h3>
            </div>

            {/* Credits */}
            <div className="text-center mb-6">
                <div className="text-5xl font-black tabular-nums text-slate-900 dark:text-white mb-2">
                    {credits}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                    AI Generations
                </div>
            </div>

            {/* Pricing */}
            <div className="text-center mb-6">
                {originalPrice && originalPrice > price && (
                    <div className="text-lg text-slate-500 dark:text-slate-400 line-through mb-1">
                        Rp {originalPrice.toLocaleString('id-ID')}
                    </div>
                )}
                <div className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
                    Rp {price.toLocaleString('id-ID')}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span>Rp {perCredit.toLocaleString('id-ID')}/credit</span>
                    {savings && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                            Save {savings}%
                        </span>
                    )}
                </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
                {features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                    </li>
                ))}
            </ul>

            {/* CTA Button */}
            <Button
                onClick={() => onPurchase(bundle)}
                disabled={disabled || isLoading}
                className={cn(
                    "w-full h-12 text-base font-bold rounded-xl transition-all",
                    colors.button,
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
            >
                {disabled ? "Current Plan" : isLoading ? "Processing..." : "Buy Now"}
            </Button>

            {/* Never Expire Badge */}
            <div className="mt-4 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    ⏳ Credits never expire
                </span>
            </div>
        </div>
    )
}
