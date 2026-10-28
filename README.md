# CARNAGE OPTIX // Brutal & Gore Eyewear Forge
**Full-Stack Web Application for FLEXI Project (CA-03)**

> "Standard eyewear is designed for mild afternoons. CARNAGE OPTIX is engineered for the scorched earth."

CARNAGE OPTIX is a neo-brutalist, cyber-gore themed full-stack eCommerce application for purchasing aggressive, ballistic-grade sunglasses. Built with **React 19 + TypeScript**, **Node.js + Express 5**, and **MongoDB** (MongoDB Compass compatible).

---

## 🕶️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React, Space Mono & Syne Typography |
| **Backend** | Node.js, Express 5, Official MongoDB Driver (`mongodb` v7), CORS |
| **Database** | MongoDB (MongoDB Compass accessible at `mongodb://127.0.0.1:27017/carnage_optix`) |
| **Testing** | Node.js Test Runner + `supertest` + `mongodb-memory-server` (Backend), Vitest + React Testing Library (Frontend) |

---

## 🩸 Brutal & Gore Design Features

- **Brutalist Aesthetic**: Heavy 4px solid borders, harsh drop shadows (`6px 6px 0px #ff0033`), jagged angles, high-contrast monospace typography, and blood-splatter accents.
- **Custom Vector Eyewear**: Bespoke SVG vector models for every silhouette:
  - `EXSANGUINATOR 3000` (Cyber-Visor with arterial crimson mirror)
  - `CORONER'S SCALPEL` (316L razor steel polygonal frame)
  - `NECROTIC AVIATOR` (Barbed-wire reinforced brow bar)
  - `VISCERA CHUNKY RECTANGLE` (10mm thick milled oxblood acetate)
  - `AUTOPSY CAT-EYE V2` (Spiked fang tips and infrared ruby lenses)
  - `HELLHOUND SPEED SHIELD` (Toxic crimson wrap shield)
  - `MORTUARY HEX` (Antiqued gunmetal with perforated mesh side blinkers)
  - `BEHEADED MONOLITH` (Bone-white composite with permanent arterial splatter drips)
- **Splatter Danger Tiers**: Categorized by carnage level (`Moderate`, `Brutal`, `Lethal`, `Extreme`, `Catastrophic`, `Apocalyptic`).
- **Blood Oath Checkout**: Live cart calculations with blood-donation promo code (`GORE10` for 10% off, `BLOODOATH` for 20% off), generating real order records with persistent storage in MongoDB.
- **Customer Reviews**: Real reviews stored in MongoDB documents; users can log testimonials that update product ratings in real time.
- **Bespoke Blood Forge**: Consultation request form for custom prescriptions and frame finishes, stored in MongoDB `inquiries`.
- **Admin Vault**: Live management dashboard showing MongoDB telemetry, real-time order logs, stock adjustment, and product creation.

---

## 🚀 How to Run the Application

### Prerequisites
1. **Node.js** (v18+ or v24+)
2. **MongoDB** or **MongoDB Compass** running locally on default port `27017` (`mongodb://127.0.0.1:27017`)

---

### Step 1: Start the Backend Server

```bash
cd "server"
npm install
npm start
```
*The server will start on `http://127.0.0.1:5000` and automatically connect to MongoDB (`carnage_optix`). If the `sunglasses` collection is empty, it will auto-seed default products!*

To manually seed or re-seed MongoDB at any time:
```bash
npm run seed
```

---

### Step 2: Start the Frontend Application

In a separate terminal:
```bash
cd "client"
npm install
npm run dev
```
*Open your browser and navigate to `http://localhost:5173`.*

---

## 🧪 How to Run Tests

### Backend Test Suite (Supertest + In-Memory MongoDB)
```bash
cd "server"
npm test
```
*Executes all 9 endpoint integration tests (Health, Catalog Filtering, Search, Product Creation, Reviews, Stock Decrementing, Order Persistence, Custom Inquiries, and Telemetry Stats).*

### Frontend Test Suite (Vitest + React Testing Library)
```bash
cd "client"
npm test
```
*Executes unit tests for ProductCard rendering, SVG variants, Add-to-Cart interactions, and Cart drawer promo discount calculations.*

### Typecheck & Linting
```bash
cd "client"
npm run typecheck
npm run lint
```

---

## 🗄️ MongoDB Database Architecture (MongoDB Compass)

In **MongoDB Compass**, connect to:
`mongodb://127.0.0.1:27017`

Database Name: `carnage_optix`

### Collections:
1. **`sunglasses`**:
   - `_id`: ObjectId
   - `name`: string (e.g. "EXSANGUINATOR 3000")
   - `slug`: string (e.g. "exsanguinator-3000")
   - `tagline`: string
   - `category`: string ("Cyber-Visor", "Razor-Edge", etc.)
   - `price`: number
   - `originalPrice`: number
   - `inStock`: number (automatically decremented on checkout)
   - `splatterLevel`: string ("Catastrophic", "Lethal", etc.)
   - `rating`: number
   - `reviewCount`: number
   - `description`: string
   - `frameMaterial`: string
   - `lensSpecs`: string
   - `dimensions`: `{ lensWidth, bridge, temple, weightGrams }`
   - `features`: array of strings
   - `svgVariant`: string
   - `reviews`: array of review subdocuments (`author`, `rating`, `comment`, `date`, `verifiedGore`)
   - `createdAt`, `updatedAt`: Date

2. **`orders`**:
   - `_id`: ObjectId
   - `orderNumber`: string (e.g. `CRNG-829104`)
   - `customerName`: string
   - `email`: string
   - `shippingAddress`: `{ street, city, state, zip, country }`
   - `bloodPledge`: string
   - `items`: array of `{ productId, name, price, quantity, svgVariant }`
   - `subtotal`: number
   - `shippingFee`: number
   - `discount`: number
   - `promoCode`: string
   - `total`: number
   - `status`: string ("CONFIRMED")
   - `paymentStatus`: string
   - `createdAt`: Date

3. **`inquiries`**:
   - `_id`: ObjectId
   - `name`: string
   - `email`: string
   - `bloodType`: string
   - `frameStyle`: string
   - `tintColor`: string
   - `visionNotes`: string
   - `status`: string
   - `createdAt`: Date

4. **`users`**:
   - `_id`: ObjectId
   - `name`: string (e.g. "Raven Bloodthorn")
   - `email`: string
   - `password`: string (hashed via bcrypt)
   - `bloodType`: string (e.g. "O-Negative", "AB-Positive")
   - `role`: string ("patron")
   - `createdAt`: Date

---

## 📡 REST API Contracts

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service and MongoDB connection status |
| `POST` | `/api/auth/signup` | Register new patron, hashes password, returns JWT |
| `POST` | `/api/auth/signin` | Authenticate patron credentials, returns JWT |
| `GET` | `/api/auth/me` | Fetch authenticated user profile using Bearer JWT |
| `GET` | `/api/sunglasses` | Query sunglasses with filters (`search`, `category`, `splatterLevel`, `sortBy`) |
| `GET` | `/api/sunglasses/:id` | Get single sunglasses details by ID or slug |
| `POST` | `/api/sunglasses` | Create a new sunglasses item in MongoDB |
| `PUT` | `/api/sunglasses/:id` | Update sunglasses properties or stock |
| `DELETE` | `/api/sunglasses/:id` | Delete sunglasses from MongoDB |
| `POST` | `/api/sunglasses/:id/reviews` | Append customer review and recalculate rating |
| `GET` | `/api/orders` | List all orders |
| `GET` | `/api/orders/:id` | Lookup order by Order ID or ObjectId |
| `POST` | `/api/orders` | Place order & decrement inventory in MongoDB |
| `GET` | `/api/inquiries` | List custom bespoke sunglasses requests |
| `POST` | `/api/inquiries` | Submit custom bespoke request |
| `GET` | `/api/stats` | Aggregated metrics for admin telemetry |
| `POST` | `/api/seed` | Re-seed default sunglasses collection |
