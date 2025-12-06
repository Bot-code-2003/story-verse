import mongoose from "mongoose";

const storyLikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true,
    },
  },
  { timestamps: true }
);

// Compound unique index: one user can only like a story once
storyLikeSchema.index({ user: 1, story: 1 }, { unique: true });

const StoryLike =
  mongoose.models.StoryLike || mongoose.model("StoryLike", storyLikeSchema);

export default StoryLike;
