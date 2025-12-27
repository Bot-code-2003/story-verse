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

    const searchQuery = query.trim();

    // ⚡ PERFORMANCE: Use $text search with text indexes (O(log n) vs O(n) for regex)
    // Falls back to regex if text search returns no results (handles partial matches)
    let storiesPromise;
    
    try {
      // Primary: Fast text search using text index
      storiesPromise = Story.find(
        { 
          $text: { $search: searchQuery },
          published: true 
        },
        { score: { $meta: "textScore" } } // Include relevance score
      )
        .select("_id title description author coverImage genres readTime createdAt")
        .sort({ score: { $meta: "textScore" } }) // Sort by relevance
        .limit(limit)
        .lean();
    } catch (textSearchError) {
      // Fallback: Regex search if text index not yet created
      console.warn("Text search failed, falling back to regex:", textSearchError.message);
      const searchRegex = new RegExp(searchQuery, "i");
      storiesPromise = Story.find({
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
    }

    // ⚡ PERFORMANCE: Use $text search for authors too
    let authorsPromise;
    
    try {
      authorsPromise = User.find(
        { $text: { $search: searchQuery } },
        { score: { $meta: "textScore" } }
      )
        .select("_id username name profileImage bio")
        .sort({ score: { $meta: "textScore" } })
        .limit(limit)
        .lean();
    } catch (textSearchError) {
      // Fallback: Regex search
      const searchRegex = new RegExp(searchQuery, "i");
      authorsPromise = User.find({
        $or: [
          { username: searchRegex },
          { name: searchRegex },
        ],
      })
        .select("_id username name profileImage bio")
        .limit(limit)
        .lean();
    }

    const [stories, authors] = await Promise.all([storiesPromise, authorsPromise]);
    
    // If text search returned no stories, try regex fallback
    let finalStories = stories;
    if (stories.length === 0) {
      const searchRegex = new RegExp(searchQuery, "i");
      finalStories = await Story.find({
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
    }

    // Normalize story IDs
    const normalizedStories = finalStories.map((story) => ({
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
      query: searchQuery,
    });
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
