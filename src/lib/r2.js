/**
 * Cloudflare R2 Upload Utility
 * Uses AWS S3 SDK (R2 is S3-compatible)
 */

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { R2_CONFIG, canUpload, recordUpload } from "@/config/r2-config";

// Initialize R2 client
const r2Client = new S3Client({
  region: "auto",
  endpoint: R2_CONFIG.endpoint,
  credentials: {
    accessKeyId: R2_CONFIG.accessKeyId,
    secretAccessKey: R2_CONFIG.secretAccessKey,
  },
  forcePathStyle: true, // Required for R2 compatibility
});

/**
 * Upload a file to R2
 * @param {Buffer} buffer - File buffer
 * @param {string} filename - Filename to store
 * @param {string} contentType - MIME type
 * @returns {Promise<{url: string, size: number}>}
 */
export async function uploadToR2(buffer, filename, contentType = "image/webp") {
  const fileSize = buffer.length;
  
  // 🚨 CHECK 80% LIMIT BEFORE UPLOAD
  const limitCheck = canUpload(fileSize);
  if (!limitCheck.allowed) {
    throw new Error(`R2 Upload Blocked: ${limitCheck.reason}`);
  }
  
  // Generate unique filename with timestamp
  const timestamp = Date.now();
  const uniqueFilename = `${timestamp}-${filename}`;
  
  try {
    // Upload to R2
    const command = new PutObjectCommand({
      Bucket: R2_CONFIG.bucketName,
      Key: uniqueFilename,
      Body: buffer,
      ContentType: contentType,
    });
    
    await r2Client.send(command);
    
    // Record successful upload in usage tracker
    recordUpload(fileSize);
    
    // Return public URL
    const url = `${R2_CONFIG.publicUrl}/${uniqueFilename}`;
    
    console.log(`✅ R2 Upload: ${filename} (${(fileSize / 1024).toFixed(2)} KB)`);
    
    return {
      url,
      size: fileSize,
      filename: uniqueFilename,
      bucket: R2_CONFIG.bucketName,
    };
  } catch (error) {
    console.error("❌ R2 upload failed:", error.message);
    throw new Error(`R2 upload failed: ${error.message}`);
  }
}

/**
 * Upload multiple files to R2
 * @param {Array<{buffer: Buffer, filename: string, contentType?: string}>} files
 * @returns {Promise<Array<{url: string, size: number}>>}
 */
export async function uploadMultipleToR2(files) {
  const results = [];
  
  for (const file of files) {
    try {
      const result = await uploadToR2(
        file.buffer,
        file.filename,
        file.contentType
      );
      results.push(result);
    } catch (error) {
      console.error(`Failed to upload ${file.filename}:`, error.message);
      throw error; // Stop on first failure
    }
  }
  
  return results;
}
