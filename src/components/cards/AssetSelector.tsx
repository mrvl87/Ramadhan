"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"
import { Check, Lock } from "lucide-react"

interface Asset {
    id: string
    name: string
    is_premium: boolean
    image_url?: string | null
    primary_color?: string
}

interface AssetSelectorProps {
    title: string
    assets: Asset[]
    selectedId?: string
    onSelect: (id: string) => void
    isPro?: boolean
}

export function AssetSelector({ title, assets, selectedId, onSelect, isPro }: AssetSelectorProps) {
    return (
        <div className="space-y-3">
            <h3 className="font-semibold text-lg">{title}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {assets.map((asset) => {
                    const isLocked = asset.is_premium && !isPro;
                    const isSelected = selectedId === asset.id;

                    return (
                        <div
                            key={asset.id}
                            onClick={() => !isLocked && onSelect(asset.id)}
                            className={cn(
                                "relative cursor-pointer rounded-lg border-2 p-3 transition-all bg-white dark:bg-neutral-900",
                                isSelected ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300",
                                isLocked && "opacity-60 cursor-not-allowed bg-gray-50"
                            )}
                        >
                            {/* Visual Placeholder if no image */}
                            <div
                                className="h-16 w-full rounded-md mb-2 flex items-center justify-center text-xs text-muted-foreground relative overflow-hidden"
                                style={{ backgroundColor: asset.primary_color || '#f3f4f6' }}
                            >
                                {asset.image_url ? (
                                    <Image src={asset.image_url} alt={asset.name} fill className="object-cover" />
                                ) : (
                                    <span>{asset.name[0]}</span>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className={cn("text-sm font-medium truncate", isLocked && "text-muted-foreground")}>
                                    {asset.name}
                                </span>
                                {isLocked && <Lock className="h-3 w-3 text-amber-500" />}
                            </div>

                            {isSelected && (
                                <div className="absolute top-2 right-2 h-5 w-5 bg-green-600 rounded-full flex items-center justify-center text-white">
                                    <Check className="h-3 w-3" />
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
