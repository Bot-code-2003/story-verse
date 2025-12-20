// src/app/stories/[storyId]/page.js (Assuming this is the file location)

"use client";

import { useEffect, useState, useCallback, useRef } from "react"; // Added useCallback
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
// Removed static data imports:
// import storiesData from "@/data/stories.json";
// import usersData from "@/data/users.json";

import { Clock, BookOpen, Heart, Bookmark } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import StoryCard from "@/components/StoryCard";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import ShareBox from "@/components/ShareBox";
import PulseCheck from "@/components/PulseCheck";
import ReadingProgress from "@/components/ReadingProgress";
import { getGenreFallback } from "@/constants/genres";

// Modular story components
import StoryHero from "@/components/story/StoryHero";
import StoryContent from "@/components/story/StoryContent";
import CommentsSection from "@/components/story/CommentsSection";
import FloatingActionBar from "@/components/FloatingActionBar";
import RecommendationsSection from "@/components/story/RecommendationsSection";

// Import caching utilities
import { fetchWithCache } from "@/lib/cache";

// Import skeleton loader
import SkeletonStoryPage from "@/components/skeletons/SkeletonStoryPage";




const MAX_RECOMMENDATIONS = 6;



/**
 * Fetches the story and author data from the new API endpoint.
 * @param {string} id - The story ID.
 * @param {string} userId - Optional user ID to check liked/saved state
 * @returns {{story: object, authorData: object | null, liked: boolean, saved: boolean}}
 */
const fetchStoryAndAuthor = async (id, userId = null) => {
  // ⚠️ IMPORTANT: Don't use homepage cache for story pages!
  // Homepage cache only has minimal fields (title, coverImage, genres, readTime)
  // Story pages need ALL fields (content, description, etc.)
  // So we skip the homepage cache and fetch full story data
  
  // Create cache key for individual story

  const cacheKey = `story_${id}`;
  
  // For logged-in users, skip cache to get fresh interaction data
  if (userId) {
    let url = `/api/stories/${encodeURIComponent(id)}`;
    url += `?userId=${encodeURIComponent(userId)}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) return { story: null, authorData: null, liked: false, saved: false };
      throw new Error(`Failed to fetch story ${id}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      story: data.story,
      authorData: data.authorData,
      liked: data.liked || false,
      saved: data.saved || false,
      userPulse: data.userPulse || null,
    };
  }
  
  // For anonymous users, use cache (5-minute TTL)
  return await fetchWithCache(cacheKey, async () => {
    const url = `/api/stories/${encodeURIComponent(id)}`;
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) return { story: null, authorData: null, liked: false, saved: false };
      throw new Error(`Failed to fetch story ${id}: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      story: data.story,
      authorData: data.authorData,
      liked: false,
      saved: false,
      userPulse: null,
    };
  });
};

// NOTE: Since the `storiesData` is gone, we cannot perform client-side
// recommendations based on all stories. We will use a simplified approach
// by fetching recommendations by the primary genre using the `/api/stories?genre=` endpoint.

/**
 * Fetches recommended stories by genre using the index API.
 * Smart logic: Get from primary genre, then secondary, then random other genres
 * @param {object} currentStory - The story object.
 */
const fetchRecommendations = async (currentStory) => {
  if (!currentStory || !currentStory.genres || currentStory.genres.length === 0)
    return [];

  // Helper to shuffle array
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Helper to fetch stories by genre
  const fetchByGenre = async (genre) => {
    try {
      const url = `/api/stories?genre=${encodeURIComponent(genre)}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error(`Failed to fetch ${genre} stories:`, response.statusText);
        return [];
      }

      const data = await response.json();
      let stories = data.stories || [];
      
      // Filter out the current story
      stories = stories.filter((s) => s.id !== currentStory.id);
      
      return shuffleArray(stories);
    } catch (error) {
      console.error(`Error fetching ${genre} stories:`, error);
      return [];
    }
  };

  try {
    let recommendations = [];
    const storyGenres = currentStory.genres;
    
    // Step 1: Get recommendations from primary genre
    if (storyGenres.length > 0) {
      const primaryRecs = await fetchByGenre(storyGenres[0]);
      recommendations = primaryRecs.slice(0, MAX_RECOMMENDATIONS);
    }

    // Step 2: If we don't have 6 yet and there's a secondary genre, fetch from it
    if (recommendations.length < MAX_RECOMMENDATIONS && storyGenres.length > 1) {
      const secondaryRecs = await fetchByGenre(storyGenres[1]);
      const needed = MAX_RECOMMENDATIONS - recommendations.length;
      
      // Add secondary genre stories that aren't already in recommendations
      const newRecs = secondaryRecs.filter(
        story => !recommendations.some(r => r.id === story.id)
      );
      recommendations = [...recommendations, ...newRecs.slice(0, needed)];
    }

    // Step 3: If still not enough and story only has 2 genres, get from random other genres
    if (recommendations.length < MAX_RECOMMENDATIONS && storyGenres.length <= 2) {
      // Import all available genres
      const { GENRE_TILES } = await import('@/constants/genres');
      const allGenres = GENRE_TILES.map(g => g.name);
      
      // Get genres not used by this story
      const otherGenres = allGenres.filter(
        genre => !storyGenres.some(sg => sg.toLowerCase() === genre.toLowerCase())
      );
      
      // Shuffle and try random genres until we have enough
      const shuffledOtherGenres = shuffleArray(otherGenres);
      
      for (const genre of shuffledOtherGenres) {
        if (recommendations.length >= MAX_RECOMMENDATIONS) break;
        
        const genreRecs = await fetchByGenre(genre);
        const needed = MAX_RECOMMENDATIONS - recommendations.length;
        
        // Add stories that aren't already in recommendations
        const newRecs = genreRecs.filter(
          story => !recommendations.some(r => r.id === story.id)
        );
        recommendations = [...recommendations, ...newRecs.slice(0, needed)];
      }
    }

    return recommendations.slice(0, MAX_RECOMMENDATIONS);
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

import { sanitizeStoryContent } from "@/utils/contentSanitizer";

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
  
  // User's pulse selection
  const [userPulse, setUserPulse] = useState(null);

  // Comments state
  const [comments, setComments] = useState([]);
  const [commentsPage, setCommentsPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  // Login prompt modal state (for like/save when not logged in)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Ref for story content container
  const contentRef = useRef(null);

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
        const userId = user?._id || user?.id || null;
        
        // Fetch story with liked/saved/pulse state from API
        const { story: fetchedStory, authorData: fetchedAuthorData, liked, saved, userPulse: fetchedUserPulse } =
          await fetchStoryAndAuthor(storyId, userId);

        if (!fetchedStory) {
          setStory(null);
          setError("Story not found.");
          setLoading(false);
          return;
        }

        setStory(fetchedStory);
        setAuthorData(fetchedAuthorData || {});
        setIsLiked(liked);
        setIsSaved(saved);
        setUserPulse(fetchedUserPulse);

        // Set Author Name - prioritize 'name' over 'username'
        setAuthorName(
          fetchedAuthorData?.name ||
            fetchedAuthorData?.username ||
            `User ${fetchedStory.author || "N/A"}`
        );

        // ✅ Stop main loading - story is ready to display NOW
        setLoading(false);

        // 🔄 Load recommendations in background (non-blocking)
        fetchRecommendations(fetchedStory).then((recs) => {
          setRecommendations(recs);
        }).catch((err) => {
          console.error("Error loading recommendations:", err);
          setRecommendations([]);
        });

        // 🔄 Load comments in background (non-blocking)
        fetchComments(1, true);
        
      } catch (err) {
        console.error("Error loading story data:", err);
        setError("An error occurred while loading the story.");
        setLoading(false);
      }
    };

    loadData();
  }, [storyId, user]); // Added user to dependencies to refetch when user logs in/out


  // helper: ensure user is logged in or show modal
  const ensureAuthOrPrompt = () => {
  if (user) return true;
    setShowLoginPrompt(true);
    return false;
  };

  // Fetch comments with pagination
  const fetchComments = async (page = 1, reset = false) => {
    if (reset) {
      setLoadingComments(true);
    }

    try {
      const userId = user?._id || user?.id || null;
      let url = `/api/stories/${encodeURIComponent(storyId)}/comments?page=${page}&limit=20`;
      if (userId) {
        url += `&userId=${encodeURIComponent(userId)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch comments");

      const data = await res.json();
      
      if (reset) {
        setComments(data.comments || []);
        setCommentsPage(1);
      } else {
        setComments((prev) => [...prev, ...(data.comments || [])]);
        setCommentsPage(page);
      }

      setHasMoreComments(data.pagination?.hasMore || false);
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  const loadMoreComments = () => {
    if (!loadingComments && hasMoreComments) {
      fetchComments(commentsPage + 1, false);
    }
  };

  const handleSubmitComment = async () => {
    if (!ensureAuthOrPrompt()) return;
    if (!newCommentText.trim()) return;

    setSubmittingComment(true);
    try {
      const userId = user?._id || user?.id;
      const res = await fetch(`/api/stories/${encodeURIComponent(storyId)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, text: newCommentText.trim() }),
      });

      if (!res.ok) throw new Error("Failed to post comment");

      const data = await res.json();
      // Add new comment to the beginning of the list
      setComments((prev) => [data.comment, ...prev]);
      setNewCommentText("");
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleCommentLike = async (commentId, currentlyLiked) => {
    if (!ensureAuthOrPrompt()) return;

    // Optimistic update
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              liked: !currentlyLiked,
              likesCount: currentlyLiked ? c.likesCount - 1 : c.likesCount + 1,
            }
          : c
      )
    );

    try {
      const userId = user?._id || user?.id;
      const res = await fetch(`/api/comments/${encodeURIComponent(commentId)}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          action: currentlyLiked ? "unlike" : "like",
        }),
      });

      if (!res.ok) throw new Error("Failed to like comment");

      const data = await res.json();
      // Update with server response
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, liked: data.liked, likesCount: data.likesCount }
            : c
        )
      );
    } catch (err) {
      console.error("Error liking comment:", err);
      // Revert optimistic update
      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? {
                ...c,
                liked: currentlyLiked,
                likesCount: currentlyLiked ? c.likesCount + 1 : c.likesCount - 1,
              }
            : c
        )
      );
    }
  };

  // Handler for Like button - now uses API
  const handleLikeClick = async () => {
    if (!ensureAuthOrPrompt()) return;
    if (!story) return;

    const newLiked = !isLiked;
    setIsLiked(newLiked);

    try {
      const userId = user?._id || user?.id;
      const res = await fetch(
        `/api/stories/${encodeURIComponent(story.id)}/like`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            action: newLiked ? "like" : "unlike",
          }),
        }
      );

      if (!res.ok) throw new Error(`Like API failed: ${res.status}`);

      const data = await res.json();
      // Update the likes count from server response
      if (typeof data.likes === "number") {
        setStory((prev) => (prev ? { ...prev, likes: data.likes, likesCount: data.likes } : prev));
      }
    } catch (err) {
      console.error("Failed to update like on server:", err);
      // Revert optimistic update
      setIsLiked(!newLiked);
    }
  };

  // Handler for Save button - now uses API
  const handleSaveClick = async () => {
    if (!ensureAuthOrPrompt()) return;
    if (!story) return;

    const newSaved = !isSaved;
    setIsSaved(newSaved);

    try {
      const userId = user?._id || user?.id;
      const res = await fetch(
        `/api/stories/${encodeURIComponent(story.id)}/save`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            action: newSaved ? "save" : "unsave",
          }),
        }
      );

      if (!res.ok) throw new Error(`Save API failed: ${res.status}`);
    } catch (err) {
      console.error("Failed to update save on server:", err);
      // Revert optimistic update
      setIsSaved(!newSaved);
    }
  };

  // Handler for Pulse submission
  const handlePulseSubmit = async (pulseValue) => {
    if (!story) return;

    try {
      const userId = user?._id || user?.id;
      const res = await fetch(
        `/api/stories/${encodeURIComponent(story.id)}/pulse`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pulse: pulseValue, userId }),
        }
      );

      if (!res.ok) throw new Error(`Pulse API failed: ${res.status}`);

      const data = await res.json();
      // Update the story with new pulse data and user's selection
      if (data.pulse) {
        setStory((prev) => (prev ? { ...prev, pulse: data.pulse } : prev));
      }
      if (data.userPulse) {
        setUserPulse(data.userPulse);
      }
    } catch (err) {
      console.error("Failed to submit pulse:", err);
    }
  };

  // Removed the original `updateLocalSfUserArrays` definition as it's now a `useCallback` helper.

  if (loading) {
    return (
      <>
        <SiteHeader />
        <SkeletonStoryPage />
        <Footer />
      </>
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

  const finalContent = sanitizeStoryContent(story.content);

  // Scroll to comments function
  const scrollToComments = () => {
    const commentsSection = document.querySelector('[data-comments-section]');
    if (commentsSection) {
      commentsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

const primaryGenre =
  story.genres && story.genres.length > 0 ? story.genres[0] : "General";

// ✅ New: compute cover fallback from primary genre
const coverGenreFallback = getGenreFallback(story.genres || []);
const finalCoverImage = story.coverImage || coverGenreFallback;


  return (
    <>
      <ReadingProgress />
      <SiteHeader />
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": story.title,
              "description": story.description || story.content?.substring(0, 160),
              "image": finalCoverImage,
              "datePublished": story.createdAt,
              "dateModified": story.updatedAt || story.createdAt,
              "author": {
                "@type": "Person",
                "name": authorName,
                "url": `https://onesitread.com/authors/${authorData.username || ''}`
              },
              "publisher": {
                "@type": "Organization",
                "name": "OneSitRead",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://onesitread.com/logo.png"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://onesitread.com/stories/${story.id}`
              },
              "genre": story.genres || [],
              "wordCount": story.content?.split(/\s+/).length || 0,
              "timeRequired": `PT${story.readTime || 5}M`,
              "interactionStatistic": [
                {
                  "@type": "InteractionCounter",
                  "interactionType": "https://schema.org/LikeAction",
                  "userInteractionCount": story.likesCount || 0
                },
                {
                  "@type": "InteractionCounter",
                  "interactionType": "https://schema.org/CommentAction",
                  "userInteractionCount": comments.length || 0
                }
              ]
            })
          }}
        />
        
        {/* Hero/Header Section */}
        <StoryHero
          story={story}
          authorData={authorData}
          authorName={authorName}
          finalCoverImage={finalCoverImage}
          isLiked={isLiked}
          isSaved={isSaved}
          handleLikeClick={handleLikeClick}
          handleSaveClick={handleSaveClick}
          commentsCount={comments.length}
        />

        {/* Divider */}
        <div className="max-w-4xl mx-auto px-6">
          <div className="h-px bg-gradient-to-r from-transparent via-[var(--foreground)]/10 to-transparent"></div>
        </div>

        {/* Story Content */}
        <StoryContent
          content={finalContent}
        />

        {/* Pulse Check - At the end of story */}
        <div className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <PulseCheck
              storyId={story.id}
              onPulseSubmit={handlePulseSubmit}
              user={user}
              pulseCounts={story.pulse || { soft: 0, intense: 0, heavy: 0, warm: 0, dark: 0 }}
              userPulse={userPulse}
            />
          </div>
        </div>

        {/* Comments Section */}
        <CommentsSection
          comments={comments}
          user={user}
          newCommentText={newCommentText}
          setNewCommentText={setNewCommentText}
          handleSubmitComment={handleSubmitComment}
          submittingComment={submittingComment}
          handleCommentLike={handleCommentLike}
          setShowLoginPrompt={setShowLoginPrompt}
          loadingComments={loadingComments}
          hasMoreComments={hasMoreComments}
          loadMoreComments={loadMoreComments}
        />

        {/* RECOMMENDED STORIES */}
        <RecommendationsSection 
          recommendations={recommendations}
          primaryGenre={primaryGenre}
        />

        <Footer />
      </div>

      {/* Floating Action Bar */}
      <FloatingActionBar
        isLiked={isLiked}
        onLikeClick={handleLikeClick}
        isSaved={isSaved}
        onSaveClick={handleSaveClick}
        commentsCount={comments.length}
        storyTitle={story.title}
        onScrollToComments={scrollToComments}
      />

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
                  router.push(`/login?redirect=${encodeURIComponent(`/stories/${storyId}`)}`);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
              >
                Log in
              </button>

              {/* <button
                onClick={() => {
                  setShowLoginPrompt(false);
                  router.push(`/login?redirect=${encodeURIComponent(`/stories/${storyId}`)}`);
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-[var(--foreground)]/20 text-[var(--foreground)] font-semibold hover:bg-[var(--foreground)]/5 transition"
              >
                Create account
              </button> */}

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

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </>
  );
}
