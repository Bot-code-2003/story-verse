/**
 * Test R2 Credentials
 * Run this to verify your R2 API credentials are working
 */

import { S3Client, ListBucketsCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync } from 'fs';

// Manually load .env.local
const envContent = readFileSync('.env.local', 'utf-8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').replace(/^["']|["']$/g, '');
    }
  }
});


const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${envVars.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: envVars.R2_ACCESS_KEY_ID,
    secretAccessKey: envVars.R2_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

console.log("\n🔐 Testing R2 Credentials...\n");
console.log("Account ID:", envVars.R2_ACCOUNT_ID ? `${envVars.R2_ACCOUNT_ID.slice(0,8)}...` : "MISSING");
console.log("Access Key:", envVars.R2_ACCESS_KEY_ID ? `${envVars.R2_ACCESS_KEY_ID.slice(0,8)}...` : "MISSING");
console.log("Secret Key:", envVars.R2_SECRET_ACCESS_KEY ? `${envVars.R2_SECRET_ACCESS_KEY.slice(0,8)}...` : "MISSING");
console.log("Endpoint:", `https://${envVars.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`);
console.log("\n---\n");

// Test 1: List buckets
try {
  console.log("📋 Test 1: Listing buckets...");
  const command = new ListBucketsCommand({});
  const response = await r2Client.send(command);
  console.log("✅ Success! Found buckets:", response.Buckets?.map(b => b.Name).join(", "));
} catch (error) {
  console.error("❌ Failed to list buckets:", error.message);
  console.error("Error code:", error.Code || error.name);
  if (error.message.includes("Unauthorized") || error.Code === "InvalidAccessKeyId") {
    console.error("\n🚨 CREDENTIALS ARE INVALID OR EXPIRED");
    console.error("→ Go to Cloudflare Dashboard → R2 → Manage R2 API Tokens");
    console.error("→ Create a new API token with 'Object Read & Write' permissions");
    console.error("→ Update .env.local with the new credentials\n");
  }
  process.exit(1);
}

// Test 2: Upload a test file
try {
  console.log("\n📤 Test 2: Uploading test file...");
  const testData = Buffer.from("Hello from R2!");
  const command = new PutObjectCommand({
    Bucket: envVars.R2_BUCKET_NAME,
    Key: `test-${Date.now()}.txt`,
    Body: testData,
    ContentType: "text/plain",
  });
  
  await r2Client.send(command);
  console.log("✅ Upload successful!");
  console.log("\n🎉 All tests passed! R2 credentials are working correctly.\n");
} catch (error) {
  console.error("❌ Failed to upload:", error.message);
  console.error("Error code:", error.Code || error.name);
  if (error.Code === "NoSuchBucket") {
    console.error("\n🚨 BUCKET NOT FOUND");
    console.error("→ Verify bucket name in .env.local matches your R2 bucket");
  }
  process.exit(1);
}
