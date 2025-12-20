/**
 * Professional Content Sanitizer for TheStoryBits
 * Normalizes content from any source (Word, Google Docs, Medium, etc.)
 * to consistent, clean HTML that matches our platform's styling
 */

/**
 * Main sanitization function
 * @param {string} content - Raw content (HTML or plain text)
 * @returns {string} - Sanitized HTML
 */
export function sanitizeStoryContent(content) {
  if (!content) return "";

  // Check if content is HTML or plain text
  const isHTML = /\<[a-z][\s\S]*\>/i.test(content);

  if (isHTML) {
    return sanitizeHTML(content);
  } else {
    return convertPlainTextToHTML(content);
  }
}

/**
 * Sanitize HTML content
 */
function sanitizeHTML(htmlContent) {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;

  // Step 1: Remove unwanted elements
  removeUnwantedElements(tempDiv);

  // Step 2: Clean all elements - remove inline styles, classes, and unwanted attributes
  cleanAllElements(tempDiv);

  // Step 3: Normalize headings
  normalizeHeadings(tempDiv);

  // Step 4: Normalize paragraphs
  normalizeParagraphs(tempDiv);

  // Step 5: Clean up whitespace and empty elements
  cleanupWhitespace(tempDiv);

  // Step 6: Ensure proper structure
  ensureProperStructure(tempDiv);

  return tempDiv.innerHTML;
}

/**
 * Remove script, style, and other unwanted elements
 */
function removeUnwantedElements(container) {
  const unwantedSelectors = [
    'script',
    'style',
    'iframe',
    'object',
    'embed',
    'applet',
    'meta',
    'link',
    'noscript',
    'form',
    'input',
    'button',
    'select',
    'textarea',
    'svg',
    'canvas',
    'video',
    'audio',
    'img[src^="data:"]', // Remove base64 images
    '.advertisement',
    '.ad',
    '.social-share',
    '[data-ad]',
    '[class*="sidebar"]',
    '[class*="footer"]',
    '[class*="header"]',
    '[class*="nav"]',
    '[class*="menu"]',
  ];

  unwantedSelectors.forEach(selector => {
    const elements = container.querySelectorAll(selector);
    elements.forEach(el => el.remove());
  });

  // Remove comments
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_COMMENT,
    null,
    false
  );
  const comments = [];
  while (walker.nextNode()) {
    comments.push(walker.currentNode);
  }
  comments.forEach(comment => comment.remove());
}

/**
 * Clean all elements - remove inline styles, classes, and most attributes
 */
function cleanAllElements(container) {
  const allElements = container.querySelectorAll('*');
  
  allElements.forEach(el => {
    // Remove all attributes except href for links and src/alt for images
    const allowedAttributes = {
      'a': ['href', 'title'],
      'img': ['src', 'alt'],
    };

    const tagName = el.tagName.toLowerCase();
    const allowed = allowedAttributes[tagName] || [];

    // Get all attributes
    const attrs = Array.from(el.attributes);
    attrs.forEach(attr => {
      if (!allowed.includes(attr.name)) {
        el.removeAttribute(attr.name);
      }
    });

    // Clean href attributes (remove javascript:, data:, etc.)
    if (tagName === 'a') {
      const href = el.getAttribute('href');
      if (href && (href.startsWith('javascript:') || href.startsWith('data:') || href.startsWith('vbscript:'))) {
        el.removeAttribute('href');
      }
    }

    // Clean img src
    if (tagName === 'img') {
      const src = el.getAttribute('src');
      if (src && (src.startsWith('javascript:') || src.startsWith('data:') || src.startsWith('vbscript:'))) {
        el.remove();
      }
    }
  });
}

/**
 * Normalize headings - fix nesting, standardize levels
 */
function normalizeHeadings(container) {
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  
  headings.forEach(heading => {
    // Fix nested headings (e.g., <h2><h1>...</h1></h2>)
    const innerHeadings = heading.querySelectorAll('h1, h2, h3, h4, h5, h6');
    innerHeadings.forEach(inner => {
      // Unwrap inner heading - move its content to parent
      while (inner.firstChild) {
        heading.insertBefore(inner.firstChild, inner);
      }
      inner.remove();
    });

    // Clean heading content - remove any remaining HTML tags except em, strong
    const allowedInHeadings = ['EM', 'STRONG', 'I', 'B'];
    Array.from(heading.children).forEach(child => {
      if (!allowedInHeadings.includes(child.tagName)) {
        // Replace with text content
        const textNode = document.createTextNode(child.textContent);
        heading.replaceChild(textNode, child);
      }
    });

    // Normalize heading text - trim whitespace
    heading.textContent = heading.textContent.trim();

    // Convert h1 to h2 (we reserve h1 for story title)
    if (heading.tagName === 'H1') {
      const h2 = document.createElement('h2');
      h2.textContent = heading.textContent;
      heading.replaceWith(h2);
    }
  });
}

/**
 * Normalize paragraphs
 */
function normalizeParagraphs(container) {
  const paragraphs = container.querySelectorAll('p');
  
  paragraphs.forEach(p => {
    // Remove empty paragraphs with only whitespace or &nbsp;
    const text = p.textContent.trim().replace(/\u00a0/g, '');
    if (!text && !p.querySelector('img')) {
      p.remove();
      return;
    }

    // Unwrap unnecessary nested elements
    unwrapUnnecessaryElements(p);

    // Clean up line breaks
    cleanLineBreaks(p);
  });
}

/**
 * Unwrap unnecessary nested elements in paragraphs
 */
function unwrapUnnecessaryElements(paragraph) {
  const unnecessaryTags = ['div', 'span', 'font', 'center'];
  
  unnecessaryTags.forEach(tagName => {
    const elements = paragraph.querySelectorAll(tagName);
    elements.forEach(el => {
      // Move children to parent
      while (el.firstChild) {
        el.parentNode.insertBefore(el.firstChild, el);
      }
      el.remove();
    });
  });
}

/**
 * Clean up excessive line breaks
 */
function cleanLineBreaks(paragraph) {
  // Replace multiple consecutive <br> tags with a single one
  let html = paragraph.innerHTML;
  
  // Remove <br> at the start and end of paragraphs
  html = html.replace(/^(\s*<br\s*\/?>)+/gi, '');
  html = html.replace(/(<br\s*\/?>)+\s*$/gi, '');
  
  // Replace multiple consecutive <br> with single <br>
  html = html.replace(/(<br\s*\/?>[\s\n]*){2,}/gi, '<br />');
  
  paragraph.innerHTML = html;
}

/**
 * Clean up whitespace and empty elements
 */
function cleanupWhitespace(container) {
  // Remove empty elements (except br, img, hr)
  const selfClosingTags = ['BR', 'IMG', 'HR'];
  
  const removeEmptyElements = (parent) => {
    Array.from(parent.children).forEach(el => {
      // Recursively clean children first
      if (el.children.length > 0) {
        removeEmptyElements(el);
      }

      // Check if element is empty
      if (!selfClosingTags.includes(el.tagName)) {
        const text = el.textContent.trim().replace(/\u00a0/g, '');
        const hasImages = el.querySelector('img');
        
        if (!text && !hasImages) {
          el.remove();
        }
      }
    });
  };

  removeEmptyElements(container);

  // Normalize whitespace in text nodes
  const walker = document.createTreeWalker(
    container,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  const textNodes = [];
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode);
  }

  textNodes.forEach(node => {
    // Replace multiple spaces with single space
    node.textContent = node.textContent.replace(/\s+/g, ' ');
  });
}

/**
 * Ensure proper document structure
 */
function ensureProperStructure(container) {
  // Collect all top-level nodes
  const nodes = Array.from(container.childNodes);
  
  nodes.forEach(node => {
    // Wrap orphaned text nodes in paragraphs
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent.trim();
      if (text) {
        const p = document.createElement('p');
        p.textContent = text;
        container.replaceChild(p, node);
      } else {
        node.remove();
      }
    }
    
    // Wrap inline elements that are direct children in paragraphs
    if (node.nodeType === Node.ELEMENT_NODE) {
      const inlineTags = ['A', 'EM', 'STRONG', 'I', 'B', 'U', 'SPAN', 'CODE'];
      if (inlineTags.includes(node.tagName)) {
        const p = document.createElement('p');
        container.insertBefore(p, node);
        p.appendChild(node);
      }
    }
  });

  // Ensure block elements are properly separated
  const blockElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, blockquote, ul, ol, pre');
  blockElements.forEach(el => {
    // Remove leading/trailing whitespace from block elements
    if (el.firstChild && el.firstChild.nodeType === Node.TEXT_NODE) {
      el.firstChild.textContent = el.firstChild.textContent.replace(/^\s+/, '');
    }
    if (el.lastChild && el.lastChild.nodeType === Node.TEXT_NODE) {
      el.lastChild.textContent = el.lastChild.textContent.replace(/\s+$/, '');
    }
  });
}

/**
 * Convert plain text to HTML
 */
function convertPlainTextToHTML(plainText) {
  // Normalize line endings
  const text = plainText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  
  if (!text) return '';

  // Split into paragraphs (double line breaks)
  const paragraphs = text.split(/\n\s*\n+/);

  const htmlParagraphs = paragraphs.map(para => {
    para = para.trim();
    if (!para) return '';

    // Escape HTML entities
    para = para
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // Convert single line breaks to <br />
    para = para.replace(/\n/g, '<br />');

    return `<p>${para}</p>`;
  });

  return htmlParagraphs.filter(p => p).join('\n');
}

/**
 * Extract plain text from HTML (for previews, word count, etc.)
 */
export function extractPlainText(htmlContent) {
  if (!htmlContent) return '';
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  // Remove script and style elements
  tempDiv.querySelectorAll('script, style').forEach(el => el.remove());
  
  return tempDiv.textContent.trim().replace(/\s+/g, ' ');
}

/**
 * Calculate reading time based on content
 * @param {string} htmlContent - HTML content
 * @param {number} wordsPerMinute - Average reading speed (default: 200)
 * @returns {number} - Estimated reading time in minutes
 */
export function calculateReadingTime(htmlContent, wordsPerMinute = 200) {
  const plainText = extractPlainText(htmlContent);
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
