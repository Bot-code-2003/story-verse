// src/app/page.js
"use client";

import { useState, useEffect } from "react";

import Carousel from "@/components/Carousel";
import StoryCard from "@/components/StoryCard";
import SiteHeader from "@/components/SiteHeader"; // Global header with theme toggle
import ShortReads from "@/components/ShortReads";
import DiscoverGenres from "@/components/DiscoverGenres";
import BecomeAuthorBanner from "@/components/BecomeAuthorBanner";
import FeaturedAuthor from "@/components/FeaturedAuthor";
import EditorsPick from "@/components/EditorsPick";
import Footer from "@/components/Footer";

// ---------------------- SECTION COMPONENT (Reusable Story List Row) ----------------------
function Section({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mb-10">
      <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
        {title}
      </h3>
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-5 pb-4">
          {items.map((story) => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // helper to fetch a route and return stories array (or empty)
  const fetchRouteStories = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`fetch ${url} failed:`, res.status);
        return [];
      }
      const json = await res.json();
      return json?.stories || [];
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
        ] = await Promise.all([
          fetchRouteStories("/api/stories/trending"),
          fetchRouteStories("/api/stories/latest"),
          fetchRouteStories("/api/stories/quickreads"),
          fetchRouteStories("/api/stories/editorpicks"), // ⭐ new endpoint
          fetchRouteStories("/api/stories?genre=Adventure"),
          fetchRouteStories("/api/stories?genre=Fantasy"),
          fetchRouteStories("/api/stories?genre=Thriller"),
          fetchRouteStories("/api/stories?genre=Romance"),
          fetchRouteStories("/api/stories?genre=Sci-Fi"),
          fetchRouteStories("/api/stories?genre=Horror"),
          fetchRouteStories("/api/stories?genre=Slice%20of%20Life"),
          fetchRouteStories("/api/stories?genre=Drama"),
        ]);

        // Use the fetched lists, with sensible fallbacks
        const finalTrending = trendingList.length
          ? trendingList.slice(0, 10)
          : [];
        const finalLatest = latestList.length ? latestList.slice(0, 10) : [];
        const finalQuickReads = quickReadsList.length
          ? quickReadsList.slice(0, 10)
          : [];
        const finalEditorPicks = editorPicksList.length
          ? editorPicksList.slice(0, 10)
          : [];

        setStories(finalTrending); // trending used as main 'stories' fallback
        setLatest(finalLatest);
        setQuickReads(finalQuickReads);
        setEditorPicks(finalEditorPicks); // ⭐ set editor picks
        console.log("finalEditorPicks", finalEditorPicks);
        // update genres to show up to 10 each as well
        setAdventure((adventureList && adventureList.slice(0, 10)) || []);
        setFantasy((fantasyList && fantasyList.slice(0, 10)) || []);
        setThrillers((thrillersList && thrillersList.slice(0, 10)) || []);
        setRomance((romanceList && romanceList.slice(0, 10)) || []);
        setSciFi((sciFiList && sciFiList.slice(0, 10)) || []);
        setHorror((horrorList && horrorList.slice(0, 10)) || []);
        setSliceOfLife((sliceOfLifeList && sliceOfLifeList.slice(0, 10)) || []);
        setDrama((dramaList && dramaList.slice(0, 10)) || []);
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
  const trending = stories.slice(0, 10); // trending comes from /api/stories/trending

  // New Releases: prefer backend 'latest'; fallback to sorting 'stories' by createdAt
  const newReleases =
    latest && latest.length
      ? latest.slice(0, 10)
      : [...stories]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 10);

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
