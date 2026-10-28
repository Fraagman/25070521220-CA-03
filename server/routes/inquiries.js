const express = require("express");
const { getDB } = require("../db/connection");

const router = express.Router();

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
 * GET /api/inquiries
 * List all custom blood oath inquiries
 */
router.get("/", async (req, res, next) => {
  try {
    const db = getDBOrThrow();
    const inquiries = await db.collection("inquiries").find({}).sort({ createdAt: -1 }).toArray();
    res.json(inquiries);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/inquiries
 * Submit bespoke sunglasses consultation or blood oath request
 */
router.post("/", async (req, res, next) => {
  try {
    const db = getDBOrThrow();
    const { name, email, bloodType, frameStyle, tintColor, visionNotes } = req.body;

    if (!name || !email || !visionNotes) {
      return res.status(400).json({ error: "Name, email, and vision notes are required for custom sunglasses forge requests." });
    }

    const inquiry = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      bloodType: bloodType ? bloodType.trim() : "O-Negative",
      frameStyle: frameStyle || "Cyber-Visor",
      tintColor: tintColor || "Arterial Red Mirror",
      visionNotes: visionNotes.trim(),
      status: "FORGING_QUOTE",
      createdAt: new Date(),
    };

    const result = await db.collection("inquiries").insertOne(inquiry);

    res.status(201).json({
      success: true,
      message: "Blood Oath received. The forge masters have catalogued your custom specifications in MongoDB.",
      inquiryId: result.insertedId,
      inquiry: {
        ...inquiry,
        _id: result.insertedId,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

