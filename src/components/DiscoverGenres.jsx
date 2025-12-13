"use client";

import Link from "next/link";
import { GENRE_TILES } from "@/constants/genres";

export default function DiscoverGenres() {
  return (
    <section className="mb-20">
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
          Browse Genres
        </h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {GENRE_TILES.map((genre) => {
          const url = `/genre/${encodeURIComponent(genre.name)}`;

          return (
            <Link key={genre.name} href={url} className="group text-left">
              {/* Image Circle */}
              <div className="relative aspect-square w-full mb-3 rounded-full overflow-hidden bg-[var(--foreground)]/5">
                <img
                  src={genre.image}
                  alt={genre.name}
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-300"></div>
              </div>

              {/* Text */}
              <div className="px-1">
                <h4 className="text-[var(--foreground)] text-center font-medium text-sm mb-0.5 transition-colors">
                  {genre.name}
                </h4>
                {/* <p className="text-[var(--foreground)]/40 text-xs">
                  {genre.count}
                </p> */}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
