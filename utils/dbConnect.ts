// Import mongoose
import mongoose from 'mongoose';

// Define the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || '';

// If the MongoDB URI is missing, throw an error
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Define an interface for the cached connection
interface Cached {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare the mongoose cache on the global object
declare global {
  var mongoose: Cached;
}

// Initialize the cached variable from globalThis
let cached: Cached = global.mongoose || { conn: null, promise: null };

// If no cache exists on the global object, create one
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Function to connect to MongoDB using Mongoose
async function dbConnect(): Promise<typeof mongoose> {
  // Return the cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // If no cached promise exists, create one
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  // Wait for the promise to resolve and cache the connection
  cached.conn = await cached.promise;
  return cached.conn;
}

// Export the connection function as default
export default dbConnect;
