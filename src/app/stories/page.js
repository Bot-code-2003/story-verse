// src/app/stories/page.js

"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";
import { GENRE_TILES } from "@/constants/genres";

export default function StoriesGenresPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <SiteHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-20 sm:pb-24">
        {/* Hero / Intro */}
        <section className="mb-10 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[var(--foreground)]/50 mb-3">
            Stories
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Choose your next{" "}
              <span className="underline decoration-[var(--foreground)]/40 decoration-2 underline-offset-4">
                world
              </span>
              .
            </h1>
            <p className="text-sm sm:text-base text-[var(--foreground)]/65 max-w-sm">
              Pick a genre to jump straight into short stories that match your
              current mood.
            </p>
          </div>
        </section>

        {/* Genre Grid */}
        <section>
          <div className="grid gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {GENRE_TILES.map((genre) => (
              <Link
                key={genre.name}
                href={genre.link}
                className="group relative rounded-3xl overflow-hidden border border-[var(--foreground)]/10 bg-[var(--foreground)]/[0.03] hover:border-[var(--foreground)]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative h-44 sm:h-52 md:h-56 overflow-hidden">
                  <img
                    src={genre.image}
                    alt={`${genre.name} stories`}
                    className="w-full h-full object-cover transform group-hover:scale-[1.06] transition-transform duration-500 ease-out"
                    loading="lazy"
                  />

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Text overlay */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-[11px] uppercase tracking-[0.2em] text-white/70 mb-1">
                      Genre
                    </p>
                    <h2 className="text-xl sm:text-2xl font-semibold text-white leading-tight">
                      {genre.name}
                    </h2>
                  </div>
                </div>

                {/* Bottom strip */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-[var(--foreground)]/10 bg-[var(--background)]/80 backdrop-blur-sm">
                  <p className="text-xs text-[var(--foreground)]/60">
                    Step into {genre.name.toLowerCase()}
                  </p>
                  <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--foreground)]/70 group-hover:text-[var(--foreground)]">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
