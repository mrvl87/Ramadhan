'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { generateMenuAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ChefHat, DollarSign, Heart, Crown, Sparkles, Utensils } from 'lucide-react';
import { toast } from 'sonner';
import { MenuResult } from './components/MenuResult';
import { CreditExhaustedModal } from './components/CreditExhaustedModal';
import { motion, AnimatePresence } from 'framer-motion';

export default function RamadanMenuPage() {
    const router = useRouter();
    const [days, setDays] = useState(7);
    const [people, setPeople] = useState(4);
    const [dietary, setDietary] = useState('');
    const [theme, setTheme] = useState<'budget' | 'healthy' | 'luxury'>('budget');
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultData, setResultData] = useState<any>(null);
    const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setResultData(null); // Clear previous
        try {
            const res = await generateMenuAction({ days, people, dietary, theme });

            if (res.success && res.data) {
                setResultData(res.data);
                toast.success("Menu generated successfully!");
            } else {
                // Handle credit exhaustion
                if (res.error?.toLowerCase().includes('insufficient credits')) {
                    setIsCreditModalOpen(true);
                    return;
                }
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
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-200 dark:border-emerald-900/50">
                        <Sparkles className="w-3 h-3" /> AI-Powered Planner
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                        Ramadhan <span className="text-emerald-700 dark:text-emerald-500">Meal Planner</span>
                    </h1>
                    <p className="max-w-2xl mx-auto text-slate-600 dark:text-gray-400">
                        Hadirkan keberkahan di setiap hidangan. Biarkan AI merancang rencana menu sahur dan buka puasa yang sehat, lezat, dan seimbang untuk keluarga Anda.
                    </p>
                </header>

                <div className="grid lg:grid-cols-12 gap-10">
                    {/* Left Column: Form */}
                    <aside className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 space-y-8 sticky top-24">
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-3">
                                        <Label htmlFor="days" className="text-sm font-bold text-slate-700 dark:text-slate-300">Durasi (Hari)</Label>
                                        <Input
                                            id="days"
                                            type="number"
                                            value={days}
                                            onChange={(e) => setDays(Number(e.target.value))}
                                            min={1}
                                            max={30}
                                            className="rounded-xl border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label htmlFor="people" className="text-sm font-bold text-slate-700 dark:text-slate-300">Porsi (Orang)</Label>
                                        <Input
                                            id="people"
                                            type="number"
                                            value={people}
                                            onChange={(e) => setPeople(Number(e.target.value))}
                                            min={1}
                                            className="rounded-xl border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tema Hidangan</Label>
                                    <div className="grid grid-cols-1 gap-3">
                                        {[
                                            { value: 'budget', label: 'Ekonomis', icon: DollarSign, desc: 'Hemat & bergizi', color: 'amber' },
                                            { value: 'healthy', label: 'Sehat & Fit', icon: Heart, desc: 'Rendah gula & lemak', color: 'emerald' },
                                            { value: 'luxury', label: 'Istimewa', icon: Crown, desc: 'Menu variatif & premium', color: 'teal' },
                                        ].map((t) => (
                                            <button
                                                key={t.value}
                                                onClick={() => setTheme(t.value as any)}
                                                className={`group p-4 rounded-2xl border-2 text-left flex items-center gap-4 transition-all duration-300 ${theme === t.value
                                                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
                                                    : 'border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900 shadow-sm'
                                                    }`}
                                            >
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${theme === t.value ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900 group-hover:text-emerald-600'
                                                    }`}>
                                                    <t.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className={`font-bold text-sm ${theme === t.value ? 'text-emerald-900 dark:text-emerald-100' : 'text-slate-900 dark:text-slate-100'}`}>{t.label}</div>
                                                    <div className="text-xs text-slate-500 dark:text-slate-400">{t.desc}</div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="dietary" className="text-sm font-bold text-slate-700 dark:text-slate-300">Catatan Khusus</Label>
                                    <Textarea
                                        id="dietary"
                                        value={dietary}
                                        onChange={(e) => setDietary(e.target.value)}
                                        placeholder="Contoh: Tanpa pedas, alergi seafood, atau perbanyak sayur..."
                                        rows={4}
                                        className="rounded-2xl border-slate-200 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none px-4 py-3"
                                    />
                                </div>
                            </div>

                            <Button
                                size="xl"
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-7 text-lg font-bold shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                        Meracik Menu...
                                    </>
                                ) : (
                                    <>
                                        <ChefHat className="mr-2 h-6 w-6" />
                                        Buat Rencana Menu
                                    </>
                                )}
                            </Button>
                        </div>
                    </aside>

                    {/* Right Column: Result Dashboard */}
                    <main className="lg:col-span-8">
                        <AnimatePresence mode="wait">
                            {isGenerating ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="h-[600px] flex flex-col items-center justify-center text-center space-y-6"
                                >
                                    <div className="relative">
                                        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                                            <ChefHat className="w-12 h-12 text-emerald-600 animate-bounce" />
                                        </div>
                                        <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-amber-500 animate-pulse" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Sedang Menyiapkan Dapur AI...</h3>
                                        <p className="text-slate-500 max-w-sm mx-auto">
                                            Kami sedang memilih resep terbaik yang sehat dan lezat khusus untuk keluarga Anda.
                                        </p>
                                    </div>
                                </motion.div>
                            ) : resultData ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm p-8"
                                >
                                    <MenuResult data={resultData} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    className="h-[600px] flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]"
                                >
                                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
                                        <Utensils className="w-10 h-10 text-slate-400" />
                                    </div>
                                    <div className="space-y-2 px-6">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Rencana Menu Anda Belum Siap</h3>
                                        <p className="text-slate-500 max-w-xs mx-auto">
                                            Isi form di samping dan klik tombol generate untuk melihat keajaiban AI.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>
            </div>
            <CreditExhaustedModal
                isOpen={isCreditModalOpen}
                onClose={() => setIsCreditModalOpen(false)}
            />
        </div>
    );
}
