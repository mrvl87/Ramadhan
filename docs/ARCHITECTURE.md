# RamadanHub AI - Architecture Documentation

## Overview
RamadanHub AI is a modular Next.js application designed to provide AI-powered consumer tools for Ramadan. The architecture emphasizes feature isolation, unified AI pipelines, and strict separation of concerns.

## Directory Structure

```
src/
├── app/                    # Next.js App Router (Routes only)
│   ├── kartu/family/       # Family Photo Route
│   ├── menu/               # Menu Generator Route
│   ├── gift/               # Gift Recommendation Route
│   └── page.tsx            # Landing Page
├── features/               # Feature Modules (Business Logic & UI)
│   ├── family-photo/       # Family Photo Feature
│   ├── ramadan-menu/       # Menu Generator Feature
│   └── gift-recommendation/# Gift Recommendation Feature
├── lib/
│   ├── ai/                 # Unified AI Pipeline
│   │   └── generate.ts     # Single entry point for all generation
│   ├── supabase/           # Database Clients
│   └── fal.ts, openrouter.ts # AI Provider Clients
└── components/             # Shared UI Components
```

## Unified AI Pipeline (`src/lib/ai/generate.ts`)

To avoid scattered logic and duplicated credit checks, all AI generation requests flow through a single function: `generateContent`.

```typescript
export async function generateContent({ featureType, userInput, userId }) {
    // 1. Check & Consume Credits (DB RPC)
    // 2. Dispatch to Provider (Fal.ai or OpenRouter) based on featureType
    // 3. Return Standardized Result
}
```

## Feature Modules

Each feature in `src/features/` follows a consistent pattern:
*   `page.tsx`: The main Client Component (UI).
*   `actions.ts`: Server Actions to bridge UI and AI Pipeline securely.
*   `prompts.ts`: Pure functions to construct prompts from user input.

This structure allows features to be added or removed without affecting the core infrastructure.
