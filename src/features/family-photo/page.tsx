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

export default function FamilyPhotoPage() {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    useEffect(() => {
        // Log user status on mount
        getUserStats().then(stats => console.log("Current User Stats:", stats));
    }, []);

    const handleSuccess = (url: string) => {
        setResultUrl(url);
    };

    return (
        <AIGenerationErrorBoundary>
            <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                <GenerationOverlay isVisible={isGenerating} />

                {/* Header */}
                <div className="text-center space-y-4">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase">
                        <Sparkles className="w-3 h-3" />
                        New Wizard Mode
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                        AI Ramadan Family Studio
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Transform self-portraits into heartwarming festive family memories using our new progressive AI wizard.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: Wizard & Input (Span 7) */}
                    <div className="lg:col-span-7 space-y-6">

                        {/* Step 0: Upload */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 transition-all hover:shadow-md">
                            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-emerald-950">
                                <span className="bg-emerald-100 text-emerald-700 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
                                Upload Foto Utama & Close-up
                            </h3>
                            <MultiImageUploader
                                onImagesChange={setImageUrls}
                                currentImages={imageUrls}
                                folder="family-uploads"
                            />
                            {imageUrls.length === 0 && (
                                <p className="text-sm text-slate-500 mt-2 ml-10">
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
                                />
                            </div>
                        ) : (
                            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400 bg-slate-50/50">
                                <p>Selesaikan upload foto di atas untuk membuka Wizard Kustomisasi.</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Result (Span 5) */}
                    <div className="lg:col-span-5 sticky top-8">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
                            <div className="bg-slate-50 border-b border-slate-100 p-4 text-center">
                                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Hasil Studio AI</span>
                            </div>

                            <div className="flex-1 relative bg-slate-100 flex items-center justify-center group">
                                {resultUrl ? (
                                    <div className="relative w-full h-full min-h-[500px]">
                                        <Image
                                            src={resultUrl}
                                            alt="Generated Family"
                                            fill
                                            className="object-cover"
                                            unoptimized
                                        />
                                        {/* Download Overlay */}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-end justify-center p-6">
                                            <a
                                                href={resultUrl}
                                                download={`ramadhan-family-${Date.now()}.png`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-center gap-2 w-full bg-white text-emerald-900 py-3 rounded-xl font-bold hover:bg-emerald-50 shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Download className="w-4 h-4" /> Download HD
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center p-8 max-w-xs">
                                        <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
                                            <Sparkles className="w-10 h-10 text-emerald-400" />
                                        </div>
                                        <h3 className="font-bold text-slate-700 mb-2">Belum ada Foto</h3>
                                        <p className="text-sm text-slate-500">
                                            Ikuti langkah-langkah di Wizard sebelah kiri untuk menciptakan foto keluarga impianmu.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AIGenerationErrorBoundary>
    );
}
