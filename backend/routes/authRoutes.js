const express = require("express");
const Parent = require("../models/Parent"); // Use Parent model
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// REGISTER a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userExists = await Parent.findOne({ username });
    if (userExists) return res.status(400).json({ message: "Username already taken" });

    const user = await Parent.create({ username, password });
    
    res.status(201).json({
      message: "User registered successfully",
      userId: user._id,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// LOGIN user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Parent.findOne({ username });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.json({
      _id: user._id,
      username: user.username,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
