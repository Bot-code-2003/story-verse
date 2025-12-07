"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState({ stories: [], authors: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef(null);

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
    // If query is too short, reset everything and STOP loading
    if (query.trim().length < 2) {
      setResults({ stories: [], authors: [] });
      setIsOpen(false);
      setLoading(false); // ✅ IMPORTANT: clear loading state
      return;
    }

    setLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}&limit=5`
        );
        if (res.ok) {
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        } else {
          setResults({ stories: [], authors: [] });
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults({ stories: [], authors: [] });
        setIsOpen(false);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleClear = () => {
    setQuery("");
    setResults({ stories: [], authors: [] });
    setIsOpen(false);
    setLoading(false); // ✅ also good to clear here
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery("");
    setResults({ stories: [], authors: [] });
    setLoading(false);
  };

  const totalResults =
    (results.stories?.length || 0) + (results.authors?.length || 0);

  return (
    <div ref={searchRef} className="relative w-full md:w-80">
      {/* Search Input */}
      <div
        className={`
          flex items-center gap-2
          px-3 py-2.5 rounded-xl
          border
          bg-[var(--background)]
          text-[var(--foreground)]
          transition-all
          border-[var(--foreground)]
        `}
      >
        <Search className="w-4 h-4 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search stories or authors..."
          className="
            w-full bg-transparent outline-none text-sm
            text-[var(--foreground)]
          "
        />
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        {query && !loading && (
          <button
            onClick={handleClear}
            className="p-1 rounded hover:bg-[var(--foreground)] hover:text-[var(--background)] transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && totalResults > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] border border-[var(--foreground)] rounded-xl shadow-2xl z-50 max-h-[500px] overflow-y-auto">
          {/* Stories Section */}
          {results.stories && results.stories.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]">
                Stories
              </div>
              {results.stories.map((story) => (
                <Link
                  key={story.id}
                  href={`/stories/${story.id}`}
                  onClick={handleResultClick}
                  className="flex items-start gap-3 p-3 rounded-lg group hover:bg-[var(--foreground)] hover:text-[var(--background)] transition"
                >
                  {story.coverImage ? (
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-12 h-16 object-cover rounded flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-16 rounded flex items-center justify-center flex-shrink-0 bg-[var(--foreground)] text-[var(--background)]">
                      <BookOpen className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate group-hover:text-[var(--background)]">
                      {story.title}
                    </h4>
                    {story.description && (
                      <p className="text-xs mt-1 line-clamp-2 group-hover:text-[var(--background)]">
                        {story.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1 text-xs">
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
            <div className="p-2 border-t border-[var(--foreground)]">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--foreground)]">
                Authors
              </div>
              {results.authors.map((author) => (
                <Link
                  key={author.id}
                  href={`/authors/${author.username}`}
                  onClick={handleResultClick}
                  className="flex items-center gap-3 p-3 rounded-lg group hover:bg-[var(--foreground)] hover:text-[var(--background)] transition"
                >
                  {author.profileImage ? (
                    <img
                      src={author.profileImage}
                      alt={author.name || author.username}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--foreground)] text-[var(--background)] font-bold">
                      {(author.name || author.username || "U")
                        .charAt(1)
                        .toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm group-hover:text-[var(--background)]">
                      {author.name || author.username}
                    </h4>
                    <p className="text-xs">{author.username}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No Results */}
      {isOpen &&
        query.trim().length >= 2 &&
        totalResults === 0 &&
        !loading && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--background)] border border-[var(--foreground)] rounded-xl shadow-2xl p-6 text-center z-50">
            <Search className="w-10 h-10 mx-auto mb-3" />
            <p className="text-sm">
              No results found for &quot;{query}&quot;
            </p>
            <p className="text-xs mt-1">Try different keywords.</p>
          </div>
        )}
    </div>
  );
}
