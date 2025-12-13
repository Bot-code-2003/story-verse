"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, ChevronLeft, ChevronRight, Heart, Clock } from "lucide-react";
import { fetchWithCache, CACHE_KEYS } from "@/lib/cache";

export default function FeaturedAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchActiveAuthors = async () => {
      try {
        // Use caching with 10-minute TTL
        const data = await fetchWithCache(CACHE_KEYS.FEATURED_AUTHOR, async () => {
          const res = await fetch("/api/authors/active?limit=5");
          if (!res.ok) throw new Error("Failed to fetch authors");
          const json = await res.json();
          return json.authors || [];
        });
        
        setAuthors(data);
      } catch (error) {
        console.error("Error fetching active authors:", error);
        setAuthors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveAuthors();
  }, []);

  // Auto-rotate carousel every 8 seconds
  useEffect(() => {
    if (authors.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % authors.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [authors.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? authors.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % authors.length);
  };

  if (loading) {
    return (
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6">
          Latest Active Authors
        </h2>
        <div className="animate-pulse bg-[var(--foreground)]/5 rounded-2xl h-96" />
      </section>
    );
  }

  if (authors.length === 0) {
    return null;
  }

  const currentAuthor = authors[currentIndex];

  return (
    <section className="mb-16">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[var(--foreground)]">
          Latest Active Authors
        </h2>
        <span className="text-sm text-[var(--foreground)]/50">
          {currentIndex + 1} / {authors.length}
        </span>
      </div>

      {/* Carousel Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[var(--foreground)]/10 bg-gradient-to-br from-[var(--foreground)]/5 to-transparent">
        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[var(--background)] border border-[var(--foreground)]/20 hover:border-blue-500 shadow-lg transition-all hover:scale-110"
          aria-label="Previous author"
        >
          <ChevronLeft className="w-5 h-5 text-[var(--foreground)]" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-[var(--background)] border border-[var(--foreground)]/20 hover:border-blue-500 shadow-lg transition-all hover:scale-110"
          aria-label="Next author"
        >
          <ChevronRight className="w-5 h-5 text-[var(--foreground)]" />
        </button>

        {/* Carousel Content */}
        <div className="grid md:grid-cols-4 gap-6 p-8">
          {/* Left 1/4 - Author Info */}
          <div className="md:col-span-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
            {/* Profile Image */}
            <Link href={`/authors/${currentAuthor.username}`} className="group">
              {currentAuthor.profileImage ? (
                <img
                  src={currentAuthor.profileImage}
                  alt={currentAuthor.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-xl group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-4xl border-4 border-white dark:border-gray-800 shadow-xl group-hover:scale-105 transition-transform">
                  {(currentAuthor.name || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </Link>

            {/* Author Name */}
            <div>
              <Link
                href={`/authors/${currentAuthor.username}`}
                className="block"
              >
                <h3 className="text-xl font-bold text-[var(--foreground)] hover:text-blue-600 transition">
                  {currentAuthor.name}
                </h3>
              </Link>
              <p className="text-sm text-[var(--foreground)]/50 mt-1">
                {currentAuthor.username}
              </p>
            </div>

            {/* Bio */}
            {currentAuthor.bio && (
              <p className="text-sm text-[var(--foreground)]/60 leading-relaxed line-clamp-3 px-4">
                {currentAuthor.bio}
              </p>
            )}

            {/* View Profile Button */}
            <Link
              href={`/authors/${currentAuthor.username}`}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-lg"
            >
              View Profile
            </Link>
          </div>

          {/* Right 3/4 - Latest Stories */}
          <div className="md:col-span-3 grid md:grid-cols-3 gap-6">
            {currentAuthor.latestStories.map((story, idx) => (
              <Link
                key={story.id}
                href={`/stories/${story.id}`}
                className="group relative rounded-xl overflow-hidden border border-[var(--foreground)]/10 hover:border-blue-500/50 bg-[var(--background)] transition-all hover:shadow-xl"
              >
                {/* Story Cover Image */}
                <div className="relative h-60 overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600">
                  {story.coverImage ? (
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="w-16 h-16 text-white/50" />
                    </div>
                  )}
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Genre Badge */}
                  {story.genres && story.genres[0] && (
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-[var(--background)]/90 text-xs font-medium text-[var(--foreground)] backdrop-blur-sm">
                        {story.genres[0]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Story Info */}
                <div className="p-4">
                  <h4 className="font-bold text-[var(--foreground)] group-hover:text-blue-600 transition line-clamp-2 mb-2">
                    {story.title}
                  </h4>
                  
                  {story.description && (
                    <p className="text-sm text-[var(--foreground)]/60 line-clamp-2 mb-3">
                      {story.description}
                    </p>
                  )}

                  {/* Story Meta */}
                  <div className="flex items-center gap-3 text-xs text-[var(--foreground)]/50">
                    {story.readTime && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{story.readTime} min</span>
                      </div>
                    )}
                    {typeof story.likesCount === "number" && story.likesCount > 0 && (
                      <div className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5" />
                        <span>{story.likesCount}</span>
                      </div>
                    )}
                    {story.publishedAt && (
                      <span>
                        {new Date(story.publishedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </Link>
            ))}

            {/* Placeholder if only 1 story */}
            {currentAuthor.latestStories.length === 1 && (
              <div className="rounded-xl border-2 border-dashed border-[var(--foreground)]/10 flex items-center justify-center p-8">
                <div className="text-center text-[var(--foreground)]/40">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">More stories coming soon</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Dot Indicators */}
        <div className="flex justify-center gap-2 pb-6">
          {authors.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "w-8 bg-blue-600"
                  : "w-2 bg-[var(--foreground)]/20 hover:bg-[var(--foreground)]/40"
              }`}
              aria-label={`Go to author ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
