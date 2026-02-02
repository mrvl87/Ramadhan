// TypeScript types and interfaces for Gift Ideas Generator

export type RecipientType =
    | 'parent'
    | 'spouse'
    | 'child'
    | 'sibling'
    | 'friend'
    | 'colleague'
    | 'religious_leader'

export type Occasion = 'ramadan' | 'eid' | 'both'

export type EcommerceStore = 'Tokopedia' | 'Shopee' | 'Bukalapak' | 'Lazada'

export type Gender = 'male' | 'female'

// Wizard form state
export interface WizardState {
    recipient_type: RecipientType
    gender?: Gender
    budget_min: number
    budget_max: number
    interests: string[]
    occasion: Occasion
    additional_notes?: string
}

// Individual gift idea from AI
export interface GiftIdea {
    name: string
    price: number
    reason: string
    where_to_buy: EcommerceStore[]
    keywords: string
    image_url?: string // Optional, generated later
}

// Complete gift generation record from database
export interface GiftGeneration {
    id: string
    user_id: string
    recipient_type: RecipientType
    gender?: Gender
    budget_min: number
    budget_max: number
    interests: string[]
    occasion: Occasion
    additional_notes?: string
    gift_ideas: GiftIdea[]
    credits_used: number
    created_at: string
    updated_at: string
    is_saved: boolean
    share_token: string
    view_count: number
    share_count: number
}

// API response types
export interface GenerateGiftResponse {
    data?: GiftGeneration
    error?: string
}

export interface SaveGiftResponse {
    success: boolean
    error?: string
}
