'use client'

import { useState, useEffect } from 'react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Plus, History, Trash2 } from 'lucide-react'

interface StepThreeProps {
    interests: string[]
    onChange: (interests: string[]) => void
}

const POPULAR_INTERESTS = [
    'Reading', 'Cooking', 'Gardening', 'Photography', 'Art', 'Music',
    'Sports', 'Travel', 'Technology', 'Fashion', 'Gaming', 'Fitness'
]

const HISTORY_STORAGE_KEY = 'gift-ideas-interest-history'
const MAX_HISTORY_ITEMS = 10

export function StepThree({ interests, onChange }: StepThreeProps) {
    const [customInterest, setCustomInterest] = useState('')
    const [interestHistory, setInterestHistory] = useState<string[]>([])

    // Load interest history from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(HISTORY_STORAGE_KEY)
            if (saved) {
                const parsed = JSON.parse(saved)
                setInterestHistory(parsed)
            }
        } catch (error) {
            console.error('[INTEREST HISTORY] Failed to load:', error)
        }
    }, [])

    // Save interest to history
    const saveToHistory = (interest: string) => {
        const trimmed = interest.trim()
        if (!trimmed) return

        setInterestHistory((prev) => {
            // Remove if already exists (move to front)
            const filtered = prev.filter((item) => item.toLowerCase() !== trimmed.toLowerCase())
            // Add to front
            const updated = [trimmed, ...filtered].slice(0, MAX_HISTORY_ITEMS)

            // Save to localStorage
            try {
                localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated))
            } catch (error) {
                console.error('[INTEREST HISTORY] Failed to save:', error)
            }

            return updated
        })
    }

    // Clear all history
    const clearHistory = () => {
        setInterestHistory([])
        try {
            localStorage.removeItem(HISTORY_STORAGE_KEY)
        } catch (error) {
            console.error('[INTEREST HISTORY] Failed to clear:', error)
        }
    }

    const handleAddCustom = () => {
        const trimmed = customInterest.trim()
        if (trimmed && !interests.includes(trimmed)) {
            onChange([...interests, trimmed])
            saveToHistory(trimmed)
            setCustomInterest('')
        }
    }

    const toggleInterest = (interest: string) => {
        if (interests.includes(interest)) {
            onChange(interests.filter((i) => i !== interest))
        } else {
            onChange([...interests, interest])
            saveToHistory(interest)
        }
    }

    const removeInterest = (interest: string) => {
        onChange(interests.filter((i) => i !== interest))
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Apa minat atau hobi mereka?
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Pilih atau tambahkan hobi untuk rekomendasi yang lebih personal (opsional)
                </p>
            </div>

            {/* Custom Interest Input */}
            <div className="flex gap-2">
                <Input
                    value={customInterest}
                    onChange={(e) => setCustomInterest(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCustom()}
                    placeholder="Contoh: Membaca Al-Quran, Memasak kue, dll..."
                    className="flex-1"
                />
                <Button
                    onClick={handleAddCustom}
                    disabled={!customInterest.trim()}
                    className="bg-purple-600 hover:bg-purple-700"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Tambah
                </Button>
            </div>

            {/* Selected Interests */}
            {interests.length > 0 && (
                <div className="space-y-2">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        Minat yang dipilih ({interests.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                            <Badge
                                key={interest}
                                variant="secondary"
                                className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 px-3 py-1.5 text-sm"
                            >
                                {interest}
                                <button
                                    onClick={() => removeInterest(interest)}
                                    className="ml-2 hover:text-purple-600 dark:hover:text-purple-400"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Interest History */}
            {interestHistory.length > 0 && (
                <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <History className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                Riwayat Pencarian Anda
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearHistory}
                            className="text-xs text-slate-500 hover:text-red-600"
                        >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Hapus Semua
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {interestHistory.map((interest) => (
                            <Badge
                                key={interest}
                                variant="outline"
                                className={`
                                    cursor-pointer transition-all
                                    ${interests.includes(interest)
                                        ? 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200'
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                    }
                                `}
                                onClick={() => toggleInterest(interest)}
                            >
                                {interest}
                            </Badge>
                        ))}
                    </div>
                </div>
            )}

            {/* Popular Suggestions */}
            <div className="space-y-2">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Saran Populer
                </p>
                <div className="flex flex-wrap gap-2">
                    {POPULAR_INTERESTS.map((interest) => (
                        <Badge
                            key={interest}
                            variant="outline"
                            className={`
                                cursor-pointer transition-all
                                ${interests.includes(interest)
                                    ? 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200'
                                    : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                                }
                            `}
                            onClick={() => toggleInterest(interest)}
                        >
                            {interest}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Helper Text */}
            <p className="text-xs text-center text-slate-500 dark:text-slate-400">
                💡 Tip: Semakin spesifik minat yang Anda tambahkan, semakin personal rekomendasi hadiahnya
            </p>
        </div>
    )
}
