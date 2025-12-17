// src/app/api/stories/editorpicks/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";
import { ObjectId } from "mongodb";

async function normalizeStories(stories) {
  return Promise.all(
    stories.map(async (s) => {
      const ns = { ...s };
      ns.id = ns._id?.toString?.();

      // If author already populated as an object
      if (ns.author && typeof ns.author === "object" && ns.author._id) {
        ns.author = {
          id: String(ns.author._id),
          username: ns.author.username || null,
          name: ns.author.name || null,
          profileImage: ns.author.profileImage || null,
        };
        return ns;
      }

      // If author is stored as a string
      if (typeof ns.author === "string") {
        const authorStr = ns.author;

        // Case 1: It's an ObjectId string
        if (ObjectId.isValid(authorStr)) {
          const userDoc = await User.findById(authorStr)
            .select("username name profileImage")
            .lean();
          if (userDoc) {
            ns.author = {
              id: String(userDoc._id),
              username: userDoc.username,
              name: userDoc.name,
              profileImage: userDoc.profileImage,
            };
            return ns;
          }
        }

        // Case 2: It's a username or @username
        const cleanUsername = authorStr.replace(/^@/, "");
        const userDoc2 = await User.findOne({
          $or: [{ username: authorStr }, { username: cleanUsername }],
        })
          .select("username name profileImage")
          .lean();

        if (userDoc2) {
          ns.author = {
            id: String(userDoc2._id),
            username: userDoc2.username,
            name: userDoc2.name,
            profileImage: userDoc2.profileImage,
          };
          return ns;
        }

        // Fallback: keep as plain string-ish author
        ns.author = { id: authorStr, username: authorStr };
        return ns;
      }

      // Fallback when no author info
      ns.author = {
        id: null,
        username: null,
        name: null,
        profileImage: null,
      };
      return ns;
    })
  );
}

export async function GET() {
  try {
    await connectToDB();

    // ⚡ PERFORMANCE: Use editorPick index (defined in Story model)
    const stories = await Story.find({ editorPick: true, published: true })
      .select('title coverImage genres readTime author createdAt') // Minimal fields
      .sort({ createdAt: -1 }) // Uses index: { editorPick: 1, published: 1, createdAt: -1 }
      .limit(18)
      .populate({ path: "author", select: "username name" })
      .lean(); // ⚡ CRITICAL: 5-10x faster

    const normalized = await normalizeStories(stories);

    return NextResponse.json({
      ok: true,
      count: normalized.length,
      stories: normalized,
    });
  } catch (err) {
    console.error("GET /api/stories/editorpicks error:", err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 }
    );
  }
}
