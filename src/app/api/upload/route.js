import { NextResponse } from "next/server";
import sharp from "sharp";

const IMGBB_API_URL = "https://api.imgbb.com/1/upload";

/**
 * Upload image buffer to ImgBB
 */
async function uploadToImgBB(buffer, name = null) {
  const base64 = buffer.toString("base64");
  
  const formData = new FormData();
  formData.append("key", process.env.IMGBB_API_KEY);
  formData.append("image", base64);
  if (name) {
    formData.append("name", name);
  }

  const response = await fetch(IMGBB_API_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ImgBB upload failed: ${error}`);
  }

  const data = await response.json();
  if (!data.success) {
    throw new Error(`ImgBB upload failed: ${data.error?.message || "Unknown error"}`);
  }

  return {
    url: data.data.url,
    displayUrl: data.data.display_url,
    thumbnailUrl: data.data.thumb?.url || data.data.url,
    mediumUrl: data.data.medium?.url || data.data.url,
    width: data.data.width,
    height: data.data.height,
    size: data.data.size,
  };
}

/**
 * POST /api/upload
 * ⚡ PERFORMANCE: Upload images to ImgBB cloud hosting
 * - Converts images to WebP format (30-50% smaller)
 * - Uploads to ImgBB for permanent CDN hosting
 * - Returns URLs instead of base64 (99% bandwidth savings)
 */
export async function POST(req) {
  try {
    // Check for API key
    if (!process.env.IMGBB_API_KEY) {
      console.error("IMGBB_API_KEY not configured");
      return NextResponse.json(
        { error: "Image upload service not configured" },
        { status: 500 }
      );
    }

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
    const quality = 80; // WebP quality (0-100)

    try {
      // ⚡ PERFORMANCE: Process with Sharp
      const sharpInstance = sharp(buffer);
      const metadata = await sharpInstance.metadata();
      
      // Only resize if image is wider than max
      const needsResize = metadata.width && metadata.width > maxWidth;
      
      // Generate optimized image (WebP, resized if needed)
      let optimizedBuffer;
      if (needsResize) {
        optimizedBuffer = await sharpInstance
          .resize(maxWidth, null, { withoutEnlargement: true })
          .webp({ quality })
          .toBuffer();
      } else {
        optimizedBuffer = await sharp(buffer)
          .webp({ quality })
          .toBuffer();
      }

      const compressedSize = optimizedBuffer.length;
      const savings = Math.round((1 - compressedSize / originalSize) * 100);

      console.log(`🖼️ Image optimized: ${savings}% saved (${originalSize} → ${compressedSize} bytes)`);

      // ☁️ Upload to ImgBB
      const imgbbResult = await uploadToImgBB(
        optimizedBuffer, 
        `${type}_${Date.now()}`
      );

      console.log(`☁️ Uploaded to ImgBB: ${imgbbResult.url}`);

      return NextResponse.json({
        success: true,
        url: imgbbResult.url,
        displayUrl: imgbbResult.displayUrl,
        thumbnailUrl: imgbbResult.thumbnailUrl,
        mediumUrl: imgbbResult.mediumUrl,
        originalSize,
        compressedSize,
        savings: `${savings}%`,
        format: "webp",
        width: needsResize ? maxWidth : metadata.width,
        originalWidth: metadata.width,
        hosted: "imgbb", // Indicates cloud hosting
      });
    } catch (processingError) {
      console.error("Image processing/upload failed:", processingError.message);
      
      // Fallback: Try uploading original if Sharp fails
      try {
        const imgbbResult = await uploadToImgBB(buffer, `${type}_${Date.now()}`);
        
        return NextResponse.json({
          success: true,
          url: imgbbResult.url,
          displayUrl: imgbbResult.displayUrl,
          thumbnailUrl: imgbbResult.thumbnailUrl,
          originalSize: file.size,
          compressedSize: file.size,
          savings: "0%",
          format: file.type.split("/")[1],
          fallback: true,
          hosted: "imgbb",
        });
      } catch (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed", message: error.message },
      { status: 500 }
    );
  }
}
