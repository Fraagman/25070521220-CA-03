const app = require("./app");
const { connectDB, DEFAULT_URI, DEFAULT_DB_NAME } = require("./db/connection");

const port = process.env.PORT || 5000;
const mongoUri = process.env.MONGODB_URI || DEFAULT_URI;
const dbName = process.env.DB_NAME || DEFAULT_DB_NAME;

async function startServer() {
  console.log("=========================================");
  console.log("   CARNAGE OPTIX - BACKEND INITIALIZING   ");
  console.log("=========================================");

  try {
    console.log(`Connecting to MongoDB at: ${mongoUri} (DB: ${dbName})...`);
    await connectDB(mongoUri, dbName);
    console.log(">> Connected successfully to MongoDB!");
    console.log(">> Collections ready: sunglasses, orders, inquiries");
  } catch (err) {
    console.error(">> MongoDB connection failed:", err.message);
    console.warn(">> Note: If MongoDB service is offline, please launch MongoDB Compass or start mongod.");
  }

  const server = app.listen(port, () => {
    console.log(`>> CARNAGE OPTIX server running on http://127.0.0.1:${port}`);
    console.log(">> Health check available at: http://127.0.0.1:" + port + "/api/health");
    console.log("=========================================");
  });

  process.on("SIGINT", async () => {
    console.log("\nReceived SIGINT. Shutting down server...");
    const { closeDB } = require("./db/connection");
    await closeDB();
    server.close(() => {
      console.log("Server closed cleanly.");
      process.exit(0);
    });
  });
}

startServer();
