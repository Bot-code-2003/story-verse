"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { GENRE_TILES } from "@/constants/genres";

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
            z-[2000]
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
