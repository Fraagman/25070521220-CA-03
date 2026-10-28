const { test, before, after, describe } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const app = require("../app");
const { connectDB, closeDB, getDB } = require("../db/connection");

let mongod;

describe("CARNAGE OPTIX API Suite", () => {
  before(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await connectDB(uri, "test_carnage");
  });

  after(async () => {
    await closeDB();
    if (mongod) {
      await mongod.stop();
    }
  });

  test("GET /api/health returns healthy and database connected", async () => {
    const res = await request(app).get("/api/health");
    assert.equal(res.status, 200);
    assert.equal(res.body.status, "healthy");
    assert.equal(res.body.database, "connected");
  });

  test("GET /api/sunglasses returns auto-seeded sunglasses catalog", async () => {
    const res = await request(app).get("/api/sunglasses");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    assert.ok(res.body.length >= 8);

    const first = res.body[0];
    assert.ok(first.name);
    assert.ok(first.price);
    assert.ok(first.splatterLevel);
    assert.ok(first.category);
  });

  test("GET /api/sunglasses?category=Aviator filters results", async () => {
    const res = await request(app).get("/api/sunglasses?category=Aviator");
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body));
    res.body.forEach((item) => {
      assert.equal(item.category, "Aviator");
    });
  });

  test("GET /api/sunglasses?search=monolith searches items", async () => {
    const res = await request(app).get("/api/sunglasses?search=monolith");
    assert.equal(res.status, 200);
    assert.ok(res.body.length > 0);
    // Every returned item must have 'monolith' in either name, tagline, or description
    res.body.forEach((item) => {
      const match =
        /monolith/i.test(item.name) ||
        /monolith/i.test(item.tagline) ||
        /monolith/i.test(item.description);
      assert.ok(match, `Item ${item.name} should contain 'monolith'`);
    });
  });

  test("POST /api/sunglasses adds a new brutal sunglasses item", async () => {
    const newShades = {
      name: "SLAUGHTER VIPER 900",
      tagline: "Venomous crimson wraps.",
      category: "Sports Shield",
      price: 199.99,
      inStock: 12,
      splatterLevel: "Lethal",
      description: "Aggressive wrap with serrated fang bridge.",
      frameMaterial: "Carbonized bone composite",
      lensSpecs: "Crimson UV400",
    };

    const res = await request(app).post("/api/sunglasses").send(newShades);
    assert.equal(res.status, 201);
    assert.ok(res.body._id);
    assert.equal(res.body.name, "SLAUGHTER VIPER 900");
    assert.equal(res.body.price, 199.99);

    // Verify retrieval by ID
    const getRes = await request(app).get(`/api/sunglasses/${res.body._id}`);
    assert.equal(getRes.status, 200);
    assert.equal(getRes.body.name, "SLAUGHTER VIPER 900");
  });

  test("POST /api/sunglasses/:id/reviews adds a review to a product", async () => {
    const itemsRes = await request(app).get("/api/sunglasses");
    const target = itemsRes.body[0];

    const reviewPayload = {
      author: "BloodyBaron",
      rating: 5,
      comment: "Brutally gorgeous lenses. Held up under extreme conditions.",
    };

    const res = await request(app).post(`/api/sunglasses/${target._id}/reviews`).send(reviewPayload);
    assert.equal(res.status, 201);
    assert.ok(res.body.reviews);
    assert.equal(res.body.reviews[0].author, "BloodyBaron");
  });

  test("POST /api/orders validates stock and creates order in MongoDB", async () => {
    const itemsRes = await request(app).get("/api/sunglasses");
    const target = itemsRes.body[0];
    const initialStock = target.inStock;

    const orderPayload = {
      customerName: "Dante Alighieri",
      email: "dante@inferno.realm",
      shippingAddress: {
        street: "9th Circle Way",
        city: "Dis",
        state: "CA",
        zip: "90210",
        country: "USA",
      },
      bloodPledge: "By the blood of the righteous.",
      promoCode: "GORE10",
      items: [
        {
          productId: target._id,
          quantity: 2,
        },
      ],
    };

    const res = await request(app).post("/api/orders").send(orderPayload);
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.orderNumber.startsWith("CRNG-"));
    assert.ok(res.body.order.discount > 0);

    // Verify stock decremented in MongoDB
    const updatedTarget = await request(app).get(`/api/sunglasses/${target._id}`);
    assert.equal(updatedTarget.body.inStock, initialStock - 2);

    // Verify order retrievable by orderNumber
    const fetchOrderRes = await request(app).get(`/api/orders/${res.body.orderNumber}`);
    assert.equal(fetchOrderRes.status, 200);
    assert.equal(fetchOrderRes.body.customerName, "Dante Alighieri");
  });

  test("POST /api/inquiries saves custom order request to MongoDB", async () => {
    const inquiryPayload = {
      name: "Valeria Bloodworth",
      email: "valeria@vamp.club",
      bloodType: "AB-Negative",
      frameStyle: "Brutal Acetate",
      tintColor: "Deep Viscera Ruby",
      visionNotes: "Severe photophobia, need absolute infrared light suppression.",
    };

    const res = await request(app).post("/api/inquiries").send(inquiryPayload);
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.inquiryId);

    const listRes = await request(app).get("/api/inquiries");
    assert.equal(listRes.status, 200);
    assert.ok(listRes.body.length > 0);
  });

  test("POST /api/auth/signup registers new patron with hashed password and returns JWT", async () => {
    const signupData = {
      name: "Raven Bloodthorn",
      email: "raven@carnage.realm",
      password: "secretpassword123",
      bloodType: "AB-Negative",
    };

    const res = await request(app).post("/api/auth/signup").send(signupData);
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    assert.equal(res.body.user.name, "Raven Bloodthorn");
    assert.equal(res.body.user.email, "raven@carnage.realm");
    assert.equal(res.body.user.bloodType, "AB-Negative");
  });

  test("POST /api/auth/signup rejects duplicate email", async () => {
    const duplicateData = {
      name: "Raven Imposter",
      email: "raven@carnage.realm",
      password: "differentpassword",
    };

    const res = await request(app).post("/api/auth/signup").send(duplicateData);
    assert.equal(res.status, 409);
    assert.match(res.body.error, /already registered/i);
  });

  test("POST /api/auth/signin validates credentials and returns JWT", async () => {
    const res = await request(app).post("/api/auth/signin").send({
      email: "raven@carnage.realm",
      password: "secretpassword123",
    });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, "raven@carnage.realm");

    // Test GET /api/auth/me with valid Bearer token
    const meRes = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${res.body.token}`);
    assert.equal(meRes.status, 200);
    assert.equal(meRes.body.user.name, "Raven Bloodthorn");
    assert.equal(meRes.body.user.password, undefined); // Password must not be leaked
  });

  test("POST /api/auth/signin rejects incorrect password", async () => {
    const res = await request(app).post("/api/auth/signin").send({
      email: "raven@carnage.realm",
      password: "wrongpassword",
    });

    assert.equal(res.status, 401);
    assert.match(res.body.error, /Invalid password cipher/i);
  });

  test("GET /api/stats reports accurate totals", async () => {
    const res = await request(app).get("/api/stats");
    assert.equal(res.status, 200);
    assert.ok(res.body.totalProducts > 0);
    assert.ok(res.body.totalOrders > 0);
  });
});

