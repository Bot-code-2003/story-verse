# SEO Fixes for OneSitRead

## Issues Fixed

### 1. Title Duplication Issue ✅
**Problem:** Browser tab showing "Story Not found | onesitread | onesitread"

**Root Cause:** The root layout has a title template `'%s | OneSitRead'` that automatically appends "| OneSitRead" to all page titles. The story page was returning titles like "Story Not Found | OneSitRead", which resulted in "Story Not Found | OneSitRead | OneSitRead".

**Solution:**
- Updated all metadata returns in `src/app/stories/[storyId]/page.js` to NOT include "OneSitRead" in the title
- The template will automatically add it
- Changed from: `title: 'Story Not Found | OneSitRead'`
- Changed to: `title: 'Story Not Found'`
- Final result: "Story Not Found | OneSitRead" ✅

### 2. WhatsApp/Social Media OG Image Not Working ✅
**Problem:** Dynamic images from Vercel not appearing in WhatsApp/social media previews

**Root Causes:**
1. Images were using relative URLs instead of absolute HTTPS URLs
2. Social media scrapers (WhatsApp, Facebook, Twitter) require fully qualified URLs
3. Client-side generated meta tags are not visible to scrapers

**Solution:**
Created a server-side dynamic OG image generator using Next.js's built-in `ImageResponse` API:

#### New API Route: `/api/og`
- **File:** `src/app/api/og/route.jsx`
- **Runtime:** Edge (for fast global generation)
- **Features:**
  - Generates 1200x630 OG images dynamically
  - Accepts query parameters: `title`, `author`, `genre`, `coverImage`
  - Creates beautiful branded images with:
    - OneSitRead branding
    - Story title (large, bold)
    - Author name
    - Genre badge
    - Optional cover image as background
  - Returns absolute HTTPS URLs that social scrapers can access

#### Updated Story Metadata
- Changed from relative/CDN URLs to dynamic OG image API
- Example URL: `https://onesitread.vercel.app/api/og?title=Story%20Title&author=Author%20Name&genre=Fiction`
- All images now use absolute HTTPS URLs
- Works for both OpenGraph (Facebook/WhatsApp) and Twitter cards

## Technical Implementation

### Dynamic OG Image Generation
```javascript
// Generates URL like:
const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&genre=${encodeURIComponent(primaryGenre)}${story.coverImage ? `&coverImage=${encodeURIComponent(story.coverImage)}` : ''}`;
```

### Metadata Structure
```javascript
openGraph: {
  images: [
    {
      url: ogImageUrl, // Absolute HTTPS URL
      width: 1200,
      height: 630,
      alt: `${title} by ${authorName} - OneSitRead`,
      type: 'image/png',
    }
  ],
}
```

## Testing & Verification

### 1. Test the OG Image API
Visit: `https://onesitread.vercel.app/api/og?title=Test%20Story&author=Test%20Author&genre=Fiction`

You should see a dynamically generated image.

### 2. Test Story Metadata
1. Deploy to Vercel
2. Visit any story page
3. View page source (Ctrl+U) - NOT inspect element
4. Verify meta tags are present with absolute URLs:
   ```html
   <meta property="og:image" content="https://onesitread.vercel.app/api/og?title=..." />
   ```

### 3. Test Social Media Sharing
Use these debugging tools to verify:

#### WhatsApp/Facebook
- **URL:** https://developers.facebook.com/tools/debug/
- Paste your story URL
- Click "Scrape Again" to clear cache
- Verify image appears

#### Twitter
- **URL:** https://cards-dev.twitter.com/validator
- Paste your story URL
- Verify card preview

#### LinkedIn
- **URL:** https://www.linkedin.com/post-inspector/
- Paste your story URL
- Verify preview

### 4. Clear Social Media Cache
Social platforms cache previews heavily. After deploying:
1. Use the debugging tools above to force a re-scrape
2. Wait 24-48 hours for cache to naturally expire
3. Test with a new story URL (uncached)

## Key Points

✅ **Server-Side Rendering:** All metadata is generated server-side in `generateMetadata()` - scrapers can see it

✅ **Absolute HTTPS URLs:** All OG images use full `https://` URLs, not relative paths

✅ **Edge Runtime:** OG image generation runs on Vercel's edge network for fast global access

✅ **No Client-Side Dependencies:** No React Helmet or client-side meta tag injection

✅ **Proper Image Dimensions:** 1200x630 (recommended OG image size)

✅ **Fallback Handling:** If story fetch fails, returns appropriate fallback metadata

## Common Issues & Solutions

### Issue: Old preview still showing
**Solution:** Use Facebook Debugger to force re-scrape, or wait for cache to expire

### Issue: Image not loading
**Solution:** 
- Verify the `/api/og` route is accessible
- Check that the URL is absolute HTTPS
- Ensure no authentication/firewall blocking the image

### Issue: Different preview on different platforms
**Solution:** 
- Each platform caches independently
- Clear cache on each platform's debugger
- Verify both `openGraph.images` and `twitter.images` are set

## Files Modified

1. ✅ `src/app/stories/[storyId]/page.js` - Updated metadata generation
2. ✅ `src/app/api/og/route.jsx` - Created new OG image API

## Next Steps

1. **Deploy to Vercel** - Changes need to be live for social scrapers to access
2. **Test with debugging tools** - Verify images load correctly
3. **Clear social media caches** - Force re-scrape of your URLs
4. **Monitor** - Check that new shares show correct previews

## Additional Recommendations

### Add Vercel Analytics (Optional)
Track how often your OG images are being generated:
```bash
npm install @vercel/analytics
```

### Add Image Caching Headers (Optional)
In `src/app/api/og/route.jsx`, add cache headers:
```javascript
return new ImageResponse(
  // ... image content
  {
    width: 1200,
    height: 630,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  }
);
```

### Monitor OG Image Performance
Check Vercel dashboard for:
- Edge function invocations
- Response times
- Error rates

## References

- [Next.js OG Image Generation](https://nextjs.org/docs/app/api-reference/functions/image-response)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
