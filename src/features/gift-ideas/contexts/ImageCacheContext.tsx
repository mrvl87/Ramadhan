'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getRecipientImage, type EmotionalImage } from '../image-actions'
import { RECIPIENT_TYPES } from '../utils/constants'

interface ImageCache {
    [recipientType: string]: EmotionalImage | null
}

interface ImageCacheContextType {
    recipientImages: ImageCache
    loadingImages: boolean
    getImage: (type: string) => EmotionalImage | null
}

const ImageCacheContext = createContext<ImageCacheContextType | undefined>(undefined)

const CACHE_KEY = 'gift-ideas-recipient-images'
const CACHE_EXPIRY_KEY = 'gift-ideas-images-expiry'
const CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 hours

export function ImageCacheProvider({ children }: { children: ReactNode }) {
    const [recipientImages, setRecipientImages] = useState<ImageCache>({})
    const [loadingImages, setLoadingImages] = useState(true)

    useEffect(() => {
        async function loadImages() {
            // Check localStorage cache first
            const cachedData = localStorage.getItem(CACHE_KEY)
            const cacheExpiry = localStorage.getItem(CACHE_EXPIRY_KEY)
            const now = Date.now()

            // Use cache if valid
            if (cachedData && cacheExpiry && now < parseInt(cacheExpiry)) {
                try {
                    const parsed = JSON.parse(cachedData)
                    console.log('[IMAGE CACHE] Using cached images')
                    setRecipientImages(parsed)
                    setLoadingImages(false)
                    return
                } catch (error) {
                    console.error('[IMAGE CACHE] Failed to parse cache:', error)
                }
            }

            // Fetch fresh images
            console.log('[IMAGE CACHE] Fetching fresh images...')
            const imagePromises = RECIPIENT_TYPES.map(async ({ type }) => {
                const image = await getRecipientImage(type)
                return { type, image }
            })

            const results = await Promise.all(imagePromises)
            const imagesMap = results.reduce((acc, { type, image }) => {
                acc[type] = image
                return acc
            }, {} as ImageCache)

            // Save to state
            setRecipientImages(imagesMap)
            setLoadingImages(false)

            // Save to localStorage with expiry
            try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(imagesMap))
                localStorage.setItem(CACHE_EXPIRY_KEY, (now + CACHE_DURATION).toString())
                console.log('[IMAGE CACHE] Cached images for 24 hours')
            } catch (error) {
                console.error('[IMAGE CACHE] Failed to cache images:', error)
            }
        }

        loadImages()
    }, [])

    const getImage = (type: string): EmotionalImage | null => {
        return recipientImages[type] || null
    }

    return (
        <ImageCacheContext.Provider value={{ recipientImages, loadingImages, getImage }}>
            {children}
        </ImageCacheContext.Provider>
    )
}

export function useImageCache() {
    const context = useContext(ImageCacheContext)
    if (!context) {
        throw new Error('useImageCache must be used within ImageCacheProvider')
    }
    return context
}
