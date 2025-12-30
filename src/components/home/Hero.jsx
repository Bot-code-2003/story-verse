"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FEATURED_STORIES } from "@/constants/featured_stories";
import { AuthModal } from "@/components/AuthModal";

/* -------------------------------- Constants ------------------------------- */

const HERO_FEATURED_IDS = [
  "69355933cdab065d273496e5",
  "6943d187279d8260bf46808b",
  "693e492b054ee2f9aebd361f",
  "69358203cdab065d27349aa9",
];

/* -------------------------------- Sub-Components --------------------------- */

const FloatingCard = ({ story, className, rotation, parallaxOffset = 0 }) => {
  if (!story) return null;

  return (
    <div 
      className={`absolute pointer-events-auto group z-20 ${className}`}
      style={{
        transform: `translateY(${parallaxOffset}px)`,
        transition: 'transform 0.1s ease-out',
        willChange: 'transform'
      }}
    >
      <Link href={`/stories/${story.id}`} aria-label={`Read ${story.title}`}>
        {/* Adjusted width: w-20 on tiny screens, w-24 on small, scaling up for md/lg */}
        <div 
          className={`z-[1000] relative w-20 sm:w-28 md:w-36 lg:w-44 aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl transition-all duration-700 ease-out group-hover:scale-110 group-hover:rotate-0 group-hover:z-30 ${rotation}`}
        >
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 640px) 80px, (max-width: 1024px) 150px, 200px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 sm:p-4">
            <p className="text-white text-[8px] sm:text-xs font-bold leading-tight line-clamp-2">
              {story.title}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
};

/* -------------------------------- Main Component --------------------------- */

const HeroSection = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const heroStories = useMemo(
    () => FEATURED_STORIES.filter((story) => HERO_FEATURED_IDS.includes(story.id)),
    []
  );

  // Parallax scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame for smooth performance
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (heroStories.length < 4) return null;

  // Define a maximum parallax offset to prevent cards from going too far
  const maxParallaxOffset = 80; // Adjust this value as needed

  return (
    <div className="relative bg-[#e7f2e4] z-50">
      <section 
        className="max-w-7xl mx-auto relative min-h-[90vh] md:min-h-screen flex items-center justify-center px-6 py-12 md:py-20"
        aria-labelledby="hero-title"
      >
        {/* 1. Background Visuals */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" aria-hidden="true">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <circle cx="10%" cy="10%" r="8" fill="#c5dbc1" />
            <circle cx="90%" cy="90%" r="12" fill="#c5dbc1" />
          </svg>
        </div>

        {/* 2. Floating Cards - Now visible on mobile */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Top Left - Tucked into corner for mobile */}
          <FloatingCard 
            story={heroStories[0]} 
            className="top-20 left-10 sm:top-12 sm:left-12 md:top-16 md:left-20" 
            rotation="rotate-[-6deg] sm:rotate-[-8deg]"
            parallaxOffset={Math.min(scrollY * 0.2, maxParallaxOffset)} // Adjust speed as needed
          />
          {/* Top Right */}
          <FloatingCard 
            story={heroStories[1]} 
            className="top-20 right-10 sm:top-12 sm:right-12 md:top-16 md:right-20" 
            rotation="rotate-[6deg] sm:rotate-[8deg]"
            parallaxOffset={Math.min(scrollY * 0.3, maxParallaxOffset)} // Adjust speed as needed
          />
          {/* Bottom Left */}
          <FloatingCard 
            story={heroStories[2]} 
            className="bottom-20 left-10 sm:bottom-12 sm:left-12 md:bottom-16 md:left-20" 
            rotation="rotate-[4deg] sm:rotate-[6deg]"
            parallaxOffset={Math.min(scrollY * 0.1, maxParallaxOffset)} // Adjust speed as needed
          />
          {/* Bottom Right */}
          <FloatingCard 
            story={heroStories[3]} 
            className="bottom-20 right-10 sm:bottom-12 sm:right-12 md:bottom-16 md:right-20" 
            rotation="rotate-[-4deg] sm:rotate-[-6deg]"
            parallaxOffset={Math.min(scrollY * 0.25, maxParallaxOffset)} // Adjust speed as needed
          />
        </div>

        {/* 3. Central Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-8 sm:space-y-10">
          <div className="space-y-4 sm:space-y-6">
            <h1 
              id="hero-title"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#2d3a2a] leading-[1.1] tracking-tight"
            >
              Stories that
              <br />
              <span className="text-[#5a7a53] italic font-light">linger.</span>
            </h1>
            
            <p className="text-base sm:text-xl md:text-2xl text-[#5a6358] max-w-xs sm:max-w-md mx-auto leading-relaxed font-medium">
              Complete fiction designed to be enjoyed in <span className="text-[#2d3a2a]">5-15 minutes.</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto group inline-flex items-center justify-center gap-3 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[#2d3a2a] hover:bg-[#1d2a1a] text-white font-bold text-base sm:text-lg transition-all duration-300 hover:shadow-xl active:scale-95"
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              href="/stories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-white/70 backdrop-blur-md hover:bg-white text-[#2d3a2a] font-bold text-base sm:text-lg border-2 border-[#e2ede0] transition-all duration-300 hover:shadow-md active:scale-95"
            >
              Browse Stories
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