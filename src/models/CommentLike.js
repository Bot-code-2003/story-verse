import mongoose from "mongoose";

const commentLikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index: one user can only like a comment once
commentLikeSchema.index({ user: 1, comment: 1 }, { unique: true });

const CommentLike =
  mongoose.models.CommentLike ||
  mongoose.model("CommentLike", commentLikeSchema);

export default CommentLike;
