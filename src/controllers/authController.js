const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // check existing user
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });


    res.status(201).json({ message: "User registered", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);  // 👈 ADD THIS
    const { email, password } = req.body;
    console.log("EMAIL:", email, "PASSWORD:", password); // 👈 ADD THIS

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login success", token, user });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
