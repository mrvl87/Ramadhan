"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { usePaywall } from "@/hooks/use-paywall"
import { PaywallModal } from "@/components/paywall/PaywallModal"
import Image from "next/image"

export default function TestFalPage() {
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [cardType, setCardType] = useState("digital_calligraphy")
    const [text, setText] = useState("Ramadan Mubarak")

    const { isPaywallOpen, setPaywallOpen, paywallReason, interceptResponse } = usePaywall()

    const handleGenerate = async () => {
        setLoading(true)
        setError(null)
        setImageUrl(null)

        try {
            const res = await fetch("/api/ai/generate-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    type: cardType,
                    text: text,
                    theme: "luxury gold"
                })
            })

            // Check Paywall
            if (await interceptResponse(res)) {
                setLoading(false)
                return
            }

            const contentType = res.headers.get("content-type")
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Received non-JSON response from server")
            }

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Generation failed")
            }

            if (data.status === "SUCCESS") {
                setImageUrl(data.data.imageUrl)
            }

        } catch (err: any) {
            console.error(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto p-8 max-w-2xl">
            <Card>
                <CardHeader>
                    <CardTitle>Test Fal.ai Generation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Card Type</Label>
                        <select
                            className="w-full p-2 border rounded-md bg-background"
                            value={cardType}
                            onChange={(e) => setCardType(e.target.value)}
                        >
                            <option value="digital_calligraphy">Digital Calligraphy</option>
                            <option value="royal_family">Royal Family</option>
                            <option value="mini_me_cartoon">Mini-Me Cartoon</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label>Text / Name</Label>
                        <Input value={text} onChange={(e) => setText(e.target.value)} />
                    </div>

                    <Button onClick={handleGenerate} disabled={loading} className="w-full">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate (Costs 1 Credit)
                    </Button>

                    {error && (
                        <div className="p-4 bg-red-100 text-red-700 rounded-md">
                            Error: {error}
                        </div>
                    )}

                    {imageUrl && (
                        <div className="space-y-2">
                            <h3 className="font-semibold">Result:</h3>
                            <div className="relative aspect-square w-full rounded-md overflow-hidden bg-gray-100 border">
                                <Image
                                    src={imageUrl}
                                    alt="Generated"
                                    fill
                                    className="object-contain"
                                    unoptimized
                                />
                            </div>
                            <p className="text-xs text-muted-foreground break-all">{imageUrl}</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <PaywallModal
                isOpen={isPaywallOpen}
                onClose={() => setPaywallOpen(false)}
                reason={paywallReason}
            />
        </div>
    )
}
