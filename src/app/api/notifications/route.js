// src/app/api/notifications/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import User from "@/models/User";
import Story from "@/models/Story";
import Comment from "@/models/Comment";
import mongoose from "mongoose";

// GET: Fetch notifications for a user with pagination
export async function GET(req) {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { ok: false, message: "Valid userId is required" },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Fetch notifications with populated sender, story, and comment
    const notifications = await Notification.find({ recipient: userId })
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .populate({
        path: "sender",
        select: "username name profileImage",
      })
      .populate({
        path: "story",
        select: "title",
      })
      .populate({
        path: "comment",
        select: "text",
      })
      .lean();

    // Get total count and unread count
    const [totalCount, unreadCount] = await Promise.all([
      Notification.countDocuments({ recipient: userId }),
      Notification.countDocuments({ recipient: userId, read: false }),
    ]);

    // Format notifications for response
    const formattedNotifications = notifications.map((notif) => ({
      id: notif._id.toString(),
      type: notif.type,
      read: notif.read,
      createdAt: notif.createdAt,
      sender: notif.sender
        ? {
            id: notif.sender._id.toString(),
            username: notif.sender.username,
            name: notif.sender.name,
            profileImage: notif.sender.profileImage,
          }
        : null,
      story: notif.story
        ? {
            id: notif.story._id.toString(),
            title: notif.story.title,
          }
        : null,
      comment: notif.comment
        ? {
            id: notif.comment._id.toString(),
            text:
              notif.comment.text.length > 50
                ? notif.comment.text.substring(0, 50) + "..."
                : notif.comment.text,
          }
        : null,
    }));

    return NextResponse.json({
      ok: true,
      notifications: formattedNotifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore: skip + notifications.length < totalCount,
      },
    });
  } catch (err) {
    console.error("GET /api/notifications error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
