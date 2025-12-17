// src/app/page.js
"use client";

import { useState, useEffect, useRef } from "react"; // 1. Import useRef
import { fetchWithCache, CACHE_KEYS } from "@/lib/cache";

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


// ---------------------- SECTION COMPONENT (Reusable Story List Row) ----------------------
function Section({ title, items }) {
  // 2. Create a ref for the scrollable container
  const scrollRef = useRef(null);
  const scrollDistance = 300; // Define scroll step size in pixels

  // 3. Scroll handler functions
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount =
        direction === "left" ? -scrollDistance : scrollDistance;
      // Use scrollBy for relative scrolling and 'smooth' for animation
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (!items || items.length === 0) return <SkeletonSection />;

  return (
    <section className="mb-10 relative"> {/* 4. Add 'relative' for absolute positioning of arrows */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">
          {title}
        </h3>
        {/* Mobile scroll hint - only visible on small screens */}
        <span className="md:hidden text-xs text-[var(--foreground)]/50 flex items-center gap-1">
          <span>Swipe</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>
      
      {/* Scrollable Container Wrapper */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
                     p-1 bg-[var(--background)] text-[var(--foreground)] opacity-70 hover:opacity-100 
                     rounded-full transition-opacity shadow-lg hidden md:block" // Hidden on small screens
          aria-label={`Scroll left on ${title}`}
        >
          <ChevronLeft />
        </button>

        {/* Story Card Scroll Container - Assign the ref here */}
        <div
          ref={scrollRef} // 5. Assign the ref
          className="overflow-x-auto scrollbar-hide"
        >
          <div className="flex gap-4 pb-4">
            {items.map((story) => (
              <div key={story.id} className="w-[160px] md:w-[200px] lg:w-[250px] flex-shrink-0">
                <StoryCard story={story} />
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
                     p-1 bg-[var(--background)] text-[var(--foreground)] opacity-70 hover:opacity-100 
                     rounded-full transition-opacity shadow-lg hidden md:block" // Hidden on small screens
          aria-label={`Scroll right on ${title}`}
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}
// End of Section component

// ---------------------- FEATURED THIS WEEK COMPONENT ----------------------
function FeaturedThisWeek({ items }) {
  const scrollRef = useRef(null);

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

      {/* Mobile/Tablet: Horizontal scroll with visual cue */}
      <div className="lg:hidden relative">
        <div
          ref={scrollRef}
          className="overflow-x-auto scrollbar-hide"
        >
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
  // ⭐ FEATURED THIS WEEK - Manually curated story IDs
  const FEATURED_THIS_WEEK_IDS = [
    "693ec8b5945dc639e08f963c", // Add your story IDs here
    "693c1ba2d837caf4fc701968", // Example: duplicate for demo
    "693d1d1d52fefada2249a462",
    "693e4ac9e6dfb2eef8a4d372",
    "69355933cdab065d273496e5",
    "69358203cdab065d27349aa9"
  ];

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

  // Helper to fetch stories by IDs
  const fetchStoriesByIds = async (ids) => {
    try {
      const res = await fetch("/api/stories/by-ids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      if (!res.ok) {
        console.warn("fetch stories by IDs failed:", res.status);
        return [];
      }
      const json = await res.json();
      return json?.stories || [];
    } catch (err) {
      console.warn("fetch stories by IDs error:", err);
      return [];
    }
  };


  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        // parallel fetch: trending/latest/quickreads + editor picks + featured this week + genres
        // ❌ Latest = NO CACHE (always fresh)
        // ✅ Others = 10-minute cache
        const [
          trendingList,
          latestList,
          quickReadsList,
          editorPicksList,
          featuredThisWeekList,
          // contestWinnersList, // 🏆 contest winners - commented out for future implementation
          fantasyList,
          dramaList,
          romanceList,
          sliceOfLifeList,
          thrillerList,
          horrorList,
        ] = await Promise.all([
          fetchRouteStories("/api/stories/trending", CACHE_KEYS.TRENDING),
          fetchRouteStories("/api/stories/latest"), // ❌ NO CACHE - always fresh
          fetchRouteStories("/api/stories/quickreads", CACHE_KEYS.QUICK_READS),
          fetchRouteStories("/api/stories/editorpicks", CACHE_KEYS.EDITOR_PICKS),
          fetchStoriesByIds(FEATURED_THIS_WEEK_IDS), // ⭐ featured this week - manual IDs
          // fetchRouteStories("/api/contests/7k-sprint-dec-2025/stories", CACHE_KEYS.CONTEST_WINNERS), // 🏆 contest winners - commented out
          fetchRouteStories("/api/stories?genre=Fantasy", CACHE_KEYS.FANTASY),
          fetchRouteStories("/api/stories?genre=Drama", CACHE_KEYS.DRAMA),
          fetchRouteStories("/api/stories?genre=Romance", CACHE_KEYS.ROMANCE),
          fetchRouteStories("/api/stories?genre=Slice%20of%20Life", CACHE_KEYS.SLICE_OF_LIFE),
          fetchRouteStories("/api/stories?genre=Thriller", CACHE_KEYS.THRILLER),
          fetchRouteStories("/api/stories?genre=Horror", CACHE_KEYS.HORROR),
        ]);

        // Use the fetched lists, with sensible fallbacks
        const finalTrending = trendingList.length
          ? trendingList.slice(0, 18)
          : [];
        const finalLatest = latestList.length ? latestList.slice(0, 18) : [];
        const finalQuickReads = quickReadsList.length
          ? quickReadsList.slice(0, 18)
          : [];
        const finalEditorPicks = editorPicksList.length
          ? editorPicksList.slice(0, 18)
          : [];
        // Contest winners - commented out for future implementation
        // const finalContestWinners = contestWinnersList.length
        //   ? contestWinnersList.slice(0, 3) // Top 3 winners
        //   : [];

        setStories(finalTrending); // trending used as main 'stories' fallback
        setLatest(finalLatest);
        setQuickReads(finalQuickReads);
        setEditorPicks(finalEditorPicks); // ⭐ set editor picks
        setFeaturedThisWeek(featuredThisWeekList || []); // ⭐ set featured this week
        // setContestWinners(finalContestWinners); // 🏆 set contest winners - commented out
        console.log("finalEditorPicks", finalEditorPicks);
        console.log("featuredThisWeek", featuredThisWeekList);
        // console.log("finalContestWinners", finalContestWinners); // commented out
        // update genres to show up to 18 each
        setFantasy((fantasyList && fantasyList.slice(0, 18)) || []);
        setDrama((dramaList && dramaList.slice(0, 18)) || []);
        setRomance((romanceList && romanceList.slice(0, 18)) || []);
        setSliceOfLife((sliceOfLifeList && sliceOfLifeList.slice(0, 18)) || []);
        setThriller((thrillerList && thrillerList.slice(0, 18)) || []);
        setHorror((horrorList && horrorList.slice(0, 18)) || []);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("Failed to load stories.");
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Derived UI lists
  const trending = stories.slice(0, 18); // trending comes from /api/stories/trending

  // New Releases: prefer backend 'latest'; fallback to sorting 'stories' by createdAt
  const newReleases =
    latest && latest.length
      ? latest.slice(0, 18)
      : [...stories]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 18);


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