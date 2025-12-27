// src/app/api/stories/[storyId]/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";
import StoryLike from "@/models/StoryLike";
import StorySave from "@/models/StorySave";
import PulseFeedback from "@/models/PulseFeedback";
import mongoose from "mongoose";
import { decompressContent } from "@/lib/compression";

export async function GET(req, { params }) {
  try {
    // params is a Promise in the Next app router - must await
    const { storyId } = await params;
    if (!storyId) {
      return NextResponse.json({ error: "Missing storyId" }, { status: 400 });
    }

    await connectToDB();

    const query = mongoose.Types.ObjectId.isValid(storyId)
      ? { _id: new mongoose.Types.ObjectId(storyId) }
      : { _id: storyId };

    // ⚡ PERFORMANCE: For individual story page, we need ALL fields
    // (unlike list views which only need minimal fields)
    let story = await Story.findOne(query)
      .select('title description content isCompressed coverImage genres tags readTime author likesCount pulse contest createdAt updatedAt published')
      .populate({
        path: "author",
        model: "User",
        select: "username name bio profileImage",
      })
      .lean();

    if (!story)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Build authorData robustly
    let authorData = null;

    if (
      story.author &&
      typeof story.author === "object" &&
      (story.author._id || story.author.username)
    ) {
      authorData = {
        id: story.author._id ? String(story.author._id) : null,
        username: story.author.username || null,
        name: story.author.name || null,
        bio: story.author.bio || null,
        profileImage: story.author.profileImage || null,
      };
    } else if (story.author && typeof story.author === "object") {
      // Could be an ObjectId wrapper — try manual lookup
      const maybeId = story.author.toString ? story.author.toString() : null;
      if (maybeId && mongoose.Types.ObjectId.isValid(maybeId)) {
        const userDoc = await User.findById(maybeId)
          .select("username name bio profileImage")
          .lean();
        if (userDoc) {
          authorData = {
            id: String(userDoc._id),
            username: userDoc.username || null,
            name: userDoc.name || null,
            bio: userDoc.bio || null,
            profileImage: userDoc.profileImage || null,
          };
        } else {
          authorData = { id: maybeId };
        }
      } else {
        authorData = story.author;
      }
    } else if (story.author && typeof story.author === "string") {
      // Legacy string — try id then username
      if (mongoose.Types.ObjectId.isValid(story.author)) {
        const userDoc = await User.findById(story.author)
          .select("username name bio profileImage")
          .lean();
        if (userDoc) {
          authorData = {
            id: String(userDoc._id),
            username: userDoc.username || null,
            name: userDoc.name || null,
            bio: userDoc.bio || null,
            profileImage: userDoc.profileImage || null,
          };
        } else {
          authorData = { id: story.author };
        }
      } else {
        const userDoc = await User.findOne({ username: story.author })
          .select("username name bio profileImage")
          .lean();
        authorData = userDoc
          ? {
              id: String(userDoc._id),
              username: userDoc.username || null,
              name: userDoc.name || null,
              bio: userDoc.bio || null,
              profileImage: userDoc.profileImage || null,
            }
          : { username: story.author };
      }
    } else {
      authorData = null;
    }

    // Normalize story payload for the client
    const normalizedStory = { ...story };
    normalizedStory.id = normalizedStory._id?.toString?.();
    
    // ⚡ PERFORMANCE: Decompress content if compressed
    // decompressContent auto-detects by marker, but also check isCompressed flag as fallback
    if (normalizedStory.content) {
      normalizedStory.content = decompressContent(normalizedStory.content);
    }
    
    normalizedStory.author =
      typeof normalizedStory.author === "object"
        ? normalizedStory.author._id
          ? String(normalizedStory.author._id)
          : normalizedStory.author.toString
          ? String(normalizedStory.author.toString())
          : null
        : normalizedStory.author;

    // Check if user has liked or saved this story (if userId provided in query)
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    
    let liked = false;
    let saved = false;
    let userPulse = null;
    
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const [likeDoc, saveDoc, pulseDoc] = await Promise.all([
        StoryLike.findOne({ user: userId, story: storyId }).lean(),
        StorySave.findOne({ user: userId, story: storyId }).lean(),
        PulseFeedback.findOne({ user: userId, story: storyId }).lean(),
      ]);
      liked = !!likeDoc;
      saved = !!saveDoc;
      userPulse = pulseDoc?.pulse || null;
    }

    return NextResponse.json({ 
      ok: true, 
      story: normalizedStory, 
      authorData,
      liked,
      saved,
      userPulse,
    });
  } catch (err) {
    console.error("GET /api/stories/[storyId] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { storyId } = await params;
    if (!storyId)
      return NextResponse.json({ error: "Missing storyId" }, { status: 400 });

    const body = await req.json();

    const allowed = [
      "title",
      "description",
      "content",
      "coverImage",
      "readTime",
      "genre",
      "genres",
      "tags",
      "published",
      // if you allow changing author, include it here but cast below
      // "author",
    ];
    const update = {};
    for (const k of allowed) if (body[k] !== undefined) update[k] = body[k];

    if (update.tags && !Array.isArray(update.tags)) update.tags = [update.tags];
    if (update.genres && !Array.isArray(update.genres))
      update.genres = [update.genres];

    // OPTIONAL: if you want to accept author in PUT and cast to ObjectId:
    // if (body.author && mongoose.Types.ObjectId.isValid(body.author)) {
    //   update.author = new mongoose.Types.ObjectId(body.author);
    // }

    await connectToDB();

    const query = mongoose.Types.ObjectId.isValid(storyId)
      ? { _id: new mongoose.Types.ObjectId(storyId) }
      : { _id: storyId };

    const updated = await Story.findOneAndUpdate(query, update, {
      new: true,
    }).lean();
    if (!updated)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    updated.id = updated._id?.toString?.();
    return NextResponse.json({ ok: true, story: updated });
  } catch (err) {
    console.error("PUT /api/stories/[storyId] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
