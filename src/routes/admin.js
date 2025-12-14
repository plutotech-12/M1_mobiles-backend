const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middleware/auth");

const Product = require("../models/Product");
const User = require("../models/User");

router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments();

    res.json({
      totalProducts,
      totalUsers,
    });
  } catch (err) {
    console.error("ADMIN STATS ERROR:", err);
    res.status(500).json({ message: "Failed to load admin stats" });
  }
});

module.exports = router;
