'use client';

import { useState, useEffect } from 'react';
import { ImageUploader } from '@/components/ui/ImageUploader';
import { generateFamilyPhotoAction, getUserStats, generateGreetingAction } from './actions';
import { Button } from '@/components/ui/button';
import { Loader2, Wand2, Download, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { GenerationOverlay } from '@/components/family-photo/GenerationOverlay';

const STYLES = [
    { id: 'anime', name: 'Ghibli Anime', image: '/assets/styles/anime.jpg' }, // Placeholders
    { id: 'realistic', name: 'Hyper Realistic', image: '/assets/styles/real.jpg' },
    { id: 'oil-painting', name: 'Oil Painting', image: '/assets/styles/oil.jpg' },
    { id: '3d-cartoon', name: '3D Disney', image: '/assets/styles/3d.jpg' },
];

export default function FamilyPhotoPage() {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [selectedStyle, setSelectedStyle] = useState<string>('realistic');
    const [mode, setMode] = useState<'individual' | 'family'>('family');
    const [aspectRatio, setAspectRatio] = useState<'square' | 'portrait' | 'landscape'>('square');
    const [caption, setCaption] = useState<string>('');
    const [generatedGreeting, setGeneratedGreeting] = useState<string>('');
    const [isGeneratingGreeting, setIsGeneratingGreeting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultUrl, setResultUrl] = useState<string | null>(null);

    useEffect(() => {
        // Log user status on mount
        getUserStats().then(stats => console.log("Current User Stats:", stats));

        // Generate initial greeting
        refreshGreeting();
    }, []);

    const refreshGreeting = async () => {
        setIsGeneratingGreeting(true);
        const result = await generateGreetingAction();
        if (result.success && result.data) {
            setGeneratedGreeting(result.data);
        }
        setIsGeneratingGreeting(false);
    };

    const handleGenerate = async () => {
        if (!imageUrl) return;

        setIsGenerating(true);
        try {
            // Use user caption if provided, otherwise fallback to generated greeting
            const finalCaption = caption.trim() || generatedGreeting;

            const result = await generateFamilyPhotoAction({
                imageUrl,
                style: selectedStyle as any,
                mode: mode,
                aspectRatio: aspectRatio,
                caption: finalCaption,
                familyType: 'nuclear',
            });

            if (result.success && result.data) {
                setResultUrl(result.data);
                toast.success("Photo generated!");
            } else {
                toast.error("Generation failed: " + result.error);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
            <GenerationOverlay isVisible={isGenerating} />
            {/* Header ... */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                    AI Ramadan Family Photo
                </h1>
                <p className="text-gray-600">
                    Transform your selfie into a heartwarming family Eid celebration.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Input */}
                <div className="space-y-6">
                    {/* 1. Upload ... */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                            Upload Your Photo
                        </h3>
                        <ImageUploader
                            onUploadComplete={setImageUrl}
                            currentImageUrl={imageUrl}
                            folder="family-uploads"
                        />
                    </div>

                    {/* 2. Mode ... */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                            Choose Mode
                        </h3>
                        <div className="flex bg-gray-100 p-1 rounded-xl">
                            <button
                                onClick={() => setMode('individual')}
                                disabled={isGenerating}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'individual' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'} ${isGenerating ? 'opacity-50' : ''}`}
                            >
                                👤 Single / Solo
                            </button>
                            <button
                                onClick={() => setMode('family')}
                                disabled={isGenerating}
                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === 'family' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'} ${isGenerating ? 'opacity-50' : ''}`}
                            >
                                👨‍👩‍👧‍👦 Family / Group
                            </button>
                        </div>
                    </div>

                    {/* 3. Aspect Ratio ... */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                            Ukuran Foto (Aspect Ratio)
                        </h3>
                        <div className="grid grid-cols-3 gap-3">
                            <button onClick={() => setAspectRatio('square')} disabled={isGenerating} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${aspectRatio === 'square' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-emerald-300'} ${isGenerating ? 'opacity-50' : ''}`}>
                                <div className="w-8 h-8 border-2 border-current rounded-sm bg-gray-200/50"></div>
                                <div className="text-xs font-medium text-center">Square<br />(1:1)</div>
                            </button>
                            <button onClick={() => setAspectRatio('portrait')} disabled={isGenerating} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${aspectRatio === 'portrait' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-emerald-300'} ${isGenerating ? 'opacity-50' : ''}`}>
                                <div className="w-6 h-8 border-2 border-current rounded-sm bg-gray-200/50"></div>
                                <div className="text-xs font-medium text-center">Portrait<br />(3:4)</div>
                            </button>
                            <button onClick={() => setAspectRatio('landscape')} disabled={isGenerating} className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${aspectRatio === 'landscape' ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200' : 'border-gray-200 hover:border-emerald-300'} ${isGenerating ? 'opacity-50' : ''}`}>
                                <div className="w-8 h-5 border-2 border-current rounded-sm bg-gray-200/50"></div>
                                <div className="text-xs font-medium text-center">Landscape<br />(16:9)</div>
                            </button>
                        </div>
                    </div>

                    {/* 4. Caption (NEW) */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                                Caption / Ucapan
                            </h3>
                            <button
                                onClick={refreshGreeting}
                                disabled={isGeneratingGreeting}
                                className="text-xs flex items-center gap-1 text-emerald-600 hover:text-emerald-700"
                            >
                                <RefreshCw className={`w-3 h-3 ${isGeneratingGreeting ? 'animate-spin' : ''}`} />
                                Refresh Idea
                            </button>
                        </div>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder={isGeneratingGreeting ? "Generating nice words..." : (generatedGreeting || "Write your Eid greeting here...")}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all text-sm min-h-[80px]"
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Leave empty to use the suggested greeting.
                        </p>
                    </div>

                    {/* 5. Style ... */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-700 w-6 h-6 rounded-full flex items-center justify-center text-sm">5</span>
                            Choose Style
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {STYLES.map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style.id)}
                                    disabled={isGenerating}
                                    className={`p-3 rounded-xl border text-left transition-all ${selectedStyle === style.id
                                        ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-200'
                                        : 'border-gray-200 hover:border-emerald-300'
                                        } ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div className="font-medium text-gray-900">{style.name}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        size="lg"
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-200"
                        onClick={handleGenerate}
                        disabled={!imageUrl || isGenerating}
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Dreaming up your family...
                            </>
                        ) : (
                            <>
                                <Wand2 className="mr-2 h-5 w-5" />
                                Generate {mode === 'individual' ? 'Solo' : 'Family'} Portrait
                            </>
                        )}
                    </Button>
                </div>

                {/* Right Column: Result */}
                <div className="bg-gray-50 rounded-3xl border border-dashed border-gray-300 flex items-center justify-center min-h-[400px] relative overflow-hidden group">
                    {resultUrl ? (
                        <div className="relative w-full h-full min-h-[500px]">
                            <Image
                                src={resultUrl}
                                alt="Generated Family"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                <a
                                    href={resultUrl}
                                    download
                                    target="_blank"
                                    className="flex items-center justify-center gap-2 w-full bg-white text-gray-900 py-3 rounded-xl font-bold hover:bg-gray-100"
                                >
                                    <Download className="w-4 h-4" /> Download HD
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center text-gray-400 p-8">
                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse" />
                            <p>Your masterpiece will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
