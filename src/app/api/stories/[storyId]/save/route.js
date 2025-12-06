// src/app/api/stories/[storyId]/save/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";
import StorySave from "@/models/StorySave";

// /api/stories/[storyId]/save
export async function POST(req, { params }) {
  try {
    await connectToDB();

    const { storyId } = await params;
    const { userId, action } = await req.json(); // action: "save" | "unsave"

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

    if (action === "save") {
      // Try to create a new save (will fail if already exists due to unique index)
      try {
        await StorySave.create({ user: userId, story: storyId });
      } catch (err) {
        // If duplicate key error, user already saved this story
        if (err.code === 11000) {
          return NextResponse.json({
            ok: true,
            saved: true,
            message: "Already saved",
          });
        }
        throw err;
      }
    } else if (action === "unsave") {
      await StorySave.deleteOne({
        user: userId,
        story: storyId,
      });
    } else {
      return NextResponse.json(
        { ok: false, message: "Invalid action. Use 'save' or 'unsave'." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      saved: action === "save",
    });
  } catch (err) {
    console.error("POST /api/stories/[storyId]/save error:", err);
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
