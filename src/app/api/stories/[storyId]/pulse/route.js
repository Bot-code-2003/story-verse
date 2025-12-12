import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import Story from "@/models/Story";
import PulseFeedback from "@/models/PulseFeedback";

export async function POST(request, { params }) {
  try {
    await connectToDB();

    // Next.js 15+ requires awaiting params
    const { storyId } = await params;
    const { pulse, userId } = await request.json();

    // Validate userId
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 401 }
      );
    }

    // Validate pulse value
    const validPulses = ["soft", "intense", "heavy", "warm", "dark"];
    if (!validPulses.includes(pulse)) {
      return NextResponse.json(
        { error: "Invalid pulse value" },
        { status: 400 }
      );
    }

    // Find the story
    const story = await Story.findById(storyId);
    
    if (!story) {
      return NextResponse.json(
        { error: "Story not found" },
        { status: 404 }
      );
    }

    // Initialize pulse object if it doesn't exist
    if (!story.pulse) {
      story.pulse = {
        soft: 0,
        intense: 0,
        heavy: 0,
        warm: 0,
        dark: 0,
      };
    }

    // Check if user has already submitted a pulse for this story
    const existingPulse = await PulseFeedback.findOne({
      user: userId,
      story: storyId,
    });

    if (existingPulse) {
      // User is changing their pulse
      const oldPulse = existingPulse.pulse;
      
      // Decrement old pulse count
      if (story.pulse[oldPulse] > 0) {
        story.pulse[oldPulse] -= 1;
      }
      
      // Increment new pulse count
      story.pulse[pulse] = (story.pulse[pulse] || 0) + 1;
      
      // Update the pulse feedback record
      existingPulse.pulse = pulse;
      await existingPulse.save();
    } else {
      // New pulse submission
      story.pulse[pulse] = (story.pulse[pulse] || 0) + 1;
      
      // Create new pulse feedback record
      await PulseFeedback.create({
        user: userId,
        story: storyId,
        pulse: pulse,
      });
    }
    
    await story.save();

    return NextResponse.json({
      success: true,
      pulse: story.pulse,
      userPulse: pulse,
    });
  } catch (error) {
    console.error("Error updating pulse:", error);
    return NextResponse.json(
      { error: "Failed to update pulse" },
      { status: 500 }
    );
  }
}
