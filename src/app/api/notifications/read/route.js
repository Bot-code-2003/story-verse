// src/app/api/notifications/read/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Notification from "@/models/Notification";
import mongoose from "mongoose";

// POST: Mark a single notification as read
export async function POST(req) {
  try {
    await connectToDB();

    const { userId, notificationId } = await req.json();

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { ok: false, message: "Valid userId is required" },
        { status: 400 }
      );
    }

    if (!notificationId || !mongoose.Types.ObjectId.isValid(notificationId)) {
      return NextResponse.json(
        { ok: false, message: "Valid notificationId is required" },
        { status: 400 }
      );
    }

    // Update notification only if it belongs to the user
    const result = await Notification.updateOne(
      { _id: notificationId, recipient: userId },
      { $set: { read: true } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { ok: false, message: "Notification not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Notification marked as read",
    });
  } catch (err) {
    console.error("POST /api/notifications/read error:", err);
    return NextResponse.json(
      { ok: false, message: "Server error", error: err.message },
      { status: 500 }
    );
  }
}
