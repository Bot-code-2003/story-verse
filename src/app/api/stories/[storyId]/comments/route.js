// src/app/api/stories/[storyId]/comments/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import Comment from "@/models/Comment";
import CommentLike from "@/models/CommentLike";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

// GET: Fetch comments for a story with pagination
export async function GET(req, { params }) {
  try {
    await connectToDB();

    const { storyId } = await params;
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const userId = url.searchParams.get("userId"); // Optional: to check if user liked each comment

    if (!storyId) {
      return NextResponse.json(
        { ok: false, message: "storyId is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Fetch comments with pagination
    const comments = await Comment.find({ story: storyId })
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user",
        select: "username name profileImage",
      })
      .populate({
        path: "replyingToUser",
        select: "username name",
      })
      .lean();

    // Get total count for pagination info
    const totalComments = await Comment.countDocuments({ story: storyId });

    // If userId provided, check which comments the user has liked
    const commentsWithLikeState = await Promise.all(
      comments.map(async (comment) => {
        let liked = false;
        if (userId && mongoose.Types.ObjectId.isValid(userId)) {
          const likeDoc = await CommentLike.findOne({
            user: userId,
            comment: comment._id,
          }).lean();
          liked = !!likeDoc;
        }

        return {
          id: comment._id.toString(),
          text: comment.text,
          likesCount: comment.likesCount || 0,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          liked,
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
        };
      })
    );

    return NextResponse.json({
      ok: true,
      comments: commentsWithLikeState,
      pagination: {
        page,
        limit,
        total: totalComments,
        hasMore: skip + comments.length < totalComments,
      },
    });
  } catch (err) {
    console.error("GET /api/stories/[storyId]/comments error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}

// POST: Add a new comment to a story
export async function POST(req, { params }) {
  try {
    await connectToDB();

    const { storyId } = await params;
    const { userId, text, parentComment, replyingToUser } = await req.json();

    if (!storyId || !userId || !text) {
      return NextResponse.json(
        { ok: false, message: "storyId, userId, and text are required" },
        { status: 400 }
      );
    }

    // Validate story exists
    const story = await Story.findById(storyId);
    if (!story) {
      return NextResponse.json(
        { ok: false, message: "Story not found" },
        { status: 404 }
      );
    }

    // Create comment data object
    const commentData = {
      story: storyId,
      user: userId,
      text: text.trim(),
    };

    // Add reply fields if provided
    if (parentComment) {
      commentData.parentComment = parentComment;
    }
    if (replyingToUser) {
      commentData.replyingToUser = replyingToUser;
    }

    // Create comment
    const comment = await Comment.create(commentData);

    // Populate user info
    await comment.populate({
      path: "user",
      select: "username name profileImage",
    });

    // Populate replyingToUser if exists
    if (comment.replyingToUser) {
      await comment.populate({
        path: "replyingToUser",
        select: "username name",
      });
    }

    // Create notifications
    const storyAuthorId = story.author?.toString();
    
    // Notify story author about new comment (skip if commenting on own story)
    if (storyAuthorId && storyAuthorId !== userId) {
      try {
        await Notification.create({
          recipient: storyAuthorId,
          sender: userId,
          type: "comment",
          story: storyId,
          comment: comment._id,
        });
      } catch (notifErr) {
        // Ignore duplicate notification errors
        if (notifErr.code !== 11000) {
          console.error("Error creating comment notification:", notifErr);
        }
      }
    }

    // If this is a reply, also notify the user being replied to (if different from story author)
    if (replyingToUser && replyingToUser !== userId && replyingToUser !== storyAuthorId) {
      try {
        await Notification.create({
          recipient: replyingToUser,
          sender: userId,
          type: "comment",
          story: storyId,
          comment: comment._id,
        });
      } catch (notifErr) {
        // Ignore duplicate notification errors
        if (notifErr.code !== 11000) {
          console.error("Error creating reply notification:", notifErr);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      comment: {
        id: comment._id.toString(),
        text: comment.text,
        likesCount: comment.likesCount || 0,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
        liked: false, // User just created it, hasn't liked it yet
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
    console.error("POST /api/stories/[storyId]/comments error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
