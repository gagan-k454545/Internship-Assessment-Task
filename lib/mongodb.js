// lib/mongodb.js
// Database connection utility for MongoDB using Mongoose.
// Uses a global cache to reuse the same connection across API calls.
// (Next.js creates a new module instance on every API request in development.)

import mongoose from "mongoose";

// Use global to persist the connection across hot-reloads in development
let cached = global.mongoose;

// Initialize the cache object if it doesn't exist yet
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// connectDB — connects to MongoDB and returns the connection
// Call this at the top of every API route handler
async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI; // Read from environment variable

  // Throw at runtime (not at build time) if the URI is missing
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined. Add it to your Vercel environment variables.");
  }

  // Return existing connection if already connected
  if (cached.conn) {
    return cached.conn;
  }

  // Start a new connection if there's no pending promise yet
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => mongoose);
  }

  // Wait for the connection and cache it
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
