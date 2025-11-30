"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import storiesData from "@/data/stories.json";
import usersData from "@/data/users.json";
import { Clock, BookOpen, Heart, Bookmark } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import StoryCard from "@/components/StoryCard";
import Footer from "./Footer";
import { useAuth } from "@/context/AuthContext";

const MAX_RECOMMENDATIONS = 6;

const fetchStoryById = (id) => {
  return storiesData.find((story) => story.id === id);
};

const fetchUserById = (id) => {
  return usersData.find((user) => user.id === id);
};

const cleanContent = (content) => {
  if (!content) return "";
  return content;
};

const fetchRecommendations = (currentStory) => {
  if (!currentStory) return [];

  const currentStoryId = currentStory.id;
  const currentGenres = currentStory.genres || [];
  let recommendedStories = new Set();

  currentGenres.forEach((genre) => {
    storiesData.forEach((story) => {
      if (story.id !== currentStoryId && story.genres.includes(genre)) {
        recommendedStories.add(story);
      }
    });
  });

  let finalRecs = Array.from(recommendedStories);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  finalRecs = shuffleArray(finalRecs);

  if (finalRecs.length < MAX_RECOMMENDATIONS) {
    const storiesToExclude = new Set([
      currentStoryId,
      ...finalRecs.map((s) => s.id),
    ]);
    const allOtherStories = storiesData.filter(
      (story) => !storiesToExclude.has(story.id)
    );

    const shuffledOthers = shuffleArray(allOtherStories);
    const needed = MAX_RECOMMENDATIONS - finalRecs.length;
    finalRecs.push(...shuffledOthers.slice(0, needed));
  }

  return finalRecs.slice(0, MAX_RECOMMENDATIONS);
};

export default function StoryPage() {
  const params = useParams();
  const storyId = params.storyId;
  const router = useRouter();
  const { user } = useAuth();

  const [story, setStory] = useState(null);
  const [authorName, setAuthorName] = useState("Unknown Author");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Like/Save states
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Login prompt modal state (for like/save when not logged in)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  useEffect(() => {
    if (storyId) {
      setLoading(true);
      const fetchedStory = fetchStoryById(storyId);

      if (fetchedStory) {
        setStory(fetchedStory);

        // Fetch Author
        const fetchedAuthor = fetchUserById(fetchedStory.author);
        setAuthorName(
          fetchedAuthor
            ? fetchedAuthor.name || `User ${fetchedAuthor.id}`
            : `User ${fetchedStory.author}`
        );

        // Fetch Recommendations
        const fetchedRecommendations = fetchRecommendations(fetchedStory);
        setRecommendations(fetchedRecommendations);

        // initialize like/save based on localStorage user state (if available)
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
      } else {
        setStory(null);
        setRecommendations([]);
      }
      setLoading(false);
    }
  }, [storyId]);

  // helper: ensure user is logged in or show modal
  const ensureAuthOrPrompt = () => {
    if (user) return true;
    setShowLoginPrompt(true);
    return false;
  };

  // helper: update localStorage's sf_user likedStories/savedStories arrays
  const updateLocalSfUserArrays = ({ add = true, listName, storyId }) => {
    try {
      const raw = localStorage.getItem("sf_user");
      let sf = raw ? JSON.parse(raw) : null;
      if (!sf) {
        // If there's no sf_user yet, create a minimal structure
        sf = {
          id: null,
          email: "",
          username: "",
          name: "",
          bio: "",
          profileImage: "",
          followers: [],
          following: [],
          savedStories: [],
          likedStories: [],
        };
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
  };

  // Handler for Like button
  const handleLikeClick = async () => {
    if (!ensureAuthOrPrompt()) return;

    // toggle local state for instant feedback
    const newLiked = !isLiked;
    setIsLiked(newLiked);

    // update localStorage sf_user
    updateLocalSfUserArrays({
      add: newLiked,
      listName: "likedStories",
      storyId: story.id,
    });

    // TODO: persist to server (example)
    // try {
    //   await fetch('/api/stories/like', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({ storyId: story.id, userId: user.id, like: newLiked })
    //   });
    // } catch (e) { console.error('Failed to persist like', e); }
  };

  // Handler for Save button
  const handleSaveClick = async () => {
    if (!ensureAuthOrPrompt()) return;

    const newSaved = !isSaved;
    setIsSaved(newSaved);

    updateLocalSfUserArrays({
      add: newSaved,
      listName: "savedStories",
      storyId: story.id,
    });

    // TODO: persist to server (example)
    // try {
    //   await fetch('/api/stories/save', {
    //     method: 'POST',
    //     headers: {'Content-Type': 'application/json'},
    //     body: JSON.stringify({ storyId: story.id, userId: user.id, save: newSaved })
    //   });
    // } catch (e) { console.error('Failed to persist save', e); }
  };

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

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <p className="text-red-500 text-lg">Story not found</p>
      </div>
    );
  }

  const finalContent = cleanContent(story.content);
  const primaryGenre = story.genres[0];

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
                    href={`/authors/${story.author}`}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                      {authorName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[var(--foreground)] hover:underline">
                        {authorName}
                      </p>
                      <p className="text-xs text-[var(--foreground)]/50">
                        Story Author
                      </p>
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

      {/* Login Prompt Modal (for Like/Save) */}
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
