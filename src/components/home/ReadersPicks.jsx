"use client";

import React, { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { FEATURED_STORIES } from "@/constants/featured_stories";
import StoryCard from "../StoryCard";

/* ------------------------------ config ------------------------------ */

const PICKED_IDS = [
  "69355933cdab065d273496e5",
  "693d1d0459f1aec7e54942ff",
  "6943d187279d8260bf46808b",
  "693e492b054ee2f9aebd361f",
  "693ec8b5945dc639e08f963c",
  "69358203cdab065d27349aa9",
];

/* ------------------------------ component ------------------------------ */

const ReadersPicks = () => {
  const pickedStories = useMemo(
    () =>
      FEATURED_STORIES.filter(story =>
        PICKED_IDS.includes(story.id)
      ),
    []
  );

  if (!pickedStories.length) return null;

  return (
    <section className="py-16 md:py-28 bg-[#e7f2e4]">
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header with Swipe Cue matching TrendingSection */}
        <div className="flex items-end justify-between px-6 mb-10">
          <div className="flex-1">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#2d3a2a] mb-2">
              Get a taste
            </h2>
            <div className="h-1.5 w-16 md:w-24 bg-[#c5d8c1] rounded-full" />
            <p className="mt-4 text-base md:text-lg text-[#5a6358] max-w-2xl">
              A curated sampler of what TheStoryBits has to offer. Dive in and discover your next favorite read.
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
            src="https://i.pinimg.com/1200x/c2/2a/f1/c22af1128a36c62120426d629ca4970a.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Soft wash layer */}
          <div className="absolute inset-0 bg-[#f3f7f2]/50" />

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
                {pickedStories.map((story, index) => (
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
              {pickedStories.map((story, index) => (
                <StoryCard key={story.id || index} story={story} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* Footer quote */}
        <div className="mt-10 text-center px-6">
          <p className="font-serif italic text-[#5a7a53] text-sm md:text-lg">
            Like what you taste? There's plenty more where that came from.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReadersPicks;