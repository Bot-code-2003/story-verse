// src/app/api/stories/quickreads/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import { normalizeStories } from "@/lib/normalizeStories";

/**
 * Quick reads: readTime <= 6 (minutes). Limit 18.
 * Fallback: if none found, return latest 18 stories.
 */
export async function GET() {
  try {
    await connectToDB();

    // ⚡ PERFORMANCE: Use readTime index (defined in Story model)
    let stories = await Story.find({ readTime: { $lte: 6 }, published: true })
      .select('title coverImage genres readTime author createdAt') // Minimal fields
      .sort({ createdAt: -1 }) // Uses index: { readTime: 1, published: 1, createdAt: -1 }
      .limit(18)
      .populate({ path: "author", select: "username name profileImage" })
      .lean(); // ⚡ CRITICAL: 5-10x faster

    // Fallback to latest if none match quick read criteria
    if (!stories || stories.length === 0) {
      stories = await Story.find({ published: true })
        .select('title coverImage genres readTime author createdAt')
        .sort({ createdAt: -1 })
        .limit(18)
        .populate({ path: "author", select: "username name profileImage" })
        .lean();
    }

    // ⚡ PERFORMANCE: Use batch author lookup (fixes N+1 problem)
    const normalized = await normalizeStories(stories);

    return NextResponse.json({
      ok: true,
      count: normalized.length,
      stories: normalized,
    });
  } catch (err) {
    console.error("GET /api/stories/quickreads error:", err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 }
    );
  }
}
