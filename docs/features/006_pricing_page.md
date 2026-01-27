# Feature Spec: Credit-Based Pricing Page

**Checkpoint**: `PRICING_V1`  
**Date**: January 27, 2026  
**Status**: 🟡 In Planning  
**Version**: 0.6.0

---

## Overview

Implement a professional `/pricing` page with a credit-based monetization model optimized for seasonal Ramadan usage. This replaces the initial subscription model with a more user-friendly "pay once, use anytime" approach.

---

## Business Context

### Why Credit-Based?

**Event-Driven Usage Pattern**:
- Users primarily active during Ramadan (30 days/year)
- Subscription anxiety: "I'm paying monthly but only use it once a year"
- Credit bundles: "I buy what I need, use it whenever"

**Market Positioning**:
- Competitive with international AI tools (Midjourney, Leonardo.ai)
- Accessible entry point for Indonesian market
- Encourages experimentation and viral sharing

**Revenue Model**:
- Direct costs: ~Rp 80-95 per generation (fal.ai + Supabase)
- Target markup: 10x (industry standard for SaaS)
- Net margin: 88% at 1,000 users/month
- Scalable: Higher volume = proportional revenue

---

## Pricing Strategy

### Cost Analysis

| Component | Cost per Generation |
|-----------|---------------------|
| fal.ai FLUX.1-schnell (1024x1024) | Rp 80 |
| Supabase Storage (1MB) | Rp 5 |
| Bandwidth | Rp 10 |
| **Total Direct Cost** | **Rp 95** |

### Competitive Benchmarking

| Service | Price | Per Image | Model |
|---------|-------|-----------|-------|
| Midjourney Basic | $10/mo | Rp 800 | Subscription |
| Leonardo.ai | $10/mo | Rp 188 | Subscription |
| Canva AI | Rp 120k/mo | Variable | Subscription |
| **RamadanHub AI** | Pay-per-use | **Rp 798-980** | **Credit Bundles** |

### Pricing Tiers

#### 🌙 Starter Pack
- **Credits**: 50 generations
- **Price**: Rp 49,000
- **Per Credit**: Rp 980
- **Markup**: 10.3x
- **Target User**: Personal use, first-time buyers
- **Marketing**: "Perfect for families - Try premium quality"

#### ⭐ Popular Pack (Highlighted)
- **Credits**: 150 generations
- **Price**: Rp 129,000
- **Original Price**: Rp 147,000 (strike-through)
- **Per Credit**: Rp 860
- **Savings**: 12%
- **Markup**: 9.1x
- **Target User**: Active social media users, extended families
- **Marketing**: "Best Value - Enough for entire Ramadan"
- **Badge**: "🔥 MOST POPULAR" + "💰 SAVE 12%"

#### 💎 Power Pack
- **Credits**: 500 generations
- **Price**: Rp 399,000
- **Original Price**: Rp 490,000 (strike-through)
- **Per Credit**: Rp 798
- **Savings**: 19%
- **Markup**: 8.4x
- **Target User**: Creators, businesses, resellers
- **Marketing**: "For Professionals - Maximum savings"
- **Badge**: "💎 CREATOR TIER" + "💰 SAVE 19%"

### Free Tier
- **Credits**: 5 free generations for new users (increased from 3)
- **Purpose**: Reduce friction, allow quality testing
- **Conversion Trigger**: After 5 uses, prompt upgrade

---

## User Journey

### New User Flow
1. Sign up → Receive 5 free credits
2. Generate 5 cards to test quality
3. Credits depleted → Paywall modal appears
4. View pricing page → Choose bundle
5. Complete payment → Credits added instantly

### Returning User Flow
1. Check credit balance in header
2. Running low → Visit `/pricing` proactively
3. Purchase bundle → Continue creating

### Creator Flow
1. Need bulk credits for business
2. Compare bundles → Power pack best value
3. Purchase 500 credits
4. Use across multiple months/seasons

---

## Technical Implementation

### Route Structure
```
/pricing
  └── page.tsx (Main pricing page)
      ├── PricingHero (Header section)
      ├── CreditBundleCard × 3 (Tier cards)
      ├── FeatureComparison (What's included)
      └── FAQ (Common questions)
```

### Data Flow

**Purchase Flow**:
```
User clicks "Buy Now"
  ↓
POST /api/payment/create-checkout
  body: { bundle: "popular" }
  ↓
Generate Xendit Invoice
  externalId: "CREDITS-POPULAR-{userId}-{timestamp}"
  amount: 129000
  ↓
Return invoice URL
  ↓
Redirect user to Xendit payment page
  ↓
User completes payment
  ↓
Xendit webhook → POST /api/webhooks/xendit
  ↓
Parse bundle from externalId
  ↓
Add credits to user.credits
  (50, 150, or 500 based on bundle)
  ↓
Update payment_status: "paid"
  ↓
User redirected to success page
```

### Database Schema

**users table** (existing, no changes needed):
```sql
credits INTEGER DEFAULT 5  -- Free tier now starts with 5
payment_gateway TEXT
payment_status TEXT
```

**No subscription fields needed**:
- Removed: `plan`, `pro_expires_at`
- Simplified: Credits-only model

### API Changes

#### `/api/payment/create-checkout/route.ts`

**Before**:
```typescript
const PRODUCT_PRICE_IDR = 150000;
const PRODUCT_DESC = "RamadanHub Pro Pass (30 Days)";
```

**After**:
```typescript
const BUNDLES = {
  starter: { credits: 50, price: 49000, desc: "Starter Pack - 50 Credits" },
  popular: { credits: 150, price: 129000, desc: "Popular Pack - 150 Credits" },
  power: { credits: 500, price: 399000, desc: "Power Pack - 500 Credits" }
};

const { bundle = "popular" } = await req.json();
const config = BUNDLES[bundle];
const externalId = `CREDITS-${bundle.toUpperCase()}-${user.id}-${Date.now()}`;
```

#### `/api/webhooks/xendit/route.ts`

**Before**:
```typescript
await supabaseAdmin.from('users').update({
  plan: 'pro',
  pro_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
});
```

**After**:
```typescript
const bundleType = externalId.split("-")[1].toLowerCase();
const BUNDLE_CREDITS = { starter: 50, popular: 150, power: 500 };
const creditsToAdd = BUNDLE_CREDITS[bundleType];

// Get current credits
const { data: user } = await supabaseAdmin
  .from('users')
  .select('credits')
  .eq('id', userId)
  .single();

// Add new credits (stacking model)
const newCredits = (user?.credits || 0) + creditsToAdd;

await supabaseAdmin.from('users').update({
  credits: newCredits,
  payment_status: 'paid'
});
```

---

## UI/UX Specifications

### Design System

**Color Palette**:
- Starter: Blue (#60A5FA) - Approachable, trustworthy
- Popular: Gold Gradient (#FBBF24 → #F59E0B) - Premium, valuable
- Power: Purple Gradient (#A855F7 → #7C3AED) - Elite, professional

**Typography Hierarchy**:
```
Credit Number: text-6xl font-bold tabular-nums
Price: text-4xl font-bold
Original Price: text-xl line-through text-muted-foreground
Savings Badge: text-sm uppercase font-semibold
```

**Component Structure**:
```tsx
<CreditBundleCard
  bundle="popular"
  credits={150}
  price={129000}
  originalPrice={147000}
  savingsPercent={12}
  perCredit={860}
  badge="MOST POPULAR"
  highlighted={true}
  features={[
    "HD Quality (1024x1024)",
    "No Watermark",
    "Commercial Use OK",
    "Credits Never Expire"
  ]}
  onPurchase={handlePurchase}
/>
```

### Responsive Behavior

**Desktop (≥1024px)**:
```
┌─────────────────────────────────────────┐
│         Choose Your Package             │
└─────────────────────────────────────────┘
┌────────┐  ┌─────────────┐  ┌────────┐
│ STARTER│  │ POPULAR ⭐  │  │ POWER  │
│        │  │ BEST VALUE  │  │        │
│ 50     │  │ 150         │  │ 500    │
└────────┘  └─────────────┘  └────────┘
```

**Mobile (<768px)**:
```
┌─────────────────┐
│ POPULAR ⭐      │
│ BEST VALUE      │
│ 150 credits     │
│ Rp 129k         │
│ [Buy Now]       │
└─────────────────┘
┌─────────────────┐
│ STARTER 🌙      │
└─────────────────┘
┌─────────────────┐
│ POWER 💎        │
└─────────────────┘
```

### Animations

**Card Hover**:
```css
transition: transform 0.2s, box-shadow 0.2s;
&:hover {
  transform: scale(1.03);
  box-shadow: 0 20px 40px rgba(0,0,0,0.2);
}
```

**Badge Pulse** (Popular tier):
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
```

**CTA Shimmer**:
```css
background: linear-gradient(90deg, #F59E0B 0%, #FBBF24 50%, #F59E0B 100%);
background-size: 200% 100%;
animation: shimmer 2s infinite;
```

---

## Marketing Copy

### Page Header
```
💳 Simple Pricing, No Surprises
Pay once. Create anytime. Credits never expire.
```

### Tier Descriptions

**Starter**:
```
🌙 Perfect for Personal Use
Try premium AI quality without commitment.
Great for: Making cards for your family
```

**Popular**:
```
⭐ Our Best Seller - Save 12%!
Everything you need for the entire Ramadan month.
Great for: Daily posts & extended family sharing
```

**Power**:
```
💎 For Creators & Businesses
Maximum savings. Professional-grade tool.
Great for: Content creators, design agencies, print shops
```

### Feature Checklist
```
What's Included in Every Package:
✅ HD Quality (1024x1024 resolution)
✅ No Watermark on downloads
✅ Commercial Use Rights
✅ Credits Never Expire
✅ Priority Support
✅ Regular Model Updates
```

---

## Success Metrics

### Conversion Goals
- Free → Paid: **15-20%** (industry average: 2-5%)
- Starter → Popular Upgrade: **30%**
- Direct to Power: **5%** of total purchasers

### Revenue Projections

**Conservative (1,000 monthly users)**:
| Tier | Conversion | Users | Revenue |
|------|------------|-------|---------|
| Free | 70% | 700 | Rp 0 |
| Starter | 20% | 200 | Rp 9.8M |
| Popular | 8% | 80 | Rp 10.3M |
| Power | 2% | 20 | Rp 7.98M |
| **Total** | - | 1,000 | **Rp 28.08M** |

**Net Margin**: Rp 24.71M (88%)

**Optimistic (5,000 users during Ramadan peak)**:
- Total Revenue: **Rp 140.4M**
- Net Margin: **Rp 123.5M**

### Key Performance Indicators
- Average Revenue Per User (ARPU): Rp 28,080
- Customer Acquisition Cost (CAC): Target <Rp 10,000
- Lifetime Value (LTV): Rp 150,000+ (repeat purchases)
- LTV:CAC Ratio: >15:1 (excellent)

---

## Future Enhancements

### Phase 2 (Post-Launch)
- [ ] Gift credits feature (send credits to friends)
- [ ] Bulk discount (10% off for 1000+ credits)
- [ ] Affiliate program (earn credits by referrals)
- [ ] Credit history dashboard
- [ ] Usage analytics (show value created)

### Phase 3 (Seasonal)
- [ ] Limited-time bundles (Eid special: 200 @ Rp 199k)
- [ ] Bundle + Template combos
- [ ] Early bird pricing for next Ramadan

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users don't understand credit model | Low conversion | Clear explainer graphics, FAQ section |
| Price too high vs competitors | Abandoned carts | Highlight unique features (cultural relevance) |
| Payment failure (Xendit issues) | Lost revenue | Fallback manual verification, email receipts |
| Credit abuse (refund fraud) | Financial loss | No-refund policy, usage limits |
| Seasonal demand spike | Server costs spike | Set monthly budget cap on fal.ai |

---

## Testing Plan

### Pre-Launch Checklist
- [ ] Xendit test mode payment (all 3 bundles)
- [ ] Webhook credit addition (verify correct amounts)
- [ ] Credit stacking (buy multiple bundles)
- [ ] Mobile responsive layout
- [ ] Loading states and error handling
- [ ] Analytics tracking (Google Analytics events)

### User Acceptance Testing
1. **New User**: Sign up → Use 5 free → Buy Starter → Generate
2. **Existing User**: Log in → Buy Popular → Credits stack correctly
3. **Edge Case**: Abandoned payment → No credits added
4. **Idempotency**: Webhook fires twice → Credits added once

---

## Dependencies

### External Services
- ✅ Xendit API (payment gateway)
- ✅ fal.ai FLUX.1-schnell (image generation)
- ✅ Supabase (database, storage)

### Internal Components
- ✅ `createClient()` from `@/lib/supabase/server`
- ✅ `createXenditInvoice()` from `@/lib/payment/xendit`
- ⚠️ New: `CreditBundleCard` component
- ⚠️ Update: `PaywallModal` for bundle selection

---

## Decision Log

### Why These Exact Credit Amounts?

**Starter (50)**:
- User psychology: 50 > 10 = "abundance mindset"
- Enough to experiment without anxiety
- Low commitment (Rp 49k = 2 meals)

**Popular (150)**:
- 30 days Ramadan × 3-5 cards/day = ~150
- Sweet spot: Not too little, not overwhelming
- Discount incentive (12% vs Starter)

**Power (500)**:
- Professional tier, targets B2B
- Year-round supply for businesses
- Maximum discount (19%) drives this choice

### Why 10x Markup?

- Industry standard: 10-20x for SaaS tools
- Lower than initial 104x (too greedy)
- Higher than 5x (unsustainable growth)
- Allows marketing budget, customer support

### Why No Expiry?

- Seasonal app: Users return annually
- No churn: Credits wait for next Ramadan
- Trust building: "We respect your purchase"
- Competitive advantage vs subscriptions

---

## Approval Gates

Before implementation begins, confirm:

- [x] Pricing amounts (Rp 49k / 129k / 399k)
- [x] Credit quantities (50 / 150 / 500)
- [x] No expiry policy
- [ ] UI/UX mockup approved
- [ ] Marketing copy approved
- [ ] Legal: Terms of Service updated
- [ ] Finance: Revenue recognition model

---

**Last Updated**: January 27, 2026  
**Next Review**: After first 100 transactions  
**Owner**: Product Team  
**Stakeholders**: Engineering, Marketing, Finance
