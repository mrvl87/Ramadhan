"use client"

import { useEffect, useState } from "react"
import { getTemplates } from "@/lib/templates"
import { AssetSelector } from "@/components/cards/AssetSelector"
import { TemplateCollection } from "@/types/templates"

export default function TemplateTestPage() {
    const [data, setData] = useState<TemplateCollection | null>(null)
    const [loading, setLoading] = useState(true)

    // Generation State
    const [testImageUrl, setTestImageUrl] = useState("https://storage.googleapis.com/falserverless/example_inputs/nano-banana-edit-input.png")
    const [generating, setGenerating] = useState(false)
    const [genResult, setGenResult] = useState<any>(null)

    const handleGenerate = async () => {
        if (!selectedParty || !selectedCostume || !testImageUrl) {
            alert("Please select Party, Costume, and ensure Image URL is present")
            return
        }

        setGenerating(true)
        setGenResult(null)

        try {
            const partyObj = data?.parties.find(p => p.id === selectedParty)
            const costumeObj = data?.costumes.find(c => c.id === selectedCostume)
            const attributesObj = data?.attributes.slice(0, 1) // Pick first attribute for test

            const currentAttributes = attributesObj || []

            const payload = {
                image_url: testImageUrl,
                party: partyObj,
                costume: costumeObj,
                attributes: currentAttributes,
                user_gender: 'male', // Force male for test
                user_name: 'Test Candidate'
            }

            console.log("Sending Payload:", payload)

            const res = await fetch('/api/ai/generate-political', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            const result = await res.json()
            console.log("Generation Result:", result)
            setGenResult(result)

            if (!res.ok) alert("Error: " + result.error)

        } catch (e: any) {
            console.error(e)
            alert("Exception: " + e.message)
        } finally {
            setGenerating(false)
        }
    }

    if (loading) return <div className="p-10 flex justify-center">Loading Templates...</div>
    if (!data) return <div className="p-10 text-red-500">Failed to load data</div>

    return (
        <div className="container mx-auto max-w-4xl p-8 space-y-8">
            <h1 className="text-3xl font-bold">Template Asset Verification</h1>
            <p className="text-muted-foreground">This page verifies that we can fetch Parties, Costumes, and Attributes from Supabase.</p>

            {/* Test Generation Section */}
            <div className="p-6 border-2 border-indigo-500 rounded-xl bg-indigo-50/50 space-y-4">
                <h2 className="text-xl font-bold text-indigo-900">⚡ Test Nano Banana Pro (Generation)</h2>

                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium mb-1">Source Image URL</label>
                        <input
                            type="text"
                            value={testImageUrl}
                            onChange={(e) => setTestImageUrl(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="https://..."
                        />
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={generating}
                    className="bg-indigo-600 text-white px-6 py-2 rounded font-bold hover:bg-indigo-700 disabled:opacity-50"
                >
                    {generating ? "Generating with Nano Banana..." : "Generate Test Card"}
                </button>

                {genResult && (
                    <div className="mt-4 p-4 bg-white rounded border">
                        <pre className="text-xs overflow-auto max-h-40 mb-2">{JSON.stringify(genResult, null, 2)}</pre>
                        {genResult.data?.imageUrl && (
                            <div>
                                <p className="font-bold mb-2">Result:</p>
                                <img src={genResult.data.imageUrl} alt="Generated" className="w-64 h-64 object-cover rounded shadow" />
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="p-6 border rounded-xl bg-gray-50 space-y-8">
                {/* Parties */}
                <AssetSelector
                    title="1. Select Party"
                    assets={data.parties.map(p => ({
                        id: p.id,
                        name: p.name,
                        is_premium: p.is_premium,
                        primary_color: p.primary_color,
                        image_url: p.logo_url
                    }))}
                    selectedId={selectedParty}
                    onSelect={setSelectedParty}
                    isPro={false} // Simulate Free User
                />

                {/* Costumes */}
                <AssetSelector
                    title="2. Select Costume"
                    assets={data.costumes.map(c => ({
                        id: c.id,
                        name: c.name,
                        is_premium: c.is_premium,
                        image_url: c.base_image_url
                    }))}
                    selectedId={selectedCostume}
                    onSelect={setSelectedCostume}
                    isPro={true} // Simulate Pro User to see unlocked state
                />

                {/* Attributes */}
                <AssetSelector
                    title="3. Select Attributes"
                    assets={data.attributes.map(a => ({
                        id: a.id,
                        name: a.name,
                        is_premium: a.is_premium,
                        image_url: a.overlay_image_url
                    }))}
                    onSelect={(id) => alert(`Selected Attribute: ${id}`)}
                    isPro={false}
                />
            </div>

            <div className="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-auto max-h-96">
                <h3 className="font-bold mb-2">Raw Data Output:</h3>
                <pre className="text-xs">
                    {JSON.stringify(data, null, 2)}
                </pre>
            </div>
        </div>
    )
}
