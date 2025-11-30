"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedAuthors({ authors }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample data if no authors provided
  const authorsData = authors || [
    {
      id: "u10",
      name: "Sarah Mitchell",
      bio: "Award-winning author crafting stories that blur the lines between reality and imagination.",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
      storiesCount: 12,
    },
    {
      id: "u5",
      name: "James Chen",
      bio: "Master of science fiction and speculative narratives exploring the future of humanity.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
      storiesCount: 18,
    },
    {
      id: "u8",
      name: "Emma Rodriguez",
      bio: "Contemporary fiction writer with a passion for character-driven stories.",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop",
      storiesCount: 15,
    },
    {
      id: "u3",
      name: "David Thompson",
      bio: "Historical fiction specialist bringing the past to life through immersive tales.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop",
      storiesCount: 9,
    },
  ];

  const currentAuthor = authorsData[currentIndex];

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === authorsData.length - 1 ? 0 : prevIndex + 1
      );
    }, 10000);

    return () => clearInterval(interval);
  }, [authorsData.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? authorsData.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === authorsData.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <section className="mb-20">
      <div className="relative rounded-3xl overflow-hidden border border-[var(--foreground)]/10">
        {/* Navigation Arrows - Absolute positioned */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--foreground)]/10 hover:bg-[var(--background)] transition-colors"
          aria-label="Previous author"
        >
          <ChevronLeft className="w-5 h-5 text-[var(--foreground)]" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--foreground)]/10 hover:bg-[var(--background)] transition-colors"
          aria-label="Next author"
        >
          <ChevronRight className="w-5 h-5 text-[var(--foreground)]" />
        </button>

        <div className="grid md:grid-cols-2 min-h-[480px]">
          {/* Left Side - Image */}
          <div className="relative h-[300px] md:h-auto order-2 md:order-1">
            <img
              src={currentAuthor.image}
              alt={currentAuthor.name}
              className="absolute inset-0 aspect-square w-full object-cover grayscale transition-all duration-500"
              key={currentAuthor.id}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[var(--background)] opacity-50 md:opacity-100"></div>
          </div>

          {/* Right Side - Content */}
          <div className="p-8 md:p-12 flex flex-col justify-center order-1 md:order-2">
            <div className="space-y-5">
              {/* Label */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium tracking-wider uppercase text-[var(--foreground)]/40">
                  Featured Author
                </span>
                <span className="text-xs text-[var(--foreground)]/40">
                  {currentIndex + 1} / {authorsData.length}
                </span>
              </div>

              {/* Author Name */}
              <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[var(--foreground)]">
                {currentAuthor.name}
              </h2>

              {/* Bio */}
              <p className="text-base text-[var(--foreground)]/60 leading-relaxed">
                {currentAuthor.bio}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    {currentAuthor.storiesCount}
                  </p>
                  <p className="text-xs text-[var(--foreground)]/50">Stories</p>
                </div>
                <div className="h-10 w-px bg-[var(--foreground)]/10"></div>
                <div>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    10K+
                  </p>
                  <p className="text-xs text-[var(--foreground)]/50">Readers</p>
                </div>
              </div>

              {/* CTA and Dots */}
              <div className="flex items-center justify-between pt-2">
                <Link
                  href={`/authors/${currentAuthor.id}`}
                  className="inline-block px-6 py-3 rounded-full font-semibold text-sm text-white bg-black hover:bg-black/90 transition-colors"
                >
                  View Profile
                </Link>

                {/* Dot Indicators */}
                <div className="flex gap-2">
                  {authorsData.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentIndex
                          ? "w-6 bg-[var(--foreground)]"
                          : "w-1.5 bg-[var(--foreground)]/20 hover:bg-[var(--foreground)]/40"
                      }`}
                      aria-label={`Go to author ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
