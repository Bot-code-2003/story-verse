import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Story from "@/models/Story";

// Add missing handler function for delete
async function handleDeleteStory(storyId, userId) {
  await connectDB();
  
  const story = await Story.findById(storyId);
  
  if (!story) {
    throw new Error("Story not found");
  }
  
  if (story.author.toString() !== userId) {
    throw new Error("Unauthorized");
  }
  
  await Story.findByIdAndDelete(storyId);
  return { success: true };
}

export { handleDeleteStory };
