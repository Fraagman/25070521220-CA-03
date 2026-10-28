const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connection");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "CARNAGE_OPTIX_DEV_AUTH_SECRET_KEY";

function getDBOrThrow() {
  const db = getDB();
  if (!db) {
    const error = new Error("Database not connected. Please ensure MongoDB is running.");
    error.status = 503;
    throw error;
  }
  return db;
}

/**
 * POST /api/auth/signup
 * Register a new patron into MongoDB
 */
router.post("/signup", async (req, res, next) => {
  try {
    const db = getDBOrThrow();
    const usersCol = db.collection("users");

    const { name, email, password, bloodType } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Moniker, dispatch email, and password cipher are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: "Invalid transmission email format." });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password cipher must be at least 6 characters in length." });
    }

    const existingUser = await usersCol.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ error: "A patron with this dispatch email is already registered in the carnage archives." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      bloodType: bloodType ? bloodType.trim() : "O-Negative",
      role: "patron",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCol.insertOne(newUser);
    const userId = result.insertedId.toString();

    const payload = {
      userId,
      name: newUser.name,
      email: newUser.email,
      bloodType: newUser.bloodType,
      role: newUser.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "Blood Initiation complete. Credentials committed to MongoDB.",
      token,
      user: {
        _id: userId,
        name: newUser.name,
        email: newUser.email,
        bloodType: newUser.bloodType,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/signin
 * Authenticate existing patron
 */
router.post(["/signin", "/login"], async (req, res, next) => {
  try {
    const db = getDBOrThrow();
    const usersCol = db.collection("users");

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password cipher are required." });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await usersCol.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ error: "No bloodline record found for this email address." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password cipher. Access denied." });
    }

    const userId = user._id.toString();
    const payload = {
      userId,
      name: user.name,
      email: user.email,
      bloodType: user.bloodType || "O-Negative",
      role: user.role || "patron",
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      success: true,
      message: "Abyss entrance granted. Welcome back.",
      token,
      user: {
        _id: userId,
        name: user.name,
        email: user.email,
        bloodType: user.bloodType || "O-Negative",
        role: user.role || "patron",
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 * Fetch current authenticated patron details
 */
router.get("/me", async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or malformed Authorization header." });
    }

    const token = authHeader.split(" ")[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      return res.status(401).json({ error: "Token cipher expired or invalid: " + jwtErr.message });
    }

    const db = getDBOrThrow();
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ error: "User no longer exists in MongoDB." });
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
