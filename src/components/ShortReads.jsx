// src/components/ShortReads.js
"use client";

import { useRef } from "react"; // Import useRef
import StoryCard from "./StoryCard";

// Utility component for the arrow icons (re-used from page.js logic)
const ChevronLeft = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 19.5L8.25 12l7.5-7.5"
    />
  </svg>
);

const ChevronRight = ({ className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 4.5l7.5 7.5-7.5 7.5"
    />
  </svg>
);


export default function ShortReads({ stories }) {
  // NOTE: You are fetching `quickReads` from the backend in `page.js` now.
  // The filtering here is redundant and should be removed if the list passed to `stories`
  // is already the filtered list (which it is in the `page.js` update).
  // However, I will keep the existing filtering logic for safety, but point out the potential for cleanup.
  const quickReads = stories.filter((s) => s.readTime <= 6).slice(0, 10);
  
  // 1. Create a ref for the scrollable container
  const scrollRef = useRef(null);
  const scrollDistance = 300; // Define scroll step size

  // 2. Scroll handler function
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount =
        direction === "left" ? -scrollDistance : scrollDistance;
      scrollRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };


  if (quickReads.length === 0) return null;

  return (
    <section className="mb-12 relative"> {/* 3. Add 'relative' for arrow positioning */}
      <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
        Quick Reads
      </h3>

      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 
                     p-1 bg-[var(--background)] text-[var(--foreground)] opacity-70 hover:opacity-100 
                     rounded-full transition-opacity shadow-lg hidden md:block"
          aria-label="Scroll left on Quick Reads"
        >
          <ChevronLeft />
        </button>

        {/* Story Card Scroll Container - Assign the ref here */}
        <div 
          ref={scrollRef} // 4. Assign the ref
          className="overflow-x-auto scrollbar-hide"
        >
          <div className="flex gap-5 pb-4">
            {quickReads.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 
                     p-1 bg-[var(--background)] text-[var(--foreground)] opacity-70 hover:opacity-100 
                     rounded-full transition-opacity shadow-lg hidden md:block"
          aria-label="Scroll right on Quick Reads"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
}