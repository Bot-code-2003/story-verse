// StoryCard.jsx
"use client";

import { Clock } from "lucide-react";
import Link from "next/link"; // Import the Link component

export default function StoryCard({ story }) {
  const { id, title, coverImage, genres, readTime, author } = story;

  // Define the dynamic path to the StoryPage, using the story's ID
  const storyPath = `/stories/${id}`;

  return (
    <Link
      href={storyPath}
      // Removed group-hover:scale-[1.03] to keep the container static
      className="min-w-[180px] md:min-w-[220px] max-w-[220px] group cursor-pointer transition duration-200 ease-in-out"
    >
      {/* Cover Image Container */}
      <div className="relative h-[240px] md:h-[350px] rounded-lg overflow-hidden bg-background/20">
        <img
          src={coverImage}
          alt={title}
          // The image itself scales on hover, no other elements move
          className="w-full h-full object-cover group-hover:scale-[1.06] transition duration-300 ease-out"
        />

        {/* Read Time (Subtle Overlay at Bottom) */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2 md:p-3">
          <div className="flex items-center text-white text-xs font-semibold space-x-1">
            <Clock className="w-3 h-3 text-white" />
            <span className="opacity-80">{readTime} min read</span>
          </div>
        </div>
      </div>

      {/* Content Area (Clean, Tighter Spacing) */}
      <div className="pt-3">
        {/* Title (Bold and Clean) */}
        <h4 className="text-base font-semibold text-foreground line-clamp-2 transition-colors group-hover:text-gray-800 dark:group-hover:text-white">
          {title}
        </h4>

        {/* Author (Subtle, secondary text) */}
        <p className="text-sm text-foreground/70 mt-0.5 line-clamp-1">
          {`By User ${author}`}
        </p>

        {/* Genres (Lightest text) */}
        <p className="text-xs text-foreground/50 mt-1 line-clamp-1">
          {genres.join(" / ")}
        </p>
      </div>
    </Link>
  );
}
