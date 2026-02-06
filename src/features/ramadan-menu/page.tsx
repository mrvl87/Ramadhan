'use client';

import { useState } from 'react';
import { generateMenuAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ChefHat, DollarSign, Heart, Crown, Sparkles, Utensils } from 'lucide-react';
import { toast } from 'sonner';
import { MenuResult } from './components/MenuResult';
import { motion, AnimatePresence } from 'framer-motion';

export default function RamadanMenuPage() {
    const [days, setDays] = useState(7);
    const [people, setPeople] = useState(4);
    const [dietary, setDietary] = useState('');
    const [theme, setTheme] = useState<'budget' | 'healthy' | 'luxury'>('budget');
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultData, setResultData] = useState<any>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setResultData(null); // Clear previous
        try {
            const res = await generateMenuAction({ days, people, dietary, theme });

            if (res.success && res.data) {
                setResultData(res.data);
                toast.success("Menu generated successfully!");
            } else {
                toast.error("Generation failed: " + res.error);
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFAF9] dark:bg-slate-950">
            <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">
                {/* Header */}
                <header className="text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 text-xs font-bold uppercase tracking-wider border border-orange-200 dark:border-orange-900/50">
                        <Sparkles className="w-3 h-3" /> AI-Powered Planner
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                        Ramadan <span className="text-orange-600">Meal Planner</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-600 dark:text-gray-400">
                        Stop stressing about Suhoor and Iftar. Let AI curate a balanced, healthy,
                        and delicious 7-day plan tailored to your family's needs.
                    </p>
                </header>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Left Column: Form */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 space-y-8">
                            <div className="flex items-center gap-3 pb-2 border-b">
                                <Utensils className="w-5 h-5 text-orange-600" />
                                <h2 className="font-bold text-lg">Preferences</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="days" className="text-xs font-bold uppercase text-slate-500">Duration (Days)</Label>
                                    <Input
                                        id="days"
                                        type="number"
                                        value={days}
                                        onChange={(e) => setDays(Number(e.target.value))}
                                        min={1}
                                        max={30}
                                        className="rounded-xl border-slate-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="people" className="text-xs font-bold uppercase text-slate-500">People</Label>
                                    <Input
                                        id="people"
                                        type="number"
                                        value={people}
                                        onChange={(e) => setPeople(Number(e.target.value))}
                                        min={1}
                                        className="rounded-xl border-slate-200"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase text-slate-500">Select Theme</Label>
                                <div className="grid grid-cols-1 gap-3">
                                    {[
                                        { value: 'budget', label: 'Ramadan Budget Friendly', desc: 'Cheap & local ingredients', icon: DollarSign },
                                        { value: 'healthy', label: 'Healthy & High Fiber', desc: 'Nutritious & low sugar', icon: Heart },
                                        { value: 'luxury', label: 'Premium & Festive', desc: 'Special restaurant quality', icon: Crown },
                                    ].map((t) => {
                                        const Icon = t.icon;
                                        return (
                                            <button
                                                key={t.value}
                                                onClick={() => setTheme(t.value as any)}
                                                className={`p-4 rounded-2xl border text-left flex items-start gap-4 transition-all ${theme === t.value
                                                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/30 ring-1 ring-orange-500'
                                                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/50 hover:border-slate-300 dark:hover:border-slate-700'
                                                    }`}
                                            >
                                                <div className={`p-2 rounded-xl ${theme === t.value ? 'bg-orange-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <span className="block font-bold text-sm text-slate-900 dark:text-white capitalize leading-tight">{t.label}</span>
                                                    <span className="block text-[10px] text-slate-500 mt-0.5">{t.desc}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="dietary" className="text-xs font-bold uppercase text-slate-500">Dietary Restrictions</Label>
                                <Textarea
                                    id="dietary"
                                    value={dietary}
                                    onChange={(e) => setDietary(e.target.value)}
                                    placeholder="e.g. Less spicy, Kids-friendly menu, No peanuts..."
                                    rows={3}
                                    className="rounded-2xl border-slate-200 resize-none"
                                />
                            </div>

                            <Button
                                size="xl"
                                className="w-full h-14 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white shadow-xl shadow-orange-500/20 font-bold text-lg"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Cooking Plan...
                                    </>
                                ) : (
                                    <>
                                        <ChefHat className="mr-2 h-6 w-6" /> Create My Plan
                                    </>
                                )}
                            </Button>
                        </div>
                    </aside>

                    {/* Right Column: Result */}
                    <main className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {resultData ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 min-h-[600px] p-8 md:p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none"
                                >
                                    <MenuResult data={resultData} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 h-full min-h-[600px] flex flex-col items-center justify-center p-12 text-center"
                                >
                                    {isGenerating ? (
                                        <div className="space-y-6 max-w-sm">
                                            <div className="relative">
                                                <div className="w-24 h-24 bg-orange-100 dark:bg-orange-950 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                                    <ChefHat className="w-12 h-12 text-orange-600" />
                                                </div>
                                                <div className="absolute top-0 right-0 animate-bounce">
                                                    <Sparkles className="w-6 h-6 text-orange-400" />
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI is composing your menu...</h3>
                                            <p className="text-slate-500 text-sm">
                                                Based on your preferences, we are calculating nutrition and pairing the best Halal dishes.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 max-w-sm">
                                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
                                                <Utensils className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Your Meal Plan Awaits</h3>
                                            <p className="text-slate-500 text-sm">
                                                Fill in your preferences on the left and click "Create My Plan" to see the magic happen.
                                            </p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
        </div>
    );
}
