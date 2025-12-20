// app/stories/[storyId]/page.js

// This is a Server Component, responsible for routing and SEO metadata

import StoryPage from "@/components/StoryPage";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";
import mongoose from "mongoose";

// Generate dynamic metadata for each story - using direct DB access (recommended for Next.js SSR)
export async function generateMetadata({ params }) {
  try {
    // Await params as it's a Promise in Next.js 15+
    const resolvedParams = await params;
    const storyId = resolvedParams.storyId;
    
    // Base URL for absolute URLs (required for social media scrapers)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://thestorybits.com');
    
    // Validate storyId
    if (!storyId || !mongoose.Types.ObjectId.isValid(storyId)) {
      console.error('Invalid storyId for metadata:', storyId);
      return {
        title: 'Story Not Found',
        description: 'The requested story could not be found on TheStoryBits.',
      };
    }
    
    // Connect to database directly (recommended for generateMetadata)
    await connectToDB();
    
    // Fetch story with author populated
    const story = await Story.findById(storyId)
      .populate({
        path: 'author',
        model: User,
        select: 'username name',
      })
      .lean();
    
    if (!story) {
      console.error('Story not found for metadata:', storyId);
      return {
        title: 'Story Not Found',
        description: 'The requested story could not be found on TheStoryBits.',
      };
    }
    
    // Extract data
    const title = story.title || 'Untitled Story';
    const description = story.description || 
                        (story.content ? story.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...' : 
                        'Read this captivating short fiction story on TheStoryBits - bite-sized stories you can enjoy anytime!');
    const authorName = story.author?.name || story.author?.username || 'Unknown Author';
    const primaryGenre = story.genres?.[0] || 'Fiction';
    const storyUrl = `${baseUrl}/stories/${storyId}`;
    
    // Generate dynamic OG image URL with absolute HTTPS path
    const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&genre=${encodeURIComponent(primaryGenre)}${story.coverImage ? `&coverImage=${encodeURIComponent(story.coverImage)}` : ''}`;
    
    return {
      title: `${title} by ${authorName}`,
      description: description,
      keywords: [
        ...(story.genres || []),
        'short story',
        'fiction',
        'creative writing',
        'story bits',
        'quick fiction',
        'quick read',
        authorName,
        'online reading'
      ],
      authors: [{ name: authorName }],
      openGraph: {
        title: `${title} by ${authorName}`,
        description: description,
        url: storyUrl,
        siteName: 'TheStoryBits',
        type: 'article',
        publishedTime: story.createdAt?.toISOString?.() || story.createdAt,
        modifiedTime: story.updatedAt?.toISOString?.() || story.createdAt,
        authors: [authorName],
        tags: story.genres || [],
        locale: 'en_US',
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${title} by ${authorName} - TheStoryBits`,
            type: 'image/png',
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@thestorybits',
        creator: '@thestorybits',
        title: `${title} by ${authorName}`,
        description: description,
        images: [ogImageUrl],
      },
      alternates: {
        canonical: storyUrl,
      },
      robots: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Short Fiction Stories',
      description: 'Read captivating short fiction stories on TheStoryBits - bite-sized stories across all genres.',
    };
  }
}

// This function receives the route parameters
export default function StoryRoutePage() {
  // StoryPage.jsx is a client component and handles fetching the ID
  // and data itself using useParams, so we just render it here.
  return <StoryPage />;
}
