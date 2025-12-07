// app/authors/[authorUsername]/page.js

import AuthorPage from "@/components/AuthorPage";

// Generate dynamic metadata for each author
export async function generateMetadata({ params }) {
  try {
    // Await params as it's a Promise in Next.js 15+
    const resolvedParams = await params;
    const authorUsername = resolvedParams.authorUsername;
    
    // Fetch author data for metadata
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/authors/${authorUsername}`, {
      cache: 'no-store' // Always get fresh data for metadata
    });
    
    if (!response.ok) {
      return {
        title: 'Author Not Found',
        description: 'The requested author could not be found.',
      };
    }
    
    const data = await response.json();
    const author = data.author;
    
    const authorName = author.name || author.username || 'Unknown Author';
    const bio = author.bio || `Read stories by ${authorName} on StoryVerse.`;
    const storyCount = data.stories?.length || 0;
    
    return {
      title: `${authorName} - Author Profile`,
      description: bio.substring(0, 160),
      keywords: [
        authorName,
        'author',
        'writer',
        'short stories',
        'fiction author',
        'creative writing'
      ],
      authors: [{ name: authorName }],
      openGraph: {
        title: `${authorName} - Author on StoryVerse`,
        description: bio.substring(0, 160),
        type: 'profile',
        profile: {
          username: author.username,
        },
        images: [
          {
            url: author.profileImage || '/default-avatar.jpg',
            width: 400,
            height: 400,
            alt: `${authorName}'s profile picture`,
          }
        ],
      },
      twitter: {
        card: 'summary',
        title: `${authorName} - Author on StoryVerse`,
        description: bio.substring(0, 160),
        images: [author.profileImage || '/default-avatar.jpg'],
      },
      alternates: {
        canonical: `/authors/${authorUsername}`,
      },
    };
  } catch (error) {
    console.error('Error generating author metadata:', error);
    return {
      title: 'Author Profile - StoryVerse',
      description: 'Discover talented authors and their stories on StoryVerse.',
    };
  }
}

export default function AuthorRoutePage() {
  return <AuthorPage />;
}
