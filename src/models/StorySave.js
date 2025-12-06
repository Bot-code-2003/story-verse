import mongoose from "mongoose";

const storySaveSchema = new mongoose.Schema(
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

// Compound unique index: one user can only save a story once
storySaveSchema.index({ user: 1, story: 1 }, { unique: true });

const StorySave =
  mongoose.models.StorySave || mongoose.model("StorySave", storySaveSchema);

export default StorySave;
