# Troubleshooting Guide

## Supabase Errors

### "Database error saving new user"
**Symptoms:**
- Login fails.
- You are redirected to `/auth/auth-code-error`.
- Error message says `Database error saving new user`.

**Cause:**
This error almost always comes from a **Database Trigger** on the `auth.users` table that is failing.
Commonly, you might have a trigger setup to copy new users to a `public.profiles` or `public.users` table, but:
1. The target table (`public.profiles`) does not exist.
2. The columns in the target table do not match what the trigger is trying to insert.
3. RLS (Row Level Security) policies are preventing the insert.

**Solution:**
1. **Check Triggers**:
   - Go to [Supabase Dashboard](https://supabase.com/dashboard).
   - Navigate to **Database** -> **Triggers**.
   - Look for any trigger on the `users` table (schema `auth`).
   - Common names: `on_auth_user_created`, `handle_new_user`.

2. **Fix the Trigger Function**:
   - Go to **Database** -> **Functions**.
   - Find the function called by the trigger.
   - Check the code. Does it insert into a table?
   - **SQL Check**: Run this in the SQL Editor to create the missing table (example):
     ```sql
     -- Example: if your trigger inserts into public.users
     create table public.users (
       id uuid references auth.users not null primary key,
       email text,
       full_name text,
       avatar_url text
     );
     
     -- Enable RLS
     alter table public.users enable row level security;
     ```

3. **Disable the Trigger (Temporary)**:
   - If you can't fix it right away, delete or disable the trigger in the dashboard to allow logins to work.
