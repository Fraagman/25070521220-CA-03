const { MongoClient } = require("mongodb");
const { seedSunglasses } = require("./seedData");

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";
const dbName = process.env.DB_NAME || "carnage_optix";

async function runSeed() {
  const client = new MongoClient(uri);
  try {
    console.log(`Connecting to MongoDB at ${uri}...`);
    await client.connect();
    console.log(`Connected to MongoDB! Target database: ${dbName}`);

    const db = client.db(dbName);
    const collection = db.collection("sunglasses");

    // Clear existing products and re-insert fresh seed catalog
    await collection.deleteMany({});
    console.log("Cleared existing sunglasses records.");

    const docsWithTimestamps = seedSunglasses.map((item) => ({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await collection.insertMany(docsWithTimestamps);
    console.log(`Successfully seeded ${result.insertedCount} brutal sunglasses items!`);
    console.log("You can now view them inside MongoDB Compass in database:", dbName, "collection: sunglasses");
  } catch (error) {
    console.error("Database seed error:", error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

runSeed();

