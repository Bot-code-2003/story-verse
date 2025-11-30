"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import storiesData from "@/data/stories.json";
import usersData from "@/data/users.json";
import { ArrowLeft, BookOpen, Calendar, User2 } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";

const fetchUserById = (id) => {
  return usersData.find((user) => user.id === id);
};

const fetchStoriesByAuthor = (authorId) => {
  return storiesData.filter((story) => story.author === authorId);
};

export default function AuthorPage() {
  const params = useParams();
  const authorId = params.authorId;
  const router = useRouter();

  const [author, setAuthor] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authorId) {
      setLoading(true);
      const fetchedAuthor = fetchUserById(authorId);
      setAuthor(fetchedAuthor);

      if (fetchedAuthor) {
        const authorStories = fetchStoriesByAuthor(authorId);
        setStories(authorStories);
      }
      setLoading(false);
    }
  }, [authorId]);

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

  if (!author) {
    return (
      <>
        <SiteHeader />
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">Author not found</p>
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

  const authorName = author.name || `User ${author.id}`;

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        {/* Hero Section */}
        <div className="relative pt-24 pb-16 px-6 bg-gradient-to-b from-[var(--foreground)]/5 to-transparent">
          <div className="max-w-5xl mx-auto">
            <div className="text-center space-y-6">
              {/* Avatar */}
              <div className="inline-block relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-5xl shadow-2xl">
                  {authorName.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Author Name */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[var(--foreground)] mb-2">
                  {authorName}
                </h1>
                <p className="text-lg text-[var(--foreground)]/60">
                  Story Author
                </p>
              </div>

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
                    {stories.reduce(
                      (total, story) => total + (story.readTime || 0),
                      0
                    )}
                  </p>
                  <p className="text-sm text-[var(--foreground)]/60">
                    Min Read
                  </p>
                </div>
              </div>

              {/* Bio (if exists) */}
              {author.bio && (
                <p className="max-w-2xl mx-auto text-lg text-[var(--foreground)]/70 leading-relaxed pt-4">
                  {author.bio}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stories Section */}
        <div className="py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[var(--foreground)] mb-2">
                Published Stories
              </h2>
              <p className="text-[var(--foreground)]/60">
                All stories written by {authorName}
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
                      {/* Cover Image */}
                      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--foreground)]/5">
                        <img
                          src={story.coverImage}
                          alt={story.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-3">
                        <h3 className="text-xl font-bold text-[var(--foreground)] group-hover:text-blue-600 transition-colors line-clamp-2">
                          {story.title}
                        </h3>

                        {story.description && (
                          <p className="text-sm text-[var(--foreground)]/70 line-clamp-2 leading-relaxed">
                            {story.description}
                          </p>
                        )}

                        {/* Meta */}
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
    </>
  );
}
