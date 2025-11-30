import mongoose from "mongoose";

const storySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    content: String,
    author: {
      type: String, // Can reference User ID
      required: true,
    },
    coverImage: String,
    readTime: Number,
    genre: String,
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
