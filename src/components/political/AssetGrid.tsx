"use client"

import { Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface AssetGridProps {
    items: {
        id: string
        name: string
        image_url?: string | null
        is_premium: boolean
        primary_color?: string
    }[]
    selectedId: string
    onSelect: (id: string, isPremium: boolean) => void
    title?: string
    isPro: boolean // Current user status
}

export function AssetGrid({ items, selectedId, onSelect, title, isPro }: AssetGridProps) {
    return (
        <div className="space-y-3">
            {title && <h3 className="text-lg font-semibold">{title}</h3>}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {items.map((item) => {
                    const isLocked = item.is_premium && !isPro
                    const isSelected = selectedId === item.id

                    return (
                        <div
                            key={item.id}
                            onClick={() => onSelect(item.id, item.is_premium)}
                            className={cn(
                                "relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-200",
                                isSelected
                                    ? "border-indigo-600 ring-2 ring-indigo-200 scale-[1.02]"
                                    : "border-transparent hover:border-gray-200 hover:scale-[1.01]",
                                "aspect-[3/4] bg-gray-50 flex flex-col items-center justify-end pb-2"
                            )}
                            style={{
                                // If no image, use primary color as fallback background
                                backgroundColor: !item.image_url && item.primary_color ? item.primary_color : undefined
                            }}
                        >
                            {/* Image Background */}
                            {item.image_url ? (
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${item.image_url})` }} />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-4xl opacity-20">
                                    🏛️
                                </div>
                            )}

                            {/* Gradient Overlay for Text Readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            {/* Name Label */}
                            <div className="relative z-10 w-full px-2 text-center">
                                <span className={cn(
                                    "text-sm font-medium text-white line-clamp-2",
                                    isSelected ? "font-bold text-yellow-300" : ""
                                )}>
                                    {item.name}
                                </span>
                            </div>

                            {/* Premium Lock Overlay */}
                            {item.is_premium && (
                                <div className="absolute top-2 right-2 z-20">
                                    {isLocked ? (
                                        <div className="bg-black/60 p-1.5 rounded-full backdrop-blur-sm border border-yellow-500/50">
                                            <Lock className="w-3 h-3 text-yellow-400" />
                                        </div>
                                    ) : (
                                        <div className="bg-yellow-500/90 px-1.5 py-0.5 rounded text-[10px] font-bold text-black uppercase tracking-wider shadow-lg">
                                            PRO
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Full Card Lock Overlay (if strictly locked, maybe blur it?) */}
                            {isLocked && (
                                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-white/10 p-2 rounded-full border border-white/20 text-white font-bold text-xs">
                                        Unlock
                                    </div>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
