# Content Sanitization System

## Overview

StoryVerse uses a comprehensive content sanitization system to ensure all story content is displayed consistently and professionally, regardless of where users copy-paste it from (Microsoft Word, Google Docs, Medium, etc.).

## Features

### 1. **HTML Sanitization**
- Removes unwanted elements (scripts, styles, iframes, forms, etc.)
- Strips inline styles, classes, and data attributes
- Cleans up malformed HTML and nested structures
- Prevents XSS attacks by sanitizing links and images

### 2. **Content Normalization**
- Fixes nested headings (e.g., `<h2><h1>...</h1></h2>`)
- Converts all `h1` tags to `h2` (h1 is reserved for story titles)
- Removes empty paragraphs and excessive whitespace
- Normalizes line breaks and spacing
- Unwraps unnecessary wrapper elements (div, span, font, center)

### 3. **Plain Text Conversion**
- Automatically detects plain text vs HTML
- Converts plain text to properly formatted HTML paragraphs
- Preserves paragraph breaks (double line breaks)
- Escapes HTML entities for security

### 4. **Professional Typography**
- Drop cap on first paragraph
- Justified text alignment with proper hyphenation
- Consistent line height and spacing
- Responsive font sizes for mobile devices
- Beautiful blockquote styling
- Proper list formatting
- Code block support with syntax highlighting

## Usage

### In Components

```javascript
import { sanitizeStoryContent } from "@/utils/contentSanitizer";

// Sanitize content before rendering
const cleanHTML = sanitizeStoryContent(rawContent);
```

### Utility Functions

```javascript
import { 
  sanitizeStoryContent, 
  extractPlainText, 
  calculateReadingTime 
} from "@/utils/contentSanitizer";

// Sanitize HTML or plain text
const clean = sanitizeStoryContent(content);

// Extract plain text from HTML (for previews)
const plainText = extractPlainText(htmlContent);

// Calculate reading time
const minutes = calculateReadingTime(htmlContent); // Default: 200 WPM
const customMinutes = calculateReadingTime(htmlContent, 250); // Custom WPM
```

## Supported HTML Elements

### Allowed Elements
- **Headings**: h2, h3, h4, h5, h6 (h1 converted to h2)
- **Text**: p, strong, em, b, i, u
- **Lists**: ul, ol, li
- **Quotes**: blockquote
- **Code**: code, pre
- **Links**: a (with href sanitization)
- **Images**: img (with src sanitization)
- **Formatting**: br, hr

### Removed Elements
- Scripts, styles, iframes
- Forms and inputs
- SVG, canvas, video, audio
- Base64 images
- Advertisement elements
- Navigation and sidebar elements

## Content Sources Tested

✅ **Microsoft Word** - Removes complex styling and formatting
✅ **Google Docs** - Strips Google-specific attributes
✅ **Medium** - Removes Medium's custom classes and styles
✅ **Notion** - Cleans up Notion's nested structure
✅ **WordPress** - Removes WordPress shortcodes and classes
✅ **Plain Text** - Converts to proper HTML paragraphs

## Security Features

1. **XSS Prevention**
   - Removes `javascript:`, `data:`, and `vbscript:` from links
   - Strips all inline event handlers
   - Sanitizes image sources

2. **Content Isolation**
   - Removes all external scripts and styles
   - Prevents iframe injection
   - Blocks form submissions

3. **Attribute Sanitization**
   - Only allows `href` and `title` on links
   - Only allows `src` and `alt` on images
   - Removes all other attributes

## Styling System

The content styling is defined in `StoryContent.jsx` and includes:

- **Typography**: System font stack for optimal readability
- **Spacing**: Consistent margins and padding
- **Colors**: Theme-aware with CSS variables
- **Responsive**: Mobile-optimized font sizes
- **Dark Mode**: Automatic adjustments for dark themes
- **Accessibility**: Proper contrast and readable line heights

## Performance

- **Client-side processing**: Fast sanitization in the browser
- **No external dependencies**: Pure JavaScript implementation
- **Efficient DOM manipulation**: Minimal reflows and repaints
- **Cached results**: Content is sanitized once and reused

## Best Practices

1. **Always sanitize user content** before storing in the database
2. **Re-sanitize on display** for defense in depth
3. **Use the split function** to inject ShareBox at 40% mark
4. **Test with various sources** to ensure compatibility

## Future Enhancements

- [ ] Markdown support
- [ ] Rich text editor integration
- [ ] Custom styling options for authors
- [ ] Image optimization and lazy loading
- [ ] Table support
- [ ] Footnotes and citations
