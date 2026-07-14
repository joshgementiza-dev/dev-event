import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables.");
}

/**
 * Cached connection stored on the global object so it survives
 * Next.js hot reloads in development without opening new connections.
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cache: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
};
global._mongooseCache = cache;

async function connectToDatabase(): Promise<Mongoose> {
  // Return the existing connection if already established
  if (cache.conn) return cache.conn;

  // Reuse an in-flight connection promise to avoid parallel open attempts
  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false, // Fail fast instead of queuing commands when disconnected
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}

export default connectToDatabase;
