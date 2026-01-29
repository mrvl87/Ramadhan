'use client'

import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Sparkles } from 'lucide-react'
import type { Occasion } from '../../types'

interface StepFourProps {
    occasion: Occasion
    additionalNotes: string
    onOccasionChange: (occasion: Occasion) => void
    onNotesChange: (notes: string) => void
}

const OCCASIONS: Array<{ value: Occasion; label: string; icon: string; description: string }> = [
    {
        value: 'ramadan',
        label: 'Ramadan',
        icon: '🌙',
        description: 'Spiritual and worship-focused'
    },
    {
        value: 'eid',
        label: 'Eid al-Fitr',
        icon: '🎉',
        description: 'Celebratory and festive'
    },
    {
        value: 'both',
        label: 'Both',
        icon: '✨',
        description: 'Versatile for the season'
    }
]

export function StepFour({
    occasion,
    additionalNotes,
    onOccasionChange,
    onNotesChange
}: StepFourProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Final touches
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Optional details to personalize your gift ideas
                </p>
            </div>

            {/* Occasion Selection */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Calendar className="w-4 h-4" />
                    Occasion
                </label>
                <div className="grid grid-cols-3 gap-3">
                    {OCCASIONS.map(({ value, label, icon, description }) => (
                        <Card
                            key={value}
                            onClick={() => onOccasionChange(value)}
                            className={`
                cursor-pointer p-4 text-center transition-all hover:shadow-md
                border-2
                ${occasion === value
                                    ? 'border-purple-500 ring-2 ring-purple-200 bg-purple-50 dark:bg-purple-950'
                                    : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
                                }
              `}
                        >
                            <div className="text-3xl mb-2">{icon}</div>
                            <p className={`font-semibold text-sm mb-1 ${occasion === value ? 'text-purple-900 dark:text-purple-100' : 'text-slate-900 dark:text-white'}`}>
                                {label}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {description}
                            </p>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-3">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                    <Sparkles className="w-4 h-4" />
                    Additional Notes (Optional)
                </label>
                <Textarea
                    placeholder="Any specific preferences, allergies, or restrictions?&#10;Example: &quot;Prefers eco-friendly products&quot; or &quot;Allergic to nuts&quot;"
                    value={additionalNotes}
                    onChange={(e) => onNotesChange(e.target.value)}
                    rows={4}
                    className="resize-none"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add any extra details to help us find the perfect gift
                </p>
            </div>

            {/* Ready to Generate */}
            <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-4">
                    <div className="text-4xl">🎁</div>
                    <div>
                        <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1">
                            Ready to find the perfect gift?
                        </h3>
                        <p className="text-sm text-purple-700 dark:text-purple-300">
                            Click "Generate Gift Ideas" to get 5 personalized gift recommendations powered by AI.
                        </p>
                        <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
                            💎 Cost: 10 credits
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
