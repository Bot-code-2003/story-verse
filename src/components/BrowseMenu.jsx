"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const GENRE_TILES = [
  {
    name: "Fantasy",
    image:
      "https://i.pinimg.com/1200x/04/b3/a6/04b3a6e8dbfc0248c1fee727f0a6e876.jpg",
    count: "124 stories",
  },
  {
    name: "Romance",
    image:
      "https://i.pinimg.com/1200x/06/fa/fc/06fafc8f185570e47c3d584f10fe152d.jpg",
    count: "89 stories",
  },
  {
    name: "Thriller",
    image:
      "https://i.pinimg.com/1200x/40/5b/d1/405bd1236909e93e1114e422964c32f3.jpg",
    count: "156 stories",
  },
  {
    name: "Sci-Fi",
    image:
      "https://i.pinimg.com/736x/31/1b/a1/311ba1955db60f6d9986aa7154e46de4.jpg",
    count: "98 stories",
  },
  {
    name: "Horror",
    image:
      "https://i.pinimg.com/736x/c4/4d/d7/c44dd707c322a0411da779b64a23de2d.jpg",
    count: "67 stories",
  },
  {
    name: "Slice of Life",
    image:
      "https://i.pinimg.com/1200x/e9/74/1b/e9741b1b0b7bd975446146ce6d1b765e.jpg",
    count: "143 stories",
  },
  {
    name: "Adventure",
    image:
      "https://i.pinimg.com/736x/b8/35/e3/b835e3e1b989c948fe6a47ab8353584c.jpg",
    count: "112 stories",
  },
  {
    name: "Drama",
    image:
      "https://i.pinimg.com/1200x/06/4f/6d/064f6d3d8a396dac69fd31e7ec1ff8bd.jpg",
    count: "78 stories",
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
              href={`/genres/${tile.name.toLowerCase().replace(/ /g, "-")}`}
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
      <button
        className="text-sm font-medium text-[var(--foreground)]/80 hover:text-[var(--foreground)] transition flex items-center gap-1"
      >
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
                href={`/genres/${tile.name.toLowerCase().replace(/ /g, "-")}`}
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
