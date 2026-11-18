import mongoose from "mongoose";
import { env } from "@/config/env";
import { ApiError } from "@/lib/api/api-error";
import { getMongoUriCandidates } from "@/lib/db-uri-candidates";

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

export { getMongoUriCandidates } from "@/lib/db-uri-candidates";

export async function connectDB(): Promise<typeof mongoose> {
  if (globalCache.conn) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    const candidates = getMongoUriCandidates(
      env.MONGODB_URI,
      "mongodb://127.0.0.1:27017/adm-platform",
      process.env.NODE_ENV !== "production"
    );

    globalCache.promise = (async () => {
      let lastError: unknown;

      for (const uri of candidates) {
        try {
          const connection = await mongoose.connect(uri, {
            dbName: env.MONGODB_DB,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 5000,
          });

          return connection;
        } catch (error) {
          lastError = error;
        }
      }

      throw new ApiError(
        503,
        "Database unavailable. Please check the MongoDB connection and try again."
      );
    })();
  }

  try {
    globalCache.conn = await globalCache.promise;
    return globalCache.conn;
  } catch (error) {
    globalCache.promise = null;
    throw error;
  }
}
