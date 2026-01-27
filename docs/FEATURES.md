# Features Guide

RamadanHub AI currently offers three core consumer features designed to enhance the Ramadan experience, plus a professional pricing system.

## 1. AI Family Photo (`/kartu/family`)
Transform your selfies into heartwarming "Eid Mubarak" family portraits.
*   **Input**: Upload a photo of yourself or your family.
*   **Styles**: Choose from "Realistic", "Anime", "Oil Painting", or "3D Cartoon".
*   **Output**: High-quality downloadable image.

## 2. Ramadan Meal Planner (`/menu`)
Reduce decision fatigue with AI-generated Iftar and Sahur menus.
*   **Input**: Number of days, number of people, dietary restrictions (e.g., "No spicy"), and theme ("Budget", "Healthy", "Luxury").
*   **Output**: A detailed 7-day plan including dishes for Sahur and Iftar.

## 3. Eid Gift Assistant (`/gift`)
Find the perfect thoughtful gifts for your friends and family.
*   **Input**: Recipient relationship (e.g., Mother), Age, Budget, and Interests.
*   **Output**: A curated list of 5 unique gift ideas tailored to your input.

## 4. Credit-Based Pricing System (`/pricing`) 🆕
Professional pricing page with flexible credit bundles for seasonal usage.
*   **Model**: Pay-once, use-anytime credit bundles (no subscription)
*   **Tiers**: Starter (50 credits @ Rp 49k), Popular (150 @ Rp 129k), Power (500 @ Rp 399k)
*   **Benefits**: Credits never expire, HD quality, no watermark, commercial use OK
*   **Payment**: Integrated with Xendit for Indonesian market
*   **Free Tier**: 5 free credits for new users to test quality

---

## Monetization

### Credit System
- **1 Credit = 1 AI Generation** (any feature: Family Photo, Greeting Cards, etc.)
- **Free Users**: 5 credits to start
- **Paid Users**: Purchase credit bundles, credits stack and never expire

### Pricing Philosophy
- **Fair Value**: 10x markup on AI costs (~Rp 80/generation), competitive with international tools
- **Seasonal Friendly**: No recurring billing, perfect for Ramadan-only usage
- **Encourages Experimentation**: Abundant credits reduce user anxiety, drive engagement

### Payment Integration
- **Gateway**: Xendit (Indonesia-optimized)
- **Flow**: Select bundle → Xendit invoice → Webhook auto-adds credits
- **Security**: Service role for webhook, RLS policies on database

---

**For detailed specs**: See `docs/features/006_pricing_page.md` (Checkpoint: PRICING_V1)
