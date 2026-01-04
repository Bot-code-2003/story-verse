# 🔄 Multi-API-Key Failover System

## What This Does

Your app now automatically switches between multiple ImgBB API keys when one hits rate limits. Upload failures become a thing of the past! 🚀

## How It Works

1. **Primary Key** → Uses your first API key
2. **500 Error?** → Instantly switches to the next key
3. **Keeps Trying** → Cycles through all your keys until one works
4. **Smart Cooldown** → Failed keys get a 5-minute break before retry

## Adding More API Keys

### Step 1: Create New ImgBB Account
1. Go to https://imgbb.com/signup
2. Sign up with a new email (Gmail, Outlook, etc.)
3. Verify your email

### Step 2: Get API Key
1. Go to https://api.imgbb.com/
2. Click "Get API Key"
3. Copy the key (it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 3: Add to Configuration
Open `src/config/imgbb-keys.js` and add your new key:

```javascript
export const IMGBB_API_KEYS = [
  "c2070ac8eb35bc11bb30f027c52f7f28", // Primary key
  "YOUR_NEW_KEY_HERE",                 // ← Add here
  "ANOTHER_KEY_IF_YOU_HAVE_MORE",      // ← Add more
];
```

**That's it!** The system automatically uses all configured keys.

## Tips

- **Recommended:** Have 3-5 keys for best reliability
- **Free accounts:** Each gives you ~5000 uploads/month (undocumented)
- **Pro tip:** Use different email providers (Gmail, Outlook, ProtonMail, etc.)
- **Watch the logs:** You'll see which key is being used in the console

## What You'll See

When rate limits hit:
```
🔄 Key 1/3 failed (500), trying next...
✅ Upload successful with key #2
```

## Migration Path

When you're ready to move to a proper solution (Cloudinary, etc.):
- All your images are already URLs (not base64)
- Easy to migrate: just update the upload endpoint
- No database changes needed

---

**Remember:** This is a scrappy solution. Monitor your usage and migrate before you scale big! 💪
