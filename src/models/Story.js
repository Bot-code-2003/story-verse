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
    tags: [String],
    likes: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        userId: String,
        text: String,
        timestamp: Date,
      },
    ],
    published: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Story = mongoose.models.Story || mongoose.model("Story", storySchema);

export default Story;
