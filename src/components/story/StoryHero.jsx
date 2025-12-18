"use client";

import Link from "next/link";
import { Heart, Bookmark, Clock, MessageCircle, Share2 } from "lucide-react";
import { GENRE_TILES } from "@/constants/genres";
import { useState } from "react";
import ShareModal from "@/components/ShareModal";

// Helper function to get genre link
const getGenreLink = (genreName) => {
  const genre = GENRE_TILES.find(
    (g) => g.name.toLowerCase() === genreName.toLowerCase()
  );
  return genre?.link || `/genre/${genreName.toLowerCase().replace(/\s+/g, '-')}`;
};

export default function StoryHero({
  story,
  authorData,
  authorName,
  finalCoverImage,
  isLiked,
  isSaved,
  handleLikeClick,
  handleSaveClick,
  commentsCount = 0
}) {
  const [showShareModal, setShowShareModal] = useState(false);

  const scrollToComments = () => {
    const commentsSection = document.querySelector('[data-comments-section]');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  return (
    <div className="pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center">
          {/* Left: Title, Description, Author, Buttons */}
          <div className="space-y-4 lg:col-span-2">
            <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-[var(--foreground)]">
              {story.title}
            </h1>
            {story.description && (
              <p className="text-lg md:text-xl text-[var(--foreground)]/70 leading-relaxed">
                {story.description}
              </p>
            )}

            {/* Genres */}
            {story.genres && story.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {story.genres.map((genre) => (
                  <Link
                    key={genre}
                    href={getGenreLink(genre)}
                    className="px-3 py-1 text-xs font-medium bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-500/20 transition-colors border border-blue-500/20"
                  >
                    {genre}
                  </Link>
                ))}
              </div>
            )}

            <div className="flex items-center gap-6 pt-4">
              <Link
                href={`/authors/${authorData.username || ""}`}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                  {authorData.profileImage ? (
                    <img
                      src={authorData.profileImage}
                      alt={`${authorName}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {authorName.charAt(1).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-[var(--foreground)] hover:underline">
                    {authorName}
                  </p>
                  {authorData.username && (
                    <p className="text-xs text-[var(--foreground)]/50">
                      {authorData.username}
                    </p>
                  )}
                </div>
              </Link>
              <div className="h-10 w-px bg-[var(--foreground)]/20"></div>
              <div className="flex items-center gap-2 text-[var(--foreground)]/60">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{story.readTime} min</span>
              </div>
              <div className="h-10 w-px bg-[var(--foreground)]/20"></div>
              <button
                onClick={scrollToComments}
                className="flex items-center gap-2 text-[var(--foreground)]/60 hover:text-[var(--foreground)] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{commentsCount}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleLikeClick}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                  isLiked
                    ? "bg-red-50 text-red-600 border border-red-200"
                    : "bg-[var(--foreground)]/5 text-[var(--foreground)]/70 border border-[var(--foreground)]/10 hover:bg-[var(--foreground)]/10"
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                />
                <span className="text-sm">
                  {isLiked ? "Liked" : "Like"}
                  {typeof story.likesCount === "number" && story.likesCount > 0 && (
                    <span className="ml-1 opacity-80">· {story.likesCount}</span>
                  )}
                </span>
              </button>

              <button
                onClick={handleSaveClick}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                  isSaved
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "bg-[var(--foreground)]/5 text-[var(--foreground)]/70 border border-[var(--foreground)]/10 hover:bg-[var(--foreground)]/10"
                }`}
              >
                <Bookmark
                  className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                />
                <span className="text-sm">
                  {isSaved ? "Saved" : "Save"}
                </span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all bg-[var(--foreground)]/5 text-[var(--foreground)]/70 border border-[var(--foreground)]/10 hover:bg-[var(--foreground)]/10"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Share</span>
              </button>
            </div>
          </div>

          {/* Right: Image */}
          <div className="relative flex justify-center lg:justify-center lg:col-span-1">
            <div className="relative w-64 md:w-72 rounded-2xl overflow-hidden border border-[var(--foreground)]/10 shadow-xl">
              <img
                src={finalCoverImage}
                alt={story.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        storyTitle={story.title}
        storyUrl={typeof window !== "undefined" ? window.location.href : ""}
      />
    </div>
  );
}
