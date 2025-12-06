"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import StoryCard from "@/components/StoryCard";

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

  return (
    <main className="min-h-screen bg-[var(--background)]">
      <SiteHeader />

      <div className="px-4 md:px-10 py-8">
        <h1 className="text-3xl font-bold mb-6 text-[var(--foreground)]">
          {genreName} Stories
        </h1>

        {loading && (
          <div className="text-lg text-[var(--foreground)]">Loading...</div>
        )}

        {!loading && stories.length === 0 && (
          <div className="text-gray-500 text-sm">No stories in this genre.</div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
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
