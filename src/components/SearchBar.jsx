"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, BookOpen, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ stories: [], authors: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults({ stories: [], authors: [] });
      setIsOpen(false);
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setResults({ stories: [], authors: [] });
    setIsOpen(false);
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
  };

  const totalResults = (results.stories?.length || 0) + (results.authors?.length || 0);

  return (
    <div ref={searchRef} className="relative w-full md:w-80">
      {/* Search Input */}
      <div
        className={`
          flex items-center gap-2 
          px-3 py-2.5 rounded-xl
          border transition-all
          ${
            isOpen
              ? "border-blue-500 bg-white dark:bg-gray-900 shadow-lg"
              : "border-[var(--foreground)]/15 bg-[var(--foreground)]/5"
          }
          text-[var(--foreground)]/80
        `}
      >
        <Search className="w-4 h-4 opacity-70 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stories or authors..."
          className="
            w-full bg-transparent outline-none text-sm 
            text-[var(--foreground)] placeholder:text-[var(--foreground)]/50
          "
        />
        {loading && <Loader2 className="w-4 h-4 animate-spin opacity-50" />}
        {query && !loading && (
          <button
            onClick={handleClear}
            className="p-0.5 hover:bg-[var(--foreground)]/10 rounded transition"
          >
            <X className="w-4 h-4 opacity-50 hover:opacity-100" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && totalResults > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-[var(--foreground)]/10 rounded-xl shadow-2xl overflow-hidden z-50 max-h-[500px] overflow-y-auto">
          {/* Stories Section */}
          {results.stories && results.stories.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold text-[var(--foreground)]/50 uppercase tracking-wide">
                Stories
              </div>
              {results.stories.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.id}`}
                  onClick={handleResultClick}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--foreground)]/5 transition group"
                >
                  {story.coverImage ? (
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-12 h-16 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[var(--foreground)] group-hover:text-blue-600 transition truncate">
                      {story.title}
                    </h4>
                    {story.description && (
                      <p className="text-xs text-[var(--foreground)]/60 line-clamp-2 mt-1">
                        {story.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-xs text-[var(--foreground)]/50">
                      {story.genres && story.genres[0] && (
                        <span>{story.genres[0]}</span>
                      )}
                      {story.readTime && (
                        <>
                          <span>·</span>
                          <span>{story.readTime} min</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Authors Section */}
          {results.authors && results.authors.length > 0 && (
            <div className="p-2 border-t border-[var(--foreground)]/10">
              <div className="px-3 py-2 text-xs font-semibold text-[var(--foreground)]/50 uppercase tracking-wide">
                Authors
              </div>
              {results.authors.map((author) => (
                <Link
                  key={author.id}
                  href={`/authors/${author.username}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--foreground)]/5 transition group"
                >
                  {author.profileImage ? (
                    <img
                      src={author.profileImage}
                      alt={author.name || author.username}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                      {(author.name || author.username || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-[var(--foreground)] group-hover:text-blue-600 transition">
                      {author.name || author.username}
                    </h4>
                    <p className="text-xs text-[var(--foreground)]/50">
                      @{author.username}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {isOpen && query.trim().length >= 2 && totalResults === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-[var(--foreground)]/10 rounded-xl shadow-2xl p-6 text-center z-50">
          <Search className="w-12 h-12 mx-auto text-[var(--foreground)]/30 mb-3" />
          <p className="text-[var(--foreground)]/60 text-sm">
            No results found for "{query}"
          </p>
          <p className="text-[var(--foreground)]/40 text-xs mt-1">
            Try different keywords
          </p>
        </div>
      )}
    </div>
  );
}
