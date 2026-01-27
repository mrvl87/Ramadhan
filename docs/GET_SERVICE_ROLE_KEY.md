# How to Get Your Supabase Service Role Key

## Step-by-Step Instructions

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard/project/hdfpxrbiofptltzsdlui

### 2. Navigate to Settings
- Click **Settings** (gear icon) in left sidebar
- Click **API** tab

### 3. Find Service Role Key
Look for section: **Project API keys**

You'll see two keys:
- ✅ `anon` `public` - Already in your `.env.local` (NEXT_PUBLIC_SUPABASE_ANON_KEY)
- ✅ `service_role` `secret` - **This is what you need!**

### 4. Copy Service Role Key
- Click **Reveal** button next to `service_role`
- Copy the long key that starts with `eyJhbGc...`
- **WARNING**: This key has FULL database access - keep it secret!

### 5. Add to .env.local
Replace `YOUR_SERVICE_ROLE_KEY_HERE` in `.env.local` with the actual key:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```

### 6. Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 7. Test Admin Dashboard
Visit: `http://localhost:3000/admin/dashboard`

You should see metrics! 🎉

---

## Security Notes

⚠️ **NEVER commit `.env.local` to git!**  
⚠️ Service Role Key bypasses ALL security rules  
⚠️ Only use on server-side (API routes, server components)  
✅ Already in `.gitignore` - safe

---

## Quick Verification

After adding the key, check terminal logs when visiting `/admin/dashboard`:

```
[ADMIN DEBUG] User check: { userId: '...', email: 'official.glenlatuni@gmail.com' }
[ADMIN DEBUG] Admin table query: { adminData: { role: 'super_admin', ... }, error: null }
[ADMIN DEBUG] ✅ Admin access granted: super_admin
```

No more errors! 🚀
