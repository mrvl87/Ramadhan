'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { RECIPIENT_TYPES } from '../../utils/constants'
import type { RecipientType } from '../../types'
import { incrementImageView } from '../../image-actions'
import { useEffect } from 'react'
import Image from 'next/image'
import { useImageCache } from '../../contexts/ImageCacheContext'

interface StepOneProps {
    value: RecipientType | null
    onChange: (type: RecipientType) => void
}

export function StepOne({ value, onChange }: StepOneProps) {
    const { recipientImages, loadingImages, getImage } = useImageCache()

    // Track image views when recipient is selected
    useEffect(() => {
        if (value) {
            const image = getImage(value)
            if (image) {
                incrementImageView(image.id).catch(console.error)
            }
        }
    }, [value, getImage])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Siapa yang ingin Anda bahagiakan?
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                    Pilih hubungan Anda dengan penerima hadiah
                </p>
            </div>

            {/* Recipient Cards Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {RECIPIENT_TYPES.map(({ type, label, icon: Icon, description }, index) => {
                    const isSelected = value === type
                    const image = getImage(type)

                    return (
                        <motion.button
                            key={type}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => onChange(type)}
                            className={`
                relative overflow-hidden rounded-2xl p-6 text-center transition-all
                ${isSelected
                                    ? 'ring-4 ring-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 scale-105 shadow-xl'
                                    : 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-lg'
                                }
              `}
                        >
                            {/* Background Image with Overlay */}
                            {image && !loadingImages && (
                                <div className="absolute inset-0 opacity-20">
                                    <Image
                                        src={image.public_url}
                                        alt={label}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                        priority={index < 3}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                </div>
                            )}

                            {/* Loading State */}
                            {loadingImages && (
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 animate-pulse" />
                            )}

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon and Check */}
                                <div className="flex items-center justify-center mb-3 relative">
                                    <Icon
                                        className={`
                      w-12 h-12 transition-all p-2 rounded-xl
                      ${isSelected
                                                ? 'bg-white dark:bg-slate-900 shadow-lg text-purple-600 scale-110'
                                                : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                                            }
                    `}
                                    />

                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute -top-2 -right-2 bg-purple-600 text-white p-1 rounded-full shadow-lg"
                                        >
                                            <Check className="w-4 h-4" />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Label */}
                                <p
                                    className={`
                    font-semibold mb-1 transition-colors
                    ${isSelected
                                            ? 'text-purple-900 dark:text-purple-100'
                                            : 'text-slate-900 dark:text-white'
                                        }
                  `}
                                >
                                    {label}
                                </p>

                                {/* Description */}
                                <p
                                    className={`
                    text-xs transition-colors
                    ${isSelected
                                            ? 'text-purple-700 dark:text-purple-300 font-medium'
                                            : 'text-slate-500 dark:text-slate-400'
                                        }
                  `}
                                >
                                    {description}
                                </p>
                            </div>

                            {/* Selected Indicator Bottom Border */}
                            {isSelected && (
                                <motion.div
                                    layoutId="selectedBorder"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 to-pink-600"
                                />
                            )}
                        </motion.button>
                    )
                })}
            </div>

            {/* Emotional Subtext */}
            {value && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-xl"
                >
                    <p className="text-sm text-purple-800 dark:text-purple-200">
                        💝 Sempurna! Kami akan mencari hadiah yang{' '}
                        <span className="font-bold">istimewa</span> untuk{' '}
                        {RECIPIENT_TYPES.find((t) => t.type === value)?.label.toLowerCase()}
                    </p>
                </motion.div>
            )}
        </div>
    )
}
