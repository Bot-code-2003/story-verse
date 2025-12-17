// src/app/api/stories/by-ids/route.js
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Story from "@/models/Story";

export async function POST(request) {
  try {
    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty IDs array" },
        { status: 400 }
      );
    }

    await dbConnect();

    // ⚡ PERFORMANCE: Select only fields needed for StoryCard
    const stories = await Story.find({ _id: { $in: ids } })
      .select('title coverImage genres readTime author createdAt') // Minimal fields
      .populate("author", "username name") // Only username and name
      .lean(); // ⚡ CRITICAL: 5-10x faster

    // Convert _id to id for frontend consistency
    const formattedStories = stories.map((story) => ({
      ...story,
      id: story._id.toString(),
      _id: undefined,
    }));

    // Sort stories to match the order of the input IDs
    const orderedStories = ids
      .map((id) => formattedStories.find((story) => story.id === id))
      .filter(Boolean); // Remove any null/undefined entries if story not found

    return NextResponse.json(
      { stories: orderedStories },
      {
        status: 200,
        headers: {
          // ⚡ PERFORMANCE: Cache featured stories for 6 hours (was 10 min)
          "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=3600",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching stories by IDs:", error);
    return NextResponse.json(
      { error: "Failed to fetch stories" },
      { status: 500 }
    );
  }
}
