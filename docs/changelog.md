# Changelog

## [Unreleased]

### Added
### Added
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
