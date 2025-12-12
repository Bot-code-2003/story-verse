"use client";

import React from "react";

// Editor Toolbar Component
const EditorToolbar = ({ format }) => (
  <div className="flex items-center gap-2 text-[var(--foreground)]">
    <button
      onClick={() => format("bold")}
      className="p-2 hover:bg-[var(--foreground)]/10 rounded font-bold"
      title="Bold"
    >
      B
    </button>
    <button
      onClick={() => format("italic")}
      className="p-2 hover:bg-[var(--foreground)]/10 rounded italic"
      title="Italic"
    >
      I
    </button>
    <button
      onClick={() => format("underline")}
      className="p-2 hover:bg-[var(--foreground)]/10 rounded underline"
      title="Underline"
    >
      U
    </button>
    <div className="w-px h-5 bg-[var(--foreground)]/20 mx-1"></div>
    <button
      onClick={() => format("formatBlock", "H1")}
      className="px-3 py-1 hover:bg-[var(--foreground)]/10 rounded text-lg font-extrabold"
      title="Heading 1"
    >
      H1
    </button>
    <button
      onClick={() => format("formatBlock", "H2")}
      className="px-3 py-1 hover:bg-[var(--foreground)]/10 rounded font-bold"
      title="Heading 2"
    >
      H2
    </button>
    <button
      onClick={() => format("formatBlock", "P")}
      className="px-3 py-1 hover:bg-[var(--foreground)]/10 rounded"
      title="Paragraph"
    >
      P
    </button>
  </div>
);

export default function ContentEditorStep({ editorRef, format, wordCount }) {
  return (
    <div className="fixed inset-0 top-[64px] bg-[var(--background)] z-10">
      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-20 bg-[var(--background)] border-b border-[var(--foreground)]/10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <EditorToolbar format={format} />
        </div>
      </div>

      {/* Scrollable Editor Area */}
      <div className="h-full overflow-y-auto pb-32">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <style jsx global>{`
            .story-editor-content {
              min-height: calc(100vh - 200px);
              padding: 2rem;
              background: transparent;
              outline: none;
              color: var(--foreground);
              line-height: 1.9;
              font-size: 1.125rem;
            }
            
            .story-editor-content p {
              margin-bottom: 1.5rem;
              line-height: 1.9;
              font-size: 1.125rem;
              color: var(--foreground);
              opacity: 0.85;
              font-weight: 300;
            }
            
            .story-editor-content h1 {
              font-size: 2.25rem;
              font-weight: 600;
              margin-top: 3rem;
              margin-bottom: 1.5rem;
              color: var(--foreground);
              letter-spacing: -0.025em;
            }
            
            .story-editor-content h2 {
              font-size: 1.875rem;
              font-weight: 600;
              margin-top: 3rem;
              margin-bottom: 1.5rem;
              color: var(--foreground);
              letter-spacing: -0.025em;
            }
            
            .story-editor-content h3 {
              font-size: 1.5rem;
              font-weight: 600;
              margin-top: 2.5rem;
              margin-bottom: 1.25rem;
              color: var(--foreground);
            }
            
            .story-editor-content strong {
              color: var(--foreground);
              font-weight: 600;
            }
            
            .story-editor-content em {
              font-style: italic;
              color: var(--foreground);
              opacity: 0.8;
            }
            
            .story-editor-content:empty:before {
              content: "Start writing your masterpiece here...";
              color: var(--foreground);
              opacity: 0.3;
              pointer-events: none;
            }
          `}</style>
          
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="story-editor-content border border-[var(--foreground)]/10 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}
