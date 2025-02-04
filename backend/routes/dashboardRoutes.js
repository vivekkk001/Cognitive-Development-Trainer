const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

// ✅ Route to fetch 3-day dashboard stats
router.get("/", async (req, res) => {
  try {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Fetch sessions from last 3 days
    const sessions = await Session.find({ date: { $gte: threeDaysAgo } });

    const totalSessions = sessions.length;

    // Calculate total score across all sessions
    const totalScore = sessions.reduce((sum, session) => sum + session.score, 0);

    // Calculate overall average score
    const overallAvg = totalSessions > 0 ? totalScore / totalSessions : 0;

    // Calculate per-game-type averages
    const gameScores = {};
    sessions.forEach((session) => {
      session.gameResults.forEach((game) => {
        if (!gameScores[game.gameType]) {
          gameScores[game.gameType] = { total: 0, count: 0 };
        }
        gameScores[game.gameType].total += game.score;
        gameScores[game.gameType].count += 1;
      });
    });

    // Convert to final average per game type
    const gameAverages = {};
    Object.keys(gameScores).forEach((gameType) => {
      gameAverages[gameType] = gameScores[gameType].total / totalSessions; // Divide by total sessions
    });

    res.json({
      totalSessions,
      overallAvg,
      gameAverages,
      sessions: sessions.map((session) => ({
        date: session.date,
        score: session.score,
      })),
    });
  } catch (err) {
    console.error("❌ Error fetching dashboard data:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;