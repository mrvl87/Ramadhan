"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { PaywallModal } from "@/components/paywall/PaywallModal"
import { usePaywall } from "@/hooks/use-paywall"
import { Loader2 } from "lucide-react"

export default function CardGenerationPage() {
    const { isPaywallOpen, setPaywallOpen, paywallReason, interceptResponse } = usePaywall()
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<string | null>(null)

    const handleGenerate = async () => {
        setLoading(true)
        setResult(null)

        try {
            // Call the Test Gate API (which enforces credits)
            const res = await fetch("/api/ai/test-gate")

            // 1. Intercept Paywall
            const isBlocked = await interceptResponse(res)
            if (isBlocked) {
                setLoading(false)
                return // STOP FLOW
            }

            // 2. Handle Success
            if (res.ok) {
                const data = await res.json()
                setResult(`Success! ${data.data.message} (Credits left: ${data.data.remaining_credits})`)
            } else {
                setResult("Error: Something else went wrong.")
            }

        } catch (error) {
            console.error(error)
            setResult("Network Error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-950 p-4 gap-8">
            <h1 className="text-3xl font-bold">AI Card Generator (Mock)</h1>

            <div className="p-8 border rounded-xl bg-white dark:bg-neutral-900 shadow-sm text-center max-w-lg">
                <p className="mb-6 text-muted-foreground">
                    Click below to generate a beautiful Ramadan Card.
                    This will consume 1 Credit.
                </p>

                {result && (
                    <div className={`mb-6 p-4 rounded-lg ${result.includes("Success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {result}
                    </div>
                )}

                <Button size="lg" onClick={handleGenerate} disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Generate Card (1 Credit)
                </Button>
            </div>

            {/* PAYWALL INTEGRATION */}
            <PaywallModal
                isOpen={isPaywallOpen}
                onClose={() => setPaywallOpen(false)}
                reason={paywallReason}
            />
        </div>
    )
}
