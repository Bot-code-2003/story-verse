# 🚀 Cloudflare R2 Setup Guide

## What This Is

You're now using **Cloudflare R2** for all new image uploads with strict **80% usage limits** to avoid any charges.

## Key Features

✅ **80% Hard Limit** - Never exceeds free tier  
✅ **Automatic Fallback** - Uses ImgBB if R2 limit hit  
✅ **Usage Tracking** - Built-in monitoring  
✅ **Old Images Safe** - Past ImgBB images untouched  
✅ **Unlimited Bandwidth** - R2's killer feature  

---

## Credentials

Your R2 is configured in `src/config/r2-config.js`:

```javascript
Bucket: storybits
Public URL: https://pub-4a701d352c1f488cbbf56c773984ae36.r2.dev
Account ID: ff7c54b4bc221a31d4c911fbd4f5f0cb
```

**⚠️ Never commit credentials to Git!** (They're in code for simplicity, move to `.env` before deploying)

---

## Usage Limits (80% of Free Tier)

| Resource | Free Tier | Your Limit (80%) | Cost if Exceeded |
|----------|-----------|------------------|------------------|
| **Storage** | 10 GB | 8 GB | $0.015/GB/month |
| **Uploads (Class A)** | 1M/month | 800K/month | $4.50 per million |
| **Reads (Class B)** | 10M/month | 8M/month | $0.36 per million |
| **Bandwidth** | ∞ Unlimited | ∞ Unlimited | **Always Free** |

---

## Monitor Usage

### View Current Usage

Visit: `http://localhost:3000/api/r2-stats`

Or in your browser after deploying:
```
https://yourdomain.com/api/r2-stats
```

**Response:**
```json
{
  "usage": {
    "storage": {
      "percentage": "2.5%",
      "usedGB": "0.200",
      "maxGB": 8
    },
    "classA": {
      "percentage": "0.25%",
      "used": 2000,
      "max": 800000
    }
  }
}
```

### Reset Counters (Testing Only)

```bash
curl -X POST http://localhost:3000/api/r2-stats \
  -H "Content-Type: application/json" \
  -d '{"action": "reset"}'
```

---

## What Happens at 80%?

### Automatic Behavior:

1. **Storage/Uploads hit 80%** → R2 throws error
2. **System automatically** → Falls back to ImgBB
3. **User sees no difference** → Upload still works
4. **Console logs** → Shows which service was used

### Example Log:
```
⚠️ R2 upload failed, falling back to ImgBB: Storage limit reached (8.1GB / 8GB max)
☁️ Uploaded to ImgBB (FALLBACK): https://i.ibb.co/...
```

---

## Limits Explained

### Storage (8 GB max)
- **What counts:** Total size of all images stored
- **Your usage:** ~200-300 KB per optimized image
- **Capacity:** ~27,000-40,000 images before hitting limit
- **Resets:** Never (cumulative)

### Class A - Uploads (800K/month)
- **What counts:** Each upload = 1 operation
- **Your usage:** ~50-100 uploads/day = ~3,000/month
- **Resets:** Automatically on 1st of each month

### Class B - Reads (8M/month)
- **What counts:** Each image view = 1 operation (first time only)
- **With CDN caching:** 90%+ of views are FREE (cached)
- **Resets:** Automatically on 1st of each month

---

## Custom Domain (Optional)

**Current URLs:**
```
https://pub-4a701d352c1f488cbbf56c773984ae36.r2.dev/image.jpg
```

**With Custom Domain:**
```
https://cdn.thestorybits.com/image.jpg
```

### Setup (5 minutes):
1. Go to R2 bucket → **Settings** → **Custom Domains**
2. Click **"Connect Domain"**
3. Enter: `cdn.thestorybits.com` (or `images.thestorybits.com`)
4. Add CNAME record in Cloudflare DNS (automatic if domain in Cloudflare)
5. Done! Update `R2_CONFIG.publicUrl` in config

---

## Migration Path

### Old Images (ImgBB)
- **Status:** Untouched, still work
- **Location:** Database `coverImage` field
- **Format:** `https://i.ibb.co/...`

### New Images (R2)
- **Status:** All new uploads go here
- **Location:** Database `coverImage` field
- **Format:** `https://pub-xxxxx.r2.dev/...`

### If R2 Limit Hit
- **Automatic:** Falls back to ImgBB
- **Format:** `https://i.ibb.co/...` (marked as `imgbb-fallback`)

---

## Troubleshooting

### "R2 Upload Blocked: Storage limit reached"
- You hit 8 GB storage
- System auto-falls back to ImgBB
- Consider upgrading or deleting unused images

### "R2 Upload Blocked: Upload limit reached"
- You hit 800K uploads this month
- System auto-falls back to ImgBB
- Resets automatically next month

### How to Check Actual R2 Usage
1. Go to Cloudflare Dashboard → R2
2. Click on `stor ybits` bucket
3. View **Metrics** tab for real usage

---

## Cost Projection

**Current pace:** ~50 uploads/day, 0.25 MB each

| Month | Storage Used | Operations | Cost |
|-------|--------------|------------|------|
| Month 1 | 375 MB | 1,500 | $0 |
| Month 6 | 2.25 GB | ~9,000 | $0 |
| Month 12 | 4.5 GB | ~18,000 | $0 |
| Month 24 | 9 GB | ~36,000 | $0.015 |

**First charge:** Month 24 = **$0.015/month** (1.5 cents)

---

## Security Note

**⚠️ Before deploying to production:**

Move credentials to environment variables:

```env
# .env.local
R2_ACCESS_KEY_ID=816b5f69ebb013113fc75ed4fe04210a
R2_SECRET_ACCESS_KEY=6088c37c949e1bc219eba672aee02c84e03e184fe6e8e41a31223a1482d58e1
R2_ACCOUNT_ID=ff7c54b4bc221a31d4c911fbd4f5f0cb
R2_BUCKET_NAME=storybits
R2_PUBLIC_URL=https://pub-4a701d352c1f488cbbf56c773984ae36.r2.dev
```

Then update `src/config/r2-config.js` to read from `process.env`.

---

**You're all set! Upload images and they'll automatically go to R2.** 🚀
