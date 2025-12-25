// src/app/api/notifications/read-all/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

// POST: Mark all notifications as read for a user
export async function POST(req) {
  try {
    await connectToDB();

    const { userId } = await req.json();

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { ok: false, message: "Valid userId is required" },
        { status: 400 }
      );
    }

    // Mark all unread notifications as read
    const result = await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    );

    return NextResponse.json({
      ok: true,
      message: "All notifications marked as read",
      count: result.modifiedCount,
    });
  } catch (err) {
    console.error("POST /api/notifications/read-all error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
