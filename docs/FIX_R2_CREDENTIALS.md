# 🚨 R2 Credentials Issue - Action Required

## Problem Confirmed

Your R2 API credentials are **INVALID or EXPIRED**. Test results:

```
❌ Failed to list buckets: Unauthorized
Error code: Unauthorized
```

## Root Cause

The credentials in `.env.local` were either:
1. **Never valid** (test/placeholder credentials)
2. **Expired** (R2 API tokens can expire)
3. **Wrong permissions** (missing "Object Read & Write" access)

## ✅ Solution: Regenerate R2 API Token

Follow these steps to create new, valid R2 credentials:

### Step 1: Go to Cloudflare Dashboard

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **R2** in the left sidebar
3. Click **Manage R2 API Tokens**

### Step 2: Create New API Token

1. Click **"Create API Token"**
2. Give it a name: `storybits-upload-token`
3. **Set Permissions:**
   - Choose **"Admin Read & Write"** (recommended)
   - OR **"Object Read and Write"** scoped to the `storybits` bucket
4. (Optional) Add IP restrictions if needed
5. Click **"Create API Token"**

### Step 3: Copy the Credentials

⚠️ **IMPORTANT:** The Secret Access Key is shown ONLY ONCE!

You'll see:
```
Access Key ID: abc123...
Secret Access Key: xyz789...  ← Copy this immediately!
```

### Step 4: Update .env.local

Replace the credentials in `d:\short_fiction\.env.local`:

```env
# Cloudflare R2 Configuration
R2_ACCOUNT_ID=ff7c54b4bc221a31d4c911fbd4f5f0cb  # Keep this (Account ID doesn't change)
R2_ACCESS_KEY_ID=<NEW_ACCESS_KEY_ID>            # Replace with new value
R2_SECRET_ACCESS_KEY=<NEW_SECRET_ACCESS_KEY>    # Replace with new value
R2_BUCKET_NAME=storybits
R2_PUBLIC_URL=https://pub-4a701d352c1f488cbbf56c773984ae36.r2.dev
```

### Step 5: Test the New Credentials

```bash
# Restart your dev server
# Press Ctrl+C to stop, then:
npm run dev

# In another terminal, run the test:
node test-r2-auth.js
```

You should see:
```
✅ Success! Found buckets: storybits
✅ Upload successful!
🎉 All tests passed! R2 credentials are working correctly.
```

---

## Quick Reference

| What You Need | Where to Find It |
|--------------|------------------|
| Account ID | Cloudflare Dashboard → R2 → Overview |
| Access Key & Secret | Create new API token (see above) |
| Bucket Name | `storybits` (already created) |
| Public URL | R2 bucket settings → Public URL |

---

## After Fixing

Once you've updated `.env.local` with the new credentials:

1. **Restart dev server** (Ctrl+C, then `npm run dev`)
2. **Test upload** - Try uploading an image in your app
3. You should see: `✅ R2 Upload: story-xxx.webp`
4. **Delete test script** (optional): `rm test-r2-auth.js`

---

## Why This Happened

The credentials in your codebase were likely:
- **Placeholder values** from initial setup documentation
- **Expired tokens** from an old R2 setup
- **Insufficient permissions** (missing write access to the bucket)

R2 API tokens can be revoked or expire, which is why they should always be stored in environment variables (not committed to git) ✅
