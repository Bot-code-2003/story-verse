// src/app/api/comments/[commentId]/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Comment from "@/models/Comment";
import Story from "@/models/Story";
import CommentLike from "@/models/CommentLike";
import mongoose from "mongoose";

// PUT: Edit a comment (only comment author can edit)
export async function PUT(req, { params }) {
  try {
    await connectToDB();

    const { commentId } = await params;
    const { userId, text } = await req.json();

    if (!commentId || !userId || !text) {
      return NextResponse.json(
        { ok: false, message: "commentId, userId, and text are required" },
        { status: 400 }
      );
    }

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { ok: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    // Check if user is the comment author
    if (comment.user.toString() !== userId) {
      return NextResponse.json(
        { ok: false, message: "You can only edit your own comments" },
        { status: 403 }
      );
    }

    // Update the comment
    comment.text = text.trim();
    await comment.save();

    // Populate user info
    await comment.populate({
      path: "user",
      select: "username name profileImage",
    });

    // Also populate replyingToUser if exists
    if (comment.replyingToUser) {
      await comment.populate({
        path: "replyingToUser",
        select: "username name",
      });
    }

    return NextResponse.json({
      ok: true,
      comment: {
        id: comment._id.toString(),
        text: comment.text,
        likesCount: comment.likesCount || 0,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        parentComment: comment.parentComment?.toString() || null,
        replyingToUser: comment.replyingToUser
          ? {
              id: comment.replyingToUser._id?.toString(),
              username: comment.replyingToUser.username,
              name: comment.replyingToUser.name,
            }
          : null,
        user: comment.user
          ? {
              id: comment.user._id?.toString(),
              username: comment.user.username,
              name: comment.user.name,
              profileImage: comment.user.profileImage,
            }
          : null,
      },
    });
  } catch (err) {
    console.error("PUT /api/comments/[commentId] error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a comment (comment author OR story author can delete)
export async function DELETE(req, { params }) {
  try {
    await connectToDB();

    const { commentId } = await params;
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!commentId || !userId) {
      return NextResponse.json(
        { ok: false, message: "commentId and userId are required" },
        { status: 400 }
      );
    }

    // Find the comment
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return NextResponse.json(
        { ok: false, message: "Comment not found" },
        { status: 404 }
      );
    }

    // Get the story to check if user is story author
    const story = await Story.findById(comment.story);
    if (!story) {
      return NextResponse.json(
        { ok: false, message: "Story not found" },
        { status: 404 }
      );
    }

    const isCommentAuthor = comment.user.toString() === userId;
    const isStoryAuthor = story.author.toString() === userId;

    // Check authorization: comment author OR story author
    if (!isCommentAuthor && !isStoryAuthor) {
      return NextResponse.json(
        { ok: false, message: "You do not have permission to delete this comment" },
        { status: 403 }
      );
    }

    // Delete associated likes first
    await CommentLike.deleteMany({ comment: commentId });

    // Also delete any replies to this comment
    await Comment.deleteMany({ parentComment: commentId });

    // Delete the comment
    await Comment.findByIdAndDelete(commentId);

    return NextResponse.json({
      ok: true,
      message: "Comment deleted successfully",
    });
  } catch (err) {
    console.error("DELETE /api/comments/[commentId] error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
