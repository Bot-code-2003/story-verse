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
    name: "Drama",
    image:
      "https://cdn.pixabay.com/photo/2025/05/23/01/24/ai-generated-9616743_1280.jpg",
    link: "/genre/drama",
    count: "78 stories",
  },
  {
    name: "Romance",
    image:
      "https://cdn.pixabay.com/photo/2021/10/29/13/30/love-6751932_1280.jpg",
    link: "/genre/romance",
    count: "89 stories",
  },
  {
    name: "Slice of Life",
    image:
      "https://cdn.pixabay.com/photo/2020/07/14/13/42/boat-5404195_1280.jpg",
    link: "/genre/slice-of-life",
    count: "143 stories",
  },
  {
    name: "Thriller",
    image:
      "https://i.pinimg.com/736x/57/75/81/577581bb71d272cb6191274f9247e8e2.jpg",
    link: "/genre/thriller",
    count: "143 stories",
  },
  {
    name: "Horror",
    image:
      "https://i.pinimg.com/1200x/3e/e5/76/3ee576b1a810b78a282df07dd7860034.jpg",
    link: "/genre/horror",
    count: "143 stories",
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
