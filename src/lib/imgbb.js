/**
 * ImgBB Image Upload Utility
 * Uploads images to ImgBB and returns permanent URLs
 * This eliminates base64 storage in MongoDB, reducing bandwidth by 99%
 */

const IMGBB_API_URL = "https://api.imgbb.com/1/upload";

/**
 * Upload an image to ImgBB
 * @param {string} base64Image - Base64 encoded image (with or without data URL prefix)
 * @param {string} name - Optional name for the image
 * @returns {Promise<{url: string, thumbnailUrl: string, deleteUrl: string}>}
 */
export async function uploadToImgBB(base64Image, name = null) {
  // Remove data URL prefix if present
  const base64Data = base64Image.includes(",")
    ? base64Image.split(",")[1]
    : base64Image;

  const formData = new FormData();
  formData.append("key", process.env.IMGBB_API_KEY);
  formData.append("image", base64Data);
  
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
    deleteUrl: data.data.delete_url,
    width: data.data.width,
    height: data.data.height,
    size: data.data.size,
  };
}

/**
 * Upload image from a File/Blob to ImgBB (server-side)
 * @param {Buffer} buffer - Image buffer
 * @param {string} name - Optional name
 * @returns {Promise<{url: string, thumbnailUrl: string}>}
 */
export async function uploadBufferToImgBB(buffer, name = null) {
  const base64 = buffer.toString("base64");
  return uploadToImgBB(base64, name);
}
