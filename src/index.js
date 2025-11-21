const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db.js");

const productRoutes = require("./routes/products.js");
const authRoutes = require("./routes/auth.js");   // ✅ ADD THIS

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ROUTES
app.use("/products", productRoutes);
app.use("/auth", authRoutes);   // ✅ VERY IMPORTANT

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
