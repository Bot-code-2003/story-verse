"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import StoryEditor from "@/components/StoryEditor";

export default function EditStoryPage() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const storyId = params?.storyId;

  const [loading, setLoading] = useState(true);
  const [storyData, setStoryData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      router.push(`/login?redirect=/write/${storyId}`);
      return;
    }

    // Fetch story data
    const fetchStory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/stories/${storyId}`);
        
        if (!res.ok) {
          throw new Error("Story not found");
        }

        const data = await res.json();
        const story = data.story || data;

        // Check if user is the author
        const authorId = story.author?._id || story.author?.id || story.author;
        const userId = user._id || user.id;

        if (authorId.toString() !== userId.toString()) {
          setError("You don't have permission to edit this story");
          return;
        }

        setStoryData(story);
      } catch (err) {
        console.error("Error fetching story:", err);
        setError(err.message || "Failed to load story");
      } finally {
        setLoading(false);
      }
    };

    if (storyId) {
      fetchStory();
    }
  }, [user, router, storyId]);

  // Show loading state
  if (!user || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-[var(--foreground)]/20 border-t-[var(--foreground)] rounded-full animate-spin mx-auto"></div>
          <p className="text-[var(--foreground)]/60 text-sm">
            {!user ? "Redirecting to login..." : "Loading story..."}
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center space-y-4">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Render editor with story data
  return <StoryEditor storyId={storyId} initialData={storyData} />;
}
