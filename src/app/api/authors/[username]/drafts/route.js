import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { username } = params;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "18");
    const skip = (page - 1) * limit;

    // Find the user by username
    const user = await User.findOne({ username }).lean();
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = user._id;

    // Fetch draft stories (published: false) by this author
    const [stories, total] = await Promise.all([
      Story.find({ author: userId, published: false })
        .sort({ updatedAt: -1 }) // Most recently updated first
        .skip(skip)
        .limit(limit)
        .lean(),
      Story.countDocuments({ author: userId, published: false }),
    ]);

    // Normalize story IDs
    const normalizedStories = stories.map((story) => ({
      ...story,
      id: story._id.toString(),
      author: story.author.toString(),
    }));

    const hasMore = skip + stories.length < total;

    return NextResponse.json({
      stories: normalizedStories,
      pagination: {
        page,
        limit,
        total,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Drafts API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch drafts" },
      { status: 500 }
    );
  }
}
