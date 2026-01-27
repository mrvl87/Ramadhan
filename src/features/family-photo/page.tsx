'use client';

import { useState, useEffect } from 'react';
import { MultiImageUploader } from '@/components/ui/MultiImageUploader';
import { getUserStats } from './actions';
import { toast } from 'sonner';
import Image from 'next/image';
import { GenerationOverlay } from '@/components/family-photo/GenerationOverlay';
import { RamadhanPhotoWizard } from './components/wizard/RamadhanPhotoWizard';
import { Download, Sparkles } from 'lucide-react';
import { AIGenerationErrorBoundary, ImageUploadErrorBoundary } from '@/components/ui/error-boundary';
import { useGenerationProgress } from '@/hooks/useGenerationProgress';
import confetti from 'canvas-confetti';
import { PaywallModal } from '@/components/paywall/PaywallModal';

export default function FamilyPhotoPage() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    // Progress tracking for better UX
    const { progress, eta } = useGenerationProgress(isGenerating, 20);

    // Paywall modal state
    const [showPaywall, setShowPaywall] = useState(false);
    const [paywallReason, setPaywallReason] = useState<"NO_CREDITS" | "NOT_LOGGED_IN">("NO_CREDITS");

    useEffect(() => {
        // Log user status on mount
        getUserStats().then(stats => console.log("Current User Stats:", stats));
    }, []);

    const handleSuccess = (url: string) => {
        setResultUrl(url);

        // Celebrate with confetti! 🎉
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#10b981', '#34d399', '#fbbf24', '#f59e0b'], // emerald + gold theme
        });
    };

    // Handler for credit exhaustion
    const handleCreditError = () => {
        setPaywallReason("NO_CREDITS");
        setShowPaywall(true);
    };

    return (
        <AIGenerationErrorBoundary>
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                <GenerationOverlay isVisible={isGenerating} />

                {/* Header */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-bold tracking-wider uppercase">
                        <Sparkles className="w-3 h-3" />
                        New Wizard Mode
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                        AI Ramadan Family Studio
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
                        Transform self-portraits into heartwarming festive family memories using our new progressive AI wizard.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Wizard & Input (Span 7) */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Step 0: Upload */}
                        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-900 transition-all hover:shadow-md">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-emerald-950 dark:text-emerald-100">
                                <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-200 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                Upload Foto Utama & Close-up
                            </h3>
                            <MultiImageUploader
                                onImagesChange={setImageUrls}
                                currentImages={imageUrls}
                                folder="family-uploads"
                            />
                            {imageUrls.length === 0 && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 ml-10">
                                    Upload foto utama dan foto close-up wajah agar hasil lebih akurat.
                                </p>
                            )}
                        </div>

                        {/* Wizard (Visible only after upload) */}
                        {imageUrls.length > 0 ? (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <RamadhanPhotoWizard
                                    imageUrls={imageUrls}
                                    onSuccess={handleSuccess}
                                    isGenerating={isGenerating}
                                    setIsGenerating={setIsGenerating}
                                    onCreditError={handleCreditError}
                                />
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center text-slate-400 dark:text-slate-500 bg-slate-50/50 dark:bg-slate-800/50">
                                <p>Selesaikan upload foto di atas untuk membuka Wizard Kustomisasi.</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Result (Span 5) */}
                    <div className="lg:col-span-5 sticky top-8">
                        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden min-h-[300px] md:min-h-[500px] flex flex-col">
                            <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700 p-4 text-center">
                                <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Hasil Studio AI</span>
                            </div>

                            <div className="flex-1 relative bg-slate-100 dark:bg-slate-900 flex items-center justify-center group">
                                {resultUrl ? (
                                    <div className="relative w-full h-full min-h-[300px] md:min-h-[500px]">
                                        <Image
                                            src={resultUrl}
                                            alt="Generated Family"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                        {/* Download Overlay - Always visible on mobile, hover on desktop */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-black/40 md:opacity-0 md:group-hover:opacity-100 transition-all flex items-end justify-center p-4 md:p-6">
                                            <a
                                                href={resultUrl}
                                                download={`ramadhan-family-${Date.now()}.png`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label="Download generated family photo"
                                                className="flex items-center justify-center gap-2 w-full bg-white dark:bg-slate-800 text-emerald-900 dark:text-emerald-100 py-3 rounded-xl font-bold hover:bg-emerald-50 dark:hover:bg-emerald-900 shadow-lg transition-all"
                                            >
                                                <Download className="w-4 h-4" /> Download HD
                                            </a>
                                        </div>
                                    </div>
                                ) : isGenerating ? (
                                    <div className="w-full h-full min-h-[300px] md:min-h-[500px] relative overflow-hidden bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-900">
                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent animate-shimmer"></div>

                                        {/* Loading Content */}
                                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center space-y-6">
                                            <div className="w-24 h-24 bg-emerald-500/20 dark:bg-emerald-500/30 rounded-full flex items-center justify-center mb-2 animate-pulse">
                                                <Sparkles className="w-12 h-12 text-emerald-600 dark:text-emerald-400 animate-pulse-slow" />
                                            </div>

                                            <div className="w-full max-w-xs space-y-3">
                                                <h3 className="font-bold text-xl text-slate-700 dark:text-slate-200">
                                                    Generating Your Family Photo...
                                                </h3>

                                                {/* Progress Bar */}
                                                <div className="w-full bg-slate-300 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                                                    <div
                                                        className="bg-emerald-500 dark:bg-emerald-600 h-2 rounded-full transition-all duration-300 ease-out"
                                                        style={{ width: `${progress}%` }}
                                                    />
                                                </div>

                                                {/* ETA Display */}
                                                <div className="flex items-center justify-between text-xs">
                                                    <span className="text-slate-500 dark:text-slate-400">
                                                        {Math.round(progress)}% complete
                                                    </span>
                                                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                                        {eta > 0 ? `~${eta}s remaining` : 'Almost done...'}
                                                    </span>
                                                </div>

                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                                                    AI sedang bekerja untuk menciptakan foto keluarga yang sempurna.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-8 max-w-xs">
                                        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                                            <Sparkles className="w-10 h-10 text-emerald-400 dark:text-emerald-300" />
                                        </div>
                                        <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">Belum ada Foto</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">
                                            Ikuti langkah-langkah di Wizard sebelah kiri untuk menciptakan foto keluarga impianmu.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Paywall Modal */}
            <PaywallModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                reason={paywallReason}
            />
        </AIGenerationErrorBoundary>
    );
}
