import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_LOCAL_URI ||
  process.env.DATABASE_URL ||
  "mongodb://localhost:27017/short_fiction";

// console.log(MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // ⚡ PERFORMANCE: Optimized connection pool settings
    const opts = {
      maxPoolSize: 10,              // Max 10 concurrent connections
      minPoolSize: 2,               // Keep 2 connections ready
      serverSelectionTimeoutMS: 5000, // Fail fast if DB is down
      socketTimeoutMS: 45000,       // Socket timeout
      family: 4,                    // Use IPv4 (faster than IPv6 in most cases)
    };
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ MongoDB connected with optimized pool');
        return mongoose;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDB;
