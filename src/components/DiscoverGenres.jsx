"use client";

import React from "react";
import Link from "next/link";
import { GENRE_TILES } from "@/constants/genres";

export default function DiscoverGenres() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden -mx-6 px-6 md:-mx-8 md:px-8 lg:-mx-10 lg:px-10">
      <div className=" mx-auto relative z-10">

        {/* ---- MOBILE GRID (Stacked 2-columns, vertical scroll) ---- */}
        <div className="lg:hidden">
          <div className="grid grid-cols-2 gap-3">
            {GENRE_TILES.map((genre) => (
              <Link
                key={genre.name}
                href={`/genre/${encodeURIComponent(genre.name)}`}
                className="group relative flex items-center gap-3 p-2 bg-white rounded-xl shadow-sm border border-[#c5d8c1]/30 active:scale-95 transition-transform"
              >
                <img
                  src={genre.image}
                  alt={genre.name}
                  className="w-10 h-10 rounded-full object-cover shadow-sm flex-shrink-0"
                />
                <span className="text-sm font-bold text-[#2d3a2a] truncate">
                  {genre.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ---- DESKTOP BENTO GRID (7 Items) ---- */}
        <div className="hidden lg:grid grid-cols-6 grid-rows-2 gap-4 h-[380px]">
          <Link href={`/genre/${encodeURIComponent(GENRE_TILES[0].name)}`} className="group relative col-span-2 row-span-2 rounded-3xl overflow-hidden">
              <GenreContent genre={GENRE_TILES[0]} lgText />
          </Link>
          <Link href={`/genre/${encodeURIComponent(GENRE_TILES[1].name)}`} className="group relative col-span-2 row-span-1 rounded-3xl overflow-hidden">
              <GenreContent genre={GENRE_TILES[1]} />
          </Link>
          <Link href={`/genre/${encodeURIComponent(GENRE_TILES[2].name)}`} className="group relative col-span-1 row-span-1 rounded-3xl overflow-hidden">
              <GenreContent genre={GENRE_TILES[2]} />
          </Link>
          <Link href={`/genre/${encodeURIComponent(GENRE_TILES[3].name)}`} className="group relative col-span-1 row-span-1 rounded-3xl overflow-hidden">
              <GenreContent genre={GENRE_TILES[3]} />
          </Link>
          <Link href={`/genre/${encodeURIComponent(GENRE_TILES[4].name)}`} className="group relative col-span-1 row-span-1 rounded-3xl overflow-hidden">
              <GenreContent genre={GENRE_TILES[4]} />
          </Link>
          <Link href={`/genre/${encodeURIComponent(GENRE_TILES[5].name)}`} className="group relative col-span-2 row-span-1 rounded-3xl overflow-hidden">
              <GenreContent genre={GENRE_TILES[5]} />
          </Link>
          <Link href={`/genre/${encodeURIComponent(GENRE_TILES[6].name)}`} className="group relative col-span-1 row-span-1 rounded-3xl overflow-hidden">
              <GenreContent genre={GENRE_TILES[6]} />
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-14 text-center">
          <p className="font-serif italic text-[var(--text-color)] text-lg">
            Find your next favorite story.
          </p>
        </div>
      </div>
    </section>
  );
}

/* Reusable Content Layer for Desktop Bento */
const GenreContent = ({ genre, lgText = false }) => (
  <>
    <img
      src={genre.image}
      alt={genre.name}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
    <div className="absolute inset-0 flex items-center justify-center">
      <h3 className={`text-white font-bold tracking-widest uppercase text-center px-4 drop-shadow-lg
        ${lgText ? "text-2xl" : "text-sm md:text-base"}`}>
        {genre.name}
      </h3>
    </div>
  </>
);
