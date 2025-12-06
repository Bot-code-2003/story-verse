// /api/authors/[username]/liked/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";
import StoryLike from "@/models/StoryLike";
import { ObjectId } from "mongodb";

export async function GET(req, { params }) {
  try {
    const { username: rawUsername } = await params;

    if (!rawUsername) {
      return NextResponse.json(
        { stories: [], pagination: { page: 1, limit: 18, total: 0, hasMore: false } },
        { status: 200 }
      );
    }

    // Get pagination params
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "18");
    const skip = (page - 1) * limit;

    // normalize incoming username
    const decoded = decodeURIComponent(rawUsername || "");
    const usernameNoAt = decoded.replace(/^@/, "").trim();
    const usernameWithAt = "@" + usernameNoAt;

    await connectToDB();

    // Find user
    let userDoc = await User.findOne({
      $or: [{ username: usernameNoAt }, { username: usernameWithAt }],
    }).lean();

    if (!userDoc && ObjectId.isValid(usernameNoAt)) {
      userDoc = await User.findOne({ _id: new ObjectId(usernameNoAt) }).lean();
    }

    if (!userDoc) {
      return NextResponse.json(
        { stories: [], pagination: { page: 1, limit: 18, total: 0, hasMore: false } },
        { status: 200 }
      );
    }

    // Get total count of liked stories
    const totalCount = await StoryLike.countDocuments({ user: userDoc._id });

    // Fetch liked story IDs with pagination
    const likedDocs = await StoryLike.find({ user: userDoc._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const storyIds = likedDocs.map((doc) => doc.story);

    // Fetch the actual stories
    const stories = await Story.find({
      _id: { $in: storyIds },
      published: true,
    })
      .populate({
        path: "author",
        select: "username name profileImage",
      })
      .lean();

    // Normalize stories
    const normalized = stories.map((s) => {
      const ns = { ...s };
      ns.id = ns._id ? String(ns._id) : ns.id || null;
      
      // Normalize author
      if (ns.author && typeof ns.author === "object" && ns.author._id) {
        ns.author = {
          id: String(ns.author._id),
          username: ns.author.username,
          name: ns.author.name,
          profileImage: ns.author.profileImage,
        };
      }
      
      ns.title = ns.title || "Untitled";
      ns.readTime = ns.readTime || 0;
      ns.description = ns.description || "";
      ns.coverImage = ns.coverImage || "";
      return ns;
    });

    return NextResponse.json(
      {
        stories: normalized,
        pagination: {
          page,
          limit,
          total: totalCount,
          hasMore: skip + normalized.length < totalCount,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/authors/[username]/liked error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
