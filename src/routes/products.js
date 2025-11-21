const express = require("express");
const Product = require("../models/Product.js");

const router = express.Router();

// GET all products or filtered products
router.get("/", async (req, res) => {
  try {
    const { category, subCategory } = req.query;

    let filter = {};

    // If category is provided (Phones / Accessories)
    if (category) {
      filter.category = category;
    }

    // If subCategory is provided (New / Refurbished)
    if (subCategory) {
      filter.subCategory = subCategory;
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
