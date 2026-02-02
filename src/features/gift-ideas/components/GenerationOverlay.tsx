'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Gift, Heart, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

interface GenerationOverlayProps {
    isVisible: boolean
    recipientType: string
    gender?: 'male' | 'female'
}

export function GenerationOverlay({ isVisible, recipientType, gender }: GenerationOverlayProps) {
    const [messageIndex, setMessageIndex] = useState(0)

    const messages = [
        `Memahami karakter ${recipientType}...`,
        gender ? `Mencari hadiah spesial untuk ${gender === 'male' ? 'pria' : 'wanita'}...` : 'Mencukupi kebutuhan personal...',
        'Menyesuaikan dengan budget Anda...',
        'Memilih produk terbaik di e-commerce...',
        'Merangkai kartu ucapan yang menyentuh...',
        'Sedikit lagi, menyiapkan kejutan...'
    ]

    // Rotate messages every 2.5 seconds
    useEffect(() => {
        if (!isVisible) {
            setMessageIndex(0)
            return
        }

        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length)
        }, 2500)

        return () => clearInterval(interval)
    }, [isVisible, messages.length])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md"
                >
                    <div className="max-w-md w-full px-6 text-center">
                        {/* Animated Icons */}
                        <div className="relative w-32 h-32 mx-auto mb-8">
                            {/* Orbital Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-4 border-dashed border-primary/30"
                            />

                            {/* Inner Circle */}
                            <motion.div
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-2 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-900/30 dark:to-amber-950/30 flex items-center justify-center shadow-glow-gold"
                            >
                                <Gift className="w-12 h-12 text-primary" />
                            </motion.div>

                            {/* Floating Elements */}
                            <motion.div
                                animate={{ y: [-10, 10, -10], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute -top-4 -right-4"
                            >
                                <Sparkles className="w-8 h-8 text-yellow-500" />
                            </motion.div>

                            <motion.div
                                animate={{ y: [10, -10, 10], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                                className="absolute -bottom-2 -left-4"
                            >
                                <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                            </motion.div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-300 dark:to-yellow-300 mb-2">
                            Mencari Hadiah Sempurna
                        </h2>

                        {/* Rotating Messages */}
                        <div className="h-8 mb-8 overflow-hidden relative">
                            <AnimatePresence mode='wait'>
                                <motion.p
                                    key={messageIndex}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-muted-foreground absolute w-full left-0 right-0"
                                >
                                    {messages[messageIndex]}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mb-4">
                            <motion.div
                                className="h-full bg-gradient-to-r from-amber-500 to-yellow-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 15, ease: "linear" }}
                            />
                        </div>

                        <p className="text-xs text-muted-foreground/60 animate-pulse">
                            Didukung oleh AI canggih & database e-commerce Indonesia
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
