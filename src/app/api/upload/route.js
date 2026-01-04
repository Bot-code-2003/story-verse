import { NextResponse } from "next/server";
import sharp from "sharp";
import { uploadToR2 } from "@/lib/r2";
import { getUsageStats } from "@/config/r2-config";
import { 
  IMGBB_API_KEYS, 
  getNextAvailableKey, 
  markKeyAsFailed 
} from "@/config/imgbb-keys";

const IMGBB_API_URL = "https://api.imgbb.com/1/upload";

/**
 * Upload image buffer to ImgBB (FALLBACK ONLY)
 * Only used if R2 hits 80% limit
 */
async function uploadToImgBB(buffer, name = null) {
  const base64 = buffer.toString("base64");
  const triedKeys = [];
  let lastError = null;
  
  // Try up to all available keys
  for (let attempt = 0; attempt < IMGBB_API_KEYS.length; attempt++) {
    const apiKey = getNextAvailableKey(triedKeys);
    triedKeys.push(apiKey);
    
    try {
      const formData = new FormData();
      formData.append("key", apiKey);
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
        
        // If it's a 500 error (likely rate limit), try next key
        if (response.status === 500) {
          markKeyAsFailed(apiKey);
          console.log(`🔄 ImgBB Key ${attempt + 1}/${IMGBB_API_KEYS.length} failed (500), trying next...`);
          lastError = new Error(`Rate limit hit (500)`);
          continue;
        }
        
        throw new Error(`ImgBB upload failed: ${error}`);
      }

      const data = await response.json();
      if (!data.success) {
        // API returned success: false
        if (data.error?.message?.includes('rate') || data.error?.message?.includes('limit')) {
          markKeyAsFailed(apiKey);
          console.log(`🔄 ImgBB Key ${attempt + 1}/${IMGBB_API_KEYS.length} rate limited, trying next...`);
          lastError = new Error(data.error.message);
          continue;
        }
        throw new Error(`ImgBB upload failed: ${data.error?.message || "Unknown error"}`);
      }

      // Success! Log which key worked
      console.log(`✅ ImgBB Upload successful with key #${attempt + 1} (FALLBACK)`);
      
      return {
        url: data.data.url,
        displayUrl: data.data.display_url,
        thumbnailUrl: data.data.thumb?.url || data.data.url,
        mediumUrl: data.data.medium?.url || data.data.url,
        width: data.data.width,
        height: data.data.height,
        size: data.data.size,
        keyUsed: attempt + 1,
        fallback: true, // Mark as fallback
      };
      
    } catch (error) {
      // If it's our last attempt, throw the error
      if (attempt === IMGBB_API_KEYS.length - 1) {
        throw error;
      }
      
      // Otherwise continue to next key
      lastError = error;
      console.log(`🔄 ImgBB Attempt ${attempt + 1}/${IMGBB_API_KEYS.length} failed, trying next key...`);
    }
  }
  
  // All keys failed
  throw new Error(`All ${IMGBB_API_KEYS.length} ImgBB API keys failed. Last error: ${lastError?.message || 'Unknown'}`);
}

export async function POST(req) {
  try {
    // Log current R2 usage stats
    const stats = getUsageStats();
    console.log("📊 R2 Usage:", {
      storage: `${stats.storage.percentage}%`,
      uploads: `${stats.classA.percentage}%`,
    });

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

      // 🚀 Try R2 first (primary storage)
      try {
        const r2Result = await uploadToR2(
          optimizedBuffer,
          `${type}_${Date.now()}.webp`,
          "image/webp"
        );

        console.log(`☁️ Uploaded to R2: ${r2Result.url}`);

        return NextResponse.json({
          success: true,
          url: r2Result.url,
          originalSize,
          compressedSize,
          savings: `${savings}%`,
          format: "webp",
          width: needsResize ? maxWidth : metadata.width,
          originalWidth: metadata.width,
          hosted: "r2", // Cloudflare R2
          r2Usage: getUsageStats(), // Include usage stats
        });
      } catch (r2Error) {
        // 🔄 R2 failed (likely 80% limit hit), fallback to ImgBB
        console.warn("⚠️ R2 upload failed, falling back to ImgBB:", r2Error.message);
        
        try {
          const imgbbResult = await uploadToImgBB(
            optimizedBuffer,
            `${type}_${Date.now()}`
          );
          
          console.log(`☁️ Uploaded to ImgBB (FALLBACK): ${imgbbResult.url}`);
          
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
            hosted: "imgbb-fallback", // Indicates fallback was used
            r2Error: r2Error.message, // Why R2 failed
          });
        } catch (imgbbError) {
          throw new Error(`Both R2 and ImgBB failed: ${imgbbError.message}`);
        }
      }
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
