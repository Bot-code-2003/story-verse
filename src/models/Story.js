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
    tags: {
      type: [String],
      default: [],
    },
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
    contest: {
      type: String,
      default: null,
    },
    // ⚡ PERFORMANCE: Content compression flag
    isCompressed: {
      type: Boolean,
      default: false,
    },
    // ⚡ PERFORMANCE: Pre-processed thumbnail for list views (200px)
    thumbnailImage: {
      type: String,
      default: null,
    },
    // ⚡ PERFORMANCE: Denormalized author snapshot (avoids populate() calls)
    authorSnapshot: {
      name: { type: String, default: null },
      username: { type: String, default: null },
      profileImage: { type: String, default: null },
    },
  },
  { timestamps: true }
);

// ⚡ PERFORMANCE: Database Indexes for Fast Queries
// These indexes dramatically improve query performance by avoiding full collection scans

// 1. Genre filtering + published status + sorting by date (for genre pages)
storySchema.index({ genres: 1, published: 1, createdAt: -1 });

// 2. Trending stories (sort by likes, filter by published)
storySchema.index({ likesCount: -1, published: 1 });

// 3. Latest stories (sort by creation date, filter by published)
storySchema.index({ createdAt: -1, published: 1 });

// 4. Editor picks (filter by editorPick flag and published status)
storySchema.index({ editorPick: 1, published: 1, createdAt: -1 });

// 5. Contest stories (filter by contest ID)
storySchema.index({ contest: 1, published: 1 });

// 6. Author's stories (for author pages)
storySchema.index({ author: 1, published: 1, createdAt: -1 });

// 7. Quick reads optimization (if you add a wordCount or readTime filter later)
storySchema.index({ readTime: 1, published: 1, createdAt: -1 });

// 8. Tags search (for tag filtering and discovery)
storySchema.index({ tags: 1, published: 1, likesCount: -1 });

// 9. ⚡ TEXT INDEX for fast full-text search (replaces slow regex)
// Enables $text search on title, description, and tags
storySchema.index(
  { title: "text", description: "text", tags: "text" },
  { 
    weights: { title: 10, tags: 5, description: 1 }, // Title matches ranked highest
    name: "story_text_search"
  }
);

const Story = mongoose.models.Story || mongoose.model("Story", storySchema);

export default Story;
