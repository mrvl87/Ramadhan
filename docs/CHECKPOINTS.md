# CHECKPOINTS

This file tracks major feature milestones for easy reference in future discussions.

---

## 🎯 PRICING_V1 (January 27, 2026)

**Feature**: Credit-Based Pricing System  
**Status**: 🟡 In Planning  
**Version**: 0.6.0

### Quick Summary
Implemented professional `/pricing` page with 3 credit bundles replacing subscription model. Optimized for seasonal Ramadan usage with fair pricing (10x markup, Rp 798-980/credit).

### Key Decisions
- **Pricing Model**: Credit bundles (50/150/500) vs subscriptions
- **Price Points**: Rp 49k / 129k / 399k
- **No Expiry**: Credits never expire (user-friendly for seasonal app)
- **Free Tier**: Increased to 5 credits (was 3)

### Files Changed
- `/pricing/page.tsx` (new)
- `/api/payment/create-checkout/route.ts` (modified)
- `/api/webhooks/xendit/route.ts` (modified)
- `/components/pricing/CreditBundleCard.tsx` (new)
- `PaywallModal.tsx` (updated)

### Documentation
- Spec: `docs/features/006_pricing_page.md`
- Changelog: `docs/changelog.md` (v0.6.0 entry)
- Implementation Plan: Brain artifact `implementation_plan.md`

### Discussion Points
- Should we add a 4th "Mini" tier (20 credits @ Rp 19k)?
- Discount codes / promo campaigns?
- Referral credits system?
- Gift credits feature?

### Revenue Projections
- Conservative (1,000 users): Rp 28M revenue, Rp 24.7M margin (88%)
- Optimistic (5,000 users): Rp 140M revenue, Rp 123.5M margin

### Cost Analysis
| Item | Per Generation |
|------|----------------|
| fal.ai FLUX.1-schnell | Rp 80 |
| Supabase storage | Rp 5 |
| Bandwidth | Rp 10 |
| **Total Cost** | **Rp 95** |
| **Selling Price** | **Rp 798-980** |
| **Markup** | **8-10x** |

---

## 🎨 AI_FAMILY_PHOTO_V2 (January 19, 2026)

**Feature**: Advanced AI Family Photo with Smart Captions  
**Status**: ✅ Completed  
**Version**: 0.5.0

### Quick Summary
Integrated fal.subscribe SDK with aspect ratio selection and auto-generated greetings using Gemini 2.5 Flash.

### Key Features
- Aspect ratio selection (Square/Portrait/Landscape)
- Smart caption generation (6 themes)
- Text positioning in image prompt

### Files Changed
- `/kartu/family/page.tsx`
- `src/features/family-photo/ai-config.ts`
- `src/lib/ai/generate.ts`

### Documentation
- AI Config: `src/features/family-photo/ai-config.ts`
- Changelog: `docs/changelog.md` (v0.5.0)

---

## 💳 XENDIT_PAYMENT_V1 (January 12, 2026)

**Feature**: Xendit Payment Integration  
**Status**: ✅ Completed  
**Version**: 0.4.0

### Quick Summary
Integrated Xendit for payment processing with webhook handler for automatic Pro activation.

### Key Components
- Xendit invoice creation API
- Webhook handler for payment callbacks
- PaywallModal UI component

### Files Changed
- `/api/payment/create-checkout/route.ts`
- `/api/webhooks/xendit/route.ts`
- `src/components/paywall/PaywallModal.tsx`
- `src/lib/payment/xendit.ts`

### Documentation
- Migration: `docs/migrations/005_payment_fields.sql`
- Changelog: `docs/changelog.md` (Layer 1.4)

---

## 🔐 AUTH_SYSTEM_V1 (January 11, 2026)

**Feature**: Complete Authentication System  
**Status**: ✅ Completed  
**Version**: 0.1.0

### Quick Summary
Implemented full auth flow with email/password and Google OAuth using Supabase Auth.

### Key Components
- Login page with dual auth methods
- Auth callback handler
- Session middleware
- RLS policies

### Files Changed
- `/login/page.tsx`
- `/auth/callback/route.ts`
- `src/lib/supabase/server.ts`
- `middleware.ts`

### Documentation
- Setup: `docs/setup.md`
- Troubleshooting: `docs/troubleshooting.md`
- Migrations: `docs/migrations/001_economic_data_model.sql`

---

## How to Use Checkpoints

### Referring Back to a Feature
```
"I want to discuss PRICING_V1 - should we add a referral system?"
```

### Comparing Versions
```
"How does PRICING_V1 differ from XENDIT_PAYMENT_V1?"
```

### Finding Related Files
Each checkpoint lists all modified files, making it easy to locate relevant code.

---

**Next Checkpoint**: Will be created after pricing page implementation is complete (PRICING_V1_IMPLEMENTED)
