import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    const type = formData.get("type"); // "story" or "profile"

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Size limits
    const maxSize = type === "profile" ? 2 * 1024 * 1024 : 5 * 1024 * 1024; // 2MB or 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large. Maximum ${type === "profile" ? "2MB" : "5MB"}` },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type;
    
    // Return data URL that will be processed on client side
    // Client will handle compression and return the final compressed image
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      dataUrl,
      originalSize: file.size,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
