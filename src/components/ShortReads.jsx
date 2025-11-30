"use client";

import StoryCard from "./StoryCard";

export default function ShortReads({ stories }) {
  const quickReads = stories.filter((s) => s.readTime <= 6).slice(0, 6);

  if (quickReads.length === 0) return null;

  return (
    <section className="mb-12">
      <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
        Quick Reads (Under 6 Minutes)
      </h3>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-5 pb-4">
          {quickReads.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
