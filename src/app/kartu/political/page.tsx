"use client"

import { useState, useEffect } from "react"
import { getTemplates } from "@/lib/templates" // Ensure this is client-safe or wrapped
import { AssetGrid } from "@/components/political/AssetGrid"
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
                    user_gender: 'male', // TODO: Add Gender Selector
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

                {/* Action Button (Desktop Specific) */}
                <div className="mt-auto hidden md:block">
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
                        <h2 className="text-2xl font-bold">First, upload your best photo</h2>
                        <div className="border-4 border-dashed border-gray-200 rounded-3xl h-64 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer relative overflow-hidden group">
                            <input
                                type="text"
                                placeholder="Paste Image URL for MVP (e.g. https://...)"
                                className="z-20 w-3/4 p-2 border rounded"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                            <p className="mt-2 text-gray-400 text-sm">(For MVP, paste a URL directly)</p>
                        </div>
                        {imageUrl && (
                            <div className="flex justify-end">
                                <button onClick={() => setStep(2)} className="bg-black text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2">
                                    Next Step <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
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

                        {selectedPartyId && (
                            <div className="flex justify-end fixed bottom-6 right-6 md:static">
                                <button onClick={() => setStep(3)} className="bg-black text-white px-8 py-3 rounded-full shadow-xl font-medium flex items-center gap-2 z-50">
                                    Next: Choose Attire <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Costume Selection */}
                {step === 3 && templates && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <h2 className="text-2xl font-bold">Select your Official Attire</h2>

                        <AssetGrid
                            items={templates.costumes.map(c => ({
                                id: c.id,
                                name: c.name,
                                image_url: c.base_image_url,
                                is_premium: c.is_premium
                            }))}
                            selectedId={selectedCostumeId}
                            onSelect={(id, isPrem) => handleAssetSelect(id, isPrem, 'costume')}
                            isPro={isPro}
                        />

                        {/* Mobile Generate Button */}
                        <div className="md:hidden mt-8">
                            <button
                                onClick={handleGenerate}
                                disabled={generating || !selectedCostumeId}
                                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {generating ? <Loader2 className="animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                {generating ? "Generating..." : "Generate Poster"}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Result */}
                {step === 4 && resultImage && (
                    <div className="flex flex-col items-center animate-in zoom-in-90 duration-300">
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
