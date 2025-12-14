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
    // Use Vercel URL or localhost
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 
                    'https://onesitread.vercel.app';
    
    const apiUrl = `${baseUrl}/api/stories/${storyId}`;
    
    console.log('Fetching metadata from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      cache: 'no-store', // Always get fresh data for metadata
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      console.error('Failed to fetch story for metadata:', response.status);
      return {
        title: 'Story Not Found',
        description: 'The requested story could not be found on OneSitRead.',
      };
    }
    
    
    const data = await response.json();
    const story = data.story;
    const author = data.authorData;
    
    const title = story.title || 'Untitled Story';
    const description = story.description || story.content?.substring(0, 160) || 'Read this captivating short fiction story on OneSitRead - finish it in one sitting!';
    const authorName = author?.name || author?.username || 'Unknown Author';
    const primaryGenre = story.genres?.[0] || 'Fiction';
    const genres = story.genres?.join(', ') || 'Fiction';
    const storyUrl = `${baseUrl}/stories/${storyId}`;
    
    // Generate dynamic OG image URL with absolute HTTPS path
    const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(title)}&author=${encodeURIComponent(authorName)}&genre=${encodeURIComponent(primaryGenre)}${story.coverImage ? `&coverImage=${encodeURIComponent(story.coverImage)}` : ''}`;
    
    return {
      // Don't include "OneSitRead" in title as the template will add it
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
            url: ogImageUrl, // Use dynamic OG image with absolute HTTPS URL
            width: 1200,
            height: 630,
            alt: `${title} by ${authorName} - OneSitRead`,
            type: 'image/png',
          }
        ],
      },
      twitter: {
        card: 'summary_large_image',
        site: '@onesitread',
        creator: '@onesitread',
        title: `${title} by ${authorName}`,
        description: description,
        images: [ogImageUrl], // Use dynamic OG image
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
