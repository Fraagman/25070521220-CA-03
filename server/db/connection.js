const { MongoClient } = require("mongodb");
const { seedSunglasses } = require("./seedData");

const DEFAULT_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const DEFAULT_DB_NAME = process.env.DB_NAME || "carnage_optix";

let client = null;
let database = null;

/**
 * Connect to MongoDB instance
 * @param {string} [customUri]
 * @param {string} [customDbName]
 * @returns {Promise<import('mongodb').Db>}
 */
async function connectDB(customUri = DEFAULT_URI, customDbName = DEFAULT_DB_NAME) {
  if (database && client) {
    return database;
  }

  client = new MongoClient(customUri, {
    serverSelectionTimeoutMS: 3000,
  });

  await client.connect();
  database = client.db(customDbName);

  // Auto-seed default sunglasses if collection is empty
  await seedDefaultData(database);

  return database;
}

/**
 * Seed initial sunglasses data if the collection has 0 items
 * @param {import('mongodb').Db} db
 */
async function seedDefaultData(db) {
  try {
    const collection = db.collection("sunglasses");
    const count = await collection.countDocuments();
    if (count === 0) {
      const docsWithTimestamps = seedSunglasses.map((item) => ({
        ...item,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      await collection.insertMany(docsWithTimestamps);
      console.log(`[Database] Successfully seeded ${docsWithTimestamps.length} brutal sunglasses into MongoDB collection 'sunglasses'.`);
    }
  } catch (err) {
    console.warn(`[Database] Auto-seeding warning: ${err.message}`);
  }
}

/**
 * Get active database instance
 * @returns {import('mongodb').Db | null}
 */
function getDB() {
  return database;
}

/**
 * Check if database is currently connected
 * @returns {boolean}
 */
function isConnected() {
  return Boolean(database && client);
}

/**
 * Close MongoDB connection
 */
async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}

module.exports = {
  connectDB,
  getDB,
  closeDB,
  seedDefaultData,
  isConnected,
  DEFAULT_URI,
  DEFAULT_DB_NAME,
};

