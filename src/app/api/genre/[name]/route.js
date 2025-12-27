import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import { normalizeStories } from "@/lib/normalizeStories";

export async function GET(request, props) {
  try {
    // Unwrap params (Next.js 15+)
    const { name } = await props.params;
    const genreName = decodeURIComponent(name);

    // Get pagination params
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "18");
    const skip = (page - 1) * limit;

    await connectToDB();

    // ⚡ PERFORMANCE: Case-insensitive exact match with regex anchor
    // Uses index when genres is indexed
    const genreQuery = { 
      genres: { $regex: `^${genreName}$`, $options: "i" },
      published: true 
    };

    // Get total count for this genre
    const totalCount = await Story.countDocuments(genreQuery);

    // Fetch stories with pagination
    const rawStories = await Story.find(genreQuery)
      .select('title coverImage genres readTime author createdAt description')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select: "username name profileImage",
      })
      .lean();

    // ⚡ PERFORMANCE: Use batch author lookup (fixes N+1 problem)
    const normalized = await normalizeStories(rawStories);

    return NextResponse.json({
      ok: true,
      count: normalized.length,
      stories: normalized,
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore: skip + normalized.length < totalCount,
      },
    });
  } catch (err) {
    console.error("Genre fetch error:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
