// app/genre/[name]/page.js - Server component wrapper for SEO

import GenrePageClient from "./GenrePageClient";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";

// Genre descriptions for SEO
const genreDescriptions = {
  "Fantasy": "Explore magical worlds, mythical creatures, and epic adventures in our Fantasy story collection.",
  "Sci-Fi": "Discover futuristic tales, space exploration, and technological wonders in our Science Fiction stories.",
  "Romance": "Fall in love with heartwarming tales of passion, connection, and relationships.",
  "Thriller": "Experience edge-of-your-seat suspense, mystery, and psychological tension.",
  "Horror": "Dive into spine-chilling tales of terror, supernatural encounters, and dark mysteries.",
  "Adventure": "Embark on thrilling journeys, daring quests, and exciting explorations.",
  "Drama": "Experience powerful emotional stories that explore the human condition.",
  "Slice of Life": "Enjoy relatable stories about everyday experiences and ordinary moments.",
  "Mystery": "Unravel puzzles, solve crimes, and uncover secrets in our mystery collection.",
  "Comedy": "Laugh out loud with humorous tales and witty narratives."
};

// Generate dynamic metadata for each genre
export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const genreName = decodeURIComponent(resolvedParams.name);
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://onesitread.vercel.app');
    
    // Connect to database to get story count
    await connectToDB();
    const storyCount = await Story.countDocuments({ 
      genres: { $regex: new RegExp(`^${genreName}$`, 'i') },
      published: true 
    });
    
    const description = genreDescriptions[genreName] || 
                        `Discover captivating ${genreName} stories on TheStoryBits - bite-sized fiction across all genres.`;
    
    const genreUrl = `${baseUrl}/genre/${encodeURIComponent(genreName)}`;
    
    // Generate OG image
    const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(genreName + ' Stories')}&author=${storyCount}%20Stories&genre=TheStoryBits`;
    
    return {
      title: `${genreName} Stories`,
      description: description,
      keywords: [
        genreName.toLowerCase(),
        `${genreName.toLowerCase()} stories`,
        `${genreName.toLowerCase()} fiction`,
        'short stories',
        'TheStoryBits',
        'story bits',
        'OneSitRead'
      ],
      openGraph: {
        title: `${genreName} Stories - TheStoryBits`,
        description: description,
        url: genreUrl,
        siteName: 'TheStoryBits',
        type: 'website',
        locale: 'en_US',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${genreName} Stories on TheStoryBits`,
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@onesitread',
        title: `${genreName} Stories - TheStoryBits`,
        description: description,
        images: [ogImageUrl],
      },
      alternates: {
        canonical: genreUrl,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating genre metadata:', error);
    return {
      title: 'Genre Stories',
      description: 'Discover captivating short fiction stories on TheStoryBits.',
    };
  }
}

export default function GenrePage({ params }) {
  return <GenrePageClient params={params} />;
}
