# SEO Quick Reference Guide

## Pages with SEO Implementation

| Page | File | Metadata | Structured Data | Status |
|------|------|----------|-----------------|--------|
| Home | `src/app/page.js` | ✅ | ✅ WebSite | Complete |
| Story | `src/app/stories/[storyId]/page.js` | ✅ Dynamic | ✅ Article | Complete |
| Author | `src/app/authors/[authorUsername]/page.js` | ✅ Dynamic | ✅ Person/ProfilePage | Complete |
| Genre | `src/app/genre/[name]/page.js` | ✅ Dynamic | ✅ CollectionPage | Complete |
| Write | `src/app/write/page.js` | ✅ (noindex) | ❌ | Complete |
| Login | `src/app/login/page.js` | ⚠️ Partial | ❌ | Partial |
| Root Layout | `src/app/layout.js` | ✅ Global | ❌ | Complete |

## Quick Commands

### Test SEO
```bash
# Check if dev server is running
npm run dev

# Visit these URLs to test:
# http://localhost:3000/ - Home page
# http://localhost:3000/stories/[any-story-id] - Story page
# http://localhost:3000/authors/[any-username] - Author page
# http://localhost:3000/genre/Fantasy - Genre page
```

### Validate Structured Data
1. Open page in browser
2. Right-click → View Page Source
3. Search for `application/ld+json`
4. Copy JSON content
5. Paste into https://validator.schema.org/

### Check Open Graph Tags
1. Open https://developers.facebook.com/tools/debug/
2. Enter your page URL
3. Click "Debug"
4. Review preview

## Environment Variables Needed

Add to `.env.local`:
```env
NEXT_PUBLIC_BASE_URL=https://storyverse.com
```

For development:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Required Images

Create these images in `/public/`:

1. **og-image.jpg** (1200x630px) - Default Open Graph image
2. **logo.png** (512x512px) - Site logo
3. **default-story-cover.jpg** (800x1200px) - Fallback for stories without covers
4. **default-avatar.jpg** (400x400px) - Fallback for users without profile pictures
5. **icon-192x192.png** (192x192px) - PWA icon
6. **icon-512x512.png** (512x512px) - PWA icon
7. **apple-touch-icon.png** (180x180px) - iOS home screen icon

## Meta Tags Checklist

For each new page type, ensure:
- [ ] Unique `<title>` tag
- [ ] Meta description (150-160 characters)
- [ ] Canonical URL
- [ ] Open Graph tags (title, description, image, type)
- [ ] Twitter Card tags
- [ ] Appropriate robots directive (index/noindex)

## Structured Data Templates

### Article (for stories)
```javascript
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Story Title",
  "description": "Story description",
  "image": "cover-image-url",
  "datePublished": "2024-01-01",
  "author": {
    "@type": "Person",
    "name": "Author Name"
  }
}
```

### Person (for authors)
```javascript
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Author Name",
  "description": "Author bio",
  "image": "profile-image-url"
}
```

## Common Issues & Solutions

### Issue: Metadata not updating
**Solution:** Clear Next.js cache
```bash
rm -rf .next
npm run dev
```

### Issue: Structured data validation errors
**Solution:** Check JSON syntax, ensure all required fields are present

### Issue: Open Graph image not showing
**Solution:** 
1. Ensure image is publicly accessible
2. Check image dimensions (1200x630 recommended)
3. Clear Facebook cache: https://developers.facebook.com/tools/debug/

### Issue: Dynamic metadata not generating
**Solution:** Ensure `generateMetadata()` is exported from server component

## Performance Tips

1. **Preload critical resources** - Already implemented in layout.js
2. **Optimize images** - Use Next.js Image component
3. **Minimize JavaScript** - Code splitting is automatic in Next.js
4. **Enable caching** - Configure in next.config.js

## Monitoring

### Google Search Console
1. Add property: https://storyverse.com
2. Verify ownership
3. Submit sitemap.xml
4. Monitor coverage, performance, and errors

### Key Metrics to Track
- Impressions
- Click-through rate (CTR)
- Average position
- Core Web Vitals
- Mobile usability
- Structured data errors

## Next Steps

1. ✅ Create required images
2. ✅ Set up environment variables
3. ✅ Generate sitemap.xml
4. ✅ Submit to Google Search Console
5. ✅ Test all pages with validation tools
6. ✅ Monitor performance for 2-4 weeks
7. ✅ Iterate based on data

## Support Resources

- [Next.js Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
