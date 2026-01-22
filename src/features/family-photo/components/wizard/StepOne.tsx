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
                <h3 className="text-xl font-bold text-emerald-950">Siapa di dalam foto?</h3>
                <p className="text-sm text-emerald-600">Pilih ukuran grup peserta foto.</p>
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
                            "flex flex-col items-center p-4 border-2 rounded-xl transition-all hover:shadow-md text-left space-y-2",
                            config.familySize === item.id
                                ? "border-emerald-600 bg-emerald-50 ring-2 ring-emerald-200"
                                : "border-slate-200 bg-white hover:border-emerald-200"
                        )}
                    >
                        <item.icon className={cn("w-8 h-8", config.familySize === item.id ? "text-emerald-700" : "text-slate-400")} />
                        <div>
                            <div className="font-semibold text-sm">{item.label}</div>
                            <div className="text-xs text-slate-500">{item.desc}</div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                <h4 className="text-sm font-medium text-slate-700">Detail Anggota</h4>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-slate-600">Dewasa</span>
                    </div>
                    <input
                        type="number"
                        min={1}
                        value={config.members.adults}
                        onChange={(e) => updateConfig({ members: { ...config.members, adults: parseInt(e.target.value) || 0 } })}
                        className="w-16 p-1 border rounded text-center text-sm"
                    />
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Baby className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-slate-600">Anak-anak</span>
                    </div>
                    <input
                        type="number"
                        min={0}
                        value={config.members.children}
                        onChange={(e) => updateConfig({ members: { ...config.members, children: parseInt(e.target.value) || 0 } })}
                        className="w-16 p-1 border rounded text-center text-sm"
                    />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                    <div className="flex items-center gap-2">
                        <Smile className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm text-slate-600">Termasuk Kakek/Nenek? (Elderly)</span>
                    </div>
                    <input
                        type="checkbox"
                        checked={config.members.elderly}
                        onChange={(e) => updateConfig({ members: { ...config.members, elderly: e.target.checked } })}
                        className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                </div>
            </div>
        </div>
    );
}
