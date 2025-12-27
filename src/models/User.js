import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    username: { type: String, default: "" },
    name: { type: String, default: "" },
    bio: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    latestContest: { type: String, default: null },
  },
  { timestamps: true }
);

// ⚡ PERFORMANCE: Database Indexes
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true, sparse: true }); // sparse allows empty strings
UserSchema.index({ name: 1 }); // For filtering by name

// ⚡ TEXT INDEX for fast author search
UserSchema.index(
  { name: "text", username: "text", bio: "text" },
  { 
    weights: { name: 10, username: 5, bio: 1 },
    name: "user_text_search"
  }
);

const User =
  mongoose.models.User || mongoose.model("User", UserSchema, "users");
export default User;
