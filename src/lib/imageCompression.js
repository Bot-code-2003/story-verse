// Image compression utilities for story covers and profile images

/**
 * Compress image for story cover
 * Target: 500x700 (5:7 ratio), WebP format, <100KB
 */
export async function compressStoryCover(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onerror = () => reject(new Error("Failed to load image"));
      
      img.onload = async () => {
        try {
          // Target dimensions
          const targetWidth = 500;
          const targetHeight = 700;
          const targetRatio = 5 / 7;
          
          // Calculate crop dimensions to maintain 5:7 ratio
          let sourceWidth = img.width;
          let sourceHeight = img.height;
          let sourceRatio = sourceWidth / sourceHeight;
          
          let sx = 0, sy = 0, sw = sourceWidth, sh = sourceHeight;
          
          if (sourceRatio > targetRatio) {
            // Image is wider, crop width
            sw = sourceHeight * targetRatio;
            sx = (sourceWidth - sw) / 2;
          } else {
            // Image is taller, crop height
            sh = sourceWidth / targetRatio;
            sy = (sourceHeight - sh) / 2;
          }
          
          // Create canvas
          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext("2d");
          
          // Draw cropped and resized image
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
          
          // Try WebP first
          let compressed = await tryCompress(canvas, "image/webp", 0.85, 100 * 1024);
          
          // Fallback to JPEG if WebP not supported or too large
          if (!compressed) {
            compressed = await tryCompress(canvas, "image/jpeg", 0.85, 100 * 1024);
          }
          
          if (!compressed) {
            reject(new Error("Could not compress image under 100KB"));
            return;
          }
          
          resolve(compressed);
        } catch (error) {
          reject(error);
        }
      };
      
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Compress image for profile picture
 * Target: 160x160 (1:1 ratio), WebP format, <10KB
 */
export async function compressProfileImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onerror = () => reject(new Error("Failed to read file"));
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onerror = () => reject(new Error("Failed to load image"));
      
      img.onload = async () => {
        try {
          const targetSize = 160;
          
          // Calculate crop to square
          const size = Math.min(img.width, img.height);
          const sx = (img.width - size) / 2;
          const sy = (img.height - size) / 2;
          
          // Create canvas
          const canvas = document.createElement("canvas");
          canvas.width = targetSize;
          canvas.height = targetSize;
          const ctx = canvas.getContext("2d");
          
          // Draw cropped and resized image
          ctx.drawImage(img, sx, sy, size, size, 0, 0, targetSize, targetSize);
          
          // Try WebP first
          let compressed = await tryCompress(canvas, "image/webp", 0.8, 10 * 1024);
          
          // Fallback to JPEG if needed
          if (!compressed) {
            compressed = await tryCompress(canvas, "image/jpeg", 0.8, 10 * 1024);
          }
          
          if (!compressed) {
            reject(new Error("Could not compress image under 10KB"));
            return;
          }
          
          resolve(compressed);
        } catch (error) {
          reject(error);
        }
      };
      
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Try to compress image to target size
 * Dynamically adjusts quality to meet size requirement
 */
async function tryCompress(canvas, mimeType, initialQuality, maxSize) {
  let quality = initialQuality;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const dataUrl = canvas.toDataURL(mimeType, quality);
    const size = Math.round((dataUrl.length - `data:${mimeType};base64,`.length) * 0.75);
    
    if (size <= maxSize) {
      return dataUrl;
    }
    
    // Reduce quality
    quality -= 0.05;
    attempts++;
    
    if (quality < 0.3) {
      break; // Don't go too low
    }
  }
  
  return null;
}

/**
 * Get size of data URL in bytes
 */
export function getDataUrlSize(dataUrl) {
  const base64 = dataUrl.split(",")[1];
  return Math.round(base64.length * 0.75);
}
