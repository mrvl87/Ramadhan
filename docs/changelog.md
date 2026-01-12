# Changelog

## [Unreleased]

### Added
- **Credit Consumption Engine**: Added `public.usage_log` table and `consume_credit` database function for transactional credit deduction and auditing.
- **Economic Data Model**: Added `pro_expires_at` to `public.users` and `get_user_entitlement` database function for managing Free/Pro states.
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
