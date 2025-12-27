// src/app/api/stories/editorpicks/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import { normalizeStories } from "@/lib/normalizeStories";

/**
 * Returns up to 18 editor's pick stories.
 * Filtered by editorPick: true, sorted by createdAt.
 */
export async function GET() {
  try {
    await connectToDB();

    // ⚡ PERFORMANCE: Use editorPick index (defined in Story model)
    const stories = await Story.find({ editorPick: true, published: true })
      .select('title coverImage genres readTime author createdAt') // Minimal fields
      .sort({ createdAt: -1 }) // Uses index: { editorPick: 1, published: 1, createdAt: -1 }
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
    console.error("GET /api/stories/editorpicks error:", err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 }
    );
  }
}
