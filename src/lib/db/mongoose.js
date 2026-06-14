import mongoose from "mongoose";

/**
 * Creates a cached getter for a named Mongoose connection.
 * Each dbName gets its own connection so ken-loyalty and super-user
 * never interfere with each other.
 */
function makeConnector(dbName) {
  const cacheKey = `_mongooseCache_${dbName}`;

  return async function connect() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("Please define MONGODB_URI in .env.local");
    }

    if (!global[cacheKey]) {
      global[cacheKey] = { conn: null, promise: null };
    }
    const cache = global[cacheKey];

    if (cache.conn) return cache.conn;

    if (!cache.promise) {
      cache.promise = mongoose.createConnection(uri, {
        dbName,
        bufferCommands: false,
      }).asPromise();
    }

    try {
      cache.conn = await cache.promise;
    } catch (e) {
      cache.promise = null;
      throw e;
    }

    return cache.conn;
  };
}

/** Connection for this project's own data (loyalty, users, etc.) */
export const connectDB = makeConnector(
  process.env.MONGODB_DB_NAME || "ken-loyalty"
);

/** Connection for the shared service catalog (admin project database) */
export const connectServicesDB = makeConnector(
  process.env.SERVICES_MONGODB_DB_NAME || "beauty-admin"
);
