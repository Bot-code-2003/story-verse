// src/app/api/comments/[commentId]/like/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import CommentLike from "@/models/CommentLike";

// POST: Toggle like on a comment
export async function POST(req, { params }) {
  try {
    await connectToDB();

    const { commentId } = await params;
    const { userId, action } = await req.json(); // action: "like" | "unlike"

    if (!commentId || !userId || !action) {
      return NextResponse.json(
        { ok: false, message: "commentId, userId, and action are required" },
        { status: 400 }
      );
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { ok: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    if (action === "like") {
      // Try to create a new like
      try {
        await CommentLike.create({ user: userId, comment: commentId });
        // Update denormalized count
        comment.likesCount = (comment.likesCount || 0) + 1;
        await comment.save();
      } catch (err) {
        // If duplicate key error, user already liked this comment
        if (err.code === 11000) {
          return NextResponse.json({
            ok: true,
            liked: true,
            likesCount: comment.likesCount || 0,
            message: "Already liked",
          });
        }
        throw err;
      }
    } else if (action === "unlike") {
      const deleteResult = await CommentLike.deleteOne({
        user: userId,
        comment: commentId,
      });

      if (deleteResult.deletedCount > 0) {
        // Update denormalized count
        comment.likesCount = Math.max((comment.likesCount || 0) - 1, 0);
        await comment.save();
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
      likesCount: comment.likesCount || 0,
    });
  } catch (err) {
    console.error("POST /api/comments/[commentId]/like error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
