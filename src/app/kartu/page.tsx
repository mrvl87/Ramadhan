"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Sparkles, Image as ImageIcon, CreditCard as CreditIcon } from "lucide-react"
import { usePaywall } from "@/hooks/use-paywall"
import { PaywallModal } from "@/components/paywall/PaywallModal"
import { ThemeSelector } from "@/components/cards/ThemeSelector"
import Image from "next/image"
import { createBrowserClient } from "@supabase/ssr"
import { CardType, ThemeKey } from "@/lib/prompt-engine"

export default function CardGeneratorPage() {
    // State
    const [loading, setLoading] = useState(false)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [credits, setCredits] = useState<number | null>(null)
    const [isPro, setIsPro] = useState(false)

    // Form State
    const [cardType, setCardType] = useState<CardType>("digital_calligraphy")
    const [theme, setTheme] = useState<ThemeKey>("luxury_gold")
    const [text, setText] = useState("Ramadhan Mubarak")

    const { isPaywallOpen, setPaywallOpen, paywallReason, interceptResponse } = usePaywall()

    // Fetch Credits on Mount
    useEffect(() => {
        const fetchEntitlement = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            )
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase.rpc('get_user_entitlement', { target_user_id: user.id })
            if (data) {
                setCredits(data.credits)
                setIsPro(data.is_pro)
            }
        }
        fetchEntitlement()
    }, [])

    const handleGenerate = async () => {
        setLoading(true)
        setImageUrl(null)

        try {
            const res = await fetch("/api/ai/generate-card", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: cardType, text, theme })
            })

            // Intercept Paywall
            if (await interceptResponse(res)) {
                setLoading(false)
                return
            }

            const data = await res.json()
            if (data.status === "SUCCESS") {
                setImageUrl(data.data.imageUrl)
                setCredits(data.data.remaining_credits) // Update local credits
            } else {
                alert(data.error || "Generation failed")
            }

        } catch (err: any) {
            console.error(err)
            alert("Network Error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header / Credit Bar */}
            <header className="sticky top-0 z-10 border-b border-border/50 bg-card/80 backdrop-blur-md px-4 py-3">
                <div className="container mx-auto max-w-4xl flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span className="text-gradient-gold">Kartu AI</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        {isPro ? (
                            <span className="text-primary bg-accent px-3 py-1 rounded-full font-semibold">PRO UNLOCKED</span>
                        ) : (
                            <span className="text-muted-foreground flex items-center gap-1">
                                <CreditIcon className="h-4 w-4" />
                                {credits !== null ? credits : "..."} Credits
                            </span>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-4xl p-4 space-y-8 mt-4">

                {/* 1. Card Type Selection */}
                <section className="space-y-3">
                    <Label className="text-lg font-semibold">1. Pilih Gaya Kartu (Card Type)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {/* Simple Toggle Buttons for now */}
                        {[
                            { id: 'digital_calligraphy', label: 'Tipografi 3D' },
                            { id: 'royal_family', label: 'Foto Keluarga Royal' },
                            { id: 'mini_me_cartoon', label: 'Kartun Disney' },
                            { id: 'pious_wish', label: 'Info & Doa' },
                        ].map((t) => (
                            <button
                                key={t.id}
                                onClick={() => setCardType(t.id as CardType)}
                                className={`p-3 text-sm rounded-lg border-2 transition-all shadow-warm-sm ${cardType === t.id ? 'border-primary bg-accent font-bold text-primary' : 'border-transparent bg-card hover:border-border hover:shadow-warm-md'}`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                </section>

                {/* 2. Theme Selection */}
                <section className="space-y-3">
                    <Label className="text-lg font-semibold">2. Pilih Nuansa (Theme)</Label>
                    <ThemeSelector selectedTheme={theme} onSelect={setTheme} />
                </section>

                {/* 3. Input Data */}
                <section className="space-y-3">
                    <Label className="text-lg font-semibold">3. Tulis Pesan / Nama</Label>
                    <Input
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={cardType === 'royal_family' ? "Deskripsi keluarga (Ayah, Ibu, 2 Anak...)" : "Ramadan Mubarak, Keluarga Santoso..."}
                        className="h-12 text-lg"
                    />
                    <p className="text-xs text-muted-foreground">
                        {cardType === 'royal_family' ? "Describe your family members for the AI." : "This text will appear in the design."}
                    </p>
                </section>

                {/* 4. Action */}
                <section className="pt-4 pb-20">
                    <Button
                        variant="gold"
                        size="xl"
                        onClick={handleGenerate}
                        disabled={loading || (credits === 0 && !isPro)}
                        className="w-full"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="animate-spin" /> Sedang Membuat...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Sparkles className="fill-white" /> Buat Kartu Sekarang
                            </span>
                        )}
                    </Button>
                    {!isPro && credits === 0 && (
                        <div className="text-center mt-3 space-y-2">
                            <p className="text-destructive text-sm font-medium">
                                Credits habis.
                            </p>
                            <Button variant="outline" onClick={() => setPaywallOpen(true)} className="w-full border-primary text-primary hover:bg-accent">
                                Upgrade to Pro to Continue
                            </Button>
                        </div>
                    )}
                </section>

                {/* Result */}
                {imageUrl && (
                    <section className="bg-card p-4 rounded-xl shadow-warm-lg border-0 animate-in fade-in slide-in-from-bottom-10 duration-500">
                        <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-muted mb-4">
                            <Image src={imageUrl} alt="Result" fill className="object-contain" unoptimized />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1" onClick={() => window.open(imageUrl, '_blank')}>
                                Download / Share
                            </Button>
                            {!isPro && (
                                <Button variant="gold" className="flex-1">
                                    Remove Watermark
                                </Button>
                            )}
                        </div>
                    </section>
                )}

            </main>

            <PaywallModal
                isOpen={isPaywallOpen}
                onClose={() => setPaywallOpen(false)}
                reason={paywallReason}
            />
        </div>
    )
}
