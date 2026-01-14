import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

interface ThemeCardProps {
    id: string
    title: string
    description: string
    gradient: string
    isSelected: boolean
    onSelect: (id: string) => void
}

export function ThemeCard({ id, title, description, gradient, isSelected, onSelect }: ThemeCardProps) {
    return (
        <div
            onClick={() => onSelect(id)}
            className={cn(
                "relative cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-200 group",
                isSelected ? "border-green-600 ring-2 ring-green-600/20" : "border-transparent hover:border-gray-200 dark:hover:border-neutral-800"
            )}
        >
            {/* Visual Preview */}
            <div className={cn("h-24 w-full", gradient)}></div>

            {/* Content */}
            <div className="p-4 bg-white dark:bg-neutral-900">
                <h3 className="font-semibold text-sm">{title}</h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
            </div>

            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute top-2 right-2 h-6 w-6 bg-green-600 rounded-full flex items-center justify-center text-white shadow-sm">
                    <Check className="h-3 w-3" />
                </div>
            )}
        </div>
    )
}
