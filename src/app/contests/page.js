"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { Heart, Clock, User, X, Calendar, Trophy, FileText, Info } from "lucide-react";
import { getCache, setCache } from "@/lib/cache";
import { getGenreFallback } from "@/constants/genres";

// Hardcoded current contest ID
const CURRENT_CONTEST_ID = "7k-sprint-dec-2025";
const CACHE_KEY = `contest_stories_${CURRENT_CONTEST_ID}`;

// Contest Details Modal
function ContestDetailsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-[var(--background)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[var(--foreground)]/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-[var(--background)] border-b border-[var(--foreground)]/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[var(--foreground)]">Contest Details</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--foreground)]/5 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-[var(--foreground)]/60" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {/* What */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-[var(--foreground)]">What</h3>
            </div>
            <p className="text-[var(--foreground)]/70 leading-relaxed">
              Write a complete short story in 7,000 words or less. Any genre is welcome—fantasy, 
              sci-fi, romance, thriller, literary fiction, or anything in between. This is your 
              chance to showcase your storytelling skills in a compact, powerful format.
            </p>
          </section>

          {/* Deadline */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Deadline</h3>
            </div>
            <p className="text-[var(--foreground)]/70 leading-relaxed">
              All submissions must be published by <strong>December 31, 2025, 11:59 PM</strong> in 
              your local timezone. Late submissions will not be accepted.
            </p>
          </section>

          {/* Rules */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Info className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Rules</h3>
            </div>
            <ul className="text-[var(--foreground)]/70 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span><strong>7,000 words maximum</strong> — Keep it concise and impactful</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span><strong>Original work only</strong> — Must be your own creation, not previously published elsewhere</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span><strong>One submission per author</strong> — Choose your best work</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span><strong>Must be complete</strong> — No serials, excerpts, or works-in-progress</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span><strong>Any genre accepted</strong> — Let your creativity flow</span>
              </li>
            </ul>
          </section>

          {/* Rewards */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-[var(--foreground)]">Rewards</h3>
            </div>
            <ul className="text-[var(--foreground)]/70 space-y-2 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span><strong>Featured on homepage</strong> — Top stories will be showcased to thousands of readers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span><strong>Editor's Pick badge</strong> — A prestigious badge displayed on your story</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span><strong>Social media spotlight</strong> — Winners will be promoted across our social channels</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500 mt-1">•</span>
                <span><strong>Community recognition</strong> — Join the ranks of our celebrated authors</span>
              </li>
            </ul>
          </section>

          {/* How to Enter */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-indigo-500" />
              <h3 className="text-lg font-semibold text-[var(--foreground)]">How to Enter</h3>
            </div>
            <div className="text-[var(--foreground)]/70 leading-relaxed space-y-3">
              <p>Entering is simple:</p>
              <ol className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-semibold">1.</span>
                  <span>Write your story (7,000 words or less)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-semibold">2.</span>
                  <span>Go to the story editor</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-semibold">3.</span>
                  <span>Check the box "Submit to 7K Sprint Dec 2025" before publishing</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500 font-semibold">4.</span>
                  <span>Click Publish and you're entered!</span>
                </li>
              </ol>
            </div>
          </section>

          {/* CTA in Modal */}
          <div className="pt-4 border-t border-[var(--foreground)]/10">
            <a
              href="/login?redirect=/write"
              className="block w-full text-center px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              Start Writing Your Entry
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contest Story Card - Horizontal layout
function ContestStoryCard({ story, rank }) {
  const {
    id = "",
    title = "Untitled",
    description = "",
    coverImage = "",
    genres = [],
    readTime = 0,
    likes = 0,
    author = null,
  } = story || {};

  const genresArr = Array.isArray(genres) ? genres : [];

  let authorName = "Unknown";
  if (author && typeof author === "object") {
    authorName = author.username?.replace(/^@/, "") || author.name || "Unknown";
  } else if (typeof author === "string" && author.length < 30) {
    authorName = author.replace(/^@/, "");
  }

  const genreFallbackImage = getGenreFallback(genresArr);
  const finalImage = coverImage || genreFallbackImage;

  return (
    <Link
      href={`/stories/${id}`}
      className="group flex flex-col md:flex-row bg-[var(--background)] border border-[var(--foreground)]/10 rounded-xl overflow-hidden hover:border-[var(--foreground)]/20 hover:shadow-lg transition-all duration-300"
    >
      {/* Left: Image (1/4 on desktop) */}
      <div className="relative w-full md:w-1/4 h-48 md:h-auto md:min-h-[180px] flex-shrink-0 overflow-hidden">
        {finalImage ? (
          <img
            src={finalImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[var(--foreground)]/5 text-[var(--foreground)]/30 text-sm">
            No image
          </div>
        )}
        {/* Rank badge */}
        {rank <= 3 && (
          <div className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
            rank === 1 ? "bg-yellow-500" : rank === 2 ? "bg-gray-400" : "bg-amber-700"
          }`}>
            {rank}
          </div>
        )}
      </div>

      {/* Right: Content (3/4 on desktop) */}
      <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
        {/* Top section */}
        <div>
          {/* Title */}
          <h3 className="text-lg md:text-xl font-semibold text-[var(--foreground)] line-clamp-2 group-hover:text-indigo-500 transition-colors">
            {title}
          </h3>

          {/* Author */}
          <div className="flex items-center gap-2 mt-2 text-sm text-[var(--foreground)]/60">
            <User className="w-4 h-4" />
            <span>@{authorName}</span>
          </div>

          {/* Description */}
          <p className="mt-3 text-sm text-[var(--foreground)]/70 line-clamp-2 md:line-clamp-3">
            {description || "No description available."}
          </p>
        </div>

        {/* Bottom section - Stats */}
        <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-[var(--foreground)]/10">
          {/* Likes */}
          <div className="flex items-center gap-1.5 text-sm text-[var(--foreground)]/60">
            <Heart className="w-4 h-4 text-red-500" />
            <span>{likes || 0} likes</span>
          </div>

          {/* Read time */}
          <div className="flex items-center gap-1.5 text-sm text-[var(--foreground)]/60">
            <Clock className="w-4 h-4" />
            <span>{readTime} min read</span>
          </div>

          {/* Genres */}
          {genresArr.length > 0 && (
            <div className="flex items-center gap-2">
              {genresArr.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-0.5 text-xs rounded-full bg-[var(--foreground)]/5 text-[var(--foreground)]/60"
                >
                  {genre}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// Loading skeleton for contest cards
function ContestCardSkeleton() {
  return (
    <div className="flex flex-col md:flex-row bg-[var(--background)] border border-[var(--foreground)]/10 rounded-xl overflow-hidden animate-pulse">
      <div className="w-full md:w-1/4 h-48 md:min-h-[180px] bg-[var(--foreground)]/10" />
      <div className="flex-1 p-4 md:p-6">
        <div className="h-6 w-3/4 bg-[var(--foreground)]/10 rounded mb-3" />
        <div className="h-4 w-1/3 bg-[var(--foreground)]/10 rounded mb-4" />
        <div className="h-4 w-full bg-[var(--foreground)]/10 rounded mb-2" />
        <div className="h-4 w-2/3 bg-[var(--foreground)]/10 rounded" />
      </div>
    </div>
  );
}

export default function ContestsPage() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(12); // Show 12 stories initially

  const STORIES_PER_PAGE = 12;

  useEffect(() => {
    async function fetchContestStories() {
      try {
        // Check cache first
        const cached = getCache(CACHE_KEY);
        if (cached) {
          setStories(cached);
          setLoading(false);
          return;
        }

        // Fetch from API
        const res = await fetch(`/api/contests/${CURRENT_CONTEST_ID}/stories`);
        if (!res.ok) throw new Error("Failed to fetch contest stories");
        
        const data = await res.json();
        const fetchedStories = data.stories || [];
        
        // Cache the results
        setCache(CACHE_KEY, fetchedStories);
        setStories(fetchedStories);
      } catch (err) {
        console.error("Error fetching contest stories:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchContestStories();
  }, []);

  // Get the stories to display based on current displayCount
  const displayedStories = stories.slice(0, displayCount);
  const hasMore = displayCount < stories.length;

  const handleLoadMore = () => {
    setDisplayCount(prev => prev + STORIES_PER_PAGE);
  };

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteHeader />

      <div className="px-4 md:px-10 py-8 max-w-4xl mx-auto">
        {/* Compact Contest Banner */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl mb-12">
  {/* Background image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage:
        "url('https://i.pinimg.com/736x/32/29/53/32295392bf80e85b9ea41d752c783988.jpg')",
    }}
  />
  <div className="absolute inset-0 bg-black/30" />

  {/* Content */}
  <div className="relative z-10 p-6 md:p-8 text-white max-w-xl">
    {/* Badge */}
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-4">
      🏆 Now Open
    </div>

    {/* Title */}
    <h1 className="text-3xl md:text-4xl font-bold mb-4">
      7K Sprint Dec 2025
    </h1>

    {/* Meta */}
    <div className="flex flex-col gap-2 text-sm text-white/90 mb-6">
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4" />
        <span>Deadline: Dec 31, 2025</span>
      </div>
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        <span>Max 7,000 words</span>
      </div>
    </div>

    {/* ACTION STACK (THIS IS THE FIX) */}
    <div className="flex flex-col items-start gap-4">
      {/* Secondary action */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-sm font-medium text-white/90 hover:text-white underline underline-offset-4 transition"
      >
        More Details →
      </button>

      {/* Primary CTA */}
      <a
        href="/login?redirect=/write"
        className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 rounded-lg font-semibold shadow-lg hover:shadow-xl hover:bg-white/90 transition"
      >
        Start Writing
      </a>

      {/* Supporting info */}
      <p className="text-xs text-white/70">
        {stories.length}{" "}
        {stories.length === 1 ? "submission" : "submissions"}
      </p>
    </div>
  </div>
</div>


        {/* Submissions Section */}
        <div>
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
            Submissions
          </h2>
          <p className="text-[var(--foreground)]/60 mb-8">
            Stories submitted to this contest, ranked by popularity
          </p>

          {/* Stories List */}
          {loading ? (
            <div className="space-y-4">
              <ContestCardSkeleton />
              <ContestCardSkeleton />
              <ContestCardSkeleton />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              {error}
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12 bg-[var(--foreground)]/5 rounded-xl">
              <p className="text-[var(--foreground)]/60 text-lg mb-2">
                No submissions yet
              </p>
              <p className="text-[var(--foreground)]/40 text-sm">
                Be the first to submit your story!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {displayedStories.map((story, index) => (
                  <ContestStoryCard 
                    key={story.id || index} 
                    story={story} 
                    rank={index + 1}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {hasMore && (
                <div className="mt-8 text-center">
                  <button
                    onClick={handleLoadMore}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                  >
                    Load More Stories
                    <span className="ml-2 text-sm opacity-80">
                      ({stories.length - displayCount} remaining)
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />

      {/* Contest Details Modal */}
      <ContestDetailsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
