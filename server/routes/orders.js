const express = require("express");
const { ObjectId } = require("mongodb");
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
 * GET /api/orders
 * Fetch all orders
 */
router.get("/", async (req, res, next) => {
  try {
    const db = getDBOrThrow();
    const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/orders/:id
 * Retrieve order by orderNumber or ObjectId
 */
router.get("/:id", async (req, res, next) => {
  try {
    const db = getDBOrThrow();
    const { id } = req.params;

    let query = {};
    if (ObjectId.isValid(id)) {
      query = { $or: [{ _id: new ObjectId(id) }, { orderNumber: id }] };
    } else {
      query = { orderNumber: id };
    }

    const order = await db.collection("orders").findOne(query);
    if (!order) {
      return res.status(404).json({ error: "Order not found in the carnage records." });
    }

    res.json(order);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/orders
 * Create and place a new order, decrementing stock in MongoDB
 */
router.post("/", async (req, res, next) => {
  try {
    const db = getDBOrThrow();
    const sunglassesCol = db.collection("sunglasses");
    const ordersCol = db.collection("orders");

    const {
      customerName,
      email,
      shippingAddress,
      bloodPledge,
      items,
      promoCode,
    } = req.body;

    if (!customerName || !email || !shippingAddress || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: "Missing required order information: customerName, email, shippingAddress, and at least one item are mandatory.",
      });
    }

    // Verify stock and prepare order items
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      if (!item.productId || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ error: "Each order item must specify a valid productId and quantity." });
      }

      let productQuery = {};
      if (ObjectId.isValid(item.productId)) {
        productQuery = { _id: new ObjectId(item.productId) };
      } else {
        productQuery = { slug: item.productId };
      }

      const product = await sunglassesCol.findOne(productQuery);
      if (!product) {
        return res.status(404).json({ error: `Product not found: ${item.productId}` });
      }

      if (product.inStock < item.quantity) {
        return res.status(400).json({
          error: `Insufficient carnage stock for "${product.name}". Available: ${product.inStock}, Requested: ${item.quantity}`,
        });
      }

      const lineTotal = product.price * item.quantity;
      subtotal += lineTotal;

      validatedItems.push({
        productId: product._id.toString(),
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        svgVariant: product.svgVariant || "visor",
      });
    }

    // Calculate discount if promo code supplied
    let discount = 0;
    if (promoCode && promoCode.toUpperCase() === "GORE10") {
      discount = parseFloat((subtotal * 0.10).toFixed(2));
    } else if (promoCode && promoCode.toUpperCase() === "BLOODOATH") {
      discount = parseFloat((subtotal * 0.20).toFixed(2));
    }

    const shippingFee = subtotal >= 150 ? 0 : 15.0;
    const total = parseFloat((subtotal - discount + shippingFee).toFixed(2));

    // Decrement inventory in MongoDB
    for (const item of validatedItems) {
      await sunglassesCol.updateOne(
        { _id: new ObjectId(item.productId) },
        { $inc: { inStock: -item.quantity } }
      );
    }

    const orderNumber = `CRNG-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder = {
      orderNumber,
      customerName: customerName.trim(),
      email: email.trim().toLowerCase(),
      shippingAddress: {
        street: shippingAddress.street ? shippingAddress.street.trim() : "",
        city: shippingAddress.city ? shippingAddress.city.trim() : "",
        state: shippingAddress.state ? shippingAddress.state.trim() : "",
        zip: shippingAddress.zip ? shippingAddress.zip.trim() : "",
        country: shippingAddress.country ? shippingAddress.country.trim() : "USA",
      },
      bloodPledge: bloodPledge ? bloodPledge.trim() : "Bound by crimson light.",
      items: validatedItems,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shippingFee,
      discount,
      promoCode: promoCode || null,
      total,
      status: "CONFIRMED",
      paymentStatus: "PAID_IN_BLOOD_OR_CARD",
      createdAt: new Date(),
    };

    const result = await ordersCol.insertOne(newOrder);

    res.status(201).json({
      success: true,
      orderNumber,
      orderId: result.insertedId,
      order: {
        ...newOrder,
        _id: result.insertedId,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

