"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import ShareModal from "@/components/ShareModal";

export default function FloatingActionBar({ 
  isLiked, 
  onLikeClick, 
  commentsCount = 0,
  storyTitle,
  onScrollToComments 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Get the story hero section height (approximately 600px)
      const heroHeight = 600;
      const scrollPosition = window.scrollY;

      // Show floating bar after scrolling past hero
      setIsVisible(scrollPosition > heroHeight);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = () => {
    setShowShareModal(true);
  };

  return (
    <>
      {/* Floating Action Bar */}
      <div
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
          isVisible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-20 pointer-events-none"
        }`}
      >
        <div className="bg-[var(--background)] border border-[var(--foreground)]/10 rounded-full shadow-2xl px-6 py-3 flex items-center gap-6 backdrop-blur-lg">
          {/* Like Button */}
          <button
            onClick={onLikeClick}
            className={`flex items-center gap-2 transition-all hover:scale-110 ${
              isLiked ? "text-red-500" : "text-[var(--foreground)]/60 hover:text-red-500"
            }`}
            aria-label={isLiked ? "Unlike story" : "Like story"}
          >
            <Heart
              className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
            />
            <span className="text-sm font-medium">Like</span>
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-[var(--foreground)]/10" />

          {/* Comments Button */}
          <button
            onClick={onScrollToComments}
            className="flex items-center gap-2 text-[var(--foreground)]/60 hover:text-blue-500 transition-all hover:scale-110"
            aria-label="Go to comments"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{commentsCount}</span>
          </button>

          {/* Divider */}
          <div className="h-6 w-px bg-[var(--foreground)]/10" />

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 text-[var(--foreground)]/60 hover:text-green-500 transition-all hover:scale-110"
            aria-label="Share story"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-sm font-medium">Share</span>
          </button>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        storyTitle={storyTitle}
        storyUrl={typeof window !== "undefined" ? window.location.href : ""}
      />
    </>
  );
}
