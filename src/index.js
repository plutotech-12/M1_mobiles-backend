// ⭐ LOAD .env FIRST
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// =========================
// MIDDLEWARE
// =========================
app.use(
  cors({
    origin: "https://m1-mobiles-frontend-inlhec7r4-yasars-projects-a4b7c84c.vercel.app", // frontend URL
    credentials: true,
  })
);

app.use(express.json());

// =========================
// DATABASE
// =========================
connectDB();

// =========================
// ROUTES
// =========================
const productRoutes = require("./routes/products");
const authRoutes = require("./routes/auth");
const cartRoutes = require("./routes/cart");
const adminRoutes = require("./routes/admin");

// IMPORTANT: use /api prefix
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/admin", adminRoutes);

// =========================
// HEALTH CHECK (VERY IMPORTANT)
// =========================
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", backend: "running" });
});

// =========================
// SERVER
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
