"use client"

import { useState } from "react"
import { CreditBundleCard } from "@/components/pricing/CreditBundleCard"
import { Sparkles, Zap, Shield, Clock } from "lucide-react"

const BUNDLES = {
    starter: {
        credits: 50,
        price: 49000,
        originalPrice: 49000,
        perCredit: 980,
        features: [
            "50 AI Generations",
            "HD Quality (1024x1024)",
            "No Watermark",
            "Commercial Use OK",
            "Priority Support"
        ]
    },
    popular: {
        credits: 150,
        price: 129000,
        originalPrice: 147000,
        perCredit: 860,
        savings: 12,
        badge: "🔥 MOST POPULAR",
        features: [
            "150 AI Generations",
            "HD Quality (1024x1024)",
            "No Watermark",
            "Commercial Use OK",
            "Priority Support",
            "Best Value - Save 12%!"
        ]
    },
    power: {
        credits: 500,
        price: 399000,
        originalPrice: 490000,
        perCredit: 798,
        savings: 19,
        badge: "💎 CREATOR TIER",
        features: [
            "500 AI Generations",
            "HD Quality (1024x1024)",
            "No Watermark",
            "Commercial Use OK",
            "Priority Support",
            "Maximum Savings - 19%!"
        ]
    }
}

export default function PricingPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null)

    const handlePurchase = async (bundle: string) => {
        setIsLoading(bundle)
        try {
            const res = await fetch("/api/payment/create-checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bundle })
            })

            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(errorText || "Payment initiation failed")
            }

            const data = await res.json()

            if (data.url) {
                // Redirect to Xendit payment page
                window.location.href = data.url
            } else {
                throw new Error(data.error || "No payment URL returned")
            }
        } catch (error: any) {
            console.error("Payment error:", error)
            alert(`Payment Error: ${error.message}`)
        } finally {
            setIsLoading(null)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-sm font-semibold mb-6">
                        <Sparkles className="w-4 h-4" />
                        Ramadan Special Pricing
                    </div>

                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">
                        Simple Pricing,
                        <br />
                        <span className="bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
                            No Surprises
                        </span>
                    </h1>

                    <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-4">
                        Pay once. Create anytime. Credits never expire.
                    </p>

                    <p className="text-sm text-slate-500 dark:text-slate-500">
                        🎁 New users get <span className="font-bold text-emerald-600 dark:text-emerald-400">5 free credits</span> to start!
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    <CreditBundleCard
                        bundle="starter"
                        credits={BUNDLES.starter.credits}
                        price={BUNDLES.starter.price}
                        originalPrice={BUNDLES.starter.originalPrice}
                        perCredit={BUNDLES.starter.perCredit}
                        features={BUNDLES.starter.features}
                        onPurchase={handlePurchase}
                        isLoading={isLoading === "starter"}
                    />

                    <CreditBundleCard
                        bundle="popular"
                        credits={BUNDLES.popular.credits}
                        price={BUNDLES.popular.price}
                        originalPrice={BUNDLES.popular.originalPrice}
                        perCredit={BUNDLES.popular.perCredit}
                        savings={BUNDLES.popular.savings}
                        badge={BUNDLES.popular.badge}
                        highlighted={true}
                        features={BUNDLES.popular.features}
                        onPurchase={handlePurchase}
                        isLoading={isLoading === "popular"}
                    />

                    <CreditBundleCard
                        bundle="power"
                        credits={BUNDLES.power.credits}
                        price={BUNDLES.power.price}
                        originalPrice={BUNDLES.power.originalPrice}
                        perCredit={BUNDLES.power.perCredit}
                        savings={BUNDLES.power.savings}
                        badge={BUNDLES.power.badge}
                        features={BUNDLES.power.features}
                        onPurchase={handlePurchase}
                        isLoading={isLoading === "power"}
                    />
                </div>

                {/* Value Props */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                    <div className="text-center p-6 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 mb-4">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">HD Quality</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            1024x1024 resolution for stunning results
                        </p>
                    </div>

                    <div className="text-center p-6 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 mb-4">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">No Watermark</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Clean downloads ready to share
                        </p>
                    </div>

                    <div className="text-center p-6 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 mb-4">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Never Expire</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Use credits anytime, even next Ramadan
                        </p>
                    </div>

                    <div className="text-center p-6 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400 mb-4">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white mb-2">Instant Activation</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                            Credits added immediately after payment
                        </p>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-8">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                                How does the credit system work?
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                1 credit = 1 AI generation. Each time you create a card, family photo, or any AI content,
                                it costs 1 credit. Credits stack when you purchase multiple bundles.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                                Do credits really never expire?
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Yes! Your credits will remain in your account forever. Use them this Ramadan,
                                next Ramadan, or anytime in between. Perfect for seasonal usage.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                                Which bundle is best for me?
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                <strong>Starter (50)</strong>: Perfect for personal use or trying it out.<br />
                                <strong>Popular (150)</strong>: Best value! Enough for daily posts during Ramadan.<br />
                                <strong>Power (500)</strong>: For creators, businesses, or heavy users who want maximum savings.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                                Can I use images for commercial purposes?
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                Yes! All generated images come with commercial use rights. Use them for your business,
                                sell prints, or use in client work without restrictions.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
                            <h3 className="font-bold text-slate-900 dark:text-white mb-2">
                                What payment methods do you accept?
                            </h3>
                            <p className="text-slate-600 dark:text-slate-400">
                                We use Xendit for secure payments. You can pay with bank transfer, e-wallet (OVO, GoPay, DANA),
                                credit/debit cards, and more. All payment methods available to Indonesian users.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Footer */}
                <div className="text-center mt-16 p-8 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-700 dark:to-cyan-700">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Ready to Create Amazing Content?
                    </h2>
                    <p className="text-emerald-50 mb-6 max-w-2xl mx-auto">
                        Join thousands of users creating stunning AI-generated cards and photos this Ramadan.
                        Start with 5 free credits, no credit card required!
                    </p>
                    <a
                        href="/kartu/family"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-colors shadow-lg"
                    >
                        <Sparkles className="w-5 h-5" />
                        Start Creating for Free
                    </a>
                </div>
            </div>
        </div>
    )
}
