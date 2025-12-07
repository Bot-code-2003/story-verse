// src/app/stories/page.js

"use client";

import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

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
