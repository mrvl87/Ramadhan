// Constants for Gift Ideas Generator

import type { RecipientType, EcommerceStore } from '../types'
import { Users, Heart, Baby, UserCheck, Briefcase, BookOpen, User } from 'lucide-react'

// Recipient type options with metadata
export const RECIPIENT_TYPES: Array<{
    type: RecipientType
    label: string
    icon: any
    color: string
    description: string
}> = [
        {
            type: 'parent',
            label: 'Parents',
            icon: Users,
            color: 'emerald',
            description: 'Mother or father'
        },
        {
            type: 'spouse',
            label: 'Spouse',
            icon: Heart,
            color: 'rose',
            description: 'Husband or wife'
        },
        {
            type: 'child',
            label: 'Child',
            icon: Baby,
            color: 'blue',
            description: 'Son or daughter'
        },
        {
            type: 'sibling',
            label: 'Sibling',
            icon: UserCheck,
            color: 'purple',
            description: 'Brother or sister'
        },
        {
            type: 'friend',
            label: 'Friend',
            icon: User,
            color: 'orange',
            description: 'Close friend'
        },
        {
            type: 'colleague',
            label: 'Colleague',
            icon: Briefcase,
            color: 'slate',
            description: 'Work colleague'
        },
        {
            type: 'religious_leader',
            label: 'Religious Leader',
            icon: BookOpen,
            color: 'teal',
            description: 'Ustadz or teacher'
        }
    ]

// Budget preset ranges (in IDR)
export const BUDGET_PRESETS = [
    {
        label: 'Under 100k',
        min: 50000,
        max: 100000,
        description: 'Thoughtful & affordable'
    },
    {
        label: '100k - 500k',
        min: 100000,
        max: 500000,
        description: 'Most popular range'
    },
    {
        label: '500k - 2M',
        min: 500000,
        max: 2000000,
        description: 'Premium gifts'
    },
    {
        label: 'Above 2M',
        min: 2000000,
        max: 5000000,
        description: 'Luxury items'
    }
]

// Suggested interests/hobbies
export const SUGGESTED_INTERESTS = [
    'Quran',
    'Cooking',
    'Technology',
    'Fashion',
    'Sports',
    'Reading',
    'Gardening',
    'Travel',
    'Photography',
    'Music',
    'Art',
    'Gaming',
    'Fitness',
    'Coffee',
    'Tea'
]

// E-commerce store configurations
export const ECOMMERCE_STORES: Record<EcommerceStore, {
    name: string
    searchUrl: (keywords: string) => string
    icon: string
}> = {
    'Tokopedia': {
        name: 'Tokopedia',
        searchUrl: (keywords) => `https://www.tokopedia.com/search?q=${encodeURIComponent(keywords)}`,
        icon: '🟢'
    },
    'Shopee': {
        name: 'Shopee',
        searchUrl: (keywords) => `https://shopee.co.id/search?keyword=${encodeURIComponent(keywords)}`,
        icon: '🔴'
    },
    'Bukalapak': {
        name: 'Bukalapak',
        searchUrl: (keywords) => `https://www.bukalapak.com/products?search[keywords]=${encodeURIComponent(keywords)}`,
        icon: '🔵'
    },
    'Lazada': {
        name: 'Lazada',
        searchUrl: (keywords) => `https://www.lazada.co.id/catalog/?q=${encodeURIComponent(keywords)}`,
        icon: '🟠'
    }
}

// Credits required for generation
export const GIFT_GENERATION_COST = 10

// Max gifts per generation
export const MAX_GIFTS_PER_GENERATION = 5
