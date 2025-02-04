const express = require("express");
const router = express.Router();
const Session = require("../models/Session"); // Import session model

// ✅ Route to save a game session
router.post("/", async (req, res) => {
  try {
    const { score, gameResults } = req.body;
    const session = new Session({ score, gameResults, date: new Date() });
    await session.save();
    res.json({ message: "Session saved!", session });
  } catch (err) {
    console.error("❌ Error saving session:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Route to get all sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find();
    res.json(sessions);
  } catch (err) {
    console.error("❌ Error fetching sessions:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
