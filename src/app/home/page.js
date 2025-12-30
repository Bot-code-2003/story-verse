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
    <section className=" relative z-10 mb-10">
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
      <div className="hidden lg:grid lg:grid-cols-6 gap-8 lg:gap-10 pb-12">
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
    <section className=" relative z-10 mb-10">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-[var(--foreground)]">
          Featured This Week
        </h3>
        {/* Scroll hint visible on all screens */}
        <span className="text-xs text-[var(--foreground)]/50 flex items-center gap-1">
          <span>Swipe</span>
          <ChevronRight className="w-3 h-3" />
        </span>
      </div>
      
      {/* Horizontal Scroll Layout for All Screens */}
      <div className="relative">
        {/* Add fade masks for scroll indication if needed, sticking to simple scroll for now */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 pb-4 px-1">
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
  const [comedy, setComedy] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // helper to fetch a route and return stories array (or empty)
  // Now with smart caching support
  // Filter stories with readTime > 1 minute to ensure legitimate content
  const filterLegitStories = (stories) => {
    return stories.filter(story => (story.readTime || 0) > 1);
  };

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
        // Filter for legitimate stories with readTime > 1 min
        return filterLegitStories(json?.stories || []);
      }

      // Use cache with TTL
      return await fetchWithCache(cacheKey, async () => {
        const res = await fetch(url);
        if (!res.ok) {
          console.warn(`fetch ${url} failed:`, res.status);
          return [];
        }
        const json = await res.json();
        // Filter for legitimate stories with readTime > 1 min
        return filterLegitStories(json?.stories || []);
      });
    } catch (err) {
      console.warn(`fetch ${url} error:`, err);
      return [];
    }
  };


  useEffect(() => {
    // ⭐ SET HARDCODED DATA IMMEDIATELY (no waiting for API calls)
    const transformedFeaturedStories = FEATURED_STORIES.slice(0, 20).map(story => ({
      ...story,
      id: story._id?.$oid || story._id || story.id, // Extract ID from MongoDB structure
      author: story.author?.$oid || story.author // Handle author ID if needed
    }));
    setFeaturedThisWeek(transformedFeaturedStories);
    console.log("featuredThisWeek (transformed - immediate)", transformedFeaturedStories);

    // ⚡ PERFORMANCE: Single batch API call instead of 12 individual calls
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Try batch API first (preferred - single round trip)
        const batchRes = await fetch("/api/homepage");
        
        if (batchRes.ok) {
          const batchData = await batchRes.json();
          const { data } = batchData;
          
          // Set all sections from batch response
          setStories(data.trending?.slice(0, 6) || []);
          setLatest(data.latest?.slice(0, 6) || []);
          setQuickReads(data.quickReads?.slice(0, 6) || []);
          setEditorPicks(data.editorPicks?.slice(0, 6) || []);
          setFantasy(data.fantasy?.slice(0, 6) || []);
          setDrama(data.drama?.slice(0, 6) || []);
          setRomance(data.romance?.slice(0, 6) || []);
          setSliceOfLife(data.sliceOfLife?.slice(0, 6) || []);
          setThriller(data.thriller?.slice(0, 6) || []);
          setHorror(data.horror?.slice(0, 6) || []);
          setComedy(data.comedy?.slice(0, 6) || []);
          
          console.log("✅ Batch API: Loaded all homepage sections in 1 call");
        } else {
          throw new Error("Batch API failed, falling back to individual calls");
        }
      } catch (err) {
        console.warn("Batch API failed, using fallback:", err.message);
        
        // Fallback: Individual calls (original behavior)
        const fetchRouteStoriesFallback = async (url) => {
          try {
            const res = await fetch(url);
            if (!res.ok) return [];
            const json = await res.json();
            return filterLegitStories(json?.stories || []);
          } catch (e) {
            console.warn(`Fetch ${url} failed:`, e);
            return [];
          }
        };

        // Parallel fetch all sections as fallback
        const [
          trendingData,
          latestData,
          quickReadsData,
          editorPicksData,
          fantasyData,
          dramaData,
          romanceData,
          sliceOfLifeData,
          thrillerData,
          horrorData,
          comedyData,
        ] = await Promise.all([
          fetchRouteStoriesFallback("/api/stories/trending"),
          fetchRouteStoriesFallback("/api/stories/latest"),
          fetchRouteStoriesFallback("/api/stories/quickreads"),
          fetchRouteStoriesFallback("/api/stories/editorpicks"),
          fetchRouteStoriesFallback("/api/stories?genre=Fantasy"),
          fetchRouteStoriesFallback("/api/stories?genre=Drama"),
          fetchRouteStoriesFallback("/api/stories?genre=Romance"),
          fetchRouteStoriesFallback("/api/stories?genre=Slice%20of%20Life"),
          fetchRouteStoriesFallback("/api/stories?genre=Thriller"),
          fetchRouteStoriesFallback("/api/stories?genre=Horror"),
          fetchRouteStoriesFallback("/api/stories?genre=Comedy"),
        ]);

        setStories(trendingData.slice(0, 6));
        setLatest(latestData.slice(0, 6));
        setQuickReads(quickReadsData.slice(0, 6));
        setEditorPicks(editorPicksData.slice(0, 6));
        setFantasy(fantasyData.slice(0, 6));
        setDrama(dramaData.slice(0, 6));
        setRomance(romanceData.slice(0, 6));
        setSliceOfLife(sliceOfLifeData.slice(0, 6));
        setThriller(thrillerData.slice(0, 6));
        setHorror(horrorData.slice(0, 6));
        setComedy(comedyData.slice(0, 6));
        
        console.log("⚠️ Fallback: Loaded homepage with individual calls");
      } finally {
        setLoading(false);
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
              "name": "TheStoryBits",
              "description": "Discover and share bite-sized fiction stories. Quick reads across all genres.",
              "url": "https://thestorybits.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://thestorybits.com/search?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              },
              "publisher": {
                "@type": "Organization",
                "name": "TheStoryBits",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://thestorybits.com/logo.png"
                }
              }
            })
          }}
        />
        
        <SiteHeader />

        <div className=" px-4 md:px-10 py-6">
          {/* 1. Hero Carousel - First impression with winner spotlight */}
          <Carousel />

          {/* 2. Trending Now - IMMEDIATE social proof (what's hot RIGHT NOW) */}
          {/* <Section title="Trending Now" items={trending} /> */}

          {/* Contest Winners - commented out for future implementation */}
          {/* <ContestWinners winners={contestWinners} /> */}

          {/* 3. Featured This Week - Manually curated stories */}
          <FeaturedThisWeek items={featuredThisWeek} />

          {/* 4. Editor's Pick - Curated quality content */}
          <div id="editors-pick">
            <EditorsPick stories={editorPicks} />
          </div>

          {/* 5. New Releases - Fresh content */}
          <div id="new-releases">
            <Section title="New Releases" items={newReleases} />
          </div>

          {/* 6. Featured Author - Community spotlight */}
          <div id="featured-authors">
            <FeaturedAuthor />
          </div>

          {/* 7. Genre Discovery - Visual exploration */}
          <DiscoverGenres />

          {/* 8. Genre Sections - Ordered: Fantasy, Horror, Drama, Banner, Slice of Life, Comedy, Romance */}
          {fantasy.length > 0 && (
            <Section title="Fantasy Picks" items={fantasy} />
          )}
          {horror.length > 0 && (
            <Section title="Horror" items={horror} />
          )}
          {drama.length > 0 && <Section title="Dramatic Reads" items={drama} />}
          
          {/* 9. CTA Banner - Conversion point */}
          <BecomeAuthorBanner />
          
          {sliceOfLife.length > 0 && (
            <Section title="Slice of Life" items={sliceOfLife} />
          )}
          {comedy.length > 0 && (
            <Section title="Comedy" items={comedy} />
          )}
          {romance.length > 0 && (
            <Section title="Romance Stories" items={romance} />
          )}
          {/* {thriller.length > 0 && (
            <Section title="Thriller" items={thriller} />
          )} */}
        </div>

        <Footer />
    </main>
  );
}