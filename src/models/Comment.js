import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for efficient querying of comments by story
commentSchema.index({ story: 1, createdAt: -1 });

const Comment =
  mongoose.models.Comment || mongoose.model("Comment", commentSchema);

export default Comment;
