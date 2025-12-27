// src/app/api/stories/latest/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import { normalizeStories } from "@/lib/normalizeStories";

/**
 * Returns up to 18 latest published stories.
 * Sorted by createdAt (newest first).
 */
export async function GET() {
  try {
    await connectToDB();

    // ⚡ PERFORMANCE: Use createdAt index (defined in Story model)
    const stories = await Story.find({ published: true })
      .select('title coverImage genres readTime author createdAt') // Minimal fields
      .sort({ createdAt: -1 }) // Uses index: { createdAt: -1, published: 1 }
      .limit(18)
      .populate({ path: "author", select: "username name profileImage" })
      .lean(); // ⚡ CRITICAL: 5-10x faster

    // ⚡ PERFORMANCE: Use batch author lookup (fixes N+1 problem)
    const normalized = await normalizeStories(stories);

    return NextResponse.json({
      ok: true,
      count: normalized.length,
      stories: normalized,
    });
  } catch (err) {
    console.error("GET /api/stories/latest error:", err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 }
    );
  }
}
