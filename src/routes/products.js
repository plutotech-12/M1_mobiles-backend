const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

const {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getReviews
} = require("../controllers/productController");

// If you already have upload middleware, keep the existing product routes
router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", upload.array("images", 10), addProduct);
router.put("/:id", upload.array("images", 10), updateProduct);
router.delete("/:id", deleteProduct);

// Reviews
router.post("/:id/reviews", addReview);
router.get("/:id/reviews", getReviews);

module.exports = router;
