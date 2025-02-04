const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now }, // Auto timestamp
    score: { type: Number, required: true }, // Total score out of 6
    gameResults: [
        {
            gameType: { type: String }, // e.g., "color-matching", "shapes", "shadow-matching"
            score: { type: Number } // Score per game type (1 for correct, 0 for incorrect)
        }
    ]
});

module.exports = mongoose.model("Session", SessionSchema);