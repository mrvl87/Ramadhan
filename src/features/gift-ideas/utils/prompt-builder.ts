// AI Prompt builder for gift idea generation

import type { WizardState, RecipientType } from '../types'

export function buildGiftPrompt(data: WizardState): string {
  const recipientContext = getRecipientContext(data.recipient_type)
  const budgetFormatted = `Rp ${data.budget_min.toLocaleString('id-ID')} - Rp ${data.budget_max.toLocaleString('id-ID')}`
  const interestsText = data.interests.length > 0
    ? data.interests.join(', ')
    : 'general interests'

  // Detect conflicting interests
  const hasConflictingInterests = detectConflicts(data.interests)

  return `You are an expert Indonesian gift consultant specializing in Ramadan and Eid gifts.

Context:
- Recipient: ${recipientContext}
- Budget: ${budgetFormatted}
- Interests/Hobbies: ${interestsText}
- Occasion: ${getOccasionText(data.occasion)}
${data.additional_notes ? `- Additional notes: ${data.additional_notes}` : ''}
${hasConflictingInterests ? '\n⚠️ NOTICE: User provided diverse interests. Create a BALANCED selection covering different interests, NOT random items.' : ''}

CRITICAL RULES - MUST FOLLOW:

1. **PHYSICAL PRODUCTS ONLY**
   ✅ YES: Books, clothing, gadgets, home items, food hampers, prayer items
   ❌ NO: Apps, software, subscriptions, digital products, gift cards, vouchers

2. **MUST BE BUYABLE ON INDONESIAN E-COMMERCE**
   - Products MUST exist on Tokopedia, Shopee, Bukalapak, or Lazada
   - Use searchable Indonesian product names
   - Avoid niche/imported items not available in Indonesia

3. **INTEREST ALIGNMENT**
   - Each gift MUST align with AT LEAST ONE specific interest from: ${interestsText}
   - If interests conflict (e.g., gaming + religious), create a BALANCED mix:
     * 2-3 gifts for interest #1
     * 2-3 gifts for interest #2
   - DO NOT mix unrelated interests in a single product
   - State clearly which interest each gift addresses

4. **BUDGET COMPLIANCE**
   - ALL 5 prices MUST be within ${budgetFormatted}
   - Distribute prices across the range (don't cluster)
   - Include both affordable and premium options

5. **CULTURAL APPROPRIATENESS**
   - Halal and Islamic-appropriate only
   - Respect Indonesian gift-giving customs
   - Consider recipient relationship dynamics

Task: Generate EXACTLY 5 thoughtful, PHYSICALLY BUYABLE gift ideas.

For EACH of the 5 gifts, provide:
- **name**: SPECIFIC product name in Indonesian (max 50 characters)
  Example: "Al-Quran Rainbow Tajwid A4" NOT "Premium Quran"
  
- **price**: Realistic price in IDR within budget (no decimals)
  
- **reason**: WHY this gift is perfect (2-3 sentences, max 150 characters)
  - Mention WHICH specific interest it addresses
  - Explain connection to recipient relationship
  - Keep it warm and personal
  
- **where_to_buy**: Array of 2-3 platforms (choose from: Tokopedia, Shopee, Bukalapak, Lazada)
  
- **keywords**: Product search keywords for Indonesian e-commerce (3-5 words, optimized)
  Example: "al quran rainbow tajwid premium" NOT "premium islamic book"

Output Format (STRICT JSON, NO markdown, NO explanations):
{
  "gifts": [
    {
      "name": "Al-Quran Rainbow Tajwid Premium",
      "price": 350000,
      "reason": "Untuk orangtua yang gemar membaca Al-Quran. Dilengkapi tajwid warna yang memudahkan bacaan, cocok untuk bulan Ramadan.",
      "where_to_buy": ["Tokopedia", "Shopee"],
      "keywords": "al quran rainbow tajwid premium"
    }
  ]
}

BAD Examples (DO NOT DO THIS):
❌ "Muslim Pro Premium 1 Year" - Digital subscription, not physical
❌ "Generic Prayer Mat" - Too vague, not searchable
❌ "Gaming Console + Quran Stand" - Mixing unrelated interests
❌ "Imported Luxury Watch" - Not available on Indonesian e-commerce

GOOD Examples (DO THIS):
✅ "Sajadah Sutra Motif Islami Premium" - Physical, specific, searchable
✅ "PlayStation 5 Controller DualSense" - Physical, specific, available
✅ "Buku Resep Masakan Ramadan Nusantara" - Physical, specific, relevant

Cultural Guidelines:
- **Parents**: Respect, usefulness, religious items, health products
- **Spouse**: Balance romantic & practical, quality over quantity
- **Children**: Age-appropriate, educational, fun but meaningful
- **Friends**: Personal but not intimate, shared interests
- **Religious leaders**: Respectful, Islamic items, quality books
- **Ramadan**: Prayer items, religious books, dates, charity-focused
- **Eid**: Festive items, clothing, food hampers, decorations

REMEMBER: Return ONLY valid JSON. Each gift MUST be a real, physical, buyable product on Indonesian e-commerce!`
}

function detectConflicts(interests: string[]): boolean {
  const lowerInterests = interests.map(i => i.toLowerCase())

  const conflictPairs = [
    ['gaming', 'quran'],
    ['gaming', 'religious'],
    ['gaming', 'prayer'],
    ['technology', 'traditional'],
    ['modern', 'traditional']
  ]

  return conflictPairs.some(([a, b]) =>
    lowerInterests.some(i => i.includes(a)) &&
    lowerInterests.some(i => i.includes(b))
  )
}

function getRecipientContext(type: RecipientType): string {
  const contexts: Record<RecipientType, string> = {
    parent: 'Parents (mother or father)',
    spouse: 'Husband or wife (married partner)',
    child: 'Son or daughter',
    sibling: 'Brother or sister',
    friend: 'Close friend or best friend',
    colleague: 'Work colleague or business associate',
    religious_leader: 'Ustadz, religious teacher, or imam'
  }
  return contexts[type]
}

function getOccasionText(occasion: string): string {
  const occasions: Record<string, string> = {
    ramadan: 'Ramadan (fasting month, focus on worship and spirituality)',
    eid: 'Eid al-Fitr (celebration after Ramadan, festive and joyous)',
    both: 'Both Ramadan and Eid (versatile gift for the season)'
  }
  return occasions[occasion] || occasions.ramadan
}
