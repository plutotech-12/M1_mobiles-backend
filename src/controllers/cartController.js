const User = require("../models/User");
const Product = require("../models/Product");

// Get user's cart
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");
    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user.id);

    const existing = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();

    res.json({ message: "Added to cart", cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update quantity
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user.id);

    const item = user.cart.find(
      (x) => x.productId.toString() === productId
    );

    if (item) item.quantity = quantity;

    await user.save();

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove item
exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user.id);

    user.cart = user.cart.filter(
      (x) => x.productId.toString() !== productId
    );

    await user.save();

    res.json(user.cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
