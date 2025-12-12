/**
 * Genre tiles configuration used across the application
 * Centralized to maintain consistency
 */

export const GENRE_TILES = [
  {
    name: "Fantasy",
    image:
      "https://cdn.pixabay.com/photo/2024/05/16/10/56/forest-8765686_1280.jpg",
    link: "/genre/fantasy",
    count: "124 stories",
  },
  {
    name: "Romance",
    image:
      "https://cdn.pixabay.com/photo/2021/10/29/13/30/love-6751932_1280.jpg",
    link: "/genre/romance",
    count: "89 stories",
  },
  {
    name: "Mythic Fiction",
    image:
      "https://cdn.pixabay.com/photo/2024/08/03/21/42/ai-generated-8943227_1280.png",
    link: "/genre/mythic-fiction",
    count: "156 stories",
  },
  {
    name: "Sci-Fi",
    image:
      "https://cdn.pixabay.com/photo/2018/04/05/15/19/abstract-3293076_1280.jpg",
    link: "/genre/sci-fi",
    count: "98 stories",
  },
  {
    name: "Horror",
    image:
      "https://images.unsplash.com/photo-1696012976137-f901d345e694?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzV8fGdob3N0c3xlbnwwfDF8MHx8fDI%3D",
    link: "/genre/horror",
    count: "67 stories",
  },
  {
    name: "Slice of Life",
    image:
      "https://cdn.pixabay.com/photo/2020/07/14/13/42/boat-5404195_1280.jpg",
    link: "/genre/slice-of-life",
    count: "143 stories",
  },
  {
    name: "Adventure",
    image:
      "https://cdn.pixabay.com/photo/2019/07/25/17/09/camp-4363073_1280.png",
    link: "/genre/adventure",
    count: "112 stories",
  },
  {
    name: "Drama",
    image:
      "https://cdn.pixabay.com/photo/2025/05/23/01/24/ai-generated-9616743_1280.jpg",
    link: "/genre/drama",
    count: "78 stories",
  },
];

/**
 * Helper function to get genre fallback image by genre name
 * @param {string[]} genres - Array of genre names
 * @returns {string|null} - Image URL or null
 */
export const getGenreFallback = (genres = []) => {
  if (!Array.isArray(genres) || genres.length === 0) return null;

  const primaryGenre = genres[0];

  const matchedGenre = GENRE_TILES.find(
    (g) => g.name.toLowerCase() === primaryGenre.toLowerCase()
  );

  return matchedGenre?.image || null;
};
