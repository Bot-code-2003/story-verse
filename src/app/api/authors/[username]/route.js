import { connectToDB } from "@/lib/mongodb";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    // Await params (keeps compatibility with previous pattern)
    const { username } = await params;

    await connectToDB();

    console.log("=== API Request ===");
    console.log("Fetching author with username:", username);
    console.log("Username type:", typeof username);
    console.log("Username length:", username?.length);

    const dbUsername = `@${username}`;

    // Find by username (exact match)
    let user = await User.findOne({ username: dbUsername }).lean();
    console.log(
      "Result from findOne by username:",
      user ? "FOUND" : "NOT FOUND"
    );

    // Debug: Count total users in collection
    const totalUsers = await User.countDocuments();
    console.log("Total users in collection:", totalUsers);

    const firstUser = await User.findOne().lean();
    console.log(
      "First user in DB:",
      firstUser ? `ID: ${firstUser._id}` : "NO USERS"
    );

    if (!user) {
      console.warn(`User not found for username: ${username}`);
      return new Response(JSON.stringify({ error: "Author not found" }), {
        status: 404,
      });
    }

    // Return safe user object (exclude password)
    const safeUser = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      bio: user.bio,
      profileImage: user.profileImage,
      followers: user.followers,
      following: user.following,
      savedStories: user.savedStories,
      likedStories: user.likedStories,
      createdAt: user.createdAt,
    };

    return new Response(JSON.stringify(safeUser), { status: 200 });
  } catch (err) {
    console.error("/api/authors/[username] GET error", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}

export async function PUT(req, { params }) {
  try {
    const { username } = await params;
    await connectToDB();

    const body = await req.json();
    const {
      name,
      username: newUsername,
      bio,
      profileImage,
      currentPassword,
      newPassword,
    } = body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // If password change requested, verify current password
    if (newPassword) {
      if (!currentPassword) {
        return new Response(
          JSON.stringify({
            error: "Current password is required to change password",
          }),
          { status: 400 }
        );
      }

      // NOTE: In production you should hash passwords and compare with bcrypt/argon2.
      // This code follows the prior pattern of plaintext comparison — replace with secure hashing.
      if (user.password !== currentPassword) {
        return new Response(
          JSON.stringify({ error: "Current password is incorrect" }),
          {
            status: 401,
          }
        );
      }
      user.password = newPassword;
    }

    // If username change requested, ensure uniqueness
    if (
      typeof newUsername === "string" &&
      newUsername.trim() !== "" &&
      newUsername !== user.username
    ) {
      // sanitize/normalize newUsername if you have rules (not done here). Just check collision.
      const existing = await User.findOne({ username: newUsername }).lean();
      if (existing) {
        return new Response(
          JSON.stringify({ error: "Username already taken" }),
          {
            status: 409,
          }
        );
      }
      user.username = newUsername;
    }

    // Update other profile fields (only if provided)
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profileImage !== undefined) user.profileImage = profileImage;

    await user.save();

    // Return updated user (safe)
    const safeUser = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      name: user.name,
      bio: user.bio,
      profileImage: user.profileImage,
      followers: user.followers,
      following: user.following,
      savedStories: user.savedStories,
      likedStories: user.likedStories,
      createdAt: user.createdAt,
    };

    return new Response(JSON.stringify(safeUser), { status: 200 });
  } catch (err) {
    console.error("/api/authors/[username] PUT error", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
