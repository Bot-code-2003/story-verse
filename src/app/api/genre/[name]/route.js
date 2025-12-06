import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";
import { ObjectId } from "mongodb";

export async function GET(request, props) {
  try {
    // Unwrap params (Next.js 15+)
    const { name } = await props.params;
    const genreName = decodeURIComponent(name);

    // Get pagination params
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "18");
    const skip = (page - 1) * limit;

    await connectToDB();

    // Get total count for this genre
    const totalCount = await Story.countDocuments({
      genres: { $regex: `^${genreName}$`, $options: "i" },
      published: true,
    });

    // Case-insensitive genre match with pagination
    let rawStories = await Story.find({
      genres: { $regex: `^${genreName}$`, $options: "i" },
      published: true,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "author",
        select: "username name profileImage",
      })
      .lean();

    // --- NORMALIZE LIKE YOUR /api/stories ROUTE ---
    const normalized = await Promise.all(
      rawStories.map(async (s) => {
        const ns = { ...s };
        ns.id = ns._id?.toString?.();

        // If populated author object
        if (ns.author && typeof ns.author === "object" && ns.author._id) {
          ns.author = {
            id: String(ns.author._id),
            username: ns.author.username || null,
            name: ns.author.name || null,
            profileImage: ns.author.profileImage || null,
          };
          return ns;
        }

        // If author is stored as STRING
        if (typeof ns.author === "string") {
          const authorStr = ns.author;

          // Case 1: is ObjectId string
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

          // Case 2: find by username
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

          // Fallback: store raw string
          ns.author = { id: authorStr, username: authorStr };
          return ns;
        }

        // Final fallback
        ns.author = {
          id: null,
          username: null,
          name: null,
          profileImage: null,
        };
        return ns;
      })
    );

    return NextResponse.json({
      ok: true,
      count: normalized.length,
      stories: normalized,
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore: skip + normalized.length < totalCount,
      },
    });
  } catch (err) {
    console.error("Genre fetch error:", err);
    return NextResponse.json(
      { ok: false, error: err.message },
      { status: 500 }
    );
  }
}
