const express = require("express");
const cors = require("cors");
const { getDB, isConnected, seedDefaultData } = require("./db/connection");
const sunglassesRouter = require("./routes/sunglasses");
const ordersRouter = require("./routes/orders");
const inquiriesRouter = require("./routes/inquiries");
const authRouter = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  const connected = isConnected();
  res.json({
    status: connected ? "healthy" : "degraded",
    database: connected ? "connected" : "disconnected",
    service: "CARNAGE OPTIX API",
    timestamp: new Date().toISOString(),
  });
});

// Admin Stats
app.get("/api/stats", async (req, res, next) => {
  try {
    const db = getDB();
    if (!db) {
      return res.status(503).json({ error: "Database not connected." });
    }

    const totalProducts = await db.collection("sunglasses").countDocuments();
    const lowStockCount = await db.collection("sunglasses").countDocuments({ inStock: { $lt: 8 } });
    const totalOrders = await db.collection("orders").countDocuments();

    const orders = await db.collection("orders").find({}).toArray();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    res.json({
      totalProducts,
      lowStockCount,
      totalOrders,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
    });
  } catch (err) {
    next(err);
  }
});

// Manual Re-seed Endpoint
app.post("/api/seed", async (req, res, next) => {
  try {
    const db = getDB();
    if (!db) {
      return res.status(503).json({ error: "Database not connected." });
    }
    const collection = db.collection("sunglasses");
    await collection.deleteMany({});
    const { seedSunglasses } = require("./db/seedData");
    const docs = seedSunglasses.map((item) => ({
      ...item,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const result = await collection.insertMany(docs);
    res.json({
      message: `Database successfully re-seeded with ${result.insertedCount} brutal sunglasses items.`,
      count: result.insertedCount,
    });
  } catch (err) {
    next(err);
  }
});

// Register routers
app.use("/api/auth", authRouter);
app.use("/api/sunglasses", sunglassesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/inquiries", inquiriesRouter);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Central Error Handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  console.error(`[Error] ${err.message}`, err.stack);
  res.status(status).json({
    error: err.message || "Internal Carnage Server Error",
    status,
  });
});

module.exports = app;

