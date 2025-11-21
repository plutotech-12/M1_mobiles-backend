const Product = require("../models/Product");

// Add product
exports.addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ message: "Product added", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: String(err.message) });
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: "Product updated", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
