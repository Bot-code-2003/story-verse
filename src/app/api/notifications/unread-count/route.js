// src/app/api/notifications/unread-count/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

// GET: Get unread notification count for a user (lightweight endpoint for polling)
export async function GET(req) {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { ok: false, message: "Valid userId is required" },
        { status: 400 }
      );
    }

    const unreadCount = await Notification.countDocuments({
      recipient: userId,
      read: false,
    });

    return NextResponse.json({
      ok: true,
      unreadCount,
    });
  } catch (err) {
    console.error("GET /api/notifications/unread-count error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
