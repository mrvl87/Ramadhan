import { WizardState } from "../../types";
import { Home, Camera, Sofa, MoonStar, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepTwoProps {
    config: WizardState['config'];
    updateConfig: (updates: Partial<WizardState['config']>) => void;
}

export function StepTwo({ config, updateConfig }: StepTwoProps) {
    const vibes = [
        { id: 'warm_homey', label: 'Hangat & Homey', desc: 'Suasana rumah yang akrab, cahaya keemasan (Golden Hour).', icon: Home },
        { id: 'formal_studio', label: 'Formal Studio', desc: 'Profesional, pencahayaan terang, rapi & simetris.', icon: Camera },
        { id: 'relaxed_indoor', label: 'Santai Indoor', desc: 'Cahaya jendela natural, pose rileks, nyaman.', icon: Sofa },
        { id: 'spiritual_mosque', label: 'Spiritual', desc: 'Nuansa Masjid, syahdu, pencahayaan dramatis.', icon: MoonStar },
        { id: 'clean_modern', label: 'Clean Modern', desc: 'Estetika minimalis, putih bersih, majalah fashion.', icon: Sparkles },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
                <h3 className="text-xl font-bold text-foreground">Pilih Suasana (Vibe)</h3>
                <p className="text-sm text-primary">Seperti apa mood foto yang diinginkan?</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {vibes.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => updateConfig({ vibe: item.id as any })}
                        className={cn(
                            "flex items-center p-4 border-2 rounded-xl transition-all hover:shadow-warm-md text-left gap-4",
                            config.vibe === item.id
                                ? "border-primary bg-accent ring-1 ring-primary/20"
                                : "border-border bg-card hover:border-primary/50"
                        )}
                    >
                        <div className={cn("p-3 rounded-full", config.vibe === item.id ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                            <item.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <div className="font-bold text-foreground">{item.label}</div>
                            <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
