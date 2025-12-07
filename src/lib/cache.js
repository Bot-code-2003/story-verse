// lib/cache.js
// Smart localStorage caching utility with TTL support

/**
 * Cache configuration for different data types
 * TTL in milliseconds (600000 = 10 minutes)
 */
const CACHE_CONFIG = {
  homepage_latest: { ttl: 0 }, // ❌ No cache - always fresh
  homepage_trending: { ttl: 600000 }, // ✅ 10 min
  homepage_quickreads: { ttl: 600000 }, // ✅ 10 min
  homepage_editorpicks: { ttl: 600000 }, // ✅ 10 min
  homepage_fantasy: { ttl: 600000 }, // ✅ 10 min
  homepage_scifi: { ttl: 600000 }, // ✅ 10 min
  homepage_romance: { ttl: 600000 }, // ✅ 10 min
  homepage_thriller: { ttl: 600000 }, // ✅ 10 min
  homepage_horror: { ttl: 600000 }, // ✅ 10 min
  homepage_adventure: { ttl: 600000 }, // ✅ 10 min
  homepage_drama: { ttl: 600000 }, // ✅ 10 min
  homepage_sliceoflife: { ttl: 600000 }, // ✅ 10 min
  homepage_author: { ttl: 600000 }, // ✅ 10 min
};

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable() {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get data from cache
 * @param {string} key - Cache key
 * @returns {any|null} - Cached data or null if expired/not found
 */
export function getCache(key) {
  if (!isLocalStorageAvailable()) return null;

  const config = CACHE_CONFIG[key];
  
  // If TTL is 0, don't use cache
  if (!config || config.ttl === 0) return null;

  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - timestamp < config.ttl) {
      console.log(`✅ Cache HIT: ${key} (age: ${Math.round((now - timestamp) / 1000)}s)`);
      return data;
    } else {
      console.log(`⏰ Cache EXPIRED: ${key} (age: ${Math.round((now - timestamp) / 1000)}s)`);
      localStorage.removeItem(key);
      return null;
    }
  } catch (error) {
    console.error(`Cache read error for ${key}:`, error);
    return null;
  }
}

/**
 * Set data in cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 */
export function setCache(key, data) {
  if (!isLocalStorageAvailable()) return;

  const config = CACHE_CONFIG[key];
  
  // If TTL is 0, don't cache
  if (!config || config.ttl === 0) return;

  try {
    const cacheEntry = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheEntry));
    console.log(`💾 Cache SET: ${key}`);
  } catch (error) {
    // Handle quota exceeded or other errors
    if (error.name === "QuotaExceededError") {
      console.warn("localStorage quota exceeded, clearing old cache");
      clearOldCache();
      // Try again after clearing
      try {
        localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
      } catch (e) {
        console.error("Failed to cache even after clearing:", e);
      }
    } else {
      console.error(`Cache write error for ${key}:`, error);
    }
  }
}

/**
 * Clear specific cache entry
 * @param {string} key - Cache key to clear
 */
export function clearCache(key) {
  if (!isLocalStorageAvailable()) return;
  
  try {
    localStorage.removeItem(key);
    console.log(`🗑️ Cache CLEARED: ${key}`);
  } catch (error) {
    console.error(`Cache clear error for ${key}:`, error);
  }
}

/**
 * Clear all homepage caches
 */
export function clearAllHomepageCache() {
  if (!isLocalStorageAvailable()) return;

  Object.keys(CACHE_CONFIG).forEach((key) => {
    clearCache(key);
  });
  console.log("🗑️ All homepage cache cleared");
}

/**
 * Clear old/expired cache entries to free up space
 */
function clearOldCache() {
  if (!isLocalStorageAvailable()) return;

  const now = Date.now();
  Object.keys(CACHE_CONFIG).forEach((key) => {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const { timestamp } = JSON.parse(cached);
        const config = CACHE_CONFIG[key];
        if (config && now - timestamp >= config.ttl) {
          localStorage.removeItem(key);
        }
      }
    } catch (error) {
      // If parsing fails, remove the corrupted entry
      localStorage.removeItem(key);
    }
  });
}

/**
 * Fetch data with caching
 * @param {string} cacheKey - Cache key
 * @param {Function} fetchFn - Async function to fetch data
 * @returns {Promise<any>} - Cached or fresh data
 */
export async function fetchWithCache(cacheKey, fetchFn) {
  // Try to get from cache first
  const cached = getCache(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // Cache miss or expired - fetch fresh data
  console.log(`🌐 Fetching fresh data: ${cacheKey}`);
  const data = await fetchFn();
  
  // Cache the fresh data
  setCache(cacheKey, data);
  
  return data;
}

/**
 * Get cache statistics (for debugging)
 */
export function getCacheStats() {
  if (!isLocalStorageAvailable()) {
    return { available: false };
  }

  const stats = {
    available: true,
    entries: {},
    totalSize: 0,
  };

  Object.keys(CACHE_CONFIG).forEach((key) => {
    try {
      const cached = localStorage.getItem(key);
      if (cached) {
        const { timestamp } = JSON.parse(cached);
        const config = CACHE_CONFIG[key];
        const age = Date.now() - timestamp;
        const isValid = config && age < config.ttl;
        
        stats.entries[key] = {
          age: Math.round(age / 1000), // seconds
          valid: isValid,
          size: cached.length,
        };
        stats.totalSize += cached.length;
      }
    } catch (error) {
      stats.entries[key] = { error: error.message };
    }
  });

  return stats;
}

// Export cache keys for easy reference
export const CACHE_KEYS = {
  LATEST: "homepage_latest",
  TRENDING: "homepage_trending",
  QUICK_READS: "homepage_quickreads",
  EDITOR_PICKS: "homepage_editorpicks",
  FANTASY: "homepage_fantasy",
  SCIFI: "homepage_scifi",
  ROMANCE: "homepage_romance",
  THRILLER: "homepage_thriller",
  HORROR: "homepage_horror",
  ADVENTURE: "homepage_adventure",
  DRAMA: "homepage_drama",
  SLICE_OF_LIFE: "homepage_sliceoflife",
  FEATURED_AUTHOR: "homepage_author",
  MYTHIC_FICTION: "homepage_mythicfiction",
};
