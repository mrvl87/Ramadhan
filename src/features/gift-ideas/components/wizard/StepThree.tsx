'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { X, Plus } from 'lucide-react'
import { SUGGESTED_INTERESTS } from '../../utils/constants'

interface StepThreeProps {
    interests: string[]
    onChange: (interests: string[]) => void
}

export function StepThree({ interests, onChange }: StepThreeProps) {
    const [input, setInput] = useState('')

    const addInterest = (interest: string) => {
        const trimmed = interest.trim()
        if (trimmed && !interests.includes(trimmed)) {
            onChange([...interests, trimmed])
        }
        setInput('')
    }

    const removeInterest = (interest: string) => {
        onChange(interests.filter(i => i !== interest))
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && input.trim()) {
            e.preventDefault()
            addInterest(input)
        }
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Tell us about them
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    What are their interests or hobbies?
                </p>
            </div>

            {/* Input Field */}
            <div className="relative">
                <Input
                    placeholder="Type an interest and press Enter..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pr-10 text-base"
                />
                {input && (
                    <button
                        onClick={() => addInterest(input)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-purple-100 dark:hover:bg-purple-900 rounded-full transition-colors"
                        title="Add interest"
                    >
                        <Plus className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </button>
                )}
            </div>

            {/* Selected Interests */}
            {interests.length > 0 && (
                <div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                        Selected ({interests.length}):
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                            <Badge
                                key={interest}
                                variant="secondary"
                                className="px-3 py-1.5 bg-purple-100 dark:bg-purple-900 text-purple-900 dark:text-purple-100 border-purple-200 dark:border-purple-800"
                            >
                                {interest}
                                <button
                                    onClick={() => removeInterest(interest)}
                                    className="ml-2 hover:text-purple-700 dark:hover:text-purple-300"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Suggested Tags */}
            <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                    {interests.length === 0 ? 'Popular suggestions:' : 'Add more:'}
                </p>
                <div className="flex flex-wrap gap-2">
                    {SUGGESTED_INTERESTS
                        .filter(interest => !interests.includes(interest))
                        .map((interest) => (
                            <Badge
                                key={interest}
                                variant="outline"
                                className="cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-950 hover:border-purple-300 dark:hover:border-purple-700 transition-colors px-3 py-1.5"
                                onClick={() => addInterest(interest)}
                            >
                                <Plus className="w-3 h-3 mr-1" />
                                {interest}
                            </Badge>
                        ))}
                </div>
            </div>

            {/* Helper Text */}
            <div className="text-center text-sm text-slate-500 dark:text-slate-400 pt-4">
                💡 Tip: Add 2-5 interests for the best gift recommendations
            </div>
        </div>
    )
}
