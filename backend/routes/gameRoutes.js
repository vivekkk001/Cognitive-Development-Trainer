const express = require("express");
const router = express.Router();
const Session = require("../models/Session"); // Import Session model
const BASE_URL = "http://localhost:5000";

// ✅ Use placeholder images if assets are missing
const placeholderImage = "https://via.placeholder.com/150";

// Pool of questions per type
const questionPool = {
    "color-matching": [
        { 
            image: `${BASE_URL}/assets/apple.png`, 
            options: ["🟥", "🟦", "🟩"], 
            answer: "🟥", 
            type: "Color-Matching" // Added type field
        },
        { 
            image: `${BASE_URL}/assets/car.png`, 
            options: ["🟦", "🟥", "🟩"], 
            answer: "🟦", 
            type: "Color-Matching" // Added type field
        },
        { 
            image: `${BASE_URL}/assets/tree.png`, 
            options: ["🟩", "🟥", "🟦"], 
            answer: "🟩", 
            type: "Color-Matching" // Added type field
        }
    ],
    "shapes": [
        { 
            image: `${BASE_URL}/assets/triangle-outline.png`, 
            options: [`${BASE_URL}/assets/circle.png`, `${BASE_URL}/assets/triangle.png`, `${BASE_URL}/assets/square.png`], 
            answer: `${BASE_URL}/assets/triangle.png`, 
            type: "Shapes" // Added type field
        },
        { 
            image: `${BASE_URL}/assets/circle-outline.png`, 
            options: [`${BASE_URL}/assets/circle.png`, `${BASE_URL}/assets/triangle.png`, `${BASE_URL}/assets/square.png`], 
            answer: `${BASE_URL}/assets/circle.png`, 
            type: "Shapes" // Added type field
        },
        { 
            image: `${BASE_URL}/assets/square-outline.png`, 
            options: [`${BASE_URL}/assets/circle.png`, `${BASE_URL}/assets/triangle.png`, `${BASE_URL}/assets/square.png`], 
            answer: `${BASE_URL}/assets/square.png`, 
            type: "Shapes" // Added type field
        }
    ],
    "shadow-matching": [
        {
            image: `${BASE_URL}/assets/chair.png`,
            options: [
                `${BASE_URL}/assets/chair-shadow.png`,
                `${BASE_URL}/assets/table-shadow.png`,
                `${BASE_URL}/assets/airplane-shadow.png`
            ],
            answer: `${BASE_URL}/assets/chair-shadow.png`,
            type: "Shadow-Matching" // Added type field
        },
        {
            image: `${BASE_URL}/assets/airplane.png`,
            options: [
                `${BASE_URL}/assets/table-shadow.png`,
                `${BASE_URL}/assets/airplane-shadow.png`,
                `${BASE_URL}/assets/chair-shadow.png`
            ],
            answer: `${BASE_URL}/assets/airplane-shadow.png`,
            type: "Shadow-Matching" // Added type field
        },
        {
            image: `${BASE_URL}/assets/table.png`,
            options: [
                `${BASE_URL}/assets/table-shadow.png`,
                `${BASE_URL}/assets/airplane-shadow.png`,
                `${BASE_URL}/assets/chair-shadow.png`
            ],
            answer: `${BASE_URL}/assets/table-shadow.png`,
            type: "Shadow-Matching" // Added type field
        }
    ]
};

// ✅ Route to return random questions with placeholder fallback
router.get("/questions", (req, res) => {
    const selectedQuestions = [];
    Object.keys(questionPool).forEach((gameType) => {
        const shuffled = questionPool[gameType].sort(() => 0.5 - Math.random());
        shuffled.slice(0, 2).forEach(q => {
            const question = {
                ...q,
                image: q.image || `${BASE_URL}/assets/placeholder.png`, // Fallback if image is missing
                options: q.options.map(opt => opt.includes("assets") ? opt : opt) // Ensure images and emojis are kept
            };
            selectedQuestions.push(question);
        });
    });
    console.log("✅ Questions Sent to Frontend:", JSON.stringify(selectedQuestions, null, 2)); // Debugging log
    res.json(selectedQuestions);
});

router.post("/save-session", async (req, res) => {
    const { score, gameResults } = req.body;
  
    console.log("Received session data:", { score, gameResults }); // Debugging log
  
    try {
      const session = new Session({
        score: score,
        gameResults: gameResults,
      });
  
      await session.save();
      console.log("Session saved to database:", session); // Debugging log
      res.json({ message: "Session saved successfully", session });
    } catch (error) {
      console.error("Error saving session:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
module.exports = router;
