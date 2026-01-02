"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen } from "lucide-react";
import { FEATURED_STORIES } from "@/constants/featured_stories";
import { AuthModal } from "@/components/AuthModal";

/* -------------------------------- Configuration --------------------------- */

// We need more IDs now. If you don't have 8 unique ones yet, 
// the code below will automatically repeat the ones you have to fill the visual space.
const HERO_FEATURED_IDS = [
  "6943d187279d8260bf46808b", 
  "69358203cdab065d27349aa9", 
  "694566813a34a78e49e3e482", 
  "69563b395c6234987addd15a",
  "694f890a920aaf27bfc71dc2",
  "694f8a11613baf95f13bab46",
  "694581540f3e2033412a91e4",
  "69565e64cfea22882082fa46",
  // Add more IDs here if you have them in your DB
];

/* -------------------------------- Sub-Components --------------------------- */

const StoryCard = ({ story, priority = false }) => {
  return (
    <Link 
      href={`/stories/${story.id}`}
      className="group relative block h-[240px] w-[130px] sm:h-[280px] sm:w-[190px] flex-shrink-0 mx-4 transition-transform hover:scale-105 duration-300"
    >
      <div className="relative h-full w-full rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-gray-200">
        <Image
          src={story.coverImage}
          alt={story.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 200px, 230px"
          priority={priority}
        />
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <span className="text-white text-xs font-bold uppercase tracking-wider mb-1 text-opacity-80">Read Now</span>
          <h3 className="text-white text-sm font-serif font-medium leading-tight line-clamp-2">
            {story.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

const InfiniteMarquee = ({ items, direction = "left", speed = 40 }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="flex w-full overflow-hidden py-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="flex min-w-full items-center"
        style={{
          // We use inline styles for the animation to avoid complex tailwind config changes
          animation: `marquee-${direction} ${speed}s linear infinite`,
          animationPlayState: isHovered ? 'paused' : 'running',
        }}
      >
        {items.map((story, idx) => (
          <StoryCard key={`${story.id}-1-${idx}`} story={story} priority={idx < 2} />
        ))}
        {/* Duplicate items to create seamless loop */}
        {items.map((story, idx) => (
          <StoryCard key={`${story.id}-2-${idx}`} story={story} />
        ))}
      </div>
      
      {/* Styles for the keyframes */}
      <style jsx>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

/* -------------------------------- Main Component --------------------------- */

const HeroSection = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // 1. Fetch Stories
  const heroStories = useMemo(() => {
    const found = FEATURED_STORIES.filter((story) => HERO_FEATURED_IDS.includes(story.id));
    // If we have fewer than 8 stories, double the array so the marquee looks full
    if (found.length > 0 && found.length < 8) {
      return [...found, ...found]; 
    }
    return found;
  }, []);

  // 2. Split stories into two rows for visual variety
  const topRowStories = heroStories.slice(0, Math.ceil(heroStories.length / 2));
  const bottomRowStories = heroStories.slice(Math.ceil(heroStories.length / 2));

  if (heroStories.length === 0) return null;

  return (
    <div className="relative w-full h-[95vh] md:h-screen bg-[#e7f2e4] overflow-hidden flex flex-col justify-center">
      
      {/* --- BACKGROUND LAYER: The Drifting Library --- */}
      <div 
        className="absolute inset-0 z-0 flex flex-col justify-center opacity-60 md:opacity-80"
        style={{ 
          transform: 'rotate(-0deg) scale(1.1)', // Rotates the whole wall of cards
          transformOrigin: 'center'
        }}
      >
        {/* Row 1: Moves Left */}
        <div className="mb-4 sm:mb-8 opacity-90 hover:opacity-100 transition-opacity duration-500">
          <InfiniteMarquee items={[...topRowStories, ...bottomRowStories]} direction="left" speed={50} />
        </div>

        {/* Row 2: Moves Right */}
        <div className="opacity-90 hover:opacity-100 transition-opacity duration-500">
          <InfiniteMarquee items={[...bottomRowStories, ...topRowStories]} direction="right" speed={60} />
        </div>
      </div>

      {/* --- OVERLAY LAYER: Fade + Vignette --- */}
      {/* This radial gradient ensures text is legible regardless of the images behind it */}
       <div
  className="absolute inset-0 z-10 pointer-events-none
  bg-[radial-gradient(circle_at_center,_rgba(242,247,240,0.97)_0%,_rgba(242,247,240,0.94)_22%,_rgba(242,247,240,0.80)_32%,_transparent_52%)]"
/>



 {/* <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#f2f7f0] via-transparent to-[#f2f7f0]/50 pointer-events-none" /> */}

      {/* --- CONTENT LAYER --- */}
      <section className="relative z-20 max-w-3xl mx-auto px-6 w-full text-center">
        
<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">

   {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2d3a2a]/5 border border-[#2d3a2a]/10 backdrop-blur-sm mx-auto">
            <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide uppercase text-[#5a7a53]">
              New Stories Added Weekly
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl md:text-6xl font-serif font-bold text-[#1a2118] leading-[1.05] tracking-tight drop-shadow-sm">
            Stories that <br />
            <span className="italic text-[#4a6345] relative inline-block">
              linger
              <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#a8c5a3]" viewBox="0 0 100 10" preserveAspectRatio="none">
                 <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="3" fill="none" />
              </svg>
            </span> 
            long after.
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-2xl text-[#4b5548] max-w-2xl mx-auto leading-relaxed font-medium">
            A curated collection of bite-sized fiction. <br className="hidden sm:block"/>
            Escape reality for <span className="text-[#2d3a2a] font-bold decoration-2 underline decoration-[#a8c5a3]/50">5-15 minutes</span> at a time.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto group relative overflow-hidden inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-[#2d3a2a] text-white font-bold text-lg shadow-xl shadow-[#2d3a2a]/20 transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <span className="relative cursor-pointer z-10 flex items-center gap-2">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-[#3d4f39] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </button>

            <Link
              href="/stories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full bg-white/60 backdrop-blur-md hover:bg-white text-[#2d3a2a] font-bold text-lg border border-[#c5dbc1] shadow-sm transition-all duration-300 hover:shadow-lg active:scale-95 group"
            >
              <BookOpen className="w-5 h-5 text-[#5a7a53] group-hover:scale-110 transition-transform" />
              Browse Library
            </Link>
          </div>
        </div>

        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          form="signup"
        />
      </section>
    </div>
  );
};

export default HeroSection;