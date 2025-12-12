import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    content: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    coverImage: String,
    readTime: Number,
    genres: [String],
    likesCount: {
      type: Number,
      default: 0,
    },
    editorPick: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: true,
    },
    pulse: {
      soft: { type: Number, default: 0 },
      intense: { type: Number, default: 0 },
      heavy: { type: Number, default: 0 },
      warm: { type: Number, default: 0 },
      dark: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

const Story = mongoose.models.Story || mongoose.model("Story", storySchema);

export default Story;
