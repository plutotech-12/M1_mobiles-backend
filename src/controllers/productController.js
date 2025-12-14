const Product = require("../models/Product");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");


// =========================
// GET USER CART
// =========================
exports.getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.productId");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.cart);
  } catch (err) {
    console.error("GET CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// =========================
// ADD TO CART
// =========================
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const existing = user.cart.find(
      (item) => item.productId.toString() === productId
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      user.cart.push({ productId, quantity });
    }

    await user.save();
    const updatedUser = await User.findById(req.user.id).populate("cart.productId");

    res.json(updatedUser.cart);
  } catch (err) {
    console.error("ADD TO CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// =========================
// UPDATE CART QUANTITY
// =========================
exports.updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const item = user.cart.find((i) => i.productId.toString() === productId);

    if (!item) return res.status(404).json({ message: "Item not found" });

    item.quantity = quantity;

    await user.save();
    const updated = await User.findById(req.user.id).populate("cart.productId");

    res.json(updated.cart);
  } catch (err) {
    console.error("UPDATE CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// =========================
// REMOVE ITEM FROM CART
// =========================
exports.removeCartItem = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(
      (item) => item.productId.toString() !== productId
    );

    await user.save();
    const updated = await User.findById(req.user.id).populate("cart.productId");

    res.json(updated.cart);
  } catch (err) {
    console.error("REMOVE CART ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// =========================
// CLOUDINARY UPLOAD (HIGH QUALITY)
// =========================
async function uploadToCloudinary(fileBuffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "products",
        quality: "100",           // 🔥 prevent compression (fixes blurry images)
        fetch_format: "auto",
        secure: true
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
}



// =========================
// CREATE PRODUCT
// =========================
exports.addProduct = async (req, res) => {
  try {
    let imageUrls = [];

    if (req.files?.length > 0) {
      for (let file of req.files) {
        const uploaded = await uploadToCloudinary(file.buffer);
        imageUrls.push(uploaded.secure_url);
      }
    }

    const newProduct = await Product.create({
      ...req.body,
      image: imageUrls
    });

    res.status(201).json({ message: "Product added", product: newProduct });

  } catch (err) {
    console.error("UPLOAD ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



// =========================
// GET ALL PRODUCTS (WITH FILTERS)
// =========================
exports.getProducts = async (req, res) => {
  try {
    const { category, subCategory, type, limit } = req.query;

    const filter = {};

    if (category) {
      filter.category = category;
    }

    // Phones / Tablets / Accessories
    if (subCategory) {
      filter.subCategory = new RegExp(`^${subCategory}$`, "i");
    }

    // Home Appliances
    if (type) {
      filter.type = new RegExp(`^${type}$`, "i");
    }

    let query = Product.find(filter).sort({ createdAt: -1 });

    if (limit) {
      query = query.limit(Number(limit));
    }

    const products = await query.exec();
    res.json(products);

  } catch (err) {
    console.error("GET PRODUCTS ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};





// =========================
// GET SINGLE PRODUCT
// =========================
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// =========================
// ADD REVIEW
// =========================
exports.addReview = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, rating, comment } = req.body;

    if (!name || !rating)
      return res.status(400).json({ message: "Name and rating are required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newReview = {
      name,
      rating: Number(rating),
      comment: comment || ""
    };

    product.reviews.unshift(newReview);
    product.ratingsCount = product.reviews.length;
    product.ratingsAverage =
      product.reviews.reduce((sum, r) => sum + r.rating, 0) /
      (product.reviews.length || 1);

    await product.save();

    res.status(201).json({
      message: "Review added",
      review: newReview,
      product
    });
  } catch (err) {
    console.error("REVIEW ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



// =========================
// GET REVIEWS ONLY
// =========================
exports.getReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select(
      "reviews ratingsAverage ratingsCount"
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({
      reviews: product.reviews,
      ratingsAverage: product.ratingsAverage,
      ratingsCount: product.ratingsCount
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// =========================
// UPDATE PRODUCT
// =========================
exports.updateProduct = async (req, res) => {
  try {
    // ---------- helper ----------
    const parseNumber = (val) => {
      if (
        val === undefined ||
        val === null ||
        val === "" ||
        val === "null"
      ) {
        return undefined; // IMPORTANT: do not send to mongoose
      }
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    };

    // ---------- existing images ----------
    let existingImages = [];
    if (req.body.existingImages) {
      existingImages = Array.isArray(req.body.existingImages)
        ? req.body.existingImages
        : [req.body.existingImages];
    }

    // ---------- new uploads ----------
    const newImages = [];
    if (req.files?.length > 0) {
      for (let file of req.files) {
        const uploaded = await uploadToCloudinary(file.buffer);
        newImages.push(uploaded.secure_url);
      }
    }

    const finalImages = [...existingImages, ...newImages];

    // ---------- SAFE UPDATE OBJECT ----------
    const update = {
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      subCategory: req.body.subCategory,
      description: req.body.description,
      image: finalImages,
      price: parseNumber(req.body.price),
      original_price: parseNumber(req.body.original_price),
      stock: parseNumber(req.body.stock),
    };

    // ---------- remove undefined fields ----------
    Object.keys(update).forEach(
      (key) => update[key] === undefined && delete update[key]
    );

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );

    res.json({ message: "Product updated", product: updatedProduct });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};




// =========================
// DELETE PRODUCT
// =========================
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
