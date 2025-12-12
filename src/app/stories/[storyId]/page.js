// app/stories/[storyId]/page.js

// This is a Server Component, responsible for routing and SEO metadata

import StoryPage from "@/components/StoryPage";

// Generate dynamic metadata for each story
export async function generateMetadata({ params }) {
  try {
    // Await params as it's a Promise in Next.js 15+
    const resolvedParams = await params;
    const storyId = resolvedParams.storyId;
    
    // Fetch story data for metadata
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/stories/${storyId}`, {
      cache: 'no-store' // Always get fresh data for metadata
    });
    
    if (!response.ok) {
      return {
        title: 'Story Not Found',
        description: 'The requested story could not be found.',
      };
    }
    
    const data = await response.json();
    const story = data.story;
    const author = data.authorData;
    
    const title = story.title || 'Untitled Story';
    const description = story.description || story.content?.substring(0, 160) || 'Read this captivating short fiction story on OneSitRead - finish it in one sitting!';
    const authorName = author?.name || author?.username || 'Unknown Author';
    const genres = story.genres?.join(', ') || 'Fiction';
    const coverImage = story.coverImage || '/og-story-default.jpg';
    const storyUrl = `${baseUrl}/stories/${storyId}`;
    
    return {
      title: `${title} by ${authorName}`,
      description: description,
      keywords: [
        ...story.genres || [],
        'short story',
        'fiction',
        'creative writing',
        'one sitting read',
        'quick read',
        authorName,
        'online reading'
      ],
      authors: [{ name: authorName }],
      openGraph: {
        title: `${title} by ${authorName}`,
        description: description,
        url: storyUrl,
        siteName: 'OneSitRead',
        type: 'article',
        publishedTime: story.createdAt,
        modifiedTime: story.updatedAt || story.createdAt,
        authors: [authorName],
        tags: story.genres || [],
        locale: 'en_US',
        images: [
          {
            url: coverImage,
            width: 1200,
            height: 630,
            alt: `${title} - Cover Image`,
            type: 'image/jpeg',
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@onesitread',
        creator: '@onesitread',
        title: `${title} by ${authorName}`,
        description: description,
        images: {
          url: coverImage,
          alt: `${title} - Cover Image`,
        },
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
      title: 'OneSitRead - Short Fiction Stories',
      description: 'Read captivating short fiction stories on OneSitRead - stories you can finish in one sitting.',
    };
  }
}

// This function receives the route parameters
export default function StoryRoutePage() {
  // StoryPage.jsx is a client component and handles fetching the ID
  // and data itself using useParams, so we just render it here.
  return <StoryPage />;
}
