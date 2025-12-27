// src/app/api/stories/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import { normalizeStories } from "@/lib/normalizeStories";

/* GET /api/stories?genre=<>&tag=<> */
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const genre = url.searchParams.get("genre")?.trim();
    const tag = url.searchParams.get("tag")?.trim();

    if (!genre && !tag) {
      return NextResponse.json(
        { error: "Provide at least one filter, e.g. ?genre=fantasy" },
        { status: 400 }
      );
    }

    await connectToDB();

    // Build query with exact genre match (uses index) or tag match
    const query = { published: true };
    
    if (genre) {
      // ⚡ PERFORMANCE: Use case-insensitive exact match with $regex anchor
      // This still uses the index when genres is indexed
      query.genres = { $regex: `^${genre}$`, $options: "i" };
    }

    if (tag) {
      query.tags = { $in: [tag, tag.toLowerCase()] };
    }

    // ⚡ PERFORMANCE: Select only fields needed for StoryCard
    const stories = await Story.find(query)
      .select('title coverImage genres readTime author createdAt') // Only essential fields
      .sort({ createdAt: -1 })
      .limit(18)
      .populate({
        path: "author",
        select: "username name profileImage",
      })
      .lean(); // ⚡ CRITICAL: Returns plain JS objects (5-10x faster)

    // ⚡ PERFORMANCE: Use batch author lookup (fixes N+1 problem)
    const normalized = await normalizeStories(stories);

    return NextResponse.json({
      ok: true,
      count: normalized.length,
      stories: normalized,
    });
  } catch (err) {
    console.error("GET /api/stories error:", err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 }
    );
  }
}

/* POST /api/stories */
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields: title and content" },
        { status: 400 }
      );
    }

    const { ObjectId } = await import("mongodb");
    const User = (await import("@/models/User")).default;

    // normalize tags/genres to arrays
    const tags = Array.isArray(body.tags)
      ? body.tags
      : body.tags
      ? body.tags.map((t) => String(t).trim()).filter(Boolean)
      : [];

    const genres = Array.isArray(body.genres)
      ? body.genres
      : body.genre
      ? [String(body.genre).trim()]
      : [];

    // Normalize author: accept ObjectId string or username string
    let authorVal = null;
    if (body.author) {
      const a = String(body.author).trim();
      if (ObjectId.isValid(a)) {
        authorVal = new ObjectId(a);
      } else if (a) {
        authorVal = a;
      }
    }

    const doc = {
      title: String(body.title).trim(),
      description: body.description ? String(body.description).trim() : "",
      content: body.content,
      coverImage: body.coverImage ? String(body.coverImage).trim() : "",
      readTime:
        body.readTime !== undefined && body.readTime !== null
          ? Number(body.readTime)
          : 0,
      genres,
      tags,
      author: authorVal,
      published: !!body.published,
      contest: body.contest || null,
      createdAt: new Date(),
    };

    await connectToDB();
    const created = await Story.create(doc);

    // If submitting to a contest, update the user's latestContest field
    if (body.contest && authorVal) {
      await User.findByIdAndUpdate(authorVal, { latestContest: body.contest });
    }

    const createdResp = {
      id: created._id.toString(),
      title: created.title,
      description: created.description,
      coverImage: created.coverImage,
      author:
        created.author && typeof created.author === "object"
          ? String(created.author)
          : created.author || null,
      readTime: created.readTime,
      genres: created.genres || [],
      tags: created.tags || [],
      published: created.published !== false,
      createdAt: created.createdAt,
    };

    return NextResponse.json({ ok: true, story: createdResp }, { status: 201 });
  } catch (err) {
    console.error("POST /api/stories error:", err);
    return NextResponse.json(
      { error: "Failed to create story", message: err.message },
      { status: 500 }
    );
  }
}
