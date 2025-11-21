const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  image: String,

  // TOP CATEGORY: "Phones" or "Accessories"
  category: {
    type: String,
    required: true,
    enum: ["Phones", "Accessories"],
  },

  // SUB CATEGORY: only for Phones
  subCategory: {
    type: String,
    enum: ["New", "Refurbished", null],
    default: null,
  },

  stock: Number,
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
