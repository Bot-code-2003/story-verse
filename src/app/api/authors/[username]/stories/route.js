// /api/authors/[username]/stories/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    // Next.js 15+ may provide params as a promise
    const { username: rawUsername } = await params;

    if (!rawUsername) {
      return NextResponse.json([], { status: 200 });
    }

    // normalize incoming username: decode, trim, remove leading @ for lookups
    const decoded = decodeURIComponent(rawUsername || "");
    const usernameNoAt = decoded.replace(/^@/, "").trim();
    const usernameWithAt = "@" + usernameNoAt;

    await connectToDB();

    // Get pagination params
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "18");
    const skip = (page - 1) * limit;

    // try find user doc by username (try both without @ and with @)
    let userDoc = await User.findOne({
      $or: [{ username: usernameNoAt }, { username: usernameWithAt }],
    }).lean();

    // also try lookup by _id if the param might be an id
    if (!userDoc && ObjectId.isValid(usernameNoAt)) {
      userDoc = await User.findOne({ _id: new ObjectId(usernameNoAt) }).lean();
    }

    let stories = [];
    let totalCount = 0;

    if (userDoc && userDoc._id) {
      // Get total count
      totalCount = await Story.countDocuments({
        author: userDoc._id,
        published: true,
      });

      // Author stored as ObjectId ref -> fetch stories by author id with pagination
      stories = await Story.find({
        author: userDoc._id,
        published: true,
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
    } else {
      // Fallback: maybe author stored as a string (username or @username)
      stories = await Story.find({
        author: { $in: [usernameNoAt, usernameWithAt] },
        published: true,
      })
        .sort({ createdAt: -1 })
        .lean();
    }

    // Normalize each story object for frontend
    const normalized = (stories || []).map((s) => {
      const ns = { ...s };
      ns.id = ns._id ? String(ns._id) : ns.id || null;
      // normalize author field: if it's an object (populated), prefer its _id
      if (ns.author && typeof ns.author === "object" && ns.author._id) {
        ns.author = String(ns.author._id);
      } else if (ns.author && ObjectId.isValid(String(ns.author))) {
        ns.author = String(ns.author);
      }
      // safe defaults to avoid UI crashes
      ns.title = ns.title || "Untitled";
      ns.readTime = ns.readTime || 0;
      ns.description = ns.description || "";
      ns.coverImage = ns.coverImage || "";
      return ns;
    });

    // Return an array with pagination info
    return NextResponse.json({
      stories: normalized,
      pagination: {
        page,
        limit,
        total: totalCount,
        hasMore: skip + normalized.length < totalCount,
      },
    }, { status: 200 });
  } catch (err) {
    console.error("GET /api/authors/[username]/stories error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
