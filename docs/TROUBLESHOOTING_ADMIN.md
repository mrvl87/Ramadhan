# Admin Dashboard Troubleshooting

## Error: "Unauthorized: Admin access required"

### Possible Causes

1. **Not logged in** - User must be authenticated
2. **Migration not run** - `admins` table doesn't exist
3. **User not seeded** - User not in `admins` table
4. **RLS blocking access** - Row Level Security misconfigured

---

## Step-by-Step Fix

### Step 1: Verify You're Logged In

Check browser console or try:
```typescript
// In browser console
fetch('/api/auth/session').then(r => r.json())
```

If not logged in:
- Go to `http://localhost:3000/login`
- Login with: `official.glenlatuni@gmail.com`

---

### Step 2: Verify Migration Ran

Open Supabase SQL Editor and run:

```sql
-- Check if admins table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'admins';
```

**Expected**: Should return 1 row with `admins`

**If empty**: Migration didn't run
- Go back and run: `supabase/migrations/20260127_admin_dashboard_schema.sql`

---

### Step 3: Check If You're in Admins Table

```sql
-- Find your user
SELECT id, email FROM auth.users 
WHERE email = 'official.glenlatuni@gmail.com';

-- Check if in admins table (replace with your ID)
SELECT * FROM admins WHERE user_id = 'your-user-id-here';
```

**Expected**: Should return 1 row with role = 'super_admin'

**If empty**: Run seed script again

---

### Step 4: Manual Admin Grant (Quick Fix)

If all else fails, manually grant admin access:

```sql
-- Step 1: Get your user ID
SELECT id FROM auth.users 
WHERE email = 'official.glenlatuni@gmail.com';

-- Step 2: Insert admin record (replace UUID)
INSERT INTO admins (user_id, role, permissions)
VALUES (
  'YOUR-USER-UUID-HERE',
  'super_admin',
  '["*"]'::jsonb
)
ON CONFLICT (user_id) DO UPDATE
SET role = 'super_admin', revoked_at = NULL;
```

---

### Step 5: Verify Admin Function Works

```sql
-- Test is_admin() function
SELECT is_admin();
```

**Expected**: Should return `true`

**If false**: 
- Check you're running query as the correct user
- Verify RLS policies are correct

---

## Debug Logs

The admin auth utility now includes debug logs. Check your terminal/console for:

```
[DEBUG] Admin check - User: [uuid] [email]
[DEBUG] Admin query result: { adminData: {...}, error: null }
[DEBUG] Admin access granted: super_admin
```

Look for errors like:
- `[DEBUG] No user logged in` → Need to login
- `[DEBUG] User not in admins table` → Need to seed
- `[DEBUG] Admin check error: { code: '42P01' }` → Table doesn't exist

---

## Still Not Working?

1. **Restart dev server**: `npm run dev`
2. **Clear browser cookies**: Logout and login again
3. **Check Supabase service role key**: Verify env vars
4. **Verify RLS policies**: May need to temporarily disable for testing

---

## Quick Verification Script

Run this in Supabase SQL Editor:

```sql
-- Complete verification
DO $$
DECLARE
  user_count INT;
  admin_count INT;
BEGIN
  -- Check tables exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'admins') THEN
    RAISE EXCEPTION 'admins table does not exist - run migration first';
  END IF;

  -- Count users
  SELECT COUNT(*) INTO user_count FROM auth.users;
  SELECT COUNT(*) INTO admin_count FROM admins WHERE revoked_at IS NULL;

  RAISE NOTICE 'Total users: %, Total admins: %', user_count, admin_count;

  -- List admins
  FOR r IN (
    SELECT a.role, u.email 
    FROM admins a 
    JOIN auth.users u ON a.user_id = u.id 
    WHERE a.revoked_at IS NULL
  ) LOOP
    RAISE NOTICE 'Admin: % - %', r.email, r.role;
  END LOOP;

  IF admin_count = 0 THEN
    RAISE WARNING 'No admins found! Run seed script.';
  END IF;
END $$;
```
