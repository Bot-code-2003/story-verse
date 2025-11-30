"use client";

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

export default function DiscoverGenres() {
  return (
    <section className="mb-20">
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-[var(--foreground)]">
          Browse Genres
        </h3>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-8 gap-3 md:gap-4">
        {GENRE_TILES.map((genre) => (
          <button key={genre.name} className="group text-left">
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
              <h4 className="text-[var(--foreground)] font-medium text-sm mb-0.5 transition-colors">
                {genre.name}
              </h4>
              <p className="text-[var(--foreground)]/40 text-xs">
                {genre.count}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
