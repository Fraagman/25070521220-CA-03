const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connection");

const router = express.Router();

function getCollection() {
  const db = getDB();
  if (!db) {
    const error = new Error("Database not connected. Please ensure MongoDB is running.");
    error.status = 503;
    throw error;
  }
  return db.collection("sunglasses");
}

/**
 * GET /api/sunglasses
 * Filter, search, and sort sunglasses
 */
router.get("/", async (req, res, next) => {
  try {
    const col = getCollection();
    const { search, category, splatterLevel, minPrice, maxPrice, sortBy } = req.query;

    const query = {};

    if (search && typeof search === "string" && search.trim() !== "") {
      const term = search.trim();
      query.$or = [
        { name: { $regex: term, $options: "i" } },
        { tagline: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
        { category: { $regex: term, $options: "i" } },
      ];
    }

    if (category && typeof category === "string" && category !== "ALL") {
      query.category = category;
    }

    if (splatterLevel && typeof splatterLevel === "string" && splatterLevel !== "ALL") {
      query.splatterLevel = splatterLevel;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = parseFloat(maxPrice);
      }
    }

    let sortOption = { createdAt: -1 };
    if (sortBy === "price-asc") {
      sortOption = { price: 1 };
    } else if (sortBy === "price-desc") {
      sortOption = { price: -1 };
    } else if (sortBy === "rating") {
      sortOption = { rating: -1 };
    } else if (sortBy === "name") {
      sortOption = { name: 1 };
    }

    const items = await col.find(query).sort(sortOption).toArray();
    res.json(items);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/sunglasses/:id
 * Retrieve single sunglasses item by ObjectId or slug
 */
router.get("/:id", async (req, res, next) => {
  try {
    const col = getCollection();
    const { id } = req.params;

    let query = {};
    if (ObjectId.isValid(id)) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { slug: id };
    }

    const item = await col.findOne(query);
    if (!item) {
      return res.status(404).json({ error: "Sunglasses not found" });
    }

    res.json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/sunglasses
 * Create new sunglasses item
 */
router.post("/", async (req, res, next) => {
  try {
    const col = getCollection();
    const {
      name,
      tagline,
      category,
      price,
      originalPrice,
      inStock,
      splatterLevel,
      description,
      frameMaterial,
      lensSpecs,
      dimensions,
      features,
      badge,
      svgVariant,
    } = req.body;

    if (!name || !price || !category || !description) {
      return res.status(400).json({ error: "Missing required fields: name, price, category, and description are required." });
    }

    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return res.status(400).json({ error: "Price must be a positive number." });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const newSunglasses = {
      name: name.trim(),
      slug,
      tagline: tagline ? tagline.trim() : "Custom brutal eyewear forged in violence.",
      category: category.trim(),
      price: parsedPrice,
      originalPrice: originalPrice ? parseFloat(originalPrice) : parsedPrice,
      inStock: inStock !== undefined ? parseInt(inStock, 10) : 10,
      splatterLevel: splatterLevel || "Brutal",
      rating: 5.0,
      reviewCount: 0,
      description: description.trim(),
      frameMaterial: frameMaterial ? frameMaterial.trim() : "Cold-Rolled Surgical Alloy",
      lensSpecs: lensSpecs ? lensSpecs.trim() : "Arterial Red Polarized UV400",
      dimensions: dimensions || { lensWidth: 55, bridge: 18, temple: 140, weightGrams: 45 },
      features: Array.isArray(features) && features.length > 0 ? features : ["Ballistic rated", "UV400 full shield"],
      badge: badge ? badge.trim() : "NEW ARRIVAL",
      svgVariant: svgVariant || "visor",
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(newSunglasses);
    res.status(201).json({
      ...newSunglasses,
      _id: result.insertedId,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/sunglasses/:id
 * Update sunglasses details
 */
router.put("/:id", async (req, res, next) => {
  try {
    const col = getCollection();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid sunglasses ID format." });
    }

    const allowedUpdates = [
      "name",
      "tagline",
      "category",
      "price",
      "originalPrice",
      "inStock",
      "splatterLevel",
      "description",
      "frameMaterial",
      "lensSpecs",
      "dimensions",
      "features",
      "badge",
      "svgVariant",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        if (key === "price" || key === "originalPrice") {
          updates[key] = parseFloat(req.body[key]);
        } else if (key === "inStock") {
          updates[key] = parseInt(req.body[key], 10);
        } else {
          updates[key] = req.body[key];
        }
      }
    }

    updates.updatedAt = new Date();

    const result = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updates },
      { returnDocument: "after" }
    );

    if (!result) {
      return res.status(404).json({ error: "Sunglasses not found to update." });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/sunglasses/:id
 * Remove sunglasses from database
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const col = getCollection();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid sunglasses ID format." });
    }

    const result = await col.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Sunglasses not found to delete." });
    }

    res.json({ message: "Sunglasses eradicated from database successfully.", deletedId: id });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/sunglasses/:id/reviews
 * Add brutal customer review
 */
router.post("/:id/reviews", async (req, res, next) => {
  try {
    const col = getCollection();
    const { id } = req.params;
    const { author, rating, comment } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid sunglasses ID format." });
    }

    if (!author || !rating || !comment) {
      return res.status(400).json({ error: "Review requires author, rating, and comment." });
    }

    const numRating = parseInt(rating, 10);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ error: "Rating must be an integer between 1 and 5." });
    }

    const item = await col.findOne({ _id: new ObjectId(id) });
    if (!item) {
      return res.status(404).json({ error: "Sunglasses not found." });
    }

    const newReview = {
      id: "rev-" + Date.now(),
      author: author.trim(),
      rating: numRating,
      comment: comment.trim(),
      date: new Date().toISOString().split("T")[0],
      verifiedGore: true,
    };

    const existingReviews = item.reviews || [];
    const updatedReviews = [newReview, ...existingReviews];
    const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));

    const updated = await col.findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          reviews: updatedReviews,
          rating: avgRating,
          reviewCount: updatedReviews.length,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    res.status(201).json(updated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

