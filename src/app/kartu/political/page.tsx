"use client"

import { useState, useEffect } from "react"
import { getTemplates } from "@/lib/templates" // Ensure this is client-safe or wrapped
import { AssetGrid } from "@/components/political/AssetGrid"
import { ImageUploader } from "@/components/ui/ImageUploader"
import { PaywallModal } from "@/components/paywall/PaywallModal"
import { TemplateCollection } from "@/types/templates"
import { Loader2, UploadCloud, ChevronRight, Wand2 } from "lucide-react"

export default function PoliticalBuilderPage() {
    // Data State
    const [templates, setTemplates] = useState<TemplateCollection | null>(null)
    const [loading, setLoading] = useState(true)
    const [isPro, setIsPro] = useState(false) // TODO: Check actual entitlement

    // Wizard State
    const [step, setStep] = useState<1 | 2 | 3 | 4>(1) // 1: Upload, 2: Party, 3: Costume, 4: Result

    // Selection State
    const [imageUrl, setImageUrl] = useState("")
    const [detectedGender, setDetectedGender] = useState<'male' | 'female' | 'unknown'>('unknown')
    const [genderLoading, setGenderLoading] = useState(false)
    const [selectedPartyId, setSelectedPartyId] = useState("")
    const [selectedCostumeId, setSelectedCostumeId] = useState("")

    // UI State
    const [showPaywall, setShowPaywall] = useState(false)
    const [generating, setGenerating] = useState(false)
    const [resultImage, setResultImage] = useState("")

    // Load Data
    useEffect(() => {
        // Mock Entitlement Check (Replace with real logic)
        // For now, assuming Free user
        getTemplates().then(data => {
            setTemplates(data)
            setLoading(false)
        })
    }, [])

    // Handler: Gender Detection
    const handleUploadComplete = async (url: string) => {
        setImageUrl(url)
        if (!url) return // Clear state if image removed

        setGenderLoading(true)
        try {
            const res = await fetch('/api/ai/detect-gender', {
                method: 'POST',
                body: JSON.stringify({ imageUrl: url })
            })
            const data = await res.json()
            if (data.gender) {
                setDetectedGender(data.gender)
                console.log("Detected Gender:", data.gender)
            }
        } catch (e) {
            console.error("Gender detection failed", e)
        } finally {
            setGenderLoading(false)
        }
    }

    // Handler: Selection Logic with Gating
    const handleAssetSelect = (id: string, isPremium: boolean, type: 'party' | 'costume') => {
        if (isPremium && !isPro) {
            setShowPaywall(true)
            return
        }

        if (type === 'party') setSelectedPartyId(id)
        if (type === 'costume') setSelectedCostumeId(id)
    }

    // Handler: Generate
    const handleGenerate = async () => {
        if (!imageUrl || !selectedPartyId || !selectedCostumeId) return

        setGenerating(true)
        try {
            const party = templates?.parties.find(p => p.id === selectedPartyId)
            const costume = templates?.costumes.find(c => c.id === selectedCostumeId)
            const attributes = templates?.attributes.slice(0, 1) || [] // Default first attribute for MVP

            const res = await fetch('/api/ai/generate-political', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    image_url: imageUrl,
                    party,
                    costume,
                    attributes,
                    user_gender: detectedGender === 'female' ? 'female' : 'male', // Default to male if unknown
                    user_name: 'Calon Pemimpin'
                })
            })

            const data = await res.json()
            if (data.data?.imageUrl) {
                setResultImage(data.data.imageUrl)
                setStep(4)
            } else {
                alert("Generation failed: " + (data.error || "Unknown error"))
            }
        } catch (e) {
            console.error(e)
            alert("Error generating card")
        } finally {
            setGenerating(false)
        }
    }

    // Helper: Filter Costumes
    const filteredCostumes = templates?.costumes.filter(c => {
        if (detectedGender === 'unknown') return true
        if (c.gender === 'unisex') return true
        return c.gender === detectedGender
    }) || []

    if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
            {/* Sidebar / Progress (Mobile Top, Desktop Left) */}
            <div className="w-full md:w-80 bg-white border-b md:border-r p-6 flex flex-col gap-8 md:h-screen sticky top-0 z-10">
                <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Political Card AI
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Design your official campaign poster.</p>
                </div>

                {/* Steps */}
                <div className="space-y-4">
                    {[
                        { num: 1, label: "Upload Photo", done: !!imageUrl },
                        { num: 2, label: "Select Party", done: !!selectedPartyId },
                        { num: 3, label: "Select Attire", done: !!selectedCostumeId },
                        { num: 4, label: "Result", done: !!resultImage },
                    ].map((s) => (
                        <div key={s.num} className={cn("flex items-center gap-3", step === s.num ? "text-indigo-600" : "text-gray-400")}>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2",
                                step === s.num ? "border-indigo-600 bg-indigo-50" :
                                    s.done ? "border-green-500 bg-green-50 text-green-600" : "border-gray-200"
                            )}>
                                {s.done ? "✓" : s.num}
                            </div>
                            <span className={cn("font-medium", step === s.num && "font-bold")}>{s.label}</span>
                        </div>
                    ))}
                </div>

                {/* Desktop Nav Actions */}
                <div className="mt-auto hidden md:flex flex-col gap-3">
                    {step > 1 && step < 4 && (
                        <button
                            onClick={() => setStep(step - 1 as any)}
                            className="w-full py-2 border border-gray-300 rounded-xl font-medium text-gray-600 hover:bg-gray-50"
                        >
                            Back
                        </button>
                    )}

                    {step === 3 && (
                        <button
                            onClick={handleGenerate}
                            disabled={generating || !selectedCostumeId}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {generating ? <Loader2 className="animate-spin" /> : <Wand2 className="w-4 h-4" />}
                            {generating ? "Transforming..." : "Generate Magic"}
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 p-6 md:p-10 max-w-5xl mx-auto w-full">

                {/* Step 1: Upload */}
                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold">First, upload your best photo</h2>
                            <p className="text-gray-500">Make sure your face is clearly visible for the best AI results.</p>
                        </div>

                        <ImageUploader
                            onUploadComplete={handleUploadComplete}
                            currentImageUrl={imageUrl}
                        />

                        {/* Status & Next Action */}
                        <div className="min-h-[80px] flex flex-col items-center justify-center">
                            {genderLoading ? (
                                <div className="flex flex-col items-center gap-2 text-indigo-600 bg-indigo-50 px-6 py-4 rounded-xl animate-pulse w-full">
                                    <div className="flex items-center gap-2">
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        <span className="font-semibold">AI is analyzing your photo...</span>
                                    </div>
                                    <p className="text-xs opacity-80">Detecting features for best costume match</p>
                                </div>
                            ) : imageUrl ? (
                                <div className="w-full text-center space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                                        <p className="text-sm text-gray-600">
                                            AI Detection Result: <span className="font-bold text-indigo-600 text-lg capitalize mx-1">{detectedGender}</span>
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            We've filtered the costumes for you. You can adjust this manually in the next steps.
                                        </p>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setStep(2)}
                                            className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-900 hover:scale-[1.02] transition-all shadow-lg flex items-center gap-2"
                                        >
                                            Continue to Party Selection <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                )}

                {/* Step 2: Party Selection */}
                {step === 2 && templates && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Choose your Organization</h2>
                        </div>

                        <AssetGrid
                            items={templates.parties.map(p => ({
                                id: p.id,
                                name: p.name,
                                image_url: p.logo_url,
                                is_premium: p.is_premium,
                                primary_color: p.primary_color
                            }))}
                            selectedId={selectedPartyId}
                            onSelect={(id, isPrem) => handleAssetSelect(id, isPrem, 'party')}
                            isPro={isPro}
                        />

                        <div className="flex justify-between items-center fixed bottom-6 left-6 right-6 md:static">
                            <button onClick={() => setStep(1)} className="md:hidden px-4 py-2 border rounded-lg bg-white shadow">
                                Back
                            </button>
                            {selectedPartyId && (
                                <button onClick={() => setStep(3)} className="bg-black text-white px-8 py-3 rounded-full shadow-xl font-medium flex items-center gap-2 z-50 ml-auto">
                                    Next: Choose Attire <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Step 3: Costume Selection */}
                {step === 3 && templates && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold">Select your Official Attire</h2>

                            {/* Manual Gender Toggle */}
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                {(['male', 'female', 'unknown'] as const).map(g => (
                                    <button
                                        key={g}
                                        onClick={() => setDetectedGender(g)}
                                        className={cn(
                                            "px-3 py-1 rounded-md text-sm font-medium transition-all capitalize",
                                            detectedGender === g ? "bg-white shadow text-indigo-600" : "text-gray-500 hover:text-gray-700"
                                        )}
                                    >
                                        {g === 'unknown' ? 'All' : g}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <AssetGrid
                            items={filteredCostumes.map(c => ({
                                id: c.id,
                                name: c.name,
                                image_url: c.base_image_url,
                                is_premium: c.is_premium
                            }))}
                            selectedId={selectedCostumeId}
                            onSelect={(id, isPrem) => handleAssetSelect(id, isPrem, 'costume')}
                            isPro={isPro}
                        />

                        {filteredCostumes.length === 0 && (
                            <div className="text-center py-10 text-gray-500">
                                No costumes found for {detectedGender}. Try different gender or upload a new photo.
                            </div>
                        )}

                        {/* Mobile Nav */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t md:hidden flex gap-3">
                            <button onClick={() => setStep(2)} className="px-4 py-2 border rounded-lg bg-white">
                                Back
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={generating || !selectedCostumeId}
                                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {generating ? <Loader2 className="animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                {generating ? "Generating..." : "Generate Poster"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Result */}
                {step === 4 && resultImage && (
                    <div className="flex flex-col items-center animate-in zoom-in-90 duration-300 mb-20">
                        <h2 className="text-3xl font-bold mb-6">Your Campaign Poster is Ready!</h2>
                        <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white max-w-md w-full">
                            <img src={resultImage} alt="Political Card" className="w-full h-auto" />
                        </div>
                        <div className="mt-8 flex gap-4">
                            <button onClick={() => window.open(resultImage, '_blank')} className="px-6 py-2 bg-gray-900 text-white rounded-lg">
                                Download HD
                            </button>
                            <button onClick={() => { setStep(2); setResultImage(""); }} className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                Create Another
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Paywall Modal */}
            <PaywallModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                reason="Unlock Official Premium Assets"
            />
        </div>
    )
}

// Helper to keep styling clean
import { cn } from "@/lib/utils"
