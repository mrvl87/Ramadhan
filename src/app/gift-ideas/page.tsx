import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Gift, Sparkles, Heart, Zap, ArrowRight } from 'lucide-react'

export default function GiftIdeasPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 py-20 text-center">
                    {/* Decorative Elements */}
                    <div className="absolute top-20 left-10 text-6xl opacity-20 animate-float">🎁</div>
                    <div className="absolute top-40 right-20 text-5xl opacity-20 animate-float-delayed">🎉</div>
                    <div className="absolute bottom-20 left-1/4 text-4xl opacity-20 animate-float">✨</div>

                    {/* Main Content */}
                    <div className="relative z-10">
                        <div className="inline-block mb-4 px-4 py-2 bg-purple-100 dark:bg-purple-900 rounded-full">
                            <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                ✨ AI-Powered Recommendations
                            </span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-6">
                            Find the Perfect Gift
                            <br />
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
                                for Ramadan & Eid
                            </span>
                        </h1>

                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                            Get personalized gift recommendations powered by AI.
                            Thoughtful, culturally appropriate, and within your budget.
                        </p>

                        <Link href="/gift-ideas/create">
                            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white gap-2 px-8 py-6 text-lg">
                                <Sparkles className="w-5 h-5" />
                                Start Finding Gifts
                                <ArrowRight className="w-5 h-5" />
                            </Button>
                        </Link>

                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                            💎 Only 10 credits per generation • 5 personalized gift ideas
                        </p>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        Why use our Gift Finder?
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                                < Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <CardTitle className="text-purple-900 dark:text-purple-100">AI-Powered</CardTitle>
                            <CardDescription>
                                Advanced AI analyzes interests, budget, and relationships to suggest perfect gifts
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                            </div>
                            <CardTitle className="text-pink-900 dark:text-pink-100">Culturally Appropriate</CardTitle>
                            <CardDescription>
                                Suggestions tailored to Indonesian culture and Islamic values for Ramadan & Eid
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="border-2 hover:border-purple-300 dark:hover:border-purple-700 transition-all">
                        <CardHeader>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                                <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <CardTitle className="text-purple-900 dark:text-purple-100">Instant Results</CardTitle>
                            <CardDescription>
                                Get 5 personalized gift ideas in seconds, with shopping links included
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>
            </section>

            {/* How It Works */}
            <section className="max-w-6xl mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                        How it works
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        4 simple steps to find the perfect gift
                    </p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {[
                        {
                            step: '1',
                            title: 'Choose Recipient',
                            description: 'Parent, spouse, friend, or colleague?'
                        },
                        {
                            step: '2',
                            title: 'Set Budget',
                            description: 'From Rp 50k to millions'
                        },
                        {
                            step: '3',
                            title: 'Add Interests',
                            description: 'Their hobbies and preferences'
                        },
                        {
                            step: '4',
                            title: 'Get Ideas',
                            description: '5 personalized gift recommendations'
                        }
                    ].map(({ step, title, description }) => (
                        <div key={step} className="text-center">
                            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-white">{step}</span>
                            </div>
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="p-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-white">
                    <h2 className="text-4xl font-bold mb-4">
                        Ready to find the perfect gift?
                    </h2>
                    <p className="text-xl mb-8 text-purple-100">
                        Let AI help you impress your loved ones this Ramadan
                    </p>
                    <Link href="/gift-ideas/create">
                        <Button size="lg" variant="secondary" className="gap-2 px-8">
                            <Gift className="w-5 h-5" />
                            Start Now - 10 Credits
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}

// Animation keyframes (add to globals.css)
/*
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 7s ease-in-out infinite;
}
*/
