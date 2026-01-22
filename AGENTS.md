# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in this Ramadhan AI Hub repository.

## Project Overview

This is a Next.js 16 application with TypeScript that provides AI-powered features for Ramadan, including:
- Family photo generation with AI
- Ramadan menu recommendations  
- Gift suggestions
- Credit-based billing system
- Supabase backend integration

## Development Commands

### Core Commands
```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Testing
No test framework is currently configured. When adding tests, check for existing test patterns or ask the user for preferred testing setup.

## Code Style Guidelines

### TypeScript Configuration
- Strict mode is **disabled** (`"strict": false` in tsconfig.json)
- Target: ES2017
- Path aliases: `@/*` maps to `./src/*`
- Use JSX transform for React components

### Import Organization
```typescript
// 1. React/Next.js imports
import { useState, useEffect } from 'react';
import Image from 'next/image';

// 2. Third-party libraries
import { toast } from 'sonner';
import { createBrowserClient } from '@supabase/ssr';

// 3. Internal imports (use @ alias)
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
```

### Component Structure
- Use functional components with React hooks
- Export components as default: `export default function ComponentName()`
- Use `'use client';` directive for client components
- Server components should not use the client directive

### UI Components (shadcn/ui)
- Use shadcn/ui components from `@/components/ui/`
- Follow the established patterns (see button.tsx for reference)
- Use `cn()` utility for conditional classes
- Components use class-variance-authority (CVA) for variants

### Styling
- Use Tailwind CSS v4 with inline theme configuration
- CSS variables are defined in `globals.css` for theming
- Dark mode support with custom variant: `@custom-variant dark (&:is(.dark *));`
- Use semantic color tokens: `bg-primary`, `text-foreground`, etc.

### File Naming
- Components: PascalCase (e.g., `FamilyPhotoPage.tsx`)
- Utilities/lib: camelCase (e.g., `generateContent.ts`)
- Pages: `page.tsx` (Next.js App Router)
- Actions: `actions.ts` for server actions

### Error Handling
- Use try-catch blocks for async operations
- Throw descriptive errors for credit/system failures
- Use toast notifications for user feedback: `toast.error('message')`
- Server functions should return NextResponse with appropriate status

### Database/Supabase
- Client: `@/lib/supabase/client.ts` for browser operations
- Server: `@/lib/supabase/server.ts` for server operations
- Use RPC functions for complex operations (e.g., `consume_credit`)
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### AI Integration
- FAL AI for image generation: `@/lib/fal.ts`
- OpenRouter for text generation: `@/lib/openrouter.ts`
- Unified generation flow: `@/lib/ai/generate.ts`
- Feature types: `'family-photo' | 'ramadan-menu' | 'gift-recommendation'`

### State Management
- Use React hooks for local state
- Server actions for data mutations
- Credit consumption handled server-side via RPC

### Payment Integration
- Lemon Squeezy: `@/lib/payment/lemonsqueezy.ts`
- Xendit: `@/lib/payment/xendit.ts`
- Paywall components in `@/components/paywall/`

## Architecture Patterns

### Feature Organization
Features are organized in `src/features/[feature-name]/`:
```
src/features/family-photo/
├── page.tsx              # Main feature page
├── actions.ts            # Server actions
├── prompts.ts            # AI prompts
├── types.ts              # Feature-specific types
└── components/           # Feature components
```

### Component Patterns
- Use composition over inheritance
- Forward refs when needed for UI library integration
- Use data attributes for testing: `data-slot="button"`

### Type Safety
- Define interfaces for API responses and options
- Use generic types where appropriate
- Export types from feature files: `export type FeatureType = '...'`

## Environment Setup

### Required Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
# Additional AI service keys as needed
```

### Image Configuration
Next.js is configured to allow images from:
- Supabase storage: `hdfpxrbiofptltzsdlui.supabase.co`
- FAL AI: `v3b.fal.media`

## Linting

Uses ESLint with Next.js configuration:
- Core Web Vitals rules
- TypeScript rules
- Custom ignores for build artifacts

Run `npm run lint` before committing changes.

## Notes for Agents

1. **No tests currently exist** - When adding test coverage, ask for preferred framework
2. **TypeScript strict mode is disabled** - Be mindful but don't assume strict typing
3. **Credit system is critical** - Always validate credit consumption in AI features
4. **Use existing patterns** - Follow established component and utility patterns
5. **Environment variables** - Never commit secrets, use proper env var naming