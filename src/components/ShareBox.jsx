"use client";

import { useState } from "react";
import { Heart, Share2, Sparkles, Star, BookOpen, Bookmark, Coffee, Moon, Sun } from "lucide-react";

export default function ShareBox({ 
  storyTitle = "The Boy Who Carried the Sun Through Winter", 
  coverImage,
  isLiked = false,
  onLikeClick
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    setCopied(true);
    const url = typeof window !== "undefined" ? window.location.href : "";
    navigator.clipboard.writeText(url).catch((err) => {
      console.error("Failed to copy:", err);
    });

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="my-8 md:my-10 max-w-3xl mx-auto px-4 sm:px-0">
      {/* Main card with cream background - Responsive layout */}
      <div className="relative flex flex-col sm:flex-row min-h-[280px] sm:h-56 md:h-60 overflow-hidden bg-[#FFF8E7] border-3 sm:border-4 border-[#2D3142] shadow-[4px_4px_0px_0px_rgba(45,49,66,1)] sm:shadow-[8px_8px_0px_0px_rgba(45,49,66,1)]">
        
        {/* Doodle pattern background using Lucide icons */}
        

        {/* Hand-drawn squiggle decoration - Hidden on mobile for cleaner look */}
        <svg className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none hidden sm:block" xmlns="http://www.w3.org/2000/svg">
          <path d="M 50 30 Q 100 20, 150 30 T 250 30" stroke="#2D3142" strokeWidth="2" fill="none" />
          <path d="M 300 200 Q 350 190, 400 200 T 500 200" stroke="#2D3142" strokeWidth="2" fill="none" />
          <circle cx="80" cy="180" r="3" fill="#EF476F" />
          <circle cx="420" cy="60" r="3" fill="#06D6A0" />
          <circle cx="520" cy="150" r="3" fill="#FFD166" />
        </svg>
        
        {/* Left side: Cover Image - Full width on mobile, 1/3 on desktop */}
        <div className="w-full sm:w-1/3 h-32 sm:h-full flex-shrink-0 relative p-3 sm:p-4">
          <div className="w-full h-full border-2 sm:border-3 border-[#2D3142] shadow-[3px_3px_0px_0px_rgba(45,49,66,1)] sm:shadow-[4px_4px_0px_0px_rgba(45,49,66,1)] overflow-hidden bg-white transform hover:rotate-1 transition-transform duration-300">
            {coverImage ? (
              <img
                src={coverImage}
                alt={storyTitle}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[#FFD166] flex items-center justify-center">
                <div className="text-[#2D3142] text-center">
                  <BookOpen className="w-8 sm:w-12 h-8 sm:h-12 mx-auto mb-1 sm:mb-2" />
                  <div className="text-xs font-bold uppercase tracking-wider">
                    Story
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Content - Full width on mobile, 2/3 on desktop */}
        <div className="w-full sm:w-2/3 flex flex-col justify-between p-4 sm:p-6 md:p-8 relative">
          
          {/* Decorative elements */}
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 flex gap-1">
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#EF476F]" />
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#06D6A0]" />
            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#FFD166]" />
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            {/* Label with hand-drawn underline */}
            <div className="relative inline-block">
              <h3 className="text-xs sm:text-sm font-black text-[#2D3142] tracking-wider uppercase">
                Currently Reading
              </h3>
              <svg className="absolute -bottom-1 left-0 w-full h-2" xmlns="http://www.w3.org/2000/svg">
                <path d="M 0 4 Q 30 2, 60 4 T 120 4 T 180 4" stroke="#EF476F" strokeWidth="2" fill="none" />
              </svg>
            </div>
            
            {/* Title with playful styling - Responsive font size */}
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-[#2D3142] leading-tight line-clamp-2 relative">
              {storyTitle}
            </h2>
          </div>

          {/* Buttons with neo-brutalism style - Stack on mobile */}
          <div className="flex gap-2 sm:gap-3 md:gap-4 flex-wrap mt-3 sm:mt-0">
            <button
              onClick={onLikeClick}
              className={`group/btn relative flex items-center justify-center gap-1.5 sm:gap-2 
                px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm
                font-black uppercase tracking-wide 
                border-2 sm:border-3 transition-all duration-200
                active:translate-x-1 active:translate-y-1 ${
                  isLiked
                    ? "bg-[#EF476F] text-white border-[#2D3142] shadow-[3px_3px_0px_0px_rgba(45,49,66,1)] sm:shadow-[4px_4px_0px_0px_rgba(45,49,66,1)] hover:shadow-[4px_4px_0px_0px_rgba(45,49,66,1)] sm:hover:shadow-[6px_6px_0px_0px_rgba(45,49,66,1)]"
                    : "bg-white text-[#2D3142] border-[#2D3142] shadow-[3px_3px_0px_0px_rgba(45,49,66,1)] sm:shadow-[4px_4px_0px_0px_rgba(45,49,66,1)] hover:shadow-[4px_4px_0px_0px_rgba(45,49,66,1)] sm:hover:shadow-[6px_6px_0px_0px_rgba(45,49,66,1)]"
                }`}
            >
              <Heart
                className={`w-4 sm:w-5 h-4 sm:h-5 transition-transform duration-200 ${
                  isLiked ? "fill-current scale-110" : "group-hover/btn:scale-110"
                }`}
              />
              <span>{isLiked ? "Liked!" : "Like"}</span>
            </button>

            <button
              onClick={handleShare}
              className="group/btn relative flex items-center justify-center gap-1.5 sm:gap-2 
                px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm
                bg-[#06D6A0] text-[#2D3142] font-black uppercase tracking-wide 
                border-2 sm:border-3 border-[#2D3142]
                shadow-[3px_3px_0px_0px_rgba(45,49,66,1)] sm:shadow-[4px_4px_0px_0px_rgba(45,49,66,1)]
                hover:shadow-[4px_4px_0px_0px_rgba(45,49,66,1)] sm:hover:shadow-[6px_6px_0px_0px_rgba(45,49,66,1)]
                transition-all duration-200
                active:translate-x-1 active:translate-y-1"
            >
              <Share2 className="w-4 sm:w-5 h-4 sm:h-5 transition-transform duration-200 group-hover/btn:scale-110" />
              <span>{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
