'use client';

import { useState } from 'react';
import { generateGiftAction } from './actions';
import { Button } from '@/components/ui/button';
import { Loader2, Gift, Sparkles, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

export default function GiftRecommendationPage() {
    const [recipient, setRecipient] = useState('');
    const [age, setAge] = useState(25);
    const [budget, setBudget] = useState('');
    const [interests, setInterests] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!recipient || !interests) {
            toast.error("Please fill in who this gift is for and their interests.");
            return;
        }

        setIsGenerating(true);
        try {
            const res = await generateGiftAction({ recipient, age, budget, interests });

            if (res.success && res.data) {
                setResult(res.data);
                toast.success("Ideas generated!");
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
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                    Eid Gift Assistant
                </h1>
                <p className="text-gray-600">
                    Find the perfect present for your loved ones this Ramadan.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Left Column: Input */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                            <input
                                type="text"
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                placeholder="e.g. My Mother"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                            <input
                                type="number"
                                value={age}
                                onChange={(e) => setAge(Number(e.target.value))}
                                className="w-full p-2 border rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                            <input
                                type="text"
                                value={budget}
                                onChange={(e) => setBudget(e.target.value)}
                                className="w-full p-2 border rounded-lg"
                                placeholder="e.g. under 500k"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                            <textarea
                                value={interests}
                                onChange={(e) => setInterests(e.target.value)}
                                className="w-full p-2 border rounded-lg text-sm"
                                placeholder="e.g. loves cooking, gardening, cats..."
                                rows={3}
                            />
                        </div>

                        <Button
                            size="lg"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg"
                            onClick={handleGenerate}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            ) : (
                                <Sparkles className="mr-2 h-5 w-5" />
                            )}
                            Find Gifts
                        </Button>
                    </div>
                </div>

                {/* Right Column: Result */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-3xl border border-gray-200 min-h-[500px] p-8 shadow-sm relative">
                        {result ? (
                            <div className="prose prose-purple max-w-none">
                                <ReactMarkdown>{result}</ReactMarkdown>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center">
                                    <Gift className="w-8 h-8 text-purple-300" />
                                </div>
                                <p>Gift ideas will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
