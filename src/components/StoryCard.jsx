// StoryCard.jsx
"use client";

import { Clock } from "lucide-react";
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

/* ✅ Helper: Safely get fallback image from primary genre */
function getGenreFallback(genres = []) {
  if (!Array.isArray(genres) || genres.length === 0) return null;

  const primaryGenre = genres[0];

  const matchedGenre = GENRE_TILES.find(
    (g) => g.name.toLowerCase() === primaryGenre.toLowerCase()
  );

  return matchedGenre?.image || null;
}

export default function StoryCard({ story, showAuthor = true }) {
  // ✅ Safe destructuring
  const {
    id = "",
    title = "Untitled",
    coverImage = "",
    genres = [],
    readTime = 0,
    author = null,
  } = story || {};

  // ✅ Always normalize genres
  const genresArr = Array.isArray(genres) ? genres : [];

  // ✅ Author name safety
  let authorName = "Unknown";

  if (author && typeof author === "object") {
    authorName = author.username?.replace(/^@/, "") || author.name || "Unknown";
  } else if (typeof author === "string" && author.length < 30) {
    authorName = author.replace(/^@/, "");
  }

  // ✅ Fallback chain: coverImage → genre image → null
  const genreFallbackImage = getGenreFallback(genresArr);
  const finalImage = coverImage || genreFallbackImage;

  const storyPath = `/stories/${id}`;

  return (
    <Link
      href={storyPath}
      className="min-w-[180px] md:min-w-[220px] max-w-[220px] group cursor-pointer transition duration-200 ease-in-out"
    >
      <div className="relative h-[240px] md:h-[350px] rounded-lg overflow-hidden bg-background/20">
        {finalImage ? (
          <img
            src={finalImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.06] transition duration-300 ease-out"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            No image
          </div>
        )}

        {/* ✅ Read Time Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/70 to-transparent flex items-end p-2 md:p-3">
          <div className="flex items-center text-white text-xs font-semibold space-x-1">
            <Clock className="w-3 h-3 text-white" />
            <span className="opacity-80">{readTime} min read</span>
          </div>
        </div>
      </div>

      {/* ✅ Text Section */}
      <div className="pt-3">
        <h4 className="text-base font-semibold text-foreground line-clamp-2 transition-colors">
          {title}
        </h4>

        {showAuthor && (
          <p className="text-sm text-foreground/70 mt-0.5 line-clamp-1">
            {`By @${authorName}`}
          </p>
        )}

        <p className="text-xs text-foreground/50 mt-1 line-clamp-1">
          {genresArr.length ? genresArr.join(" / ") : "—"}
        </p>
      </div>
    </Link>
  );
}
