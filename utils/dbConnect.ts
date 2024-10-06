import mongoose, { Mongoose } from 'mongoose';

// Define the MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Create a cached variable to hold the connection and promise
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }; // Initialize if not present
}

async function dbConnect(): Promise<Mongoose> {
  // Return the cached connection if it exists
  if (cached.conn) {
    return cached.conn;
  }

  // If there is no cached promise, create one
  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance; // Return the Mongoose instance
    });
  }

  // Wait for the promise to resolve and cache the connection
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
