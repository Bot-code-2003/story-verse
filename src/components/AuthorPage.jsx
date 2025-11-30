"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { BookOpen, Calendar, Edit2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import EditProfileModal from "@/components/EditProfileModal";
import { useAuth } from "@/context/AuthContext";

export default function AuthorPage() {
  const params = useParams();
  const rawParam = params?.authorUsername || ""; // whatever the dynamic segment is named
  const router = useRouter();
  const { user: loggedInUser } = useAuth();

  // Normalize param: decode percent encoding, remove leading @, trim, lowercase for comparisons
  const decoded = decodeURIComponent(rawParam || "");
  const authorUsername = decoded.replace(/^@/, "").trim();
  const authorUsernameForFetch = authorUsername; // use this in API calls

  const [author, setAuthor] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // compute logged-in username normalized (no @)
  const loggedUsername =
    (loggedInUser?.username || "")
      .toString()
      .replace(/^@/, "")
      .trim()
      .toLowerCase() || null;

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

  async function fetchAuthorData() {
    try {
      // fetch author by normalized username (no leading @)
      const authorRes = await fetch(
        `/api/authors/${encodeURIComponent(authorUsernameForFetch)}`
      );
      if (!authorRes.ok) {
        throw new Error("Author not found");
      }
      const authorData = await authorRes.json();
      setAuthor(authorData);

      // fetch stories by author (route expected to accept username)
      const storiesRes = await fetch(
        `/api/authors/${encodeURIComponent(authorUsernameForFetch)}/stories`
      );
      if (storiesRes.ok) {
        const storiesData = await storiesRes.json();
        setStories(Array.isArray(storiesData) ? storiesData : []);
      } else {
        setStories([]);
      }
    } catch (err) {
      console.error("Error fetching author data:", err);
      setError(err.message || "Error fetching author");
      setAuthor(null);
      setStories([]);
    } finally {
      setLoading(false);
    }
  }

  const handleProfileSave = async (updatedUser) => {
    // update local author state
    setAuthor(updatedUser);

    // if the logged-in user edited their own profile, update localStorage sf_user so UI stays in sync
    try {
      const raw = localStorage.getItem("sf_user");
      if (raw) {
        const sf = JSON.parse(raw);
        // Only update local sf_user if this is the same logged-in user (by username)
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

  // Display name: prefer name, else username (but show @ in UI)
  const displayName = author.username;
  const displayedWithAt =
    "@" +
    (author.username ? author.username.replace(/^@/, "") : authorUsername);

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {/* Hero */}
        <div className="relative pt-24 pb-16 px-6 bg-gradient-to-b from-[var(--foreground)]/5 to-transparent">
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
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name / Username */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--foreground)] mb-2">
                  {displayName}
                </h1>
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

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-[var(--foreground)]">
                    {stories.length}
                  </p>
                  <p className="text-sm text-[var(--foreground)]/60">
                    {stories.length === 1 ? "Story" : "Stories"}
                  </p>
                </div>
                <div className="h-12 w-px bg-[var(--foreground)]/20"></div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-[var(--foreground)]">
                    {stories.reduce((total, s) => total + (s.readTime || 0), 0)}
                  </p>
                  <p className="text-sm text-[var(--foreground)]/60">
                    Min Read
                  </p>
                </div>
              </div>

              {/* Bio */}
              {author.bio && (
                <p className="max-w-2xl mx-auto text-lg text-[var(--foreground)]/70 leading-relaxed pt-4">
                  {author.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stories */}
        <div className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                Published Stories
              </h2>
              <p className="text-[var(--foreground)]/60">
                All stories written by {displayedWithAt}
              </p>
            </div>

            {stories.length === 0 ? (
              <div className="text-center py-16">
                <BookOpen className="w-16 h-16 text-[var(--foreground)]/30 mx-auto mb-4" />
                <p className="text-xl text-[var(--foreground)]/60">
                  No stories published yet
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {stories.map((story) => (
                  <Link
                    key={story.id}
                    href={`/stories/${story.id}`}
                    className="group block"
                  >
                    <article className="h-full bg-[var(--background)] border border-[var(--foreground)]/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--foreground)]/5">
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-6 space-y-3">
                        <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-blue-600 transition-colors line-clamp-2">
                          {story.title}
                        </h3>

                        {story.description && (
                          <p className="text-sm text-[var(--foreground)]/70 line-clamp-2 leading-relaxed">
                            {story.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 pt-2 text-xs text-[var(--foreground)]/60">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{story.readTime} min read</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[var(--foreground)]/10 py-8 bg-[var(--background)]">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-[var(--foreground)]/50 text-sm">
              &copy; {new Date().getFullYear()} My Story App
            </p>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={author}
        onSave={handleProfileSave}
        loading={isUpdating}
      />
    </>
  );
}
