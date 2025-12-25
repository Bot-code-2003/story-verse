import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["story_like", "comment", "comment_like"],
      required: true,
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      default: null,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for efficient querying
// 1. Fetch user's notifications (unread first, newest first)
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

// 2. Prevent duplicate notifications for same action
notificationSchema.index(
  { recipient: 1, sender: 1, type: 1, story: 1, comment: 1 },
  { unique: true, sparse: true }
);

// 3. Count unread for a user
notificationSchema.index({ recipient: 1, read: 1 });

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
