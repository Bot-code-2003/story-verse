// src/app/stories/[storyId]/page.js (Assuming this is the file location)

"use client";

import { useEffect, useState, useCallback } from "react"; // Added useCallback
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
// Removed static data imports:
// import storiesData from "@/data/stories.json";
// import usersData from "@/data/users.json";

import { Clock, BookOpen, Heart, Bookmark } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import StoryCard from "@/components/StoryCard";
import Footer from "@/components/Footer"; // Corrected import path (assuming Footer is in components)
import { useAuth } from "@/context/AuthContext";

const MAX_RECOMMENDATIONS = 6;

// --- API FETCH UTILITIES ---

/**
 * Fetches the story and author data from the new API endpoint.
 * @param {string} id - The story ID.
 * @returns {{story: object, authorData: object | null}}
 */
const fetchStoryAndAuthor = async (id) => {
  const url = `/api/stories/${encodeURIComponent(id)}`;
  const response = await fetch(url);

  if (!response.ok) {
    // Check for 404 specifically
    if (response.status === 404) return { story: null, authorData: null };
    throw new Error(`Failed to fetch story ${id}: ${response.statusText}`);
  }

  const data = await response.json();
  console.log("Fetched story data:", data);
  return {
    story: data.story,
    authorData: data.authorData,
  };
};

// NOTE: Since the `storiesData` is gone, we cannot perform client-side
// recommendations based on all stories. We will use a simplified approach
// by fetching recommendations by the primary genre using the `/api/stories?genre=` endpoint.

/**
 * Fetches recommended stories by genre using the index API.
 * @param {object} currentStory - The story object.
 */
const fetchRecommendations = async (currentStory) => {
  if (!currentStory || !currentStory.genres || currentStory.genres.length === 0)
    return [];

  const primaryGenre = currentStory.genres[0];

  try {
    const url = `/api/stories?genre=${encodeURIComponent(primaryGenre)}`;
    const response = await fetch(url);

    if (!response.ok) {
      console.error("Failed to fetch recommendations:", response.statusText);
      return [];
    }

    const data = await response.json();
    let recs = data.stories || [];

    // Filter out the current story itself
    recs = recs.filter((s) => s.id !== currentStory.id);

    // Simple shuffle (optional, but good practice)
    const shuffleArray = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    return shuffleArray(recs).slice(0, MAX_RECOMMENDATIONS);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

const cleanContent = (content) => {
  if (!content) return "";
  return content;
};

// --- MAIN COMPONENT ---

export default function StoryPage() {
  const params = useParams();
  // Ensure storyId is treated as a string, not array of strings
  const storyId = Array.isArray(params.storyId)
    ? params.storyId[0]
    : params.storyId;
  const router = useRouter();
  const { user } = useAuth();

  const [story, setStory] = useState(null);
  const [authorName, setAuthorName] = useState("Unknown Author");
  // ⬇️ MODIFIED: ADDED authorData state
  const [authorData, setAuthorData] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Like/Save states
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Login prompt modal state (for like/save when not logged in)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Memoized helper function for local storage updates
  const updateLocalSfUserArrays = useCallback(
    ({ add = true, listName, storyId }) => {
      // Your existing updateLocalSfUserArrays logic goes here
      try {
        const raw = localStorage.getItem("sf_user");
        let sf = raw ? JSON.parse(raw) : null;

        // Simplified User structure if not present
        if (!sf) {
          sf = { id: null, likedStories: [], savedStories: [] };
        }

        const arr = Array.isArray(sf[listName]) ? [...sf[listName]] : [];
        const idx = arr.indexOf(storyId);

        if (add) {
          if (idx === -1) arr.push(storyId);
        } else {
          if (idx !== -1) arr.splice(idx, 1);
        }
        sf[listName] = arr;

        localStorage.setItem("sf_user", JSON.stringify(sf));
      } catch (e) {
        console.error("Failed to update sf_user in localStorage:", e);
      }
    },
    []
  ); // Empty dependency array means this function is stable

  // Main Data Fetching Effect
  useEffect(() => {
    if (!storyId) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Renamed inner variable to avoid shadowing, then used the new state.
        const { story: fetchedStory, authorData: fetchedAuthorData } =
          await fetchStoryAndAuthor(storyId);

        if (!fetchedStory) {
          setStory(null);
          setError("Story not found.");
          setLoading(false);
          return;
        }

        setStory(fetchedStory);
        setAuthorData(fetchedAuthorData || {}); // ⬅️ SET authorData state

        // Set Author Name
        setAuthorName(
          fetchedAuthorData?.name ||
            fetchedAuthorData?.username ||
            `User ${fetchedStory.author || "N/A"}`
        );

        // Fetch Recommendations using the new API method
        const fetchedRecommendations = await fetchRecommendations(fetchedStory);
        setRecommendations(fetchedRecommendations);

        // Initialize like/save based on localStorage
        try {
          const raw = localStorage.getItem("sf_user");
          if (raw) {
            const sf = JSON.parse(raw);
            setIsLiked(
              Array.isArray(sf.likedStories) &&
                sf.likedStories.includes(fetchedStory.id)
            );
            setIsSaved(
              Array.isArray(sf.savedStories) &&
                sf.savedStories.includes(fetchedStory.id)
            );
          } else {
            setIsLiked(false);
            setIsSaved(false);
          }
        } catch (e) {
          console.error("Failed to read sf_user:", e);
          setIsLiked(false);
          setIsSaved(false);
        }
      } catch (err) {
        console.error("Error loading story data:", err);
        setError("An error occurred while loading the story.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // Include updateLocalSfUserArrays in dependency array as it's used within a scope
    // Though it's memoized to be stable, linting requires it if used outside of its definition scope.
  }, [storyId, updateLocalSfUserArrays]);

  // helper: ensure user is logged in or show modal
  const ensureAuthOrPrompt = () => {
    if (user) return true;
    setShowLoginPrompt(true);
    return false;
  };

  // Handler for Like button (remains largely the same, now relying on the stable update helper)
  const handleLikeClick = () => {
    if (!ensureAuthOrPrompt()) return;
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    updateLocalSfUserArrays({
      add: newLiked,
      listName: "likedStories",
      storyId: story.id,
    });
    // TODO: persist to server
  };

  // Handler for Save button (remains largely the same, now relying on the stable update helper)
  const handleSaveClick = () => {
    if (!ensureAuthOrPrompt()) return;
    const newSaved = !isSaved;
    setIsSaved(newSaved);
    updateLocalSfUserArrays({
      add: newSaved,
      listName: "savedStories",
      storyId: story.id,
    });
    // TODO: persist to server
  };

  // Removed the original `updateLocalSfUserArrays` definition as it's now a `useCallback` helper.

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-[var(--foreground)]/20 border-t-[var(--foreground)] rounded-full animate-spin mx-auto"></div>
          <p className="text-[var(--foreground)]/60 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <p className="text-red-500 text-lg">Error: {error}</p>
      </div>
    );
  }

  // The rest of the return statement (JSX) remains the same
  // ... (rest of the component's JSX remains the same as it relies on the state variables)

  const finalContent = cleanContent(story.content);
  const primaryGenre =
    story.genres && story.genres.length > 0 ? story.genres[0] : "General";

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {/* Hero/Header Section */}
        <div className="pt-24 pb-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-center">
              {/* Left: Title, Description, Author, Buttons */}
              <div className="space-y-4 lg:col-span-2">
                <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-[var(--foreground)]">
                  {story.title}
                </h1>
                {story.description && (
                  <p className="text-lg md:text-xl text-[var(--foreground)]/70 leading-relaxed">
                    {story.description}
                  </p>
                )}
                <div className="flex items-center gap-6 pt-4">
                  <Link
                    // Link to the author page using the author's ID from the state
                    href={`/authors/${authorData.username || ""}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    {/* ⬇️ MODIFIED: Author Avatar Logic ⬇️ */}
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                      {authorData.profileImage ? (
                        <img
                          src={authorData.profileImage}
                          alt={`${authorName}'s profile`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                          {authorName.charAt(1).toUpperCase()}
                        </div>
                      )}
                    </div>
                    {/* ⬆️ MODIFIED: Author Avatar Logic ⬆️ */}

                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)] hover:underline">
                        {authorName}
                      </p>
                      {/* ⬇️ MODIFIED: Display Username ⬇️ */}
                      {authorData.username && (
                        <p className="text-xs text-[var(--foreground)]/50">
                          {authorData.username}
                        </p>
                      )}
                      {/* ⬆️ MODIFIED: Display Username ⬆️ */}
                    </div>
                  </Link>
                  <div className="h-10 w-px bg-[var(--foreground)]/20"></div>
                  <div className="flex items-center gap-2 text-[var(--foreground)]/60">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{story.readTime} min</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleLikeClick}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                      isLiked
                        ? "bg-red-50 text-red-600 border border-red-200"
                        : "bg-[var(--foreground)]/5 text-[var(--foreground)]/70 border border-[var(--foreground)]/10 hover:bg-[var(--foreground)]/10"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
                    />
                    <span className="text-sm">
                      {isLiked ? "Liked" : "Like"}
                    </span>
                  </button>

                  <button
                    onClick={handleSaveClick}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                      isSaved
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "bg-[var(--foreground)]/5 text-[var(--foreground)]/70 border border-[var(--foreground)]/10 hover:bg-[var(--foreground)]/10"
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`}
                    />
                    <span className="text-sm">
                      {isSaved ? "Saved" : "Save"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Right: Image */}
              <div className="relative flex justify-center lg:justify-center lg:col-span-1">
                <div className="relative w-64 md:w-72 rounded-2xl overflow-hidden border border-[var(--foreground)]/10 shadow-xl">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--foreground)]/10 to-transparent"></div>
        </div>

        {/* Story Content */}
        <div className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            {/* The global style JSX block remains unchanged */}
            <style jsx global>{`
              .story-content p {
                margin-top: 4px;
                margin-bottom: 1.5rem;
                line-height: 1.9;
                font-size: 1.125rem;
                color: var(--foreground);
                opacity: 0.8;
                font-weight: 300;
              }
              .story-content p:first-child {
                margin-top: 0;
              }
              .story-content p:first-child::first-letter {
                font-size: 4rem;
                line-height: 1;
                float: left;
                margin-right: 0.75rem;
                margin-top: 0.25rem;
                font-weight: 700;
                color: #2563eb;
              }
              .story-content h1,
              .story-content h2,
              .story-content h3 {
                margin-top: 3rem;
                margin-bottom: 1.5rem;
                font-weight: 600;
                color: var(--foreground);
                letter-spacing: -0.025em;
              }
              .story-content h1 {
                font-size: 2.25rem;
              }
              .story-content h2 {
                font-size: 1.875rem;
              }
              .story-content h3 {
                font-size: 1.5rem;
              }
              .story-content strong {
                color: var(--foreground);
                font-weight: 600;
              }
              .story-content em {
                font-style: italic;
                color: var(--foreground);
                opacity: 0.7;
              }
              .story-content a {
                color: #2563eb;
                text-decoration: none;
                border-bottom: 1px solid #2563eb;
                transition: all 0.2s;
              }
              .story-content a:hover {
                color: #1d4ed8;
                border-bottom-color: #1d4ed8;
              }
              .story-content blockquote {
                border-left: 3px solid #2563eb;
                padding-left: 2rem;
                margin: 2rem 0;
                font-style: italic;
                color: var(--foreground);
                opacity: 0.7;
                font-size: 1.25rem;
              }
            `}</style>
            <div
              className="story-content"
              dangerouslySetInnerHTML={{ __html: finalContent }}
            />
          </div>
        </div>

        {/* RECOMMENDED STORIES */}
        {recommendations.length > 0 && (
          <div className="py-16 px-6 bg-[var(--foreground)]/5 border-t border-[var(--foreground)]/10">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold mb-8 text-[var(--foreground)] text-center">
                You May Also Like
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {recommendations.map((recStory) => (
                  // The StoryCard component will likely need to handle the new ID format from the API
                  <StoryCard key={recStory.id} story={recStory} />
                ))}
              </div>

              <div className="text-center pt-10">
                <button
                  onClick={() => router.push(`/?genre=${primaryGenre}`)}
                  className="px-6 py-2 border border-[var(--foreground)]/20 text-[var(--foreground)]/80 rounded-full text-sm hover:bg-[var(--foreground)]/10 transition-colors"
                >
                  View More {primaryGenre} Stories
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>

      {/* Login Prompt Modal (remains unchanged) */}
      {showLoginPrompt && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          aria-labelledby="login-prompt-title"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowLoginPrompt(false)}
          />
          <div className="relative bg-[var(--background)] rounded-3xl shadow-2xl w-full max-w-md p-6 z-10">
            <h3
              id="login-prompt-title"
              className="text-lg font-bold mb-2 text-[var(--foreground)]"
            >
              Please log in to continue
            </h3>
            <p className="text-sm text-[var(--foreground)]/70 mb-6">
              You need an account to like or save stories. Log in to continue,
              or create a new account.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  router.push("/login");
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Log in
              </button>

              <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  router.push("/signup");
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-[var(--foreground)]/20 text-[var(--foreground)] font-semibold hover:bg-[var(--foreground)]/5 transition"
              >
                Create account
              </button>

              <button
                onClick={() => setShowLoginPrompt(false)}
                className="absolute top-3 right-3 text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
