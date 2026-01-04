/**
 * ImgBB API Keys Configuration
 * Multiple keys for automatic failover when rate limits hit
 * 
 * HOW TO ADD MORE KEYS:
 * 1. Sign up at https://api.imgbb.com/
 * 2. Get API key from dashboard
 * 3. Add to .env.local as IMGBB_API_KEY_2, IMGBB_API_KEY_3, etc.
 */

// Load API keys from environment variables
const loadImgbbKeys = () => {
  const keys = [];
  
  // Primary key
  if (process.env.IMGBB_API_KEY) {
    keys.push(process.env.IMGBB_API_KEY);
  }
  
  // Additional keys (IMGBB_API_KEY_1, IMGBB_API_KEY_2, etc.)
  let i = 1;
  while (process.env[`IMGBB_API_KEY_${i}`]) {
    keys.push(process.env[`IMGBB_API_KEY_${i}`]);
    i++;
  }
  
  // Fallback for development (only if no env keys found)
  if (keys.length === 0) {
    console.warn("⚠️ No ImgBB API keys found in environment variables");
  }
  
  return keys;
};

export const IMGBB_API_KEYS = loadImgbbKeys();

// Debug log (only show count for security)
console.log(`🔑 Loaded ${IMGBB_API_KEYS.length} ImgBB API key(s) from environment`);

// Track which keys have failed recently
const failedKeys = new Map(); // key -> { failCount, lastFailTime }
const COOLDOWN_PERIOD = 5 * 60 * 1000; // 5 minutes cooldown after failures
const MAX_FAILS_BEFORE_COOLDOWN = 3;

/**
 * Get the next available API key
 * Skips keys that are in cooldown period
 */
export function getNextAvailableKey(excludeKeys = []) {
  const now = Date.now();
  
  // Clean up old failures
  for (const [key, data] of failedKeys.entries()) {
    if (now - data.lastFailTime > COOLDOWN_PERIOD) {
      failedKeys.delete(key);
    }
  }
  
  // Find first available key
  for (const key of IMGBB_API_KEYS) {
    if (excludeKeys.includes(key)) continue;
    
    const failData = failedKeys.get(key);
    if (!failData || failData.failCount < MAX_FAILS_BEFORE_COOLDOWN) {
      return key;
    }
    
    // Check if cooldown period has passed
    if (now - failData.lastFailTime > COOLDOWN_PERIOD) {
      failedKeys.delete(key);
      return key;
    }
  }
  
  // If all keys are in cooldown, return the first one anyway
  return IMGBB_API_KEYS[0];
}

/**
 * Mark a key as failed
 */
export function markKeyAsFailed(key) {
  const failData = failedKeys.get(key) || { failCount: 0, lastFailTime: 0 };
  failData.failCount += 1;
  failData.lastFailTime = Date.now();
  failedKeys.set(key, failData);
  
  console.warn(`⚠️ ImgBB key failed (${failData.failCount}/${MAX_FAILS_BEFORE_COOLDOWN}):`, 
    key.substring(0, 8) + '...');
}

/**
 * Get all available keys (not in cooldown)
 */
export function getAvailableKeysCount() {
  const now = Date.now();
  let available = 0;
  
  for (const key of IMGBB_API_KEYS) {
    const failData = failedKeys.get(key);
    if (!failData || failData.failCount < MAX_FAILS_BEFORE_COOLDOWN || 
        now - failData.lastFailTime > COOLDOWN_PERIOD) {
      available++;
    }
  }
  
  return available;
}
