# Troubleshooting Webhook Issues

## Problem: Payment Success but Credits Not Added

### Root Cause Analysis

**Symptoms:**
- Payment completed successfully in Xendit
- User redirected back to app
- BUT: Credits not added to user account

**Most Likely Causes:**

1. **Xendit Test Mode Doesn't Trigger Webhooks** ⚠️
   - In test/sandbox mode, Xendit may not automatically fire webhooks
   - You need to manually trigger webhook from Xendit Dashboard
   
2. **Webhook URL Not Configured** 
   - Webhook endpoint not registered in Xendit settings
   - Xendit doesn't know where to send the callback

3. **Localhost Not Accessible**
   - Xendit cannot reach `http://localhost:3000` from internet
   - Need ngrok or deployed server for webhooks

---

## Solutions

### Solution 1: Manual Webhook Testing (Immediate Fix)

**Step 1: Get Your User ID**
```sql
-- Run this in Supabase SQL Editor
SELECT id, email, credits FROM auth.users WHERE email = 'your@email.com';
```

**Step 2: Update Test Script**
Edit `test-webhook.js`:
```javascript
external_id: "CREDITS-POPULAR-{YOUR-UUID-HERE}-1738032000000"
```
Replace `{YOUR-UUID-HERE}` with the UUID from Step 1.

**Step 3: Run Test**
```bash
node test-webhook.js
```

**Step 4: Verify Credits**
```sql
SELECT id, email, credits FROM auth.users WHERE email = 'your@email.com';
```
Credits should have increased by 150 (Popular bundle).

---

### Solution 2: Configure Ngrok for Local Webhooks

**Step 1: Install ngrok**
```bash
# Download from https://ngrok.com
# Or via npm:
npm install -g ngrok
```

**Step 2: Start ngrok tunnel**
```bash
ngrok http 3000
```

This will give you a public URL like: `https://abc123.ngrok.io`

**Step 3: Configure Xendit Webhook**
1. Go to Xendit Dashboard → Settings → Webhooks
2. Add webhook URL: `https://abc123.ngrok.io/api/webhooks/xendit`
3. Select event: "Invoice Paid"
4. Save

**Step 4: Test Payment Again**
- Make a new test payment
- Webhook should fire automatically to ngrok URL
- ngrok forwards to your localhost:3000

---

### Solution 3: Deploy to Production

**For Real Testing:**
1. Deploy to Vercel/Railway/Render
2. Configure webhook URL with production domain
3. Test with real/test payment

**Example:**
```
Production URL: https://your-app.vercel.app
Webhook URL: https://your-app.vercel.app/api/webhooks/xendit
```

---

## Verification Checklist

After implementing fix, verify:

- [ ] Webhook endpoint returns 200 OK
- [ ] User credits increased by correct amount (50/150/500)
- [ ] `payment_status` changed to "paid"
- [ ] `payment_gateway` set to "xendit"
- [ ] Console logs show: "Added X credits to user Y"

---

## Debug Commands

**Check if webhook endpoint works:**
```bash
curl -X POST http://localhost:3000/api/webhooks/xendit \
  -H "Content-Type: application/json" \
  -H "x-callback-token: test" \
  -d '{"status":"PAID","external_id":"CREDITS-POPULAR-test-uuid-123","amount":129000}'
```

**Check current user credits:**
```sql
SELECT 
  id, 
  email, 
  credits, 
  payment_status, 
  payment_gateway 
FROM auth.users 
WHERE email = 'your@email.com';
```

**View recent webhook logs (if logging enabled):**
```sql
-- If you have a webhook_logs table
SELECT * FROM webhook_logs ORDER BY created_at DESC LIMIT 10;
```

---

## Next Steps

1. **For immediate testing**: Use manual test script (`test-webhook.js`)
2. **For automated testing**: Set up ngrok + configure Xendit dashboard
3. **For production**: Deploy app and use production webhook URL

**Current Status**: Webhook handler code is correct, just needs external trigger mechanism.
