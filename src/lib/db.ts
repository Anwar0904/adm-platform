import mongoose from "mongoose";
import { env } from "@/config/env";

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Extend the global object so the cache survives hot reloads in development.
declare global {
  var mongooseCache: MongooseCache | undefined;
}

const globalCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = globalCache;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    globalCache.promise = mongoose.connect(env.MONGODB_URL, {
      dbName: "adm-wehsite",
    });
  }

  try {
    globalCache.conn = await globalCache.promise;
    console.log("MongoDB connected");
    return globalCache.conn;
  } catch (error) {
    globalCache.promise = null;
    console.error("MongoDB connection failed");
    throw error
  }
}
