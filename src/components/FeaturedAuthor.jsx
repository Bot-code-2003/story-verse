"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, ArrowRight, Clock } from "lucide-react";
import { fetchWithCache, CACHE_KEYS } from "@/lib/cache";
import { getGenreFallback } from "@/constants/genres";

export default function FeaturedAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const limit = typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches
  ? 80
  : 300;

  useEffect(() => {
    const fetchActiveAuthors = async () => {
      try {
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

  useEffect(() => {
    if (authors.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % authors.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [authors.length, currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? authors.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % authors.length);
  };

  if (loading) {
    return (
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-[var(--foreground)] mb-8">
          Featured Authors
        </h2>
        <div className="animate-pulse bg-[var(--foreground)]/5 rounded-3xl h-96" />
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
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-[var(--foreground)]">
            Featured Authors
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-sm font-medium text-[var(--foreground)]/40">
  {currentIndex + 1} / {authors.length}
</span>

          <div className="flex gap-2">
            <button
              onClick={goToPrevious}
              className="p-2 rounded-full bg-[var(--background)] border border-[var(--foreground)]/10 hover:border-[var(--foreground)]/30 transition-all duration-300"
              aria-label="Previous author"
            >
              <ChevronLeft className="w-5 h-5 text-[var(--foreground)]" />
            </button>
            <button
              onClick={goToNext}
              className="p-2 rounded-full bg-[var(--background)] border border-[var(--foreground)]/10 hover:border-[var(--foreground)]/30 transition-all duration-300"
              aria-label="Next author"
            >
              <ChevronRight className="w-5 h-5 text-[var(--foreground)]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Carousel Card */}
      <div className="relative rounded-3xl overflow-hidden bg-[var(--foreground)]/5 border border-[var(--foreground)]/10">
        <div className="p-6 md:p-8">
          <div className="grid lg:grid-cols-5 gap-6 items-start">
            {/* Left Side - Author Info */}
            <div className="lg:col-span-2">
              <div className="sticky top-8">
                {/* Profile Section */}
                <div className="flex items-start gap-4 mb-5">
                  <Link href={`/authors/${currentAuthor.username}`} className="group flex-shrink-0">
                    {currentAuthor.profileImage ? (
                      <img
                        src={currentAuthor.profileImage}
                        alt={currentAuthor.name}
                        className="w-20 h-20 md:w-24 md:h-24 rounded-2xl object-cover border-2 border-[var(--foreground)]/10 shadow-lg group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-[var(--foreground)]/10 flex items-center justify-center text-[var(--foreground)] font-bold text-2xl md:text-3xl border-2 border-[var(--foreground)]/10 shadow-lg group-hover:scale-105 transition-transform duration-300">
                        {(currentAuthor.name || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </Link>
                  
                  <div className="flex-1 pt-1">
                    <Link href={`/authors/${currentAuthor.username}`}>
                      <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] hover:text-blue-600 transition mb-1">
                        {currentAuthor.name}
                      </h3>
                    </Link>
                    <p className="text-[var(--foreground)]/50 text-sm mb-2">
                      {currentAuthor.username}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                {currentAuthor.bio && (
                  <div className="bg-[var(--background)] rounded-2xl p-5 mb-5 border border-[var(--foreground)]/10">
                    <p className="text-[var(--foreground)]/70 leading-relaxed text-sm">
  {currentAuthor.bio.length > limit
    ? currentAuthor.bio.slice(0, limit) + "..."
    : currentAuthor.bio}
</p>
                  </div>
                )}

                {/* CTA Button */}
                <Link
                  href={`/authors/${currentAuthor.username}`}
                  className="w-full group flex items-center justify-center gap-2 bg-[var(--foreground)] text-[var(--background)] font-semibold py-3 px-6 rounded-2xl hover:opacity-90 transition-all duration-300"
                >
                  View Full Profile
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {authors.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex
                          ? "w-8 bg-[var(--foreground)]"
                          : "w-2 bg-[var(--foreground)]/20 hover:bg-[var(--foreground)]/40"
                      }`}
                      aria-label={`Go to author ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side - Latest Stories */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-5">
                <h4 className="text-lg font-bold text-[var(--foreground)]">Latest Stories</h4>
                <Link 
                  href={`/authors/${currentAuthor.username}`}
                  className="text-sm text-[var(--foreground)]/50 hover:text-[var(--foreground)] font-medium transition"
                >
                  View All →
                </Link>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentAuthor.latestStories.slice(0, 2).map((story) => {
                  const genresArr = Array.isArray(story.genres) ? story.genres : [];
                  const genreFallbackImage = getGenreFallback(genresArr);
                  const finalImage = story.coverImage || genreFallbackImage;
                  const storyPath = `/stories/${story.id}`;

                  return (
                    <Link
                      key={story.id}
                      href={storyPath}
                      className="group cursor-pointer transition duration-200 ease-in-out"
                    >
                      <div className="relative w-full aspect-[5/6] rounded-lg overflow-hidden bg-[var(--background)]/20">
                        {finalImage ? (
                          <img
                            src={finalImage}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-[1.06] transition duration-300 ease-out"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[var(--foreground)]/5 text-[var(--foreground)]/50 text-xs">
                            No image
                          </div>
                        )}

                        {/* Read Time Overlay */}
                        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2 md:p-3">
                          <div className="flex items-center text-white text-xs font-semibold space-x-1">
                            <Clock className="w-3 h-3 text-white" />
                            <span className="opacity-80">{story.readTime || 0} min read</span>
                          </div>
                        </div>
                      </div>

                      {/* Text Section */}
                      <div className="pt-2 md:pt-3">
                        <h4 className="text-sm md:text-base font-semibold text-[var(--foreground)] line-clamp-2 transition-colors">
                          {story.title || "Untitled"}
                        </h4>

                        <p className="text-xs text-[var(--foreground)]/50 mt-0.5 md:mt-1 line-clamp-1">
                          {genresArr.length ? genresArr.join(" / ") : "—"}
                        </p>
                      </div>
                    </Link>
                  );
                })}
                {currentAuthor.latestStories.length > 2 && (
                  <div className="hidden md:block">
                    {(() => {
                      const story = currentAuthor.latestStories[2];
                      const genresArr = Array.isArray(story.genres) ? story.genres : [];
                      const genreFallbackImage = getGenreFallback(genresArr);
                      const finalImage = story.coverImage || genreFallbackImage;
                      const storyPath = `/stories/${story.id}`;

                      return (
                        <Link
                          href={storyPath}
                          className="group cursor-pointer transition duration-200 ease-in-out"
                        >
                          <div className="relative w-full aspect-[5/6] rounded-lg overflow-hidden bg-[var(--background)]/20">
                            {finalImage ? (
                              <img
                                src={finalImage}
                                alt={story.title}
                                className="w-full object-cover group-hover:scale-[1.06] transition duration-300 ease-out"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-[var(--foreground)]/5 text-[var(--foreground)]/50 text-xs">
                                No image
                              </div>
                            )}

                            {/* Read Time Overlay */}
                            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2 md:p-3">
                              <div className="flex items-center text-white text-xs font-semibold space-x-1">
                                <Clock className="w-3 h-3 text-white" />
                                <span className="opacity-80">{story.readTime || 0} min read</span>
                              </div>
                            </div>
                          </div>

                          {/* Text Section */}
                          <div className="pt-2 md:pt-3">
                            <h4 className="text-sm md:text-base font-semibold text-[var(--foreground)] line-clamp-2 transition-colors">
                              {story.title || "Untitled"}
                            </h4>

                            <p className="text-xs text-[var(--foreground)]/50 mt-0.5 md:mt-1 line-clamp-1">
                              {genresArr.length ? genresArr.join(" / ") : "—"}
                            </p>
                          </div>
                        </Link>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}