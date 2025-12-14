const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const productSchema = new mongoose.Schema(
  {
    name: String,
    brand: { type: String, default: "" },
    price: Number,
    original_price: { type: Number, default: 0 },
    description: String,
    image: [String],

    // ratings / reviews
    reviews: { type: [reviewSchema], default: [] },
    ratingsAverage: { type: Number, default: 0 },
    ratingsCount: { type: Number, default: 0 },

    category: {
      type: String,
      required: true,
      enum: ["Phones", "Tablets", "Accessories", "Home Appliances"],
    },

    type: {
      type: String, // Smart TV, AC, Speaker, Induction and Cookware.
      default: ""
    },

    subCategory: {
      type: String,
      enum: ["New", "Like New", "Demo-OpenBox", "Refurbished", "", null],
      default: null,
    },


    stock: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
