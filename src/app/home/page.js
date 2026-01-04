// src/app/page.js
"use client";

import { useState, useEffect } from "react";
import { FEATURED_STORIES } from "@/constants/featured_stories"; // Import featured stories
import {
  EDITOR_PICKS,
  QUICK_READS,
  FANTASY_STORIES,
  DRAMA_STORIES,
  ROMANCE_STORIES,
  SLICE_OF_LIFE_STORIES,
  THRILLER_STORIES,
  HORROR_STORIES,
  COMEDY_STORIES,
} from "@/constants/homepage_data";

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
      <div className="hidden lg:grid lg:grid-cols-6 gap-8 lg:gap-6 pb-12">
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
          Featured Stories
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
  // STATIC DATA - Imported from homepage_data.js
  const editorPicks = EDITOR_PICKS.slice(0, 6);
  const quickReads = QUICK_READS.slice(0, 6);
  const fantasy = FANTASY_STORIES.slice(0, 6);
  const drama = DRAMA_STORIES.slice(0, 6);
  const romance = ROMANCE_STORIES.slice(0, 6);
  const sliceOfLife = SLICE_OF_LIFE_STORIES.slice(0, 6);
  const thriller = THRILLER_STORIES.slice(0, 6);
  const horror = HORROR_STORIES.slice(0, 6);
  const comedy = COMEDY_STORIES.slice(0, 6);

  // Featured This Week - from featured_stories.js
  const transformedFeaturedStories = FEATURED_STORIES.slice(0, 20).map(story => ({
    ...story,
    id: story._id?.$oid || story._id || story.id,
    author: story.author?.$oid || story.author
  }));
  const featuredThisWeek = transformedFeaturedStories;

  // DYNAMIC DATA - Only New Releases fetches from backend
  const [latest, setLatest] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter stories with readTime > 1 minute to ensure legitimate content
  const filterLegitStories = (stories) => {
    return stories.filter(story => (story.readTime || 0) > 1);
  };

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch("/api/stories/latest");
        if (!res.ok) {
          console.warn("fetch /api/stories/latest failed:", res.status);
          setLatest([]);
          return;
        }
        const json = await res.json();
        setLatest(filterLegitStories(json?.stories || []));
      } catch (err) {
        console.warn("fetch /api/stories/latest error:", err);
        setLatest([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatest();
  }, []);

  // Derived UI lists
  const newReleases = latest.slice(0, 12);

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
          {/* <BecomeAuthorBanner /> */}
          
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