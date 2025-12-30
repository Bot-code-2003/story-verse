import React from "react";
import { ArrowRight, Coffee, Music, PenTool } from "lucide-react";
import Link from "next/link";
import StoryCard from "../StoryCard";

const TrendingSection = ({ trendingStories = [], loading = false }) => {
  if (loading || trendingStories.length === 0) return null;

  return (
    <section className="px-6 relative py-12 md:py-24 bg-[#e7f2e4] overflow-hidden">
      {/* Decorative doodles (desktop only) */}
      <div className="absolute top-10 left-10 text-[#5a7a53]/10 -rotate-12 hidden lg:block">
        <Music size={120} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between px-6 mb-8 lg:mb-16">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#2d3a2a] mb-2">
              Trending now
            </h2>
            <div className="h-1.5 w-16 md:w-24 bg-[#c5d8c1] rounded-full" />
          </div>

          {/* Swipe Cue (Mobile Only) - Positioned like your drawing */}
          <div className="lg:hidden flex items-center gap-1 text-[#5a7a53] font-medium animate-pulse pb-1">
            {/* <span className="text-xs uppercase tracking-widest italic">swipe</span> */}
            <ArrowRight size={16} />
          </div>

          {/* Desktop Button */}
          <Link
            href="/login?redirect=/home"
            className="group hidden md:flex items-center gap-3 px-6 py-3 rounded-full bg-white text-[#5a7a53] font-bold border border-[#c5d8c1] hover:shadow-md transition-all"
          >
            See all stories
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* ---- MOBILE SWIPE CONTAINER ---- */}
        <div className="lg:hidden">
          <div 
            className="flex gap-4 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
            /* This style ensures the first card has a "virtual" margin on the left */
            style={{ 
                paddingLeft: '1.5rem', 
                paddingRight: '1.5rem',
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none' 
            }}
          >
            {trendingStories.slice(0, 6).map((story, index) => (
              <div
                key={story.id || index}
                className="snap-start flex-shrink-0 w-[150px]" 
              >
                <StoryCard story={story} index={index} />
              </div>
            ))}
          </div>
        </div>

        {/* ---- DESKTOP GRID ---- */}
        <div className="hidden lg:grid grid-cols-6 gap-8 px-6 pb-12">
          {trendingStories.slice(0, 6).map((story, index) => (
            <StoryCard key={story.id || index} story={story} index={index} />
          ))}
        </div>

        {/* Footer quote */}
        <div className="text-center mt-4 lg:mt-12 px-6">
          <p className="font-serif italic text-[#5a7a53] text-sm md:text-lg">
            “Discover the stories shaping our world, one read at a time.”
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrendingSection;