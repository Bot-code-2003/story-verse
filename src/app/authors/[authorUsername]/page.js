// app/authors/[authorUsername]/page.js

import AuthorPage from "@/components/AuthorPage";
import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import Story from "@/models/Story";

// Generate dynamic metadata for each author - using direct DB access
export async function generateMetadata({ params }) {
  try {
    const resolvedParams = await params;
    const authorUsername = resolvedParams.authorUsername;
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://thestorybits.com');
    
    // Clean the username (handle @ prefix and decoding)
    const cleanUsername = decodeURIComponent(authorUsername).replace(/^@/, '');
    
    // Connect to database directly
    await connectToDB();
    
    // Fetch author - case insensitive search
    const author = await User.findOne({ 
      username: { $regex: new RegExp(`^${cleanUsername}$`, 'i') } 
    })
      .select('username name bio profileImage')
      .lean();
    
    if (!author) {
      return {
        title: 'Author Profile',
        description: 'Read captivating short stories by talented authors on TheStoryBits.',
      };
    }
    
    // Count stories
    const storyCount = await Story.countDocuments({ author: author._id, published: true });
    
    const authorName = author.name || author.username || 'Unknown Author';
    const bio = author.bio || `Read ${storyCount} stories by ${authorName} on TheStoryBits - bite-sized fiction across all genres.`;
    const authorUrl = `${baseUrl}/authors/${authorUsername}`;
    
    // Generate OG image URL
    const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(authorName)}&author=Author%20Profile&genre=${storyCount}%20Stories`;
    
    return {
      title: `${authorName} - Author Profile`,
      description: bio.substring(0, 160),
      keywords: [
        authorName,
        'author',
        'writer',
        'short stories',
        'fiction author',
        'creative writing',
        'TheStoryBits',
        'story bits',
      ],
      authors: [{ name: authorName }],
      openGraph: {
        title: `${authorName} - Author on TheStoryBits`,
        description: bio.substring(0, 160),
        url: authorUrl,
        siteName: 'TheStoryBits',
        type: 'profile',
        profile: {
          username: author.username,
        },
        images: [
          {
            url: author.profileImage || ogImageUrl,
            width: 400,
            height: 400,
            alt: `${authorName}'s profile`,
          }
        ],
      },
      twitter: {
        card: 'summary',
        site: '@thestorybits',
        title: `${authorName} - Author on TheStoryBits`,
        description: bio.substring(0, 160),
        images: [author.profileImage || ogImageUrl],
      },
      alternates: {
        canonical: authorUrl,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating author metadata:', error);
    return {
      title: 'Author Profile',
      description: 'Discover talented authors and their stories on TheStoryBits.',
    };
  }
}

export default function AuthorRoutePage() {
  return <AuthorPage />;
}
