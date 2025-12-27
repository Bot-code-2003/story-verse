// src/app/api/homepage/route.js
// ⚡ PERFORMANCE: Single batch endpoint for all homepage data
// Reduces 12+ API calls to 1 call, dramatically improving homepage load time

import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import { normalizeStories } from "@/lib/normalizeStories";

// Shared projection for list views (minimal fields for StoryCard)
const LIST_PROJECTION = 'title coverImage thumbnailImage genres readTime author authorSnapshot createdAt likesCount';

/**
 * Fetch stories with a given query
 */
async function fetchSection(query, sort, limit = 18) {
  const stories = await Story.find(query)
    .select(LIST_PROJECTION)
    .sort(sort)
    .limit(limit)
    .populate({ path: "author", select: "username name profileImage" })
    .lean();
  
  return normalizeStories(stories);
}

/**
 * GET /api/homepage
 * Returns all homepage sections in a single response
 */
export async function GET() {
  try {
    await connectToDB();

    // ⚡ PERFORMANCE: Parallel fetch all sections at once
    const [
      trending,
      latest,
      quickReads,
      editorPicks,
      fantasy,
      drama,
      romance,
      sliceOfLife,
      thriller,
      horror,
      comedy,
    ] = await Promise.all([
      // Trending: by likes
      fetchSection({ published: true }, { likesCount: -1, createdAt: -1 }, 18),
      
      // Latest: by date
      fetchSection({ published: true }, { createdAt: -1 }, 18),
      
      // Quick Reads: readTime <= 5
      fetchSection({ published: true, readTime: { $lte: 5 } }, { createdAt: -1 }, 18),
      
      // Editor Picks
      fetchSection({ published: true, editorPick: true }, { createdAt: -1 }, 18),
      
      // Genre sections
      fetchSection({ published: true, genres: { $regex: /^fantasy$/i } }, { createdAt: -1 }, 18),
      fetchSection({ published: true, genres: { $regex: /^drama$/i } }, { createdAt: -1 }, 18),
      fetchSection({ published: true, genres: { $regex: /^romance$/i } }, { createdAt: -1 }, 18),
      fetchSection({ published: true, genres: { $regex: /^slice of life$/i } }, { createdAt: -1 }, 18),
      fetchSection({ published: true, genres: { $regex: /^thriller$/i } }, { createdAt: -1 }, 18),
      fetchSection({ published: true, genres: { $regex: /^horror$/i } }, { createdAt: -1 }, 18),
      fetchSection({ published: true, genres: { $regex: /^comedy$/i } }, { createdAt: -1 }, 18),
    ]);

    const response = NextResponse.json({
      ok: true,
      data: {
        trending,
        latest,
        quickReads,
        editorPicks,
        fantasy,
        drama,
        romance,
        sliceOfLife,
        thriller,
        horror,
        comedy,
      },
      timestamp: Date.now(),
    });

    // ⚡ PERFORMANCE: CDN cache headers
    // Cache for 5 minutes on CDN, allow stale for 1 hour while revalidating
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=3600'
    );

    return response;
  } catch (err) {
    console.error("GET /api/homepage error:", err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 }
    );
  }
}
