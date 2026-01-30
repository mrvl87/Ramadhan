import { WizardState } from "../../types";
import { Trees, Warehouse, Building2, Armchair, LampCeiling } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepFourProps {
    config: WizardState['config'];
    updateConfig: (updates: Partial<WizardState['config']>) => void;
}

export function StepFour({ config, updateConfig }: StepFourProps) {
    const settings = [
        { id: 'living_room', label: 'Ruang Tamu', desc: 'Nyaman & akrab.', icon: Armchair },
        { id: 'mosque_arch', label: 'Arsitektur Masjid', desc: 'Megah & Islami.', icon: Building2 },
        { id: 'garden', label: 'Taman Hijau', desc: 'Segar & natural.', icon: Trees },
        { id: 'solid_studio', label: 'Studio Polos', desc: 'Fokus ke wajah.', icon: Warehouse },
    ];

    const updateProps = (key: keyof typeof config.props, val: boolean) => {
        updateConfig({ props: { ...config.props, [key]: val } });
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
                <h3 className="text-xl font-bold text-foreground">Lokasi & Dekorasi</h3>
                <p className="text-sm text-primary">Di mana foto ini diambil?</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {settings.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => updateConfig({ background: item.id as any })}
                        className={cn(
                            "flex flex-col items-center p-4 border-2 rounded-xl transition-all hover:shadow-warm-md text-center space-y-2",
                            config.background === item.id
                                ? "border-primary bg-accent ring-2 ring-primary/20"
                                : "border-border bg-card hover:border-primary/50"
                        )}
                    >
                        <item.icon className={cn("w-8 h-8", config.background === item.id ? "text-primary" : "text-muted-foreground")} />
                        <div className="text-sm font-semibold text-foreground">{item.label}</div>
                    </button>
                ))}
            </div>

            <div className="bg-accent/50 p-4 rounded-xl border border-border/50 mt-4 space-y-3">
                <h4 className="text-sm font-medium text-foreground">Dekorasi Tambahan</h4>

                <label className="flex items-center justify-between p-2 hover:bg-card rounded cursor-pointer transition-colors">
                    <span className="text-sm text-foreground/80 flex items-center gap-2">
                        🔷 Gantung Ketupat
                    </span>
                    <input
                        type="checkbox"
                        checked={config.props.ketupat}
                        onChange={(e) => updateProps('ketupat', e.target.checked)}
                        className="w-5 h-5 text-primary rounded focus:ring-primary"
                    />
                </label>

                <label className="flex items-center justify-between p-2 hover:bg-card rounded cursor-pointer transition-colors">
                    <span className="text-sm text-foreground/80 flex items-center gap-2">
                        <LampCeiling className="w-4 h-4" /> Lampu Hias Maroko
                    </span>
                    <input
                        type="checkbox"
                        checked={config.props.lamps}
                        onChange={(e) => updateProps('lamps', e.target.checked)}
                        className="w-5 h-5 text-primary rounded focus:ring-primary"
                    />
                </label>
            </div>
        </div>
    );
}
