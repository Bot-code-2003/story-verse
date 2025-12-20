"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BookOpen, Calendar, Edit2, Heart, Bookmark, Trash2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import EditProfileModal from "@/components/EditProfileModal";
import { useAuth } from "@/context/AuthContext";
import StoryCard from "@/components/StoryCard";
import Footer from "./Footer";
import SkeletonAuthorPage from "@/components/skeletons/SkeletonAuthorPage";

export default function AuthorPage() {
  const params = useParams();
  const rawParam = params?.authorUsername || "";
  const router = useRouter();
  const { user: loggedInUser } = useAuth();

  const decoded = decodeURIComponent(rawParam || "");
  const authorUsername = decoded.trim();
  const authorUsernameForFetch = authorUsername;

  const [author, setAuthor] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Tab state
  const [activeTab, setActiveTab] = useState("stories"); // "stories" | "liked" | "saved"
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [deletingStoryId, setDeletingStoryId] = useState(null);

  const loggedUsername =
    (loggedInUser?.username || "").toString().trim().toLowerCase() || null;

  const isOwnProfile = !!(
    loggedUsername &&
    authorUsername &&
    loggedUsername.toLowerCase() === authorUsername.toLowerCase()
  );

  useEffect(() => {
    if (!authorUsernameForFetch) {
      setError("Invalid author");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetchAuthorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authorUsernameForFetch]);

  // Fetch stories when tab changes
  useEffect(() => {
    if (author) {
      fetchStories(1, true); // Reset to page 1 when tab changes
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, author]);

  async function fetchAuthorData() {
    try {
      const authorRes = await fetch(
        `/api/authors/${encodeURIComponent(authorUsernameForFetch)}`
      );
      if (!authorRes.ok) {
        throw new Error("Author not found");
      }
      const authorData = await authorRes.json();
      setAuthor(authorData.author || authorData);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching author data:", err);
      setError(err.message || "Error fetching author");
      setAuthor(null);
      setStories([]);
      setLoading(false);
    }
  }

  async function fetchStories(pageNum = 1, reset = false) {
    if (reset) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }

    try {
      let endpoint = "";
      
      if (activeTab === "stories") {
        endpoint = `/api/authors/${encodeURIComponent(authorUsernameForFetch)}/stories?page=${pageNum}&limit=18`;
      } else if (activeTab === "liked") {
        endpoint = `/api/authors/${encodeURIComponent(authorUsernameForFetch)}/liked?page=${pageNum}&limit=18`;
      } else if (activeTab === "saved") {
        endpoint = `/api/authors/${encodeURIComponent(authorUsernameForFetch)}/saved?page=${pageNum}&limit=18`;
      }

      const storiesRes = await fetch(endpoint);
      if (storiesRes.ok) {
        const data = await storiesRes.json();
        const fetchedStories = data.stories || [];

        if (reset) {
          setStories(fetchedStories);
          setPage(1);
        } else {
          setStories((prev) => [...prev, ...fetchedStories]);
          setPage(pageNum);
        }

        setHasMore(data.pagination?.hasMore || false);
      } else {
        setStories([]);
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching stories:", err);
      if (reset) {
        setStories([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchStories(page + 1, false);
    }
  };

  const handleDeleteStory = async (storyId) => {
    if (!confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
      return;
    }

    setDeletingStoryId(storyId);
    try {
      const userId = loggedInUser?._id || loggedInUser?.id;
      const res = await fetch(
        `/api/stories/${storyId}/delete?userId=${userId}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to delete story");
      }

      setStories((prev) => prev.filter((s) => s.id !== storyId));
      alert("Story deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.message || "Failed to delete story");
    } finally {
      setDeletingStoryId(null);
    }
  };


  const handleProfileSave = async (updatedUser) => {
    setAuthor(updatedUser);

    try {
      const raw = localStorage.getItem("sf_user");
      if (raw) {
        const sf = JSON.parse(raw);
        const sfUsername = (sf.username || "")
          .toString()
          .replace(/^@/, "")
          .trim();
        if (sfUsername.toLowerCase() === authorUsername.toLowerCase()) {
          const merged = { ...sf, ...updatedUser };
          localStorage.setItem("sf_user", JSON.stringify(merged));
        }
      }
    } catch (e) {
      console.error("Failed to update local sf_user after profile save:", e);
    }
    setShowEditModal(false);
  };

  if (loading && !author) {
    return (
      <>
        <SiteHeader />
        <SkeletonAuthorPage />
        <Footer />
      </>
    );
  }

  if (!author || error) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">
              {error || "Author not found"}
            </p>
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:underline"
            >
              Go back
            </button>
          </div>
        </div>
      </>
    );
  }

  const displayName = author.name;
  const displayUsername = author.username;
  const displayedWithAt =
    "@" +
    (author.username ? author.username.replace(/^@/, "") : authorUsername);

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              "mainEntity": {
                "@type": "Person",
                "name": author.name || author.username,
                "alternateName": author.username,
                "description": author.bio || `Author on TheStoryBits`,
                "image": author.profileImage || "",
                "url": `https://thestorybits.com/authors/${author.username}`,
                "sameAs": author.socialLinks || [],
                "jobTitle": "Author",
                "worksFor": {
                  "@type": "Organization",
                  "name": "StoryVerse"
                }
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
                    "name": "Authors",
                    "item": "https://storyverse.com/authors"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": author.name || author.username,
                    "item": `https://storyverse.com/authors/${author.username}`
                  }
                ]
              }
            })
          }}
        />
        
        {/* Hero */}
        <div className="relative py-14 px-6 bg-gradient-to-b from-[var(--foreground)]/5 to-transparent">

          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-6">
              {/* Avatar */}
              <div className="inline-block relative">
                {author.profileImage ? (
                  <img
                    src={author.profileImage}
                    alt={author.username || authorUsername}
                    className="w-32 h-32 rounded-full object-cover shadow-2xl border-4 border-white dark:border-gray-800"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-5xl shadow-2xl">
                    {(author.name || author.username || authorUsername || "U")
                      .charAt(1)
                      .toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name / Username */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--foreground)] mb-2">
                  {displayName}
                </h1>
                <p className="mt-4 text-sm text-[var(--foreground)]/60">
                  {displayUsername}
                </p>
              </div>

              {/* Edit Profile (only visible to owner) */}
              {isOwnProfile && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition font-medium"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              )}

              {/* Bio */}
              {author.bio && (
                <p className="max-w-2xl mx-auto text-lg text-[var(--foreground)]/70 leading-relaxed pt-4">
                  {author.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs (only for own profile) */}
        {isOwnProfile && (
          <div className="border-b border-[var(--foreground)]/10">
            <div className="max-w-5xl mx-auto px-6">
              <div className="flex gap-8">
                <button
                  onClick={() => setActiveTab("stories")}
                  className={`pb-4 px-2 font-medium transition-colors relative ${
                    activeTab === "stories"
                      ? "text-blue-600"
                      : "text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
                  }`}
                >
                  <BookOpen className="inline w-5 h-5 mr-2" />
                  My Stories
                  {activeTab === "stories" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("liked")}
                  className={`pb-4 px-2 font-medium transition-colors relative ${
                    activeTab === "liked"
                      ? "text-blue-600"
                      : "text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
                  }`}
                >
                  <Heart className="inline w-5 h-5 mr-2" />
                  Liked
                  {activeTab === "liked" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`pb-4 px-2 font-medium transition-colors relative ${
                    activeTab === "saved"
                      ? "text-blue-600"
                      : "text-[var(--foreground)]/60 hover:text-[var(--foreground)]"
                  }`}
                >
                  <Bookmark className="inline w-5 h-5 mr-2" />
                  Saved
                  {activeTab === "saved" && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stories */}
        <div className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                {isOwnProfile
                  ? activeTab === "stories"
                    ? "My Stories"
                    : activeTab === "liked"
                    ? "Liked Stories"
                    : "Saved Stories"
                  : "Published Stories"}
              </h2>
              <p className="text-[var(--foreground)]/60">
                {isOwnProfile
                  ? activeTab === "stories"
                    ? `All stories written by you`
                    : activeTab === "liked"
                    ? `Stories you've liked`
                    : `Stories you've saved`
                  : `All stories written by ${displayedWithAt}`}
              </p>
            </div>

            {loading ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 border-2 border-[var(--foreground)]/20 border-t-[var(--foreground)] rounded-full animate-spin mx-auto"></div>
              </div>
            ) : stories.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-[var(--foreground)]/30 mx-auto mb-4" />
                <p className="text-xl text-[var(--foreground)]/60">
                  {activeTab === "stories"
                    ? "No stories published yet"
                    : activeTab === "liked"
                    ? "No liked stories yet"
                    : "No saved stories yet"}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {stories.map((story) => (
                    <div key={story.id} className="relative">
                      <StoryCard story={story} />
                      {/* Edit and Delete buttons for own stories */}
                      {isOwnProfile && activeTab === "stories" && (
                        <div className="absolute top-3 right-3 flex gap-2 z-10">
                          <button
                            onClick={() => router.push(`/write/${story.id}`)}
                            className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg"
                            title="Edit story"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteStory(story.id)}
                            disabled={deletingStoryId === story.id}
                            className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition shadow-lg disabled:opacity-50"
                            title="Delete story"
                          >
                            {deletingStoryId === story.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {hasMore && (
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
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={author}
        onSave={handleProfileSave}
      />
    </>
  );
}
