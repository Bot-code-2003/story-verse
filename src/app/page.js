// src/app/page.js

"use client";

import { useState, useEffect } from "react";

// The local data imports are removed as we will fetch dynamically
// import storiesData from "@/data/stories.json";
// import usersData from "@/data/users.json";

import Carousel from "@/components/Carousel";
import StoryCard from "@/components/StoryCard";
import SiteHeader from "@/components/SiteHeader"; // Global header with theme toggle
import ShortReads from "@/components/ShortReads";
import DiscoverGenres from "@/components/DiscoverGenres";
import BecomeAuthorBanner from "@/components/BecomeAuthorBanner";
import FeaturedAuthor from "@/components/FeaturedAuthor";
import EditorsPick from "@/components/EditorsPick";
import Footer from "@/components/Footer";

// Utility function to fetch stories by genre
const fetchStories = async (genre) => {
  // Use the API route you created: /api/stories?genre=<genre>
  const url = `/api/stories?genre=${encodeURIComponent(genre)}`;
  const response = await fetch(url);

  if (!response.ok) {
    console.error(`Failed to fetch ${genre} stories:`, response.statusText);
    return [];
  }

  const data = await response.json();
  // Ensure we are returning the array of stories
  return data.stories || [];
};

// This component can stay the same, but we will call it from the main Home component
/* ---------------------- SECTION COMPONENT (Reusable Story List Row) ---------------------- */
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
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for specific genre sections to be fetched independently (or filtered from 'stories')
  const [adventure, setAdventure] = useState([]);
  const [fantasy, setFantasy] = useState([]);
  const [thrillers, setThrillers] = useState([]);
  const [romance, setRomance] = useState([]);
  const [sciFi, setSciFi] = useState([]);
  const [horror, setHorror] = useState([]);
  const [sliceOfLife, setSliceOfLife] = useState([]);
  const [drama, setDrama] = useState([]);
  useEffect(() => {
    // Function to fetch the initial 'Trending Now' and 'New Releases' data
    const fetchInitialData = async () => {
      try {
        // Fetch all stories (or a default set) for the main sections.
        // Since your API requires a filter, we'll fetch a common one or adjust the API.
        // ASSUMPTION: We'll fetch 'Fantasy' as a starting point for now,
        // or you'd need a separate endpoint to get the "Trending/New" list.
        // For this refactor, we'll fetch a list of top stories regardless of genre.
        // *** To properly get Trending/New, you'd need a backend endpoint like /api/stories/trending ***

        // For demonstration, let's fetch a common list for 'Trending'
        const trendingList = await fetchStories("AnyPopularGenre"); // Assuming 'AnyPopularGenre' exists or endpoint is adjusted

        setStories(trendingList);
      } catch (err) {
        console.error("Failed to fetch initial stories:", err);
        setError("Failed to load initial stories.");
      } finally {
        setLoading(false);
      }
    };

    // Function to fetch specific genre sections, using the API's genre filter
    const fetchGenreSections = async () => {
      // Since your API handles the genre filtering, we just call the fetcher
      const [
        adventureList,
        fantasyList,
        thrillersList,
        romanceList,
        sciFiList,
        horrorList,
        sliceOfLifeList,
        dramaList,
      ] = await Promise.all([
        fetchStories("Adventure"),
        fetchStories("Fantasy"),
        fetchStories("Thriller"),
        fetchStories("Romance"),
        fetchStories("Sci-Fi"),
        fetchStories("Horror"),
        fetchStories("Slice of Life"),
        fetchStories("Drama"),
      ]);

      setAdventure(adventureList.slice(0, 6));
      setFantasy(fantasyList.slice(0, 6));
      setThrillers(thrillersList.slice(0, 6));
      setRomance(romanceList.slice(0, 6));
      setSciFi(sciFiList.slice(0, 6));
      setHorror(horrorList.slice(0, 6));
      setSliceOfLife(sliceOfLifeList.slice(0, 6));
      setDrama(dramaList.slice(0, 6));
    };

    // Run all fetches
    fetchInitialData();
    fetchGenreSections();
  }, []); // Empty dependency array means this runs once on mount

  // --- Data Filtering and Sorting for Sections based on fetched 'stories' ---
  // Since the API now does the genre filtering, we just need to handle sorting/slicing on the main list

  // NOTE: If the API doesn't provide sorting, we sort the main 'stories' array.
  // We'll use the 'stories' state for the 'Trending Now' and calculate 'New Releases'.
  const trending = stories.slice(0, 6); // Assuming the fetched 'stories' are already trending/popular

  const newReleases = [...stories]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

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

  // NOTE: Genres like `magicrealism`, `mystery`, `sliceOfLife`, `drama`, and `poetry`
  // were in the original file but not fetched/filtered here.
  // You would need to add `fetchStories` calls for them like the others if needed.

  return (
    <main className="min-h-screen w-full bg-[var(--background)]">
      <SiteHeader />

      <div className="px-4 md:px-10 py-6">
        <Carousel />

        {/* ---------------------- SECTIONS ---------------------- */}
        <Section title="Trending Now" items={trending} />
        <EditorsPick stories={stories} />
        <ShortReads stories={stories} />
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
        {/* Sci-Fi and Horror fetched separately above */}
        {sciFi.length > 0 && <Section title="Sci-Fi" items={sciFi} />}
        {horror.length > 0 && <Section title="Horror Stories" items={horror} />}
      </div>

      <Footer />
    </main>
  );
}
