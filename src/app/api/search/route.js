import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.trim().length < 2) {
      return NextResponse.json({
        stories: [],
        authors: [],
        message: "Query too short (minimum 2 characters)",
      });
    }

    const searchRegex = new RegExp(query.trim(), "i");

    // Search stories by title or description (limit to 10)
    const storiesPromise = Story.find({
      $or: [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
      ],
      published: true,
    })
      .select("_id title description author coverImage genres readTime createdAt")
      .limit(limit)
      .lean();

    // Search authors by username (limit to 10)
    const authorsPromise = User.find({
      username: searchRegex,
    })
      .select("_id username name profileImage bio")
      .limit(limit)
      .lean();

    const [stories, authors] = await Promise.all([storiesPromise, authorsPromise]);

    // Normalize story IDs
    const normalizedStories = stories.map((story) => ({
      ...story,
      id: story._id.toString(),
      author: story.author?.toString() || story.author,
    }));

    // Normalize author IDs
    const normalizedAuthors = authors.map((author) => ({
      ...author,
      id: author._id.toString(),
    }));

    return NextResponse.json({
      stories: normalizedStories,
      authors: normalizedAuthors,
      query: query.trim(),
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
