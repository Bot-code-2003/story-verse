"use client";

import Link from "next/link";

const GENRE_TILES = [
  {
    name: "Fantasy",
    image:
      "https://cdn.pixabay.com/photo/2024/05/16/10/56/forest-8765686_1280.jpg",
    count: "124 stories",
  },
  {
    name: "Romance",
    image:
      "https://cdn.pixabay.com/photo/2021/10/29/13/30/love-6751932_1280.jpg",
    count: "89 stories",
  },
  {
    name: "Thriller",
    image:
      "https://cdn.pixabay.com/photo/2024/08/03/21/42/ai-generated-8943227_1280.png",
    count: "156 stories",
  },
  {
    name: "Sci-Fi",
    image:
      "https://cdn.pixabay.com/photo/2018/04/05/15/19/abstract-3293076_1280.jpg",
    count: "98 stories",
  },
  {
    name: "Horror",
    image:
      "https://images.unsplash.com/photo-1696012976137-f901d345e694?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGdob3N0c3xlbnwwfDF8MHx8fDI%3D",
    count: "67 stories",
  },
  {
    name: "Slice of Life",
    image:
      "https://cdn.pixabay.com/photo/2020/07/14/13/42/boat-5404195_1280.jpg",
    count: "143 stories",
  },
  {
    name: "Adventure",
    image:
      "https://cdn.pixabay.com/photo/2019/07/25/17/09/camp-4363073_1280.png",
    count: "112 stories",
  },
  {
    name: "Drama",
    image:
      "https://cdn.pixabay.com/photo/2025/05/23/01/24/ai-generated-9616743_1280.jpg",
    count: "78 stories",
  },
];

export default function DiscoverGenres() {
  return (
    <section className="mb-20">
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
          Browse Genres
        </h3>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
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
