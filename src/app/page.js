// src/app/page.js
"use client";

import { useState, useEffect } from "react";
import { fetchWithCache, CACHE_KEYS } from "@/lib/cache";
import { FEATURED_STORIES } from "@/constants/featured_stories"; // Import featured stories

import Carousel from "@/components/Carousel";
import StoryCard from "@/components/StoryCard";
import SiteHeader from "@/components/SiteHeader"; // Global header with theme toggle
import ShortReads from "@/components/ShortReads";
import DiscoverGenres from "@/components/DiscoverGenres";
import BecomeAuthorBanner from "@/components/BecomeAuthorBanner";
import FeaturedAuthor from "@/components/FeaturedAuthor";
import EditorsPick from "@/components/EditorsPick";
// Contest-related imports - commented out for future implementation
// import ContestWinners from "@/components/ContestWinners";
import Footer from "@/components/Footer";
import SkeletonSection from "@/components/skeletons/SkeletonSection";
import SkeletonHomepage from "@/components/skeletons/SkeletonHomepage";

// Utility component for the arrow icons (assuming a simple inline SVG)
// Using Tailwind's default colors for this example, you can adjust the className
const ChevronLeft = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5L8.25 12l7.5-7.5"
    />
  </svg>
);

const ChevronRight = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
    />
  </svg>
);


// ---------------------- SECTION COMPONENT (Reusable Story List - 6 Column Grid) ----------------------
function Section({ title, items }) {
  if (!items || items.length === 0) return <SkeletonSection />;

  return (
    <section className="mb-10 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">
          {title}
        </h3>
        {/* Mobile scroll hint - only visible on small screens */}
        <span className="lg:hidden text-xs text-[var(--foreground)]/50 flex items-center gap-1">
          <span>Swipe</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>
      
      {/* Desktop: 6-column grid (no scroll) */}
      <div className="hidden lg:grid lg:grid-cols-6 gap-4">
        {items.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      {/* Mobile/Tablet: Horizontal scroll */}
      <div className="lg:hidden relative">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-4">
            {items.map((story) => (
              <div key={story.id} className="w-[160px] md:w-[200px] flex-shrink-0">
                <StoryCard story={story} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
// End of Section component

// ---------------------- FEATURED THIS WEEK COMPONENT ----------------------
function FeaturedThisWeek({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-10 relative">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">
          Featured This Week
        </h3>
        {/* Mobile scroll hint - only visible on small screens */}
        <span className="lg:hidden text-xs text-[var(--foreground)]/50 flex items-center gap-1">
          <span>Swipe</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>
      
      {/* Desktop: 6-column grid (no scroll) */}
      <div className="hidden lg:grid lg:grid-cols-6 gap-4">
        {items.map((story) => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>

      {/* Mobile/Tablet: Horizontal scroll */}
      <div className="lg:hidden relative">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-4">
            {items.map((story) => (
              <div key={story.id} className="w-[160px] md:w-[200px] flex-shrink-0">
                <StoryCard story={story} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
// End of FeaturedThisWeek component

export default function Home() {
  // global / main lists
  const [stories, setStories] = useState([]); // using trending as the main 'stories' fallback
  const [latest, setLatest] = useState([]);
  const [quickReads, setQuickReads] = useState([]);
  const [editorPicks, setEditorPicks] = useState([]); // ⭐ editor picks
  const [featuredThisWeek, setFeaturedThisWeek] = useState([]); // ⭐ featured this week
  // Contest-related state - commented out for future implementation
  // const [contestWinners, setContestWinners] = useState([]); // 🏆 contest winners

  // genre-specific lists - Only active genres
  const [fantasy, setFantasy] = useState([]);
  const [drama, setDrama] = useState([]);
  const [romance, setRomance] = useState([]);
  const [sliceOfLife, setSliceOfLife] = useState([]);
  const [thriller, setThriller] = useState([]);
  const [horror, setHorror] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // helper to fetch a route and return stories array (or empty)
  // Now with smart caching support
  const fetchRouteStories = async (url, cacheKey = null) => {
    try {
      // If no cache key provided, fetch directly (no cache)
      if (!cacheKey) {
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`fetch ${url} failed:`, res.status);
          return [];
        }
        const json = await res.json();
        return json?.stories || [];
      }

      // Use cache with TTL
      return await fetchWithCache(cacheKey, async () => {
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`fetch ${url} failed:`, res.status);
          return [];
        }
        const json = await res.json();
        return json?.stories || [];
      });
    } catch (err) {
      console.warn(`fetch ${url} error:`, err);
      return [];
    }
  };


  useEffect(() => {
    // ⭐ SET HARDCODED DATA IMMEDIATELY (no waiting for API calls)
    const transformedFeaturedStories = FEATURED_STORIES.slice(0, 6).map(story => ({
      ...story,
      id: story._id?.$oid || story._id || story.id, // Extract ID from MongoDB structure
      author: story.author?.$oid || story.author // Handle author ID if needed
    }));
    setFeaturedThisWeek(transformedFeaturedStories);
    console.log("featuredThisWeek (transformed - immediate)", transformedFeaturedStories);

    // ⭐ FETCH API DATA INDEPENDENTLY (progressive rendering)
    // Each fetch updates state as soon as it completes, allowing sections to render independently
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch trending stories (with cache) - limit to 6
        fetchRouteStories("/api/stories/trending", CACHE_KEYS.TRENDING)
          .then(list => {
            setStories(list.length ? list.slice(0, 6) : []);
          })
          .catch(err => console.warn("Failed to fetch trending:", err));

        // Fetch latest stories (NO CACHE - always fresh) - limit to 6
        fetchRouteStories("/api/stories/latest")
          .then(list => {
            setLatest(list.length ? list.slice(0, 6) : []);
          })
          .catch(err => console.warn("Failed to fetch latest:", err));

        // Fetch quick reads (with cache) - limit to 6
        fetchRouteStories("/api/stories/quickreads", CACHE_KEYS.QUICK_READS)
          .then(list => {
            setQuickReads(list.length ? list.slice(0, 6) : []);
          })
          .catch(err => console.warn("Failed to fetch quick reads:", err));

        // Fetch editor picks (with cache) - limit to 6
        fetchRouteStories("/api/stories/editorpicks", CACHE_KEYS.EDITOR_PICKS)
          .then(list => {
            setEditorPicks(list.length ? list.slice(0, 6) : []);
            console.log("finalEditorPicks", list.slice(0, 6));
          })
          .catch(err => console.warn("Failed to fetch editor picks:", err));

        // Fetch genre stories independently - limit to 6 each
        fetchRouteStories("/api/stories?genre=Fantasy", CACHE_KEYS.FANTASY)
          .then(list => setFantasy(list.length ? list.slice(0, 6) : []))
          .catch(err => console.warn("Failed to fetch Fantasy:", err));

        fetchRouteStories("/api/stories?genre=Drama", CACHE_KEYS.DRAMA)
          .then(list => setDrama(list.length ? list.slice(0, 6) : []))
          .catch(err => console.warn("Failed to fetch Drama:", err));

        fetchRouteStories("/api/stories?genre=Romance", CACHE_KEYS.ROMANCE)
          .then(list => setRomance(list.length ? list.slice(0, 6) : []))
          .catch(err => console.warn("Failed to fetch Romance:", err));

        fetchRouteStories("/api/stories?genre=Slice%20of%20Life", CACHE_KEYS.SLICE_OF_LIFE)
          .then(list => setSliceOfLife(list.length ? list.slice(0, 6) : []))
          .catch(err => console.warn("Failed to fetch Slice of Life:", err));

        fetchRouteStories("/api/stories?genre=Thriller", CACHE_KEYS.THRILLER)
          .then(list => setThriller(list.length ? list.slice(0, 6) : []))
          .catch(err => console.warn("Failed to fetch Thriller:", err));

        fetchRouteStories("/api/stories?genre=Horror", CACHE_KEYS.HORROR)
          .then(list => setHorror(list.length ? list.slice(0, 6) : []))
          .catch(err => console.warn("Failed to fetch Horror:", err));

        // Contest winners - commented out for future implementation
        // fetchRouteStories("/api/contests/7k-sprint-dec-2025/stories", CACHE_KEYS.CONTEST_WINNERS)
        //   .then(list => setContestWinners(list.length ? list.slice(0, 3) : []))
        //   .catch(err => console.warn("Failed to fetch contest winners:", err));

      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("Failed to load stories.");
      } finally {
        // Set loading to false after a short delay to allow first batch of requests to start
        setTimeout(() => setLoading(false), 100);
      }
    };

    fetchData();
  }, []);

  // Derived UI lists
  const trending = stories.slice(0, 6); // trending comes from /api/stories/trending

  // New Releases: prefer backend 'latest'; fallback to sorting 'stories' by createdAt
  const newReleases =
    latest && latest.length
      ? latest.slice(0, 6)
      : [...stories]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 6);


  // --- Error State Only (removed global loading) ---
  // Sections will show skeletons individually if not loaded

  if (error) {
    return (
      <main className="min-h-screen w-full bg-[var(--background)]">
        <SiteHeader />
        <div className="text-center py-20 text-red-500">Error: {error}</div>
        <Footer />
      </main>
    );
  }


  return (
    <main className="min-h-screen w-full bg-[var(--background)]">
      {/* Structured Data for SEO */}
      <script

          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "OneSitRead",
              "description": "Discover and share short fiction stories you can finish in one sitting. Quick reads across all genres.",
              "url": "https://onesitread.vercel.app",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://onesitread.vercel.app/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "OneSitRead",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://onesitread.vercel.app/logo.png"
                }
              }
            })
          }}
        />
        
        <SiteHeader />

        <div className="px-4 md:px-10 py-6">
          {/* 1. Hero Carousel - First impression with winner spotlight */}
          <Carousel />

          {/* 2. Trending Now - IMMEDIATE social proof (what's hot RIGHT NOW) */}
          {/* <Section title="Trending Now" items={trending} /> */}

          {/* Contest Winners - commented out for future implementation */}
          {/* <ContestWinners winners={contestWinners} /> */}

          {/* 3. Featured This Week - Manually curated stories */}
          <FeaturedThisWeek items={featuredThisWeek} />

          {/* 4. Editor's Pick - Curated quality content */}
          <EditorsPick stories={editorPicks} />

          {/* 5. New Releases - Fresh content */}
          <Section title="New Releases" items={newReleases} />

          {/* 6. Featured Author - Community spotlight */}
          <FeaturedAuthor />

          {/* 7. Genre Discovery - Visual exploration */}
          <DiscoverGenres />

          {/* 8. Genre Sections - Deep dive into categories */}
          {fantasy.length > 0 && (
            <Section title="Fantasy Picks" items={fantasy} />
          )}
          {drama.length > 0 && <Section title="Dramatic Reads" items={drama} />}
          
          {/* 9. CTA Banner - Conversion point */}
          <BecomeAuthorBanner />
          
          {romance.length > 0 && (
            <Section title="Romance Stories" items={romance} />
          )}
          {sliceOfLife.length > 0 && (
            <Section title="Slice of Life" items={sliceOfLife} />
          )}
          {/* {thriller.length > 0 && (
            <Section title="Thriller" items={thriller} />
          )} */}
          {horror.length > 0 && (
            <Section title="Horror" items={horror} />
          )}
        </div>

        <Footer />
    </main>
  );
}