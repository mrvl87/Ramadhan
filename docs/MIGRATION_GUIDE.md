# Running Database Migration

## Step-by-Step Instructions

### Option 1: Supabase Dashboard (Recommended)

**Step 1: Open Supabase SQL Editor**
1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
2. Navigate to: **SQL Editor** (left sidebar)
3. Click: **New Query**

**Step 2: Run Main Migration**
1. Copy entire content of `supabase/migrations/20260127_admin_dashboard_schema.sql`
2. Paste into SQL Editor
3. Click: **Run** (or press Ctrl+Enter)
4. Wait for success message: "✅ Admin Dashboard Schema Migration Completed Successfully!"

**Step 3: Seed Admin User**
1. Open `supabase/migrations/20260127_seed_admin_user.sql`
2. **IMPORTANT**: Replace `YOUR_EMAIL_HERE@example.com` with your actual email
3. Copy and paste into SQL Editor
4. Click: **Run**
5. Verify you see: "✅ Super Admin granted to user: [your-uuid]"

**Step 4: Verify Tables**
Run this query to verify all tables exist:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'admins', 
  'transactions', 
  'generations', 
  'webhook_logs', 
  'analytics_events', 
  'cms_content'
)
ORDER BY table_name;
```

You should see 6 tables returned.

---

### Option 2: Supabase CLI (Advanced)

**Prerequisites:**
```bash
npm install -g supabase
supabase login
```

**Run Migration:**
```bash
cd g:\CODING PROJECT\AppRamadhanAI\Ramadhan
supabase db push
```

**Seed Admin:**
```bash
# Edit seed file first with your email
supabase db execute --file supabase/migrations/20260127_seed_admin_user.sql
```

---

## Verification Checklist

After running migration, verify:

- [ ] All 6 tables created (admins, transactions, generations, webhook_logs, analytics_events, cms_content)
- [ ] Both views created (admin_revenue_summary, admin_user_stats)
- [ ] RLS policies enabled on all tables
- [ ] Helper function `is_admin()` exists
- [ ] Your user is in `admins` table with role 'super_admin'

**Quick Verification Query:**
```sql
-- Check admin status
SELECT * FROM is_admin();  -- Should return TRUE

-- View your admin record
SELECT a.role, u.email, a.granted_at
FROM admins a
JOIN auth.users u ON a.user_id = u.id
WHERE a.user_id = auth.uid();
```

---

## Troubleshooting

**Error: "relation already exists"**
- Some tables may already exist
- Safe to ignore if schema is identical
- Or drop existing tables first (careful!)

**Error: "permission denied"**
- Make sure you're using Service Role Key
- Check RLS policies are correct

**Error: "user not found in seed"**
- Double-check email is correct
- Ensure user exists in `auth.users`
- Run: `SELECT email FROM auth.users LIMIT 10;` to find your email

---

## Next Steps After Migration

1. ✅ Verify migration success
2. ✅ Confirm admin access
3. ⏳ Build admin API endpoints
4. ⏳ Create `/admin/dashboard` UI
5. ⏳ Test permission system
