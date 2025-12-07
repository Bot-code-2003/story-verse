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
import Footer from "@/components/Footer";

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

  if (!items || items.length === 0) return null;

  return (
    <section className="mb-10 relative"> {/* 4. Add 'relative' for absolute positioning of arrows */}
      <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
        {title}
      </h3>
      
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
              <StoryCard key={story.id} story={story} />
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

export default function Home() {
  // global / main lists
  const [stories, setStories] = useState([]); // using trending as the main 'stories' fallback
  const [latest, setLatest] = useState([]);
  const [quickReads, setQuickReads] = useState([]);
  const [editorPicks, setEditorPicks] = useState([]); // ⭐ editor picks

  // genre-specific lists
  const [adventure, setAdventure] = useState([]);
  const [fantasy, setFantasy] = useState([]);
  const [thrillers, setThrillers] = useState([]);
  const [romance, setRomance] = useState([]);
  const [sciFi, setSciFi] = useState([]);
  const [horror, setHorror] = useState([]);
  const [sliceOfLife, setSliceOfLife] = useState([]);
  const [drama, setDrama] = useState([]);
  const [mythicFiction, setMythicFiction] = useState([]);

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
    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        // parallel fetch: trending/latest/quickreads + editor picks + genres
        // ❌ Latest = NO CACHE (always fresh)
        // ✅ Others = 10-minute cache
        const [
          trendingList,
          latestList,
          quickReadsList,
          editorPicksList,
          adventureList,
          fantasyList,
          thrillersList,
          romanceList,
          sciFiList,
          horrorList,
          sliceOfLifeList,
          dramaList,
          mythicFictionList,
        ] = await Promise.all([
          fetchRouteStories("/api/stories/trending", CACHE_KEYS.TRENDING),
          fetchRouteStories("/api/stories/latest"), // ❌ NO CACHE - always fresh
          fetchRouteStories("/api/stories/quickreads", CACHE_KEYS.QUICK_READS),
          fetchRouteStories("/api/stories/editorpicks", CACHE_KEYS.EDITOR_PICKS),
          fetchRouteStories("/api/stories?genre=Adventure", CACHE_KEYS.ADVENTURE),
          fetchRouteStories("/api/stories?genre=Fantasy", CACHE_KEYS.FANTASY),
          fetchRouteStories("/api/stories?genre=Thriller", CACHE_KEYS.THRILLER),
          fetchRouteStories("/api/stories?genre=Romance", CACHE_KEYS.ROMANCE),
          fetchRouteStories("/api/stories?genre=Sci-Fi", CACHE_KEYS.SCIFI),
          fetchRouteStories("/api/stories?genre=Horror", CACHE_KEYS.HORROR),
          fetchRouteStories("/api/stories?genre=Slice%20of%20Life", CACHE_KEYS.SLICE_OF_LIFE),
          fetchRouteStories("/api/stories?genre=Drama", CACHE_KEYS.DRAMA),
          fetchRouteStories("/api/stories?genre=Mythic Fiction", CACHE_KEYS.MYTHIC_FICTION),
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

        setStories(finalTrending); // trending used as main 'stories' fallback
        setLatest(finalLatest);
        setQuickReads(finalQuickReads);
        setEditorPicks(finalEditorPicks); // ⭐ set editor picks
        console.log("finalEditorPicks", finalEditorPicks);
        // update genres to show up to 10 each as well
        setAdventure((adventureList && adventureList.slice(0, 18)) || []);
        setFantasy((fantasyList && fantasyList.slice(0, 18)) || []);
        setThrillers((thrillersList && thrillersList.slice(0, 18)) || []);
        setRomance((romanceList && romanceList.slice(0, 18)) || []);
        setMythicFiction((mythicFictionList && mythicFictionList.slice(0, 18)) || []);
        setSciFi((sciFiList && sciFiList.slice(0, 18)) || []);
        setHorror((horrorList && horrorList.slice(0, 18)) || []);
        setSliceOfLife((sliceOfLifeList && sliceOfLifeList.slice(0, 18)) || []);
        setDrama((dramaList && dramaList.slice(0, 18)) || []);
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

  // --- Loading and Error States ---
  if (loading) {
    return (
      <main className="min-h-screen w-full bg-[var(--background)]">
        <SiteHeader />
        <div className="text-center py-20 text-[var(--foreground)]">
          Loading stories...
        </div>
        <Footer />
      </main>
    );
  }

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
              "name": "StoryVerse",
              "description": "Discover and share short fiction stories across multiple genres",
              "url": "https://storyverse.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://storyverse.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "StoryVerse",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://storyverse.com/logo.png"
                }
              }
            })
          }}
        />
        
        <SiteHeader />

        <div className="px-4 md:px-10 py-6">
          <Carousel />

          {/* ---------------------- SECTIONS ---------------------- */}
          <Section title="Trending Now" items={trending} />

          {/* ⭐ use editorPicks instead of stories */}
          <EditorsPick stories={editorPicks} />

          {/* Pass quickReads directly to ShortReads to avoid client-side filtering */}
          <ShortReads stories={quickReads} />
          <FeaturedAuthor />
          <Section title="New Releases" items={newReleases} />
          <DiscoverGenres />

          {/* Genre sections using the dynamically fetched state */}
          {fantasy.length > 0 && (
            <Section title="Fantasy Picks" items={fantasy} />
          )}
          {sliceOfLife.length > 0 && (
            <Section title="Slice of Life" items={sliceOfLife} />
          )}
          {mythicFiction.length > 0 && (
            <Section title="Mythic Fiction" items={mythicFiction} />
          )}
          {drama.length > 0 && <Section title="Dramatic Reads" items={drama} />}
          {adventure.length > 0 && (
            <Section title="Adventure Tales" items={adventure} />
          )}
          <BecomeAuthorBanner />

          {thrillers.length > 0 && (
            <Section title="Thrillers" items={thrillers} />
          )}
          {romance.length > 0 && (
            <Section title="Romance Stories" items={romance} />
          )}
          {sciFi.length > 0 && <Section title="Sci-Fi" items={sciFi} />}
          {horror.length > 0 && <Section title="Horror Stories" items={horror} />}
        </div>

        <Footer />
    </main>
  );
}