# Changelog

## [Unreleased]

### Added
- **v0.7.0 (Jan 27, 2026) - Admin Dashboard Phase 1** 🎯 **CHECKPOINT: ADMIN_DASHBOARD_V1**
    - **Feature**: Admin dashboard with authentication, metrics API, and UI
        - **Database Schema**:
            - New `admins` table for role-based access control (super_admin, admin, moderator)
            - New `transactions` table for payment logs and revenue tracking
            - New `generations` table for AI activity monitoring
            - New `webhook_logs` table for payment gateway debugging
            - New `analytics_events` table for user behavior tracking
            - New `cms_content` table for future CMS integration
            - Created analytics views: `admin_revenue_summary`, `admin_user_stats`
        - **Authentication System**:
            - Created `lib/admin/auth.ts` with `isAdmin()`, `requireAdmin()`, `getAdminRole()` utilities
            - Uses service role client to bypass RLS and avoid infinite recursion
            - Admin middleware protects `/admin/*` routes
        - **API Endpoints**:
            - `GET /api/admin/stats` - Returns 6 key metrics:
                - Total revenue (today + all-time)
                - Total users (active last 30 days, registered today)
                - Credits sold vs used
                - AI generations count
                - Average transaction value
                - Conversion rate
        - **Dashboard UI**:
            - Created `/admin/dashboard` page with metric cards
            - Sidebar navigation: Dashboard, Users, Transactions, Generations, Settings
            - Loading states and error handling with retry
            - Dark mode support, responsive layout
        - **Navbar Integration**:
            - Added admin dashboard link to profile dropdown (desktop + mobile)
            - Purple gradient background with "ADMIN" badge
            - Checks `admins` table on component mount
        - **RLS Fix**:
            - Disabled RLS on `admins` table to resolve infinite recursion issue
            - Service role client bypasses RLS for admin queries
            - Safe: no sensitive data in admins table (only user_id → role mapping)
    - **Documentation**:
        - Added `docs/MIGRATION_GUIDE.md` for database setup
        - Added `docs/TROUBLESHOOTING_ADMIN.md` for debugging
        - Added `docs/GET_SERVICE_ROLE_KEY.md` for environment setup
    - **Testing**: Admin authentication, metrics accuracy, navbar integration verified
    - **Next Phase**: User management table, transaction log viewer, revenue charts

- **v0.6.0 (Jan 27, 2026) - Credit-Based Pricing System** 🎯 **CHECKPOINT: PRICING_V1**
    - **Feature**: New `/pricing` route with professional pricing page
        - **Pricing Model**: Shifted from subscription to credit-based bundles for seasonal usage
        - **Three Tiers**:
            - 🌙 **Starter Pack**: 50 credits @ Rp 49,000 (Rp 980/credit)
            - ⭐ **Popular Pack** (BEST VALUE): 150 credits @ Rp 129,000 (Rp 860/credit, Save 12%)
            - 💎 **Power Pack**: 500 credits @ Rp 399,000 (Rp 798/credit, Save 19%)
        - **Free Tier**: Increased from 3 to 5 free credits for new users
        - **No Expiry**: Credits never expire, users can use them across multiple Ramadan seasons
    - **Payment Integration Updates**:
        - Modified `/api/payment/create-checkout/route.ts` to accept `bundle` parameter
        - Dynamic pricing based on selected bundle (starter/popular/power)
        - Updated `external_id` format: `CREDITS-{BUNDLE}-{userId}-{timestamp}`
    - **Webhook Handler Updates**:
        - Modified `/api/webhooks/xendit/route.ts` to parse bundle type from external_id
        - Implements credit addition instead of subscription activation
        - Stacks credits on top of existing balance (additive model)
    - **Components**:
        - New `CreditBundleCard.tsx` component for individual pricing tiers
        - Updated `PaywallModal.tsx` to support bundle selection
    - **Marketing Strategy**:
        - Aggressive pricing positioning (10x markup vs 104x in initial proposal)
        - Encourages experimentation and viral sharing
        - Competitive with international services (Midjourney, Leonardo.ai)
        - 88% net margin at 1,000 users/month
    - **Design Decisions**:
        - Cost structure analysis: fal.ai FLUX.1-schnell ~Rp 80/generation
        - Target markup: 10x (industry standard for SaaS tools)
        - Entry barrier lowered from Rp 99k to Rp 49k (50% reduction)
        - Credits per tier increased 400-500% compared to initial proposal
    - **Documentation**: 
        - Added `docs/features/006_pricing_page.md` for detailed specification
        - Updated `implementation_plan.md` with cost analysis and revenue projections

- **v0.5.0 (Jan 19) - AI Family Photo & Greeting Engine Update**
    - **Feature**: Advanced AI Family Photo (`/kartu/family`).
        - **AI Engine**: Integrated `fal.subscribe` SDK for robust generation.
        - **Aspect Ratio**: Added UI to select Square, Portrait, or Landscape.
        - **Smart Caption**: 
            - Integrated `google/gemini-2.5-flash` via Fal.ai Proxy.
            - Auto-generates greetings randomly from 6 themes (e.g., "Kemenangan", "Kehangatan").
            - **Text Positioning**: Injected into image prompt as "Include text '...' written elegantly at the bottom".
    - **Configuration**:
        - Created `src/features/family-photo/ai-config.ts` to separate Prompt Logic & Model ID.
    - **Prompt Engineering**:
        - Refined Greeting Prompt: "Warm, Casual, & Natural" tone (10-15 words).
        - Added strict constraints (No fillers, no quotes).
    
### Changed
- **Product Refocus**: Shifted main branch strategy back to consumer roots (Family, Menu, Gift).
- **Architecture**: Refactored into modular `src/features/` directory structure.
- **Removed Features**: Moved Political/Election features to `refactor/political-ui-v2` branch.
- **Pricing Strategy**: Eliminated subscription model in favor of credit bundles (better for seasonal apps)
- **Button Visibility Fix**: Changed "Start Creating" button text color from `text-primary-foreground` to `text-accent-foreground` for better contrast

### Added
- **Unified AI Pipeline**: `src/lib/ai/generate.ts` centralizes all AI calls and credit consumption.
- **Feature: AI Family Photo**: New simplified flow for Eid portraits (`/kartu/family`).
- **Feature: Ramadan Meal Planner**: New LLM-powered menu generator (`/menu`).
- **Feature: Gift Assistant**: New LLM-powered gift recommender (`/gift`).
- **Documentation**: Added `ARCHITECTURE.md`, `FEATURES.md`, `ROADMAP.md`.

### Added (Previous)
- **Layer 2.P.4: Image Intelligence & Secure Upload** [NEW]
  - **Real Photo Upload**: Replaced URL input with secure `ImageUploader` (Supabase Storage).
  - **Gender Detection**: Integrated `fal-ai/moondream3-preview` to detect gender from uploaded photos.
  - **Smart Asset Filtering**: Automatically filters costumes based on detected gender.
  - **Manual Override**: Added UI to manually correct gender selection.
- **Layer 2.P.3: Political Card UI**
  - **Nano Banana Pro**: Integrated `fal-ai/nano-banana-pro/edit` for high-quality template generation.
  - **Builder UI**: Multi-step wizard (`/kartu/political`) for Party/Costume selection.
  - **Premium Gating**: "Lock" overlays for Pro assets, triggering `PaywallModal`.
  - **Template Data**: SQL migrations for Parties, Costumes (Male/Female), and Attributes.
- **Fal.ai Pipeline**: Implemented `src/lib/fal.ts` for AI image generation and `src/app/api/ai/generate-card` endpoint.
- **Supabase Storage**: Configured `cards` bucket with `docs/migrations/003_storage_setup.sql`.
- **Layer 1.4: Payment System (Xendit)**
  - Implemented Xendit integration for "Ramadan Pro Pass" (~$9.99).
  - Created `create-checkout` API to generate Xendit Invoices.
  - Added `PaywallModal` integration to trigger payment flow.
  - Added database migration `005_payment_fields.sql` for payment tracking.
  - Added webhook handlers for Xendit callbacks (auto-activation of Pro).
- **Layer 2.5: Theme Selection UI**
  - Created `/kartu` as the main generation interface.
  - Implemented `ThemeSelector` and `ThemeCard` components.
  - Added support for 4 Card Types (Typography, Family, Cartoon, Quote) and 4 Themes.
  - Integrated Paywall trigger when user has 0 credits.
- **Layer 1.3.4: UI Paywall**
  - `PaywallModal` component with `UpgradeCard`.
  - `usePaywall` hook for intercepting API limits.
- **Layer 1.3.3: Feature Gatekeeper**
  - server-side `requireEntitlement` logic.
- **Layer 1.3.2: Credit Consumption Engine**
  - `consume_credits` RPC function.
- **Layer 1.3.1: Economic Data Model**
  - `credits`, `is_pro`, `pro_expires_at` columns in `users`.
  - `docs/migrations/001_economic_data_model.sql`. database function for managing Free/Pro states.
- **Login Page**: Implemented `src/app/login/page.tsx` with email/password and Google OAuth support.
- **Supabase Client**: Configured `src/lib/supabase.ts` for client-side authentication and `@supabase/ssr` for server-side.
- **Auth Routes**: Added `auth/callback` for OAuth and `auth/signout` for logging out.
- **Middleware**: Added `middleware.ts` for session management.
- **Error Handling**: Added `src/app/auth/auth-code-error/page.tsx` for graceful auth failure display.
- **Database Scripts**: Added `docs/fix_database.sql` and `docs/check_triggers.sql` for troubleshooting.
- **UI Components**: Added `Label`, `Input`, and `Card` components from shadcn/ui.
- **Environment Configuration**: Fixed `supabaseKey` and `supabaseUrl` errors by ensuring `.env.local` is correctly populated.

### Fixed
- **Database Triggers**: Resolved "Database error saving new user" by providing a SQL script to clean up triggers and ensure `public.users` table exists.
- **RLS Policies**: Implemented Row Level Security to protect user data.
- **Env Var Crash**: Added fallback handling (temporarily) and then fixed the root cause by applying correct credentials to `.env.local`.
- **Import Errors**: Resolved missing module errors for UI components.
- **CSS Parsing Error**: Resolved "Parsing CSS source code failed" error caused by invalid Tailwind class (`.[-:|]`) by cleaning up page.tsx

---

## Checkpoints Reference

Use these checkpoint markers to easily navigate feature discussions:

- **CHECKPOINT: PRICING_V1** (Jan 27, 2026) - Credit-based pricing system implementation
  - Location: This changelog, `docs/features/006_pricing_page.md`
  - Related files: `/pricing/page.tsx`, payment API, webhook handler
  - Discussion points: Pricing strategy, bundle configuration, credit mechanics
