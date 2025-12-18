// lib/cache.js
// Smart localStorage caching utility with TTL support

/**
 * Cache configuration for different data types
 * TTL in milliseconds (600000 = 10 minutes)
 */
const CACHE_CONFIG = {
  homepage_latest: { ttl: 0 }, // ❌ No cache - always fresh
  homepage_trending: { ttl: 21600000 }, // ✅ 6 hours (was 2 hours)
  homepage_quickreads: { ttl: 21600000 }, // ✅ 6 hours
  homepage_editorpicks: { ttl: 21600000 }, // ✅ 6 hours
  homepage_featuredweek: { ttl: 21600000 }, // ✅ 6 hours - Featured This Week
  homepage_fantasy: { ttl: 21600000 }, // ✅ 6 hours
  homepage_drama: { ttl: 21600000 }, // ✅ 6 hours
  homepage_romance: { ttl: 21600000 }, // ✅ 6 hours
  homepage_sliceoflife: { ttl: 21600000 }, // ✅ 6 hours
  homepage_thriller: { ttl: 21600000 }, // ✅ 6 hours
  homepage_horror: { ttl: 21600000 }, // ✅ 6 hours
  homepage_author: { ttl: 21600000 }, // ✅ 6 hours
  contest_stories_: { ttl: 1800000 }, // ✅ 30 min - Contest stories (prefix)
  story_: { ttl: 300000 }, // ✅ 5 min - Individual stories (prefix, actual key will be story_[id])
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

  // Try exact match first
  let config = CACHE_CONFIG[key];
  
  // If no exact match, try prefix match (e.g., story_[id] matches story_)
  if (!config) {
    const prefixKey = Object.keys(CACHE_CONFIG).find(k => key.startsWith(k));
    if (prefixKey) {
      config = CACHE_CONFIG[prefixKey];
    }
  }
  
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

  // Try exact match first
  let config = CACHE_CONFIG[key];
  
  // If no exact match, try prefix match (e.g., story_[id] matches story_)
  if (!config) {
    const prefixKey = Object.keys(CACHE_CONFIG).find(k => key.startsWith(k));
    if (prefixKey) {
      config = CACHE_CONFIG[prefixKey];
    }
  }
  
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
  FEATURED_WEEK: "homepage_featuredweek", // ⭐ Featured This Week
  FANTASY: "homepage_fantasy",
  DRAMA: "homepage_drama",
  ROMANCE: "homepage_romance",
  SLICE_OF_LIFE: "homepage_sliceoflife",
  THRILLER: "homepage_thriller",
  HORROR: "homepage_horror",
  FEATURED_AUTHOR: "homepage_author",
  CONTEST_WINNERS: "contest_stories_7k-sprint-dec-2025",
};
