"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const GENRE_TILES = [
  {
    name: "Fantasy",
    image:
      "https://cdn.pixabay.com/photo/2024/05/16/10/56/forest-8765686_1280.jpg",
    link: "/genre/fantasy",
  },
  {
    name: "Romance",
    image:
      "https://cdn.pixabay.com/photo/2021/10/29/13/30/love-6751932_1280.jpg",
    link: "/genre/romance",
  },
  {
    name: "Thriller",
    image:
      "https://cdn.pixabay.com/photo/2024/08/03/21/42/ai-generated-8943227_1280.png",
    link: "/genre/thriller",
  },
  {
    name: "Sci-Fi",
    image:
      "https://cdn.pixabay.com/photo/2018/04/05/15/19/abstract-3293076_1280.jpg",
    link: "/genre/sci-fi",
  },
  {
    name: "Horror",
    image:
      "https://images.unsplash.com/photo-1696012976137-f901d345e694?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGdob3N0c3xlbnwwfDF8MHx8fDI%3D",
    link: "/genre/horror",
  },
  {
    name: "Slice of Life",
    image:
      "https://cdn.pixabay.com/photo/2020/07/14/13/42/boat-5404195_1280.jpg",
    link: "/genre/slice-of-life",
  },
  {
    name: "Adventure",
    image:
      "https://cdn.pixabay.com/photo/2019/07/25/17/09/camp-4363073_1280.png",
      link: "/genre/adventure",
  },
  {
    name: "Drama",
    image:
      "https://cdn.pixabay.com/photo/2025/05/23/01/24/ai-generated-9616743_1280.jpg",
    link: "/genre/drama",
  },
];

export default function BrowseMenu({ isMobile = false }) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef(null);

  const handleMouseEnter = () => {
    // Clear any pending close timer
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    // Delay closing by 1 second
    closeTimer.current = setTimeout(() => {
      setOpen(false);
    }, 200);
  };

  // Mobile View - Simple Grid
  if (isMobile) {
    return (
      <div className="w-full space-y-3">
        <h3 className="text-sm font-semibold text-[var(--foreground)] uppercase tracking-wide">
          Browse
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {GENRE_TILES.map((tile) => (
            <Link
              href={`/genre/${encodeURIComponent(tile.name)}`}
              key={tile.name}
              className="group block"
            >
              <div
                className="
                  relative aspect-square rounded-lg overflow-hidden 
                  border border-[var(--foreground)]/10 
                  hover:border-[var(--foreground)]
                  transition-all duration-300
                "
              >
                <img
                  src={tile.image}
                  alt={tile.name}
                  className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-2">
                  <p className="text-white text-xs font-semibold text-center w-full">
                    {tile.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Desktop View - Dropdown
  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger */}
      <button className="text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition flex items-center gap-1">
        Browse
        <ChevronDown
          size={16}
          className={`opacity-80 transition-transform duration-300 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* DROPDOWN MUST BE INSIDE THE SAME WRAPPER */}
      {open && (
        <div
          className="
            absolute top-full left-1/2 -translate-x-1/2 mt-3
            w-[480px] p-4 rounded-xl z-50
            bg-[var(--background)] shadow-xl 
            border border-[var(--foreground)]/15
            transition duration-300
            pointer-events-auto
          "
        >
          <div className="grid grid-cols-4 gap-3">
            {GENRE_TILES.map((tile) => (
              <Link
                href={`/genre/${encodeURIComponent(tile.name).toLowerCase()}`}
                key={tile.name}
                className="group block"
              >
                <div
                  className="
                    relative aspect-square rounded-lg overflow-hidden 
                    border border-[var(--foreground)]/10 
                    hover:border-[var(--foreground)]
                    transition-all duration-300 shadow-sm hover:shadow-lg
                  "
                >
                  <img
                    src={tile.image}
                    alt={tile.name}
                    className="w-full h-full object-cover group-hover:scale-[1.06] transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-end p-2">
                    <p className="text-white text-sm font-semibold">
                      {tile.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
