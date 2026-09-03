const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../model/User");
require("dotenv").config();

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
    console.log("BODY:", req.body); // 👈 ADD THIS

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("USER:", user); // 👈 ADD THIS

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("MATCH:", isMatch); // 👈 ADD THIS

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, SECRET, {
      expiresIn: "1d",
    });

    res.json({ token, user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;