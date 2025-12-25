"use client";

const MAX_WORD_COUNT = 7000;

/**
 * Truncates HTML content to a maximum word count while preserving HTML structure
 * @param {string} htmlContent - The HTML content to truncate
 * @param {number} maxWords - Maximum number of words
 * @returns {string} - Truncated HTML content
 */
const truncateHtmlToWordCount = (htmlContent, maxWords) => {
  if (!htmlContent) return '';
  
  // Create a temporary div to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  let wordCount = 0;
  let truncated = false;
  
  // Recursive function to process nodes
  const processNode = (node) => {
    if (truncated) return null;
    
    if (node.nodeType === Node.TEXT_NODE) {
      const words = node.textContent.trim().split(/\s+/).filter(w => w.length > 0);
      
      if (wordCount + words.length > maxWords) {
        // Truncate this text node
        const remainingWords = maxWords - wordCount;
        const truncatedText = words.slice(0, remainingWords).join(' ');
        node.textContent = truncatedText + '...';
        truncated = true;
        return node;
      } else {
        wordCount += words.length;
        return node;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const clonedNode = node.cloneNode(false);
      
      for (let child of Array.from(node.childNodes)) {
        if (truncated) break;
        const processedChild = processNode(child);
        if (processedChild) {
          clonedNode.appendChild(processedChild);
        }
      }
      
      return clonedNode;
    }
    
    return node.cloneNode(true);
  };
  
  const resultDiv = document.createElement('div');
  for (let child of Array.from(tempDiv.childNodes)) {
    if (truncated) break;
    const processedChild = processNode(child);
    if (processedChild) {
      resultDiv.appendChild(processedChild);
    }
  }
  
  return resultDiv.innerHTML;
};

export default function StoryContent({ content }) {
  // Limit content to 7000 words
  const limitedContent = truncateHtmlToWordCount(content, MAX_WORD_COUNT);
  
  return (
    <div className="pt-20 pb-4 px-6">
      <div className="max-w-3xl mx-auto">
        <style jsx global>{`
          /* Story Content Container */
          .story-content {
            line-height: 1.9;
            font-size: 1.1875rem;
            color: var(--foreground);
            animation: fadeInUp 0.8s ease-out;
            font-family: var(--font-roboto-mono), 'Roboto Mono', monospace;
            letter-spacing: 0.015em;
            word-spacing: 0.05em;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Paragraphs */
          .story-content p {
            margin-bottom: 2rem;
            line-height: 1.9;
            font-size: 1.1875rem;
            color: var(--foreground);
            opacity: 0.92;
            font-weight: 400;
            text-align: justify;
            text-justify: inter-word;
            hyphens: auto;
          }
          
          .story-content p:first-child {
            margin-top: 0;
          }
          
          /* Enhanced Drop Cap - First Letter */
          .story-content p:first-child::first-letter {
            font-size: 5rem;
            font-weight: 700;
            line-height: 0.85;
            float: left;
            margin-right: 0.75rem;
            margin-top: 0.15rem;
            margin-bottom: -0.1rem;
            color: #4f46e5;
            font-family: var(--font-roboto-mono), 'Roboto Mono', monospace;
            opacity: 1;
            text-shadow: 2px 2px 4px rgba(79, 70, 229, 0.1);
          }
          
          @media (prefers-color-scheme: dark) {
            .story-content p:first-child::first-letter {
              color: #818cf8;
              text-shadow: 2px 2px 4px rgba(129, 140, 248, 0.2);
            }
          }
          
          .story-content p:last-child {
            margin-bottom: 0;
          }
          
          /* Headings */
          .story-content h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-top: 3.5rem;
            margin-bottom: 1.75rem;
            color: var(--foreground);
            letter-spacing: -0.03em;
            line-height: 1.2;
            opacity: 1;
            font-family: var(--font-roboto-mono), 'Roboto Mono', monospace;
          }
          
          .story-content h2 {
            font-size: 2rem;
            font-weight: 700;
            margin-top: 3rem;
            margin-bottom: 1.5rem;
            color: var(--foreground);
            letter-spacing: -0.025em;
            line-height: 1.3;
            opacity: 1;
            font-family: var(--font-roboto-mono), 'Roboto Mono', monospace;
          }
          
          .story-content h3 {
            font-size: 1.625rem;
            font-weight: 600;
            margin-top: 2.5rem;
            margin-bottom: 1.25rem;
            color: var(--foreground);
            letter-spacing: -0.02em;
            line-height: 1.4;
            opacity: 1;
            font-family: var(--font-roboto-mono), 'Roboto Mono', monospace;
          }
          
          .story-content h4 {
            font-size: 1.375rem;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: var(--foreground);
            opacity: 1;
            font-family: var(--font-roboto-mono), 'Roboto Mono', monospace;
          }
          
          .story-content h5,
          .story-content h6 {
            font-size: 1.125rem;
            font-weight: 600;
            margin-top: 1.75rem;
            margin-bottom: 0.875rem;
            color: var(--foreground);
            opacity: 1;
            font-family: var(--font-roboto-mono), 'Roboto Mono', monospace;
          }
          
          .story-content h1:first-child,
          .story-content h2:first-child,
          .story-content h3:first-child,
          .story-content h4:first-child,
          .story-content h5:first-child,
          .story-content h6:first-child {
            margin-top: 0;
          }
          
          /* Text Formatting */
          .story-content strong,
          .story-content b {
            color: var(--foreground);
            font-weight: 700;
            opacity: 1;
          }
          
          .story-content em,
          .story-content i {
            font-style: italic;
            color: var(--foreground);
            opacity: 0.95;
          }
          
          .story-content u {
            text-decoration: underline;
            text-decoration-thickness: 1px;
            text-underline-offset: 2px;
          }
          
          /* Links */
          .story-content a {
            color: #4f46e5;
            text-decoration: none;
            border-bottom: 1px solid #4f46e5;
            transition: all 0.2s ease;
            font-weight: 500;
            word-break: break-word;
            overflow-wrap: break-word;
          }
          
          .story-content a:hover {
            color: #4338ca;
            border-bottom-color: #4338ca;
            background-color: rgba(79, 70, 229, 0.1);
          }
          
          /* Blockquotes */
          .story-content blockquote {
            border-left: 4px solid #4f46e5;
            padding-left: 1.5rem;
            padding-right: 1rem;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;
            margin: 2rem 0;
            font-style: italic;
            color: var(--foreground);
            opacity: 0.88;
            font-size: 1.3rem;
            line-height: 1.8;
            background: rgba(79, 70, 229, 0.05);
            border-radius: 0 0.5rem 0.5rem 0;
          }
          
          .story-content blockquote p {
            margin-bottom: 0.75rem;
          }
          
          .story-content blockquote p:last-child {
            margin-bottom: 0;
          }
          
          /* Lists */
          .story-content ul,
          .story-content ol {
            margin: 1.5rem 0;
            padding-left: 2rem;
            line-height: 1.9;
          }
          
          .story-content ul {
            list-style-type: disc;
          }
          
          .story-content ol {
            list-style-type: decimal;
          }
          
          .story-content li {
            margin-bottom: 0.75rem;
            color: var(--foreground);
            opacity: 0.92;
          }
          
          .story-content li:last-child {
            margin-bottom: 0;
          }
          
          .story-content ul ul,
          .story-content ol ol,
          .story-content ul ol,
          .story-content ol ul {
            margin-top: 0.5rem;
            margin-bottom: 0.5rem;
          }
          
          /* Code */
          .story-content code {
            background: rgba(0, 0, 0, 0.05);
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
            font-family: 'Courier New', Courier, monospace;
            font-size: 0.9em;
            color: var(--foreground);
            opacity: 0.95;
          }
          
          .story-content pre {
            background: rgba(0, 0, 0, 0.05);
            padding: 1.5rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 2rem 0;
            line-height: 1.6;
          }
          
          .story-content pre code {
            background: transparent;
            padding: 0;
            border-radius: 0;
            font-size: 0.95rem;
          }
          
          /* Horizontal Rule */
          .story-content hr {
            border: none;
            height: 1px;
            background: linear-gradient(to right, transparent, var(--foreground), transparent);
            opacity: 0.2;
            margin: 3rem 0;
          }
          
          /* Images */
          .story-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 2rem 0;
            display: block;
          }
          
          /* Line Breaks */
          .story-content br {
            display: block;
            content: "";
            margin-top: 0.5rem;
          }
          
          /* Selection */
          .story-content ::selection {
            background-color: rgba(79, 70, 229, 0.25);
            color: var(--foreground);
          }
          
          /* Responsive Typography */
          @media (max-width: 768px) {
            .story-content {
              font-size: 1.0625rem;
              line-height: 1.8;
            }
            
            .story-content p {
              font-size: 1.0625rem;
              margin-bottom: 1.75rem;
              text-align: left;
              line-height: 1.8;
            }
            
            .story-content p:first-child::first-letter {
              font-size: 4rem;
              margin-right: 0.6rem;
            }
            
            .story-content h1 {
              font-size: 2rem;
              margin-top: 2.5rem;
            }
            
            .story-content h2 {
              font-size: 1.75rem;
              margin-top: 2rem;
            }
            
            .story-content h3 {
              font-size: 1.5rem;
              margin-top: 1.75rem;
            }
            
            .story-content blockquote {
              font-size: 1.125rem;
              padding-left: 1rem;
            }
          }
          
          /* Dark Mode Adjustments */
          @media (prefers-color-scheme: dark) {
            .story-content code {
              background: rgba(255, 255, 255, 0.1);
            }
            
            .story-content pre {
              background: rgba(255, 255, 255, 0.05);
            }
            
            .story-content blockquote {
              background: rgba(129, 140, 248, 0.1);
              border-left-color: #818cf8;
            }
            
            .story-content a {
              color: #818cf8;
              border-bottom-color: #818cf8;
            }
            
            .story-content a:hover {
              color: #a5b4fc;
              border-bottom-color: #a5b4fc;
              background-color: rgba(129, 140, 248, 0.15);
            }
          }
        `}</style>
        
        {/* Full story content */}
        <div
          className="story-content"
          dangerouslySetInnerHTML={{ __html: limitedContent }}
        />
      </div>
    </div>
  );
}
