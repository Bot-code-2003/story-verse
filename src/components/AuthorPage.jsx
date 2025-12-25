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
  const [bioExpanded, setBioExpanded] = useState(false);

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
            <p className="text-[var(--foreground)]/60 text-lg mb-4">
              We couldn't find the author you're looking for.
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
                  "name": "TheStoryBits"
                }
              },
              "breadcrumb": {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://thestorybits.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Authors",
                    "item": "https://thestorybits.com/authors"
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": author.name || author.username,
                    "item": `https://thestorybits.com/authors/${author.username}`
                  }
                ]
              }
            })
          }}
        />
        
        {/* Hero */}
        <div className="relative py-8 md:py-16 lg:py-20 px-4 md:px-6 bg-gradient-to-b from-[var(--foreground)]/5 to-transparent">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 md:gap-8 lg:gap-12">
              {/* Left Side - Avatar */}
              <div className="flex-shrink-0">
                {author.profileImage ? (
                  <img
                    src={author.profileImage}
                    alt={author.username || authorUsername}
                    className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-2xl object-cover shadow-2xl border-4 border-white dark:border-gray-800"
                  />
                ) : (
                  <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-4xl md:text-5xl lg:text-6xl shadow-2xl">
                    {(author.name || author.username || authorUsername || "U")
                      .charAt(1)
                      .toUpperCase()}
                  </div>
                )}
              </div>

              {/* Right Side - Info */}
              <div className="flex-1 w-full text-center lg:text-left space-y-4 md:space-y-6">
                {/* Name and Username */}
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-[var(--foreground)] mb-2 md:mb-3 break-words">
                    {displayName}
                  </h1>
                  <p className="text-sm md:text-base lg:text-lg text-[var(--foreground)]/60 break-words">
                    {displayUsername}
                  </p>
                </div>

                {/* Bio */}
                {author.bio && (
                  <div className="max-w-3xl mx-auto lg:mx-0">
                    <div 
                      className={`text-sm md:text-base text-[var(--foreground)]/70 leading-relaxed whitespace-pre-wrap break-words ${
                        !bioExpanded ? 'line-clamp-5' : ''
                      }`}
                      style={!bioExpanded ? {
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      } : {}}
                    >
                      {author.bio.split(/(https?:\/\/[^\s]+)/g).map((part, index) => {
                        const isUrl = part.match(/(https?:\/\/[^\s]+)/);
                        if (isUrl) {
                          return (
                            <a
                              key={index}
                              href={part}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 border-b border-indigo-600 hover:text-indigo-700 hover:border-indigo-700 hover:bg-indigo-600/10 transition-colors"
                            >
                              {part}
                            </a>
                          );
                        }
                        return part;
                      })}
                    </div>
                    {author.bio.split('\n').length > 3 || author.bio.length > 200 ? (
                      <button
                        onClick={() => setBioExpanded(!bioExpanded)}
                        className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors cursor-pointer"
                      >
                        {bioExpanded ? 'Show less' : 'Read more'}
                      </button>
                    ) : null}
                  </div>
                )}

                {/* Edit Profile Button */}
                {isOwnProfile && (
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="inline-flex items-center gap-2 px-6 md:px-8 py-2.5 md:py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-medium shadow-lg hover:shadow-xl text-sm md:text-base"
                  >
                    <Edit2 size={18} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        {isOwnProfile && (
          <div className="sticky top-0 z-20 bg-[var(--background)]/95 backdrop-blur-sm border-b border-[var(--foreground)]/10">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex gap-1">
                <button
                  onClick={() => setActiveTab("stories")}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                    activeTab === "stories"
                      ? "text-blue-600"
                      : "text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
                  }`}
                >
                  <BookOpen className="w-5 h-5" />
                  <span>My Stories</span>
                  {activeTab === "stories" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("liked")}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                    activeTab === "liked"
                      ? "text-blue-600"
                      : "text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span>Liked</span>
                  {activeTab === "liked" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab("saved")}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all relative ${
                    activeTab === "saved"
                      ? "text-blue-600"
                      : "text-[var(--foreground)]/60 hover:text-[var(--foreground)] hover:bg-[var(--foreground)]/5"
                  }`}
                >
                  <Bookmark className="w-5 h-5" />
                  <span>Saved</span>
                  {activeTab === "saved" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full"></div>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stories Section */}
        <div className="py-16 sm:py-10 px-6">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div className="mb-12 flex items-end justify-between">
              <div>
                <h2 className="text-2xl sm:text-4xl font-bold text-[var(--foreground)] mb-3">
                  {isOwnProfile
                    ? activeTab === "stories"
                      ? "My Stories"
                      : activeTab === "liked"
                      ? "Liked Stories"
                      : "Saved Stories"
                    : "Published Stories"}
                </h2>
                <p className="text-[var(--foreground)]/60 text-md sm:text-lg">
                  {isOwnProfile
                    ? activeTab === "stories"
                      ? `All stories written by you`
                      : activeTab === "liked"
                      ? `Stories you've liked`
                      : `Stories you've saved`
                    : `All stories written by ${displayedWithAt}`}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="w-16 h-16 border-4 border-[var(--foreground)]/20 border-t-[var(--foreground)] rounded-full animate-spin"></div>
              </div>
            ) : stories.length === 0 ? (
              <div className="text-center py-32">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--foreground)]/5 mb-6">
                  <BookOpen className="w-12 h-12 text-[var(--foreground)]/30" />
                </div>
                <p className="text-2xl text-[var(--foreground)]/60 font-medium">
                  {activeTab === "stories"
                    ? "No stories published yet"
                    : activeTab === "liked"
                    ? "No liked stories yet"
                    : "No saved stories yet"}
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                  {stories.map((story) => (
                    <div key={story.id} className="relative group">
                      <StoryCard story={story} />
                      {isOwnProfile && activeTab === "stories" && (
                        <div className="absolute top-4 right-4 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => router.push(`/write/${story.id}`)}
                            className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                            title="Edit story"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteStory(story.id)}
                            disabled={deletingStoryId === story.id}
                            className="p-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition shadow-lg hover:shadow-xl disabled:opacity-50"
                            title="Delete story"
                          >
                            {deletingStoryId === story.id ? (
                              <div className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-16">
                    <button
                      onClick={loadMore}
                      disabled={loadingMore}
                      className="px-10 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
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