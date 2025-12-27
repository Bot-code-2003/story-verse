// src/app/api/stories/trending/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import { normalizeStories } from "@/lib/normalizeStories";

/**
 * Returns up to 18 trending stories.
 * Sorted by likesCount (most liked first), then by createdAt.
 */
export async function GET() {
  try {
    await connectToDB();

    // ⚡ PERFORMANCE: Use likesCount index (defined in Story model)
    // Sort by likesCount descending, filter by published, limit to 18
    const stories = await Story.find({ published: true })
      .select('title coverImage genres readTime author createdAt likesCount') // Minimal fields
      .sort({ likesCount: -1, createdAt: -1 }) // Uses index: { likesCount: -1, published: 1 }
      .limit(18)
      .populate({ 
        path: "author", 
        select: "username name profileImage" // Include profileImage for cards
      })
      .lean(); // ⚡ CRITICAL: 5-10x faster than Mongoose documents

    // ⚡ PERFORMANCE: Use batch author lookup (fixes N+1 problem)
    const normalized = await normalizeStories(stories);

    return NextResponse.json({
      ok: true,
      count: normalized.length,
      stories: normalized,
    });
  } catch (err) {
    console.error("GET /api/stories/trending error:", err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 }
    );
  }
}
