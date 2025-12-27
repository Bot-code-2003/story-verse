import { NextResponse } from "next/server";
import sharp from "sharp";

/**
 * POST /api/upload
 * ⚡ PERFORMANCE: Server-side image optimization with Sharp
 * - Converts images to WebP format (30-50% smaller)
 * - Resizes cover images to max 800px width
 * - Generates 200px thumbnail for list views
 */
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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const originalSize = buffer.length;

    // Determine dimensions based on type
    const maxWidth = type === "profile" ? 400 : 800;
    const thumbnailWidth = 200;
    const quality = 80; // WebP quality (0-100)

    try {
      // ⚡ PERFORMANCE: Process with Sharp
      const sharpInstance = sharp(buffer);
      const metadata = await sharpInstance.metadata();
      
      // Only resize if image is wider than max
      const needsResize = metadata.width && metadata.width > maxWidth;
      
      // Generate main image (WebP, resized if needed)
      let mainBuffer;
      if (needsResize) {
        mainBuffer = await sharpInstance
          .resize(maxWidth, null, { withoutEnlargement: true })
          .webp({ quality })
          .toBuffer();
      } else {
        mainBuffer = await sharp(buffer)
          .webp({ quality })
          .toBuffer();
      }
      
      // Generate thumbnail (200px width, WebP)
      const thumbnailBuffer = await sharp(buffer)
        .resize(thumbnailWidth, null, { withoutEnlargement: true })
        .webp({ quality: 70 }) // Lower quality for thumbnail
        .toBuffer();

      // Convert to base64 data URLs
      const mainDataUrl = `data:image/webp;base64,${mainBuffer.toString("base64")}`;
      const thumbnailDataUrl = `data:image/webp;base64,${thumbnailBuffer.toString("base64")}`;

      const compressedSize = mainBuffer.length;
      const savings = Math.round((1 - compressedSize / originalSize) * 100);

      console.log(`🖼️ Image optimized: ${savings}% saved (${originalSize} → ${compressedSize} bytes)`);

      return NextResponse.json({
        success: true,
        dataUrl: mainDataUrl,
        thumbnailUrl: thumbnailDataUrl,
        originalSize,
        compressedSize,
        savings: `${savings}%`,
        format: "webp",
        width: needsResize ? maxWidth : metadata.width,
        originalWidth: metadata.width,
      });
    } catch (sharpError) {
      console.error("Sharp processing failed, falling back to original:", sharpError.message);
      
      // Fallback: Return original as base64 if Sharp fails
      const mimeType = file.type;
      const base64 = buffer.toString("base64");
      const dataUrl = `data:${mimeType};base64,${base64}`;

      return NextResponse.json({
        success: true,
        dataUrl,
        thumbnailUrl: null,
        originalSize: file.size,
        compressedSize: file.size,
        savings: "0%",
        format: mimeType.split("/")[1],
        fallback: true,
      });
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", message: error.message },
      { status: 500 }
    );
  }
}
