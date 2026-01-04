/**
 * Cloudflare R2 Configuration and Usage Tracking
 * 
 * CRITICAL: 80% hard limits enforced to prevent overage charges
 */

// R2 Credentials - loaded from environment variables
export const R2_CONFIG = {
  accountId: process.env.R2_ACCOUNT_ID,
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  bucketName: process.env.R2_BUCKET_NAME || "storybits",
  publicUrl: process.env.R2_PUBLIC_URL,
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
};

// Debug: Verify credentials are loaded (only log first/last 4 chars for security)
console.log("🔐 R2 Config loaded:", {
  accountId: R2_CONFIG.accountId ? `${R2_CONFIG.accountId.slice(0,4)}...${R2_CONFIG.accountId.slice(-4)}` : "MISSING",
  accessKeyId: R2_CONFIG.accessKeyId ? `${R2_CONFIG.accessKeyId.slice(0,4)}...${R2_CONFIG.accessKeyId.slice(-4)}` : "MISSING",
  secretAccessKey: R2_CONFIG.secretAccessKey ? `${R2_CONFIG.secretAccessKey.slice(0,4)}...${R2_CONFIG.secretAccessKey.slice(-4)}` : "MISSING",
  bucketName: R2_CONFIG.bucketName,
  publicUrl: R2_CONFIG.publicUrl,
});

// 🚨 HARD LIMITS - 80% of free tier (NO EXCEPTIONS)
export const R2_LIMITS = {
  storage: {
    max: 8_000_000_000,        // 8 GB (80% of 10 GB)
    free: 10_000_000_000,      // 10 GB free tier
    name: "Storage",
  },
  classA: {
    max: 800_000,              // 800K (80% of 1M)
    free: 1_000_000,           // 1M free tier
    name: "Class A Operations (Uploads)",
  },
  classB: {
    max: 8_000_000,            // 8M (80% of 10M)
    free: 10_000_000,          // 10M free tier
    name: "Class B Operations (Reads)",
  },
};

// Usage tracking (stored in memory, resets monthly)
const usage = {
  storage: 0,                  // Bytes stored
  classA: 0,                   // Upload operations
  classB: 0,                   // Read operations
  lastReset: new Date().toISOString(),
  month: new Date().getMonth(),
};

/**
 * Check if we should reset monthly counters
 */
function checkMonthlyReset() {
  const currentMonth = new Date().getMonth();
  if (usage.month !== currentMonth) {
    console.log("🔄 Resetting R2 usage counters for new month");
    usage.classA = 0;
    usage.classB = 0;
    usage.month = currentMonth;
    usage.lastReset = new Date().toISOString();
  }
}

/**
 * 🚨 Check if upload is allowed (80% limit check)
 * @param {number} fileSize - Size of file to upload in bytes
 * @returns {{ allowed: boolean, reason?: string, usage: object }}
 */
export function canUpload(fileSize = 0) {
  checkMonthlyReset();
  
  const newStorage = usage.storage + fileSize;
  const newClassA = usage.classA + 1;
  
  // Check storage limit (80% of 10GB)
  if (newStorage > R2_LIMITS.storage.max) {
    return {
      allowed: false,
      reason: `Storage limit reached (${(newStorage / 1_000_000_000).toFixed(2)}GB / ${R2_LIMITS.storage.max / 1_000_000_000}GB max)`,
      usage: getUsageStats(),
    };
  }
  
  // Check Class A operations (80% of 1M)
  if (newClassA > R2_LIMITS.classA.max) {
    return {
      allowed: false,
      reason: `Upload limit reached (${newClassA.toLocaleString()} / ${R2_LIMITS.classA.max.toLocaleString()} max uploads this month)`,
      usage: getUsageStats(),
    };
  }
  
  return {
    allowed: true,
    usage: getUsageStats(),
  };
}

/**
 * Record a successful upload
 * @param {number} fileSize - Size of uploaded file in bytes
 */
export function recordUpload(fileSize) {
  checkMonthlyReset();
  usage.storage += fileSize;
  usage.classA += 1;
  
  // Log warning if approaching 80% limit
  const storagePercent = (usage.storage / R2_LIMITS.storage.max) * 100;
  const classAPercent = (usage.classA / R2_LIMITS.classA.max) * 100;
  
  if (storagePercent > 90 || classAPercent > 90) {
    console.warn("⚠️ R2 usage above 90%:", getUsageStats());
  }
}

/**
 * Record a file read (Class B operation)
 */
export function recordRead() {
  checkMonthlyReset();
  usage.classB += 1;
}

/**
 * Get current usage statistics
 */
export function getUsageStats() {
  checkMonthlyReset();
  
  return {
    storage: {
      used: usage.storage,
      max: R2_LIMITS.storage.max,
      free: R2_LIMITS.storage.free,
      percentage: ((usage.storage / R2_LIMITS.storage.max) * 100).toFixed(2),
      usedGB: (usage.storage / 1_000_000_000).toFixed(3),
      maxGB: R2_LIMITS.storage.max / 1_000_000_000,
    },
    classA: {
      used: usage.classA,
      max: R2_LIMITS.classA.max,
      free: R2_LIMITS.classA.free,
      percentage: ((usage.classA / R2_LIMITS.classA.max) * 100).toFixed(2),
    },
    classB: {
      used: usage.classB,
      max: R2_LIMITS.classB.max,
      free: R2_LIMITS.classB.free,
      percentage: ((usage.classB / R2_LIMITS.classB.max) * 100).toFixed(2),
    },
    lastReset: usage.lastReset,
    month: usage.month,
  };
}

/**
 * Reset usage manually (for testing)
 */
export function resetUsage() {
  usage.storage = 0;
  usage.classA = 0;
  usage.classB = 0;
  usage.lastReset = new Date().toISOString();
  console.log("✅ R2 usage manually reset");
}
