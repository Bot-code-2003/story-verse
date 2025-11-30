import { connectDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { storyId } = await params;

    // Validate if it's a valid MongoDB ObjectId
    let query = {};
    try {
      if (ObjectId.isValid(storyId)) {
        query = { _id: new ObjectId(storyId) };
      } else {
        // Fallback to string ID for backward compatibility
        query = { _id: storyId };
      }
    } catch {
      query = { _id: storyId };
    }

    await connectDB();
    const story = await Story.findOne(query);

    if (!story) {
      return new Response(JSON.stringify({ error: "Story not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Return story with proper formatting
    const storyData = {
      id: story._id.toString(),
      title: story.title,
      description: story.description || "",
      content: story.content || "",
      author: story.author,
      coverImage: story.coverImage || "",
      readTime: story.readTime || 0,
      genre: story.genre || "",
      tags: story.tags || [],
      likes: story.likes || 0,
      comments: story.comments || [],
      published: story.published !== false,
      createdAt: story.createdAt,
    };

    return new Response(JSON.stringify(storyData), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("/api/stories/[storyId] error:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch story" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
