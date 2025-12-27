// src/lib/compression.js
// ⚡ PERFORMANCE: LZ-String compression utility for story content
// Reduces story payload size by 40-70%

import LZString from 'lz-string';

// Magic prefix to identify compressed content
const COMPRESSION_MARKER = '§LZ§';

/**
 * Compress text content using LZ-String
 * @param {string} text - Raw text to compress
 * @returns {string} - Compressed string with marker prefix
 */
export function compressContent(text) {
  if (!text || typeof text !== 'string') return text;
  
  // Don't compress if already compressed
  if (isCompressed(text)) return text;
  
  // Don't compress very short content (not worth it)
  if (text.length < 500) return text;
  
  try {
    const compressed = LZString.compressToUTF16(text);
    // Only use compression if it actually reduces size
    if (compressed.length < text.length * 0.9) {
      return COMPRESSION_MARKER + compressed;
    }
    // Compression didn't help much, return original
    return text;
  } catch (error) {
    console.error('Compression error:', error);
    return text;
  }
}

/**
 * Decompress text content if compressed
 * @param {string} text - Possibly compressed text
 * @returns {string} - Original uncompressed text
 */
export function decompressContent(text) {
  if (!text || typeof text !== 'string') return text;
  
  // Not compressed, return as-is
  if (!isCompressed(text)) return text;
  
  try {
    const compressedData = text.slice(COMPRESSION_MARKER.length);
    const decompressed = LZString.decompressFromUTF16(compressedData);
    
    if (!decompressed) {
      console.warn('Decompression returned null, returning original');
      return text;
    }
    
    return decompressed;
  } catch (error) {
    console.error('Decompression error:', error);
    return text;
  }
}

/**
 * Check if content is compressed
 * @param {string} text - Text to check
 * @returns {boolean} - True if compressed
 */
export function isCompressed(text) {
  return typeof text === 'string' && text.startsWith(COMPRESSION_MARKER);
}

/**
 * Get compression stats
 * @param {string} original - Original text
 * @param {string} compressed - Compressed text
 * @returns {object} - Stats object
 */
export function getCompressionStats(original, compressed) {
  const wasCompressed = isCompressed(compressed);
  const originalSize = original?.length || 0;
  const compressedSize = compressed?.length || 0;
  const savings = wasCompressed ? Math.round((1 - compressedSize / originalSize) * 100) : 0;
  
  return {
    originalSize,
    compressedSize,
    savings: `${savings}%`,
    wasCompressed,
  };
}

export default {
  compressContent,
  decompressContent,
  isCompressed,
  getCompressionStats,
};
