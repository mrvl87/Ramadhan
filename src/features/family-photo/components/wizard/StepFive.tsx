import { WizardState } from "../../types";
import { RefreshCw, Instagram, LayoutTemplate, Smartphone, RectangleHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateGreetingAction } from "../../actions";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

interface StepFiveProps {
    config: WizardState['config'];
    updateConfig: (updates: Partial<WizardState['config']>) => void;
    onGenerate: () => void;
    isGenerating: boolean;
}

export function StepFive({ config, updateConfig, onGenerate, isGenerating }: StepFiveProps) {
    const [isGreetingLoading, startGreetingTransition] = useTransition();

    const handleRefreshGreeting = () => {
        startGreetingTransition(async () => {
            const res = await generateGreetingAction();
            if (res.success && res.data) {
                updateConfig({
                    greeting: {
                        ...config.greeting,
                        message: res.data,
                        generated: true
                    }
                });
            }
        });
    };

    const ratios = [
        { id: '1:1', label: 'Square', icon: Instagram, desc: 'Feed IG' },
        { id: '9:16', label: 'Story', icon: Smartphone, desc: 'Status/Reels' },
        { id: '4:5', label: 'Portrait', icon: LayoutTemplate, desc: 'Portrait Feed' },
        { id: '16:9', label: 'Landscape', icon: RectangleHorizontal, desc: 'PC/Youtube' },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">

            {/* Aspect Ratio */}
            <div className="space-y-3">
                <label className="text-sm font-bold text-foreground block">Rasio Foto</label>
                <div className="grid grid-cols-4 gap-2">
                    {ratios.map((r) => (
                        <button
                            key={r.id}
                            onClick={() => updateConfig({ aspectRatio: r.id as any })}
                            className={cn(
                                "flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all",
                                config.aspectRatio === r.id
                                    ? "border-primary bg-accent text-primary"
                                    : "border-border bg-card text-muted-foreground hover:border-primary/50"
                            )}
                        >
                            <r.icon className="w-5 h-5 mb-1" />
                            <span className="text-xs font-medium">{r.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Greeting Generator */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-bold text-foreground block">Ucapan & Teks (Opsional)</label>
                    <button
                        onClick={handleRefreshGreeting}
                        disabled={isGreetingLoading}
                        className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 disabled:opacity-50"
                    >
                        <RefreshCw className={cn("w-3 h-3", isGreetingLoading && "animate-spin")} />
                        {isGreetingLoading ? "Menulis..." : "Buatkan Ide"}
                    </button>
                </div>

                <div className="space-y-2">
                    <input
                        type="text"
                        placeholder="Untuk siapa? (Cth: Keluarga Besar Bani Ismail)"
                        value={config.greeting.recipient}
                        onChange={(e) => updateConfig({ greeting: { ...config.greeting, recipient: e.target.value } })}
                        className="w-full text-sm p-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    />
                    <textarea
                        placeholder="Tulis ucapan lebaran atau gunakan tombol 'Buatkan Ide'..."
                        value={config.greeting.message}
                        onChange={(e) => updateConfig({ greeting: { ...config.greeting, message: e.target.value, generated: false } })}
                        rows={3}
                        className="w-full text-sm p-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none resize-none"
                    />
                </div>
            </div>

            {/* Final Action */}
            <div className="pt-4">
                <Button
                    variant="gold"
                    size="xl"
                    onClick={onGenerate}
                    disabled={isGenerating}
                    className="w-full"
                >
                    {isGenerating ? "Menciptakan Foto..." : "GENERATE IMAGE ✨"}
                </Button>
            </div>

        </div>
    );
}
