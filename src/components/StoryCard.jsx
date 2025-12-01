// StoryCard.jsx
"use client";

import { Clock } from "lucide-react";
import Link from "next/link";

export default function StoryCard({ story, showAuthor = true }) {
  // Safe destructuring
  const {
    id = "",
    title = "Untitled",
    coverImage = "",
    genres = [],
    readTime = 0,
    author = null,
  } = story || {};

  // Convert genres to array safely
  const genresArr = Array.isArray(genres) ? genres : [];

  // ---- FIX: Determine the correct display name ----
  let authorName = "Unknown";

  if (typeof author === "string") {
    // If it's a raw string id → do NOT display it
    if (author.length < 20) {
      // short string → maybe it is a username
      authorName = author.replace(/^@/, "");
    }
  } else if (author && typeof author === "object") {
    authorName = author.username?.replace(/^@/, "") || author.name || "Unknown";
  }

  const storyPath = `/stories/${id}`;

  return (
    <Link
      href={storyPath}
      className="min-w-[180px] md:min-w-[220px] max-w-[220px] group cursor-pointer transition duration-200 ease-in-out"
    >
      <div className="relative h-[240px] md:h-[350px] rounded-lg overflow-hidden bg-background/20">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.06] transition duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            No image
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2 md:p-3">
          <div className="flex items-center text-white text-xs font-semibold space-x-1">
            <Clock className="w-3 h-3 text-white" />
            <span className="opacity-80">{readTime} min read</span>
          </div>
        </div>
      </div>

      <div className="pt-3">
        <h4 className="text-base font-semibold text-foreground line-clamp-2 transition-colors">
          {title}
        </h4>

        {showAuthor && (
          <p className="text-sm text-foreground/70 mt-0.5 line-clamp-1">
            {`By @${authorName}`}
          </p>
        )}

        <p className="text-xs text-foreground/50 mt-1 line-clamp-1">
          {genresArr.length ? genresArr.join(" / ") : "—"}
        </p>
      </div>
    </Link>
  );
}
