"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Clock, ChevronRight } from "lucide-react";
import { FEATURED_STORIES } from "@/constants/featured_stories";
import { AuthModal } from "@/components/AuthModal";

/* -------------------------------- constants -------------------------------- */

const HERO_ROTATION_INTERVAL = 6000;

const HERO_FEATURED_IDS = [
  "69355933cdab065d273496e5",
  "6943d187279d8260bf46808b",
  "693e492b054ee2f9aebd361f",
  "69358203cdab065d27349aa9",
];

/* -------------------------------- component -------------------------------- */

const HeroSection = () => {
  const heroStories = useMemo(
    () =>
      FEATURED_STORIES.filter(story =>
        HERO_FEATURED_IDS.includes(story.id)
      ),
    []
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (heroStories.length <= 1) return;

    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % heroStories.length);
    }, HERO_ROTATION_INTERVAL);

    return () => clearInterval(timer);
  }, [heroStories.length]);

  if (!heroStories.length) return null;

  const currentStory = heroStories[activeIndex];

  /* ---------------------------------- render --------------------------------- */

  return (
    <section className="relative min-h-screen lg:min-h-[85vh] flex items-center px-6 py-12 bg-[#e7f2e4] overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[60%] bg-[#e2ede0]  blur-[120px] opacity-70" />
        <div className="absolute bottom-0 right-[5%] w-[35%] h-[55%] bg-[#d8e6d5]  blur-[100px] opacity-60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-3 gap-16 items-center">
        {/* ------------------------------ Text Content ----------------------------- */}
        <div className="space-y-6 text-center lg:text-center lg:col-span-2">

          <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold font-serif text-[#2d3a2a] leading-tight">
            Stories that fit <br />
            <span className="italic font-medium text-[#5a7a53]">
              your coffee break.
            </span>
          </h1>

          <p className="text-base md:text-lg text-[#5a6358] leading-relaxed max-w-md mx-auto lg:mx-auto">
            Complete fiction in 5-15 minutes. No subscriptions.
            No cliffhangers. Just captivating short stories across all genres.
          </p>

          <div className="pt-4 flex justify-center lg:justify-center">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="group inline-flex items-center gap-3 px-10 py-4 rounded-2xl bg-[#5a7a53] hover:bg-[#4a6344] text-white font-bold text-lg transition-all active:scale-95"
            >
              Get Started
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* ------------------------------ Book Display ------------------------------ */}
        <div className="relative flex justify-center w-full mx-auto lg:col-span-1">
          {/* Stacked depth layers (visual cue) */}
          <div className="absolute inset-0 flex justify-center">
            <div className="absolute top-2 w-[200px] sm:w-[240px] lg:w-[300px] aspect-[5/7] rounded-r-3xl rounded-l-md bg-[#c5d8c1] opacity-30" />
            <div className="absolute top-4 w-[200px] sm:w-[240px] lg:w-[300px] aspect-[5/7] rounded-r-3xl rounded-l-md bg-[#c5d8c1] opacity-20" />
          </div>

          {/* Main book */}
          <div className="relative z-20 w-[200px] sm:w-[240px] lg:w-[300px] aspect-[5/7] rounded-r-3xl rounded-l-md shadow-xl">
            <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/20 to-transparent rounded-l-md z-30" />

            <img
              src={currentStory.coverImage}
              alt={currentStory.title}
              className="w-full h-full object-cover rounded-xl"
            />

            {/* Floating card */}
            <div className="absolute -bottom-8 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/60 z-40">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-[#5a7a53] uppercase tracking-widest">
                  <span className="bg-[#e2ede0] px-2 py-0.5 rounded">
                    Featured
                  </span>
                  <span className="flex items-center gap-1 opacity-70">
                    <Clock size={12} />
                    {currentStory.readTime}m
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[#2d3a2a] line-clamp-1">
                  {currentStory.title}
                </h3>

                <Link
                  href={`/stories/${currentStory.id}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#5a7a53] hover:bg-[#4a6344] text-white text-sm font-bold transition-colors"
                >
                  Read Now
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Pagination */}
          <div className="absolute -bottom-20 flex gap-3">
            {heroStories.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-[#5a7a53]"
                    : "w-2 bg-[#c5d8c1]"
                }`}
                aria-label={`Show story ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        form="signup"
      />
    </section>
  );
};

export default HeroSection;
