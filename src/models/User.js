import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    username: { type: String, default: "" },
    name: { type: String, default: "" },
    bio: { type: String, default: "" },
    profileImage: { type: String, default: "" },
  },
  { timestamps: true }
);

const User =
  mongoose.models.User || mongoose.model("User", UserSchema, "users");
export default User;
