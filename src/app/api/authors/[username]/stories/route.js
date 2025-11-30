import { connectToDB } from "@/lib/mongodb";
import Story from "@/models/Story";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    // Await params since it's a Promise in Next.js 15+
    const { authorId } = await params;

    await connectToDB();

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    // Fetch all stories by author ID
    const stories = await Story.find({ author: authorId }).lean();

    return new Response(JSON.stringify(stories || []), { status: 200 });
  } catch (err) {
    console.error("/api/authors/[authorId]/stories error", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
}
