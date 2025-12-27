// StoryCard.jsx
"use client";

import { Clock } from "lucide-react";
import Link from "next/link";
import { getGenreFallback } from "@/constants/genres";

export default function StoryCard({ story, showAuthor = true }) {
  // ✅ Safe destructuring
  const {
    id = "",
    title = "Untitled",
    coverImage = "",
    thumbnailImage = "", // ⚡ PERFORMANCE: Pre-processed 200px thumbnail
    genres = [],
    readTime = 0,
    author = null,
  } = story || {};

  // ✅ Always normalize genres
  const genresArr = Array.isArray(genres) ? genres : [];

  // ✅ Author name safety - prioritize 'name' over 'username'
  let authorName = "Unknown";

  if (author && typeof author === "object") {
    // Try name first, then username, then fallback to Unknown
    authorName = author.name || author.username?.replace(/^@/, "") || "Unknown";
  } else if (typeof author === "string" && author.length < 30) {
    authorName = author.replace(/^@/, "");
  }

  // ✅ Fallback chain: thumbnailImage → coverImage → genre image → null
  // ⚡ PERFORMANCE: Use thumbnail (200px) for list views when available
  const genreFallbackImage = getGenreFallback(genresArr);
  const finalImage = thumbnailImage || coverImage || genreFallbackImage;

  const storyPath = `/stories/${id}`;

  return (
    <Link
      href={storyPath}
      prefetch={true} // ⚡ PERFORMANCE: Prefetch story pages for instant navigation
      className="w-full min-w-[160px] md:min-w-[200px] lg:min-w-0 group cursor-pointer transition duration-200 ease-in-out flex-shrink-0"
    >
      <div className="relative w-full aspect-[5/7] rounded-lg overflow-hidden bg-background/20">
        {finalImage ? (
          <img
            src={finalImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.06] transition duration-300 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500 text-xs">
            No image
          </div>
        )}

        {/* ✅ Read Time Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2 md:p-3">
          <div className="flex items-center text-white text-xs font-semibold space-x-1">
            <Clock className="w-3 h-3 text-white" />
            <span className="opacity-80">{readTime} min read</span>
          </div>
        </div>
      </div>

      {/* ✅ Text Section */}
      <div className="pt-2 md:pt-3">
        <h4 className="text-sm md:text-base font-semibold text-foreground line-clamp-2 transition-colors">
          {title}
        </h4>

        {showAuthor && (
          <p className="text-xs md:text-sm text-foreground/70 mt-0.5 line-clamp-1">
            {`By ${authorName}`}
          </p>
        )}

        <p className="text-xs text-foreground/50 mt-0.5 md:mt-1 line-clamp-1">
          {genresArr.length ? genresArr.join(" / ") : "—"}
        </p>
      </div>
    </Link>
  );
}
