"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { QUICK_READS } from "@/constants/homepage_data";
import StoryCard from "../StoryCard";

/* ------------------------------ component ------------------------------ */

const QuickReads = () => {
  if (!QUICK_READS.length) return null;

  return (
    <section className="py-16 md:py-28 bg-[#e7f2e4]">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header with Swipe Cue matching TrendingSection */}
        <div className="flex items-end justify-between px-6 mb-10">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#2d3a2a] mb-2">
              Quick Reads
            </h2>
            <div className="h-1.5 w-16 md:w-24 bg-[#c5d8c1] rounded-full" />
            <p className="mt-4 text-base md:text-lg text-[#5a6358] max-w-2xl">
              Short on time? Dive into these bite-sized stories—perfect for a quick escape. Each one takes 10 minutes or less.
            </p>
          </div>

          {/* Mobile Swipe Cue */}
          <div className="lg:hidden flex items-center gap-1 text-[#5a7a53] font-medium animate-pulse pb-1">
            <ArrowRight size={16} />
          </div>
        </div>

        {/* Framed container */}
        <div className="px-6 relative md:rounded-3xl overflow-hidden border-y md:border border-[#c5d8c1]/60 bg-[#e9f0e6] md:mx-6">
          {/* Background illustration */}
          <img
            src="https://i.pinimg.com/1200x/b1/5e/f6/b15ef640cf285b568c5506ae11f55aec.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Soft wash layer */}
          <div className="absolute inset-0 bg-[#f3f7f2]/10" />

          {/* Content Area */}
          <div className="relative">
            {/* ---- MOBILE SWIPE CONTAINER ---- */}
            <div className="lg:hidden">
              <div 
                className="flex gap-4 overflow-x-auto py-10 snap-x snap-mandatory scrollbar-hide"
                style={{ 
                    paddingLeft: '1.5rem', 
                    paddingRight: '1.5rem',
                    scrollbarWidth: 'none', 
                    msOverflowStyle: 'none' 
                }}
              >
                {QUICK_READS.map((story, index) => (
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
            <div className="hidden lg:grid grid-cols-6 gap-8 p-14">
              {QUICK_READS.map((story, index) => (
                <StoryCard key={story.id || index} story={story} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickReads;
