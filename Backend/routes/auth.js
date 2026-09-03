
require("dotenv").config();
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/User");
// require("dotenv").config();

const SECRET = process.env.JWT_SECRET
// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // check user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("📩 BODY:", req.body);

    const { email, password } = req.body;

    // 🔍 Find user
    const user = await User.findOne({ email });
    console.log("👤 USER FOUND:", user ? user.email : "NOT FOUND");

    if (!user) {
      console.log("❌ ERROR: User not found");
      return res.status(400).json({ message: "User not found" });
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔑 PASSWORD MATCH:", isMatch);

    if (!isMatch) {
      console.log("❌ ERROR: Invalid password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // 🧠 Log secret used
    console.log("🔐 JWT SECRET (login):", SECRET);

    // 🎟️ Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "1d",
});
jwt.verify(token, process.env.JWT_SECRET);

console.log("🎟️ TOKEN CREATED:", token);

const decodedNow = jwt.verify(token, SECRET);
console.log("✅ VERIFIED IMMEDIATELY AFTER LOGIN:", decodedNow);
    // 📤 Send response
    res.json({ token, user });

  } catch (err) {
    console.log("🔥 LOGIN ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;