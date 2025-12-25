// src/app/api/stories/[storyId]/like/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";
import StoryLike from "@/models/StoryLike";
import Notification from "@/models/Notification";

// /api/stories/[storyId]/like
export async function POST(req, { params }) {
  try {
    await connectToDB();

    const { storyId } = await params;
    const { userId, action } = await req.json(); // action: "like" | "unlike"

    if (!storyId || !userId || !action) {
      return NextResponse.json(
        { ok: false, message: "storyId, userId, and action are required" },
        { status: 400 }
      );
    }

    const story = await Story.findById(storyId);
    if (!story) {
      return NextResponse.json(
        { ok: false, message: "Story not found" },
        { status: 404 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { ok: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (action === "like") {
      // Try to create a new like (will fail if already exists due to unique index)
      try {
        await StoryLike.create({ user: userId, story: storyId });
        // Update denormalized count
        story.likesCount = (story.likesCount || 0) + 1;
        story.likes = story.likesCount; // Keep backward compatibility
        await story.save();

        // Create notification for story author (skip if liking own story)
        const storyAuthorId = story.author?.toString();
        if (storyAuthorId && storyAuthorId !== userId) {
          try {
            await Notification.create({
              recipient: storyAuthorId,
              sender: userId,
              type: "story_like",
              story: storyId,
            });
          } catch (notifErr) {
            // Ignore duplicate notification errors (user already liked before)
            if (notifErr.code !== 11000) {
              console.error("Error creating story like notification:", notifErr);
            }
          }
        }
      } catch (err) {
        // If duplicate key error, user already liked this story
        if (err.code === 11000) {
          return NextResponse.json({
            ok: true,
            liked: true,
            likes: story.likesCount || story.likes || 0,
            message: "Already liked",
          });
        }
        throw err;
      }
    } else if (action === "unlike") {
      const deleteResult = await StoryLike.deleteOne({
        user: userId,
        story: storyId,
      });

      if (deleteResult.deletedCount > 0) {
        // Update denormalized count
        story.likesCount = Math.max((story.likesCount || 0) - 1, 0);
        story.likes = story.likesCount; // Keep backward compatibility
        await story.save();
      }
    } else {
      return NextResponse.json(
        { ok: false, message: "Invalid action. Use 'like' or 'unlike'." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      liked: action === "like",
      likes: story.likesCount || story.likes || 0,
    });
  } catch (err) {
    console.error("POST /api/stories/[storyId]/like error:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "Server error",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
