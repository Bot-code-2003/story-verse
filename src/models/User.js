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

const User =
  mongoose.models.User || mongoose.model("User", UserSchema, "users");
export default User;
