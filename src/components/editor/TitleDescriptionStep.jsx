"use client";

import React from "react";

export default function TitleDescriptionStep({ 
  title, 
  setTitle, 
  description, 
  setDescription 
}) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title */}
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Story Title"
        className="w-full text-4xl md:text-5xl font-bold bg-transparent border-b-2 border-[var(--foreground)]/20 focus:border-blue-500 focus:outline-none text-[var(--foreground)] placeholder:text-[var(--foreground)]/30 transition-colors py-4"
      />

      {/* Description */}
      <div className="space-y-2">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of your story..."
          rows={10}
          className="w-full text-lg bg-[var(--background)] border-2 border-[var(--foreground)]/10 focus:border-blue-500 rounded-lg p-4 focus:outline-none text-[var(--foreground)]/80 placeholder:text-[var(--foreground)]/30 resize-none transition-colors"
          maxLength={350}
        />
        <div className="text-right text-xs text-[var(--foreground)]/40">
          {description.length} / 350
        </div>
      </div>
    </div>
  );
}
