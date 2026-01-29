'use client'

import { Card } from '@/components/ui/card'
import { RECIPIENT_TYPES } from '../../utils/constants'
import type { RecipientType } from '../../types'

interface StepOneProps {
    value: RecipientType | null
    onChange: (type: RecipientType) => void
}

export function StepOne({ value, onChange }: StepOneProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Who is this gift for?
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Select the recipient to get personalized gift ideas
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {RECIPIENT_TYPES.map(({ type, label, icon: Icon, color, description }) => {
                    const isSelected = value === type

                    return (
                        <Card
                            key={type}
                            onClick={() => onChange(type)}
                            className={`
                cursor-pointer p-6 text-center transition-all hover:shadow-lg
                border-2
                ${isSelected
                                    ? `border-${color}-500 ring-2 ring-${color}-200 bg-${color}-50 dark:bg-${color}-950`
                                    : 'border-slate-200 dark:border-slate-700 hover:border-${color}-300'
                                }
              `}
                        >
                            <Icon
                                className={`
                  w-12 h-12 mx-auto mb-3 
                  ${isSelected ? `text-${color}-600 dark:text-${color}-400` : 'text-slate-400'}
                `}
                            />
                            <p className={`font-semibold mb-1 ${isSelected ? `text-${color}-900 dark:text-${color}-100` : 'text-slate-900 dark:text-white'}`}>
                                {label}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                {description}
                            </p>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
