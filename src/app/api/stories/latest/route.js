// src/app/api/stories/latest/route.js
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

      if (ns.author && typeof ns.author === "object" && ns.author._id) {
        ns.author = {
          id: String(ns.author._id),
          username: ns.author.username || null,
          name: ns.author.name || null,
          profileImage: ns.author.profileImage || null,
        };
        return ns;
      }

      if (typeof ns.author === "string") {
        const authorStr = ns.author;

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

        ns.author = { id: authorStr, username: authorStr };
        return ns;
      }

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

    const stories = await Story.find({})
      .sort({ createdAt: -1 })
      .limit(10)
      .populate({ path: "author", select: "username name profileImage" })
      .lean();

    const normalized = await normalizeStories(stories);

    return NextResponse.json({
      ok: true,
      count: normalized.length,
      stories: normalized,
    });
  } catch (err) {
    console.error("GET /api/stories/latest error:", err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 }
    );
  }
}
