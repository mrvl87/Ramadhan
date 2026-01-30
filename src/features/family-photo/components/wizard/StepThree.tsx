import { WizardState } from "../../types";
import { Sparkles, Shirt, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepThreeProps {
    config: WizardState['config'];
    updateConfig: (updates: Partial<WizardState['config']>) => void;
}

export function StepThree({ config, updateConfig }: StepThreeProps) {
    const outfits = [
        {
            id: 'white_modest',
            label: 'Serba Putih (Suci)',
            desc: 'Klasik Idul Fitri, bersih & elegan.',
            colors: ['bg-white border-slate-200', 'bg-slate-50 border-slate-200']
        },
        {
            id: 'sarimbit_batik',
            label: 'Sarimbit Batik',
            desc: 'Kompak dengan corak budaya premium.',
            colors: ['bg-amber-700', 'bg-amber-900']
        },
        {
            id: 'earth_tone',
            label: 'Earth Tone (Sage/Beige)',
            desc: 'Warna alam yang lembut & kekinian.',
            colors: ['bg-[#D3Dac3]', 'bg-[#d6cbb6]']
        },
        {
            id: 'elegant_dark',
            label: 'Elegant Dark (Navy/Maroon)',
            desc: 'Mewah, velvet, aksen emas.',
            colors: ['bg-slate-900', 'bg-red-900']
        },
        {
            id: 'auto_ai',
            label: 'Biarkan AI Memilih',
            desc: 'Fashion modern random yang estetik.',
            colors: ['bg-gradient-to-br from-pink-300 via-purple-300 to-indigo-400']
        },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
                <h3 className="text-xl font-bold text-foreground">Pilih Busana (Outfit)</h3>
                <p className="text-sm text-primary">Apa tema baju lebaran tahun ini?</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {outfits.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => updateConfig({ outfit: item.id as any })}
                        className={cn(
                            "flex items-center p-3 border-2 rounded-xl transition-all hover:shadow-warm-md text-left gap-4",
                            config.outfit === item.id
                                ? "border-primary bg-accent ring-1 ring-primary/20"
                                : "border-border bg-card hover:border-primary/50"
                        )}
                    >
                        {/* Swatch */}
                        <div className="flex -space-x-2">
                            {item.colors.length === 1 ? (
                                <div className={cn("w-10 h-10 rounded-full border shadow-sm", item.colors[0])} />
                            ) : (
                                item.colors.map((c, i) => (
                                    <div key={i} className={cn("w-8 h-8 rounded-full border shadow-sm", c)} style={{ zIndex: 10 - i }} />
                                ))
                            )}
                        </div>

                        <div className="flex-1">
                            <div className="font-bold text-foreground flex items-center gap-2">
                                {item.label}
                                {item.id === 'auto_ai' && <Sparkles className="w-4 h-4 text-secondary" />}
                            </div>
                            <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
