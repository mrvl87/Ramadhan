"use client"

import { ThemeKey } from "@/lib/prompt-engine"
import { ThemeCard } from "./ThemeCard"

interface ThemeSelectorProps {
    selectedTheme: ThemeKey
    onSelect: (theme: ThemeKey) => void
}

const AVAILABLE_THEMES: { id: ThemeKey; title: string; desc: string; gradient: string }[] = [
    {
        id: "luxury_gold",
        title: "Royal Gold",
        desc: "Cinematic lighting, golden ornaments, and emerald touches. Feels wealthy and victorious.",
        gradient: "bg-gradient-to-br from-yellow-100 via-amber-200 to-yellow-600"
    },
    {
        id: "minimalist_white",
        title: "Modern Clean",
        desc: "Pure white, soft daylight, and minimal geometry. Feels peaceful and contemporary.",
        gradient: "bg-gradient-to-br from-gray-50 via-gray-100 to-gray-300"
    },
    {
        id: "spiritual_night",
        title: "Spiritual Night",
        desc: "Midnight blue, glowing lanterns, and moonlit skies. Feels deeply pious and reflective.",
        gradient: "bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900"
    },
    {
        id: "kampung_heritage",
        title: "Classic Heritage",
        desc: "Warm tones, batik textures, and traditional wooden architecture. Feels nostalgic.",
        gradient: "bg-gradient-to-br from-orange-100 via-stone-300 to-amber-700"
    },
]

export function ThemeSelector({ selectedTheme, onSelect }: ThemeSelectorProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {AVAILABLE_THEMES.map((theme) => (
                <ThemeCard
                    key={theme.id}
                    id={theme.id}
                    title={theme.title}
                    description={theme.desc}
                    gradient={theme.gradient}
                    isSelected={selectedTheme === theme.id}
                    onSelect={(id) => onSelect(id as ThemeKey)}
                />
            ))}
        </div>
    )
}
