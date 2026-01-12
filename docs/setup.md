# Project Setup Guide

## Environment Variables
This project uses Supabase for backend services. You need to configure the following environment variables in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

**Note**: Use the `anon` / `public` key from your Supabase dashboard. Do not use the `service_role` key on the client side.

## Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

## UI Components
This project uses [shadcn/ui](https://ui.shadcn.com/).
To add new components:
```bash
npx shadcn@latest add [component-name]
```
Currently installed:
- Button
- Input
- Label
- Card
