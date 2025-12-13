"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import StoryCard from "@/components/StoryCard";
import SkeletonCard from "@/components/skeletons/SkeletonCard";


export default function GenrePage(props) {
  // ⬇️ unwrap Next.js dynamic params Promise
  const params = use(props.params);
  const genreName = decodeURIComponent(params.name);

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/genre/${genreName}?page=1&limit=18`);
        const data = await res.json();
        setStories(data.stories || []);
        setHasMore(data.pagination?.hasMore || false);
        setPage(1);
      } catch (err) {
        console.error("Error loading genre:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [genreName]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    
    setLoadingMore(true);
    try {
      const nextPage = page + 1;
      const res = await fetch(`/api/genre/${genreName}?page=${nextPage}&limit=18`);
      const data = await res.json();
      
      if (data.stories && data.stories.length > 0) {
        setStories((prev) => [...prev, ...data.stories]);
        setPage(nextPage);
        setHasMore(data.pagination?.hasMore || false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error loading more stories:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Genre descriptions for SEO
  const genreDescriptions = {
    "Fantasy": "Explore magical worlds, mythical creatures, and epic adventures in our Fantasy story collection.",
    "Sci-Fi": "Discover futuristic tales, space exploration, and technological wonders in our Science Fiction stories.",
    "Romance": "Fall in love with heartwarming tales of passion, connection, and relationships.",
    "Thriller": "Experience edge-of-your-seat suspense, mystery, and psychological tension.",
    "Horror": "Dive into spine-chilling tales of terror, supernatural encounters, and dark mysteries.",
    "Adventure": "Embark on thrilling journeys, daring quests, and exciting explorations.",
    "Drama": "Experience powerful emotional stories that explore the human condition.",
    "Slice of Life": "Enjoy relatable stories about everyday experiences and ordinary moments.",
    "Mystery": "Unravel puzzles, solve crimes, and uncover secrets in our mystery collection.",
    "Comedy": "Laugh out loud with humorous tales and witty narratives."
  };

  const genreDescription = genreDescriptions[genreName] || `Discover captivating ${genreName} stories on StoryVerse.`;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Structured Data for SEO */}
      <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              "name": `${genreName} Stories`,
              "description": genreDescription,
              "url": `https://storyverse.com/genre/${genreName}`,
              "isPartOf": {
                "@type": "WebSite",
                "name": "StoryVerse",
                "url": "https://storyverse.com"
              },
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://storyverse.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Genres",
                    "item": "https://storyverse.com/genres"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": genreName,
                    "item": `https://storyverse.com/genre/${genreName}`
                  }
                ]
              }
            })
          }}
        />
        
        <SiteHeader />

        <div className="px-4 md:px-10 py-8">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[var(--foreground)]">
              {genreName} Stories
            </h1>
            <p className="text-lg text-[var(--foreground)]/70 max-w-3xl">
              {genreDescription}
            </p>
          </header>

          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
              {[...Array(10)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!loading && stories.length === 0 && (
            <div className="text-gray-500 text-sm">No stories in this genre.</div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>

          {!loading && hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loadingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </div>

        <Footer />
      </main>
  );
}
