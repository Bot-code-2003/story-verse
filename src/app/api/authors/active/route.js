import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    // Get the most recent published stories with their authors
    const recentStories = await Story.find({ published: true })
      .sort({ createdAt: -1 })
      .select("_id title description coverImage author createdAt genres readTime likesCount")
      .populate("author", "_id username name profileImage bio")
      .limit(200) // Get more stories to find unique authors with multiple stories
      .lean();

    // Group by author and get their latest 2 stories
    const authorMap = new Map();
    
    for (const story of recentStories) {
      if (!story.author || !story.author._id) continue;
      
      const authorId = story.author._id.toString();
      
      if (!authorMap.has(authorId)) {
        authorMap.set(authorId, {
          id: authorId,
          username: story.author.username,
          name: story.author.name || story.author.username,
          profileImage: story.author.profileImage,
          bio: story.author.bio,
          latestStories: [],
        });
      }
      
      // Add story if we have less than 2 for this author
      const authorData = authorMap.get(authorId);
      if (authorData.latestStories.length < 3) {
        authorData.latestStories.push({
          id: story._id.toString(),
          title: story.title,
          description: story.description,
          coverImage: story.coverImage,
          genres: story.genres,
          readTime: story.readTime,
          likesCount: story.likesCount || 0,
          publishedAt: story.createdAt,
        });
      }
    }

    // Filter to only include authors with at least 1 story and take the limit
    const activeAuthors = Array.from(authorMap.values())
      .filter(author => author.latestStories.length > 0)
      .slice(0, limit);

    return NextResponse.json({
      authors: activeAuthors,
      count: activeAuthors.length,
    });
  } catch (error) {
    console.error("Active authors API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch active authors" },
      { status: 500 }
    );
  }
}
