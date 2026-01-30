import { WizardState } from "../../types";
import { Users, User, Baby, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepOneProps {
    config: WizardState['config'];
    updateConfig: (updates: Partial<WizardState['config']>) => void;
}

export function StepOne({ config, updateConfig }: StepOneProps) {
    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="text-center">
                <h3 className="text-xl font-bold text-foreground">Siapa di dalam foto?</h3>
                <p className="text-sm text-primary">Pilih ukuran grup peserta foto.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {[
                    { id: 'small', label: 'Kecil', desc: '3-4 Orang', icon: Users },
                    { id: 'medium', label: 'Sedang', desc: '5-8 Orang', icon: Users },
                    { id: 'large', label: 'Besar', desc: '9-14 Orang', icon: Users },
                    { id: 'extra_large', label: 'Keluarga Besar', desc: '15+ Orang', icon: Users },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => updateConfig({ familySize: item.id as any })}
                        className={cn(
                            "flex flex-col items-center p-4 border-2 rounded-xl transition-all hover:shadow-warm-md text-left space-y-2",
                            config.familySize === item.id
                                ? "border-primary bg-accent ring-2 ring-primary/20"
                                : "border-border bg-card hover:border-primary/50"
                        )}
                    >
                        <item.icon className={cn("w-8 h-8", config.familySize === item.id ? "text-primary" : "text-muted-foreground")} />
                        <div>
                            <div className="font-semibold text-sm text-foreground">{item.label}</div>
                            <div className="text-xs text-muted-foreground">{item.desc}</div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="bg-accent/50 p-4 rounded-xl border border-border/50 space-y-4">
                <h4 className="text-sm font-medium text-foreground">Detail Anggota</h4>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground/80">Dewasa</span>
                    </div>
                    <input
                        type="number"
                        min={1}
                        value={config.members.adults}
                        onChange={(e) => updateConfig({ members: { ...config.members, adults: parseInt(e.target.value) || 0 } })}
                        className="w-16 p-1 border border-border bg-card text-foreground rounded text-center text-sm"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Baby className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground/80">Anak-anak</span>
                    </div>
                    <input
                        type="number"
                        min={0}
                        value={config.members.children}
                        onChange={(e) => updateConfig({ members: { ...config.members, children: parseInt(e.target.value) || 0 } })}
                        className="w-16 p-1 border border-border bg-card text-foreground rounded text-center text-sm"
                    />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2">
                        <Smile className="w-4 h-4 text-primary" />
                        <span className="text-sm text-foreground/80">Termasuk Kakek/Nenek? (Elderly)</span>
                    </div>
                    <input
                        type="checkbox"
                        checked={config.members.elderly}
                        onChange={(e) => updateConfig({ members: { ...config.members, elderly: e.target.checked } })}
                        className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                </div>
            </div>
        </div>
    );
}
