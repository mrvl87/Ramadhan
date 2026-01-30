'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { BUDGET_PRESETS } from '../../utils/constants'

interface StepTwoProps {
    budgetMin: number
    budgetMax: number
    onChange: (min: number, max: number) => void
}

export function StepTwo({ budgetMin, budgetMax, onChange }: StepTwoProps) {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    What's your budget?
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Choose a price range that works for you
                </p>
            </div>

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-2 gap-3">
                {BUDGET_PRESETS.map((preset) => {
                    const isSelected = budgetMin === preset.min && budgetMax === preset.max

                    return (
                        <Card
                            key={preset.label}
                            onClick={() => onChange(preset.min, preset.max)}
                            className={`
                cursor-pointer p-4 text-center transition-all hover:shadow-warm-md
                border-2
                ${isSelected
                                    ? 'border-primary ring-2 ring-primary/20 bg-accent'
                                    : 'border-border hover:border-primary/50'
                                }
              `}
                        >
                            <p className={`font-bold text-lg mb-1 ${isSelected ? 'text-amber-900 dark:text-amber-100' : 'text-foreground'}`}>
                                {preset.label}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {preset.description}
                            </p>
                        </Card>
                    )
                })}
            </div>

            {/* Custom Range Sliders */}
            <div className="space-y-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                    Or set a custom range:
                </p>

                {/* Min Budget */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Minimum Budget
                        </label>
                        <span className="text-lg font-bold text-primary">
                            Rp {budgetMin.toLocaleString('id-ID')}
                        </span>
                    </div>
                    <Slider
                        value={[budgetMin]}
                        onValueChange={([val]) => onChange(val, Math.max(val, budgetMax))}
                        min={50000}
                        max={5000000}
                        step={50000}
                        className="cursor-pointer"
                    />
                </div>

                {/* Max Budget */}
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Maximum Budget
                        </label>
                        <span className="text-lg font-bold text-primary">
                            Rp {budgetMax.toLocaleString('id-ID')}
                        </span>
                    </div>
                    <Slider
                        value={[budgetMax]}
                        onValueChange={([val]) => onChange(Math.min(budgetMin, val), val)}
                        min={budgetMin}
                        max={5000000}
                        step={50000}
                        className="cursor-pointer"
                    />
                </div>

                {/* Budget Range Display */}
                <div className="text-center p-4 bg-accent rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                        Selected Budget Range
                    </p>
                    <p className="text-2xl font-bold text-primary">
                        Rp {budgetMin.toLocaleString('id-ID')} - Rp {budgetMax.toLocaleString('id-ID')}
                    </p>
                </div>
            </div>
        </div>
    )
}
