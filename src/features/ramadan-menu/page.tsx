'use client';

import { useState } from 'react';
import { generateMenuAction } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, ChefHat, Copy, DollarSign, Heart, Crown } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import { Tooltip } from '@/components/ui/tooltip';

export default function RamadanMenuPage() {
    const [days, setDays] = useState(7);
    const [people, setPeople] = useState(4);
    const [dietary, setDietary] = useState('');
    const [theme, setTheme] = useState<'budget' | 'healthy' | 'luxury'>('budget');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const res = await generateMenuAction({ days, people, dietary, theme });

            if (res.success && res.data) {
                setResult(res.data);
                toast.success("Menu generated!");
            } else {
                toast.error("Generation failed: " + res.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-amber-600">
                    AI Ramadan Meal Planner
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Plan your Iftar and Sahur with ease. Customized for your family.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-orange-100 dark:border-orange-900 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="days">Number of Days</Label>
                            <Input
                                id="days"
                                type="number"
                                value={days}
                                onChange={(e) => setDays(Number(e.target.value))}
                                min={1}
                                max={30}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="people">Number of People</Label>
                            <Input
                                id="people"
                                type="number"
                                value={people}
                                onChange={(e) => setPeople(Number(e.target.value))}
                                min={1}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Theme</Label>
                            <div className="grid grid-cols-1 gap-2">
                                {[
                                    { value: 'budget', label: 'Budget', icon: DollarSign },
                                    { value: 'healthy', label: 'Healthy', icon: Heart },
                                    { value: 'luxury', label: 'Luxury', icon: Crown },
                                ].map((t) => {
                                    const Icon = t.icon;
                                    return (
                                        <button
                                            key={t.value}
                                            onClick={() => setTheme(t.value as any)}
                                            className={`p-3 rounded-lg border text-left flex items-center gap-3 transition-colors ${theme === t.value
                                                ? 'border-orange-500 bg-orange-50 dark:bg-orange-950 text-orange-700 dark:text-orange-400'
                                                : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-orange-300 dark:hover:border-orange-800'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="capitalize font-medium">{t.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dietary">Dietary / Notes</Label>
                            <Textarea
                                id="dietary"
                                value={dietary}
                                onChange={(e) => setDietary(e.target.value)}
                                placeholder="e.g. No spicy food, kids friendly..."
                                rows={3}
                            />
                        </div>

                        <Button
                            size="lg"
                            className="w-full bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white shadow-lg"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <ChefHat className="mr-2 h-5 w-5" />
                            )}
                            Generate Menu
                        </Button>
                    </div>
                </div>

                {/* Right Column: Result */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-gray-800 min-h-[500px] p-8 shadow-sm relative">
                        {result ? (
                            <div className="prose prose-orange dark:prose-invert max-w-none">
                                <ReactMarkdown>{result}</ReactMarkdown>
                                <Tooltip content="Copy to clipboard">
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }}
                                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
                                    >
                                        <Copy className="w-5 h-5" />
                                    </button>
                                </Tooltip>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 space-y-4">
                                <div className="w-16 h-16 bg-orange-50 dark:bg-orange-950 rounded-full flex items-center justify-center">
                                    <ChefHat className="w-8 h-8 text-orange-300 dark:text-orange-600" />
                                </div>
                                <p>Your meal plan will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
