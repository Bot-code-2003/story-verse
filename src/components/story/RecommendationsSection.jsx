"use client";

import { useRouter } from "next/navigation";
import StoryCard from "@/components/StoryCard";

export default function RecommendationsSection({ recommendations, primaryGenre }) {
  const router = useRouter();

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="py-16 px-6 bg-[var(--foreground)]/5 border-t border-[var(--foreground)]/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-[var(--foreground)] text-center">
          You May Also Like
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {recommendations.map((recStory) => (
            <StoryCard key={recStory.id} story={recStory} />
          ))}
        </div>

        {primaryGenre && (
          <div className="text-center pt-10">
            <button
              onClick={() => router.push(`/genre/${primaryGenre}`)}
              className="px-6 py-2 border border-[var(--foreground)]/20 text-[var(--foreground)]/80 rounded-full text-sm hover:bg-[var(--foreground)]/10 transition-colors"
            >
              View More {primaryGenre} Stories
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
