const express = require("express");
const router = express.Router();

// ⭐ IMPORT THE PROPER MIDDLEWARE
const { protect } = require("../middleware/auth");

// ⭐ IMPORT CART CONTROLLER
const {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

// ⭐ ROUTES
router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/", protect, updateCartItem);
router.delete("/", protect, removeCartItem);

module.exports = router;
