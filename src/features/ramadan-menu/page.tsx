'use client';

import { useState } from 'react';
import { generateMenuAction } from './actions';
import { Button } from '@/components/ui/button';
import { Loader2, ChefHat, Copy } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

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
                <p className="text-gray-600">
                    Plan your Iftar and Sahur with ease. Customized for your family.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Input */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Days</label>
                            <input
                                type="number"
                                value={days}
                                onChange={(e) => setDays(Number(e.target.value))}
                                className="w-full p-2 border rounded-lg"
                                min={1} max={30}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Number of People</label>
                            <input
                                type="number"
                                value={people}
                                onChange={(e) => setPeople(Number(e.target.value))}
                                className="w-full p-2 border rounded-lg"
                                min={1}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                            <div className="grid grid-cols-1 gap-2">
                                {['budget', 'healthy', 'luxury'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTheme(t as any)}
                                        className={`p-2 rounded-lg border text-left capitalize ${theme === t
                                                ? 'border-orange-500 bg-orange-50 text-orange-700'
                                                : 'border-gray-200 text-gray-600'
                                            }`}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Dietary / Notes</label>
                            <textarea
                                value={dietary}
                                onChange={(e) => setDietary(e.target.value)}
                                className="w-full p-2 border rounded-lg text-sm"
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
                    <div className="bg-white rounded-3xl border border-gray-200 min-h-[500px] p-8 shadow-sm relative">
                        {result ? (
                            <div className="prose prose-orange max-w-none">
                                <ReactMarkdown>{result}</ReactMarkdown>
                                <button
                                    onClick={() => { navigator.clipboard.writeText(result); toast.success("Copied!"); }}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-orange-600"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
                                    <ChefHat className="w-8 h-8 text-orange-300" />
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
