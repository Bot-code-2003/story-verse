// src/app/api/stories/route.js
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import User from "@/models/User";
import { ObjectId } from "mongodb";

/* GET /api/stories?genre=<>&tag=<> */
export async function GET(request) {
  try {
    const url = new URL(request.url);
    const genre = url.searchParams.get("genre")?.trim();
    const tag = url.searchParams.get("tag")?.trim();

    if (!genre && !tag) {
      return NextResponse.json(
        { error: "Provide at least one filter, e.g. ?genre=fantasy" },
        { status: 400 }
      );
    }

    await connectToDB();

    const filters = [];
    if (genre) {
      filters.push({ genres: genre });
    }

    if (tag) {
      filters.push({ tags: tag });
      filters.push({ tags: { $in: [tag] } });
    }

    const query = filters.length ? { $or: filters } : {};

    let stories = await Story.find(query)
      .limit(12)
      .populate({
        path: "author",
        select: "username name profileImage",
      })
      .lean();

    // Normalize author shape for any stories that have string author
    const normalized = await Promise.all(
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

    return NextResponse.json({
      ok: true,
      count: normalized.length,
      stories: normalized,
    });
  } catch (err) {
    console.error("GET /api/stories error:", err);
    return NextResponse.json(
      { error: "Server error", message: err.message },
      { status: 500 }
    );
  }
}

/* POST /api/stories */
export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { error: "Missing required fields: title and content" },
        { status: 400 }
      );
    }

    console.log("Creating story with body:", body);

    // normalize tags/genres to arrays
    const tags = Array.isArray(body.tags)
      ? body.tags
      : body.tags
      ? body.tags.map((t) => String(t).trim()).filter(Boolean)
      : [];

    const genres = Array.isArray(body.genres)
      ? body.genres
      : body.genre
      ? [String(body.genre).trim()]
      : [];

    // Normalize author: accept ObjectId string or username string
    let authorVal = null;
    if (body.author) {
      const a = String(body.author).trim();
      if (ObjectId.isValid(a)) {
        // store MongoDB ObjectId
        authorVal = new ObjectId(a);
      } else if (a) {
        // store username string (legacy support)
        authorVal = a;
      }
    }

    const doc = {
      title: String(body.title).trim(),
      description: body.description ? String(body.description).trim() : "",
      content: body.content,
      coverImage: body.coverImage ? String(body.coverImage).trim() : "",
      readTime:
        body.readTime !== undefined && body.readTime !== null
          ? Number(body.readTime)
          : 0,
      genres,
      tags,
      author: authorVal,
      published: !!body.published,
      createdAt: new Date(),
    };

    await connectToDB();
    const created = await Story.create(doc);

    const createdResp = {
      id: created._id.toString(),
      title: created.title,
      description: created.description,
      coverImage: created.coverImage,
      // convert author to safe shape for frontend
      author:
        created.author && typeof created.author === "object"
          ? String(created.author)
          : created.author || null,
      readTime: created.readTime,
      genres: created.genres || [],
      tags: created.tags || [],
      published: created.published !== false,
      createdAt: created.createdAt,
    };

    return NextResponse.json({ ok: true, story: createdResp }, { status: 201 });
  } catch (err) {
    console.error("POST /api/stories error:", err);
    return NextResponse.json(
      { error: "Failed to create story", message: err.message },
      { status: 500 }
    );
  }
}
