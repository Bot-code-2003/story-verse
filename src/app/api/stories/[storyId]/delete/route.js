import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Story from "@/models/Story";
import { ObjectId } from "mongodb";

export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { storyId } = await params; // Await params in Next.js 15+
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(storyId)) {
      return NextResponse.json(
        { error: "Invalid story ID" },
        { status: 400 }
      );
    }

    // Find the story
    const story = await Story.findById(storyId);

    if (!story) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    // Verify ownership
    if (story.author.toString() !== userId) {
      return NextResponse.json(
        { error: "Unauthorized - you can only delete your own stories" },
        { status: 403 }
      );
    }

    // Delete the story
    await Story.findByIdAndDelete(storyId);

    return NextResponse.json({
      success: true,
      message: "Story deleted successfully",
    });
  } catch (error) {
    console.error("Delete story error:", error);
    return NextResponse.json(
      { error: "Failed to delete story" },
      { status: 500 }
    );
  }
}
