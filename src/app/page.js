"use client";

import storiesData from "@/data/stories.json";
import usersData from "@/data/users.json"; // Imported but not used directly here

import Carousel from "@/components/Carousel";
import StoryCard from "@/components/StoryCard";
import SiteHeader from "@/components/SiteHeader"; // Global header with theme toggle
import ShortReads from "@/components/ShortReads";
import DiscoverGenres from "@/components/DiscoverGenres";
import BecomeAuthorBanner from "@/components/BecomeAuthorBanner";
import FeaturedAuthor from "@/components/FeaturedAuthor";
import EditorsPick from "@/components/EditorsPick";
import Footer from "@/components/Footer";

export default function Home() {
  const stories = storiesData;

  // --- Data Filtering and Sorting for Sections ---
  const trending = stories.slice(0, 6);
  const newReleases = [...stories]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const adventure = stories
    .filter((s) => s.genres.includes("Adventure"))
    .slice(0, 6);

  const horror = stories.filter((s) => s.genres.includes("Horror")).slice(0, 6);

  const magicrealism = stories
    .filter((s) => s.genres.includes("Magic Realism"))
    .slice(0, 6);

  const mystery = stories
    .filter((s) => s.genres.includes("Mystery"))
    .slice(0, 6);
  const fantasy = stories
    .filter((s) => s.genres.includes("Fantasy"))
    .slice(0, 6);
  const sliceOfLife = stories
    .filter((s) => s.genres.includes("Slice of Life"))
    .slice(0, 6);
  const sciFi = stories.filter((s) => s.genres.includes("Sci-Fi")).slice(0, 6);

  const thrillers = stories
    .filter((s) => s.genres.includes("Thriller"))
    .slice(0, 6);

  const drama = stories.filter((s) => s.genres.includes("Drama")).slice(0, 6);
  const romance = stories
    .filter((s) => s.genres.includes("Romance"))
    .slice(0, 6);
  const poetry = stories.filter((s) => s.genres.includes("Poetry")).slice(0, 6);
  return (
    // FIX: Apply the background CSS variable to the main container.
    // This ensures the primary page background color changes with the theme toggle.
    <main className="min-h-screen w-full bg-[var(--background)]">
      {/* Global Header (includes theme toggle) */}
      <SiteHeader />

      {/* Main Content Area */}
      <div className="px-4 md:px-10 py-6">
        <Carousel />

        {/* ---------------------- SECTIONS ---------------------- */}
        <Section title="Trending Now" items={trending} />
        <ShortReads stories={stories} />
        <Section title="New Releases" items={newReleases} />
        <DiscoverGenres />
        {fantasy.length > 3 && (
          <Section title="Fantasy Picks" items={fantasy} />
        )}
        {sliceOfLife.length > 3 && (
          <Section title="Slice of Life" items={sliceOfLife} />
        )}
        {drama.length > 3 && <Section title="Dramatic Reads" items={drama} />}
        {adventure.length > 3 && (
          <Section title="Adventure Tales" items={adventure} />
        )}
        <BecomeAuthorBanner />
        {thrillers.length > 3 && (
          <Section title="Thrillers" items={thrillers} />
        )}
        {romance.length > 0 && (
          <Section title="Romance Stories" items={romance} />
        )}
        {sciFi.length > 0 && <Section title="Sci-Fi & Mystery" items={sciFi} />}
        {horror.length > 0 && <Section title="Horror Stories" items={horror} />}
        <FeaturedAuthor />
        <EditorsPick stories={stories} />
      </div>

      <Footer />
    </main>
  );
}

/* ---------------------- SECTION COMPONENT (Reusable Story List Row) ---------------------- */

function Section({ title, items }) {
  if (items.length === 0) return null;

  return (
    <section className="mb-10">
      {/* Uses CSS variable for color to ensure it flips with the theme */}
      <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
        {title}
      </h3>

      {/* overflow-x-auto allows for horizontal scrolling on mobile */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-5 pb-4">
          {items.map((story) => (
            // IMPORTANT: StoryCard must also use the [var(--foreground)]/etc. notation
            // for its internal elements (text, backgrounds, borders)
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
      </div>
    </section>
  );
}
