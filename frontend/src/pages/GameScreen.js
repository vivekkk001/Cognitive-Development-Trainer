import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

// Add Poppins font import
const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
document.head.appendChild(fontLink);

const emojiToColor = {
    "🟥": "red",
    "🟦": "blue",
    "🟩": "green",
    "🟨": "yellow",
    "🟧": "orange",
    "⬛": "black",
    "⬜": "white"
};

const GameScreen = () => {
    const [questions, setQuestions] = useState([]);
    const [questionIndex, setQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showVideo, setShowVideo] = useState(false);
    const [videoSrc, setVideoSrc] = useState("");
    const [showInstructionVideo, setShowInstructionVideo] = useState(false);
    const [instructionVideoSrc, setInstructionVideoSrc] = useState("");
    const [gameResults, setGameResults] = useState([]);
    const [showScorePopup, setShowScorePopup] = useState(false);
    const apiUrl = process.env.BACKEND_URL;
    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/games/questions`);
            const data = await response.json();
            console.log("📥 Data received from API:", data);
            setQuestions(data);
        } catch (error) {
            console.error("❌ Error fetching questions:", error);
        }
    };

    useEffect(() => {
        if (questions.length > 0) {
            if (questionIndex === 0 || questionIndex === 2 || questionIndex === 4) {
                const questionType = questions[questionIndex].type.toLowerCase();
                console.log("Question Type:", questionType);

                if (questionType) {
                    let videoPath = "";
                    switch (questionType) {
                        case "color-matching":
                            videoPath = "/videos/color-instruction.mp4";
                            break;
                        case "shapes":
                            videoPath = "/videos/shape-instruction.mp4";
                            break;
                        case "shadow-matching":
                            videoPath = "/videos/shadow-instruction.mp4";
                            break;
                        default:
                            videoPath = "";
                    }
                    console.log("Instructional Video Path:", videoPath);
                    console.log("▶ Instruction Video Debug:", {
                        index: questionIndex,
                        type: questions[questionIndex]?.type,
                        path: videoPath
                    });

                    setInstructionVideoSrc(videoPath);
                    setShowInstructionVideo(true);
                } else {
                    console.log("Question type is missing. Skipping instructional video.");
                    setShowInstructionVideo(false);
                }
            } else {
                setShowInstructionVideo(false);
            }
        }
    }, [questionIndex, questions]);

    const handleConfirm = () => {
        const isCorrect = selectedOption === questions[questionIndex].answer;

        if (isCorrect) {
            setVideoSrc("/videos/correct.mp4");
            setScore(score + 1);
        } else {
            setVideoSrc("/videos/wrong.mp4");
        }

        const currentGameType = questions[questionIndex].type;
        const gameResult = {
            gameType: currentGameType,
            score: isCorrect ? 1 : 0,
        };
        setGameResults((prevResults) => [...prevResults, gameResult]);

        setShowVideo(true);

        setTimeout(() => {
            setShowVideo(false);

            if (questionIndex < questions.length - 1) {
                setQuestionIndex(questionIndex + 1);
                setSelectedOption(null);
            } else {
                setShowScorePopup(true);
                saveSessionData();
            }
        }, 5000);
    };

    const handlePlayAgain = () => {
        setShowScorePopup(false);
        setQuestionIndex(0);
        setScore(0);
        setSelectedOption(null);
        setGameResults([]);
        fetchQuestions();
    };

    const saveSessionData = async () => {
        const sessionData = {
            score: score,
            gameResults: gameResults,
        };

        try {
            const response = await axios.post(`${apiUrl}/api/games/save-session`, sessionData);
            console.log("Session saved:", response.data);
        } catch (error) {
            console.error("Error saving session:", error);
        }
    };

    const handleOptionClick = (opt) => {
        setSelectedOption(opt);
        setShowInstructionVideo(false);
    };

    if (questions.length === 0) {
        return <h2 style={styles.loading}>Loading...</h2>;
    }

    return (
        <motion.div
            style={styles.container}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <motion.h2
                style={styles.title}
                initial={{ y: -20 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                Game Time! 🎮
            </motion.h2>

            <motion.img
                src={questions[questionIndex].image}
                alt="Game Question"
                style={styles.questionImage}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
            />

            <div style={styles.optionsContainer}>
                {questions[questionIndex].options.map((opt, idx) => (
                    <motion.button
                        key={idx}
                        onClick={() => handleOptionClick(opt)}
                        style={{
                            ...styles.optionButton,
                            backgroundColor: emojiToColor[opt] || (opt.includes("http") ? "transparent" : "#f9f9f9"),
                            border: selectedOption === opt ? "4px solid #3498db" : "none",
                            boxShadow: selectedOption === opt ? "0 0 20px rgba(52, 152, 219, 0.3)" : "0 5px 15px rgba(0,0,0,0.1)"
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {opt.includes("http") ? <img src={opt} alt="Option" style={styles.optionImage} /> : opt}
                    </motion.button>
                ))}
            </div>

            {showInstructionVideo && instructionVideoSrc && (
                <motion.div
                    style={styles.instructionVideoContainer}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <video autoPlay loop muted style={styles.instructionVideo}>
                        <source src={instructionVideoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </motion.div>
            )}

            <motion.button
                onClick={handleConfirm}
                disabled={selectedOption === null}
                style={styles.confirmButton}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                Confirm ✅
            </motion.button>

            {showVideo && (
                <motion.div
                    style={styles.feedbackVideoContainer}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <video autoPlay style={styles.feedbackVideo}>
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </motion.div>
            )}

            {showScorePopup && (
                <motion.div
                    style={styles.scorePopup}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2>Game Over! 🎉</h2>
                    <p>Your Score: {score} / {questions.length}</p>
                    <motion.button
                        onClick={handlePlayAgain}
                        style={styles.playAgainButton}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Play Again 🔄
                    </motion.button>
                </motion.div>
            )}
        </motion.div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        padding: "20px",
        background: "linear-gradient(135deg, #f6f9fc 0%, #eef2f7 100%)",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
        fontSize: "22px",
        position: "relative",
        overflow: "hidden",
    },
    title: {
        fontSize: "48px",
        background: "linear-gradient(45deg, #2c3e50, #3498db)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "30px",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: "700",
        textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
    },
    questionImage: {
        width: "300px",
        borderRadius: "20px",
        border: "none",
        margin: "20px auto",
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        transition: "transform 0.3s ease",
        "&:hover": {
            transform: "scale(1.02)",
        },
    },
    optionsContainer: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        margin: "30px 0",
        gap: "20px",
    },
    optionButton: {
        width: "180px",
        height: "180px",
        borderRadius: "20px",
        margin: "10px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "28px",
        transition: "all 0.3s ease",
        border: "none",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        "&:hover": {
            transform: "translateY(-5px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
    },
    optionImage: {
        width: "100%",
        borderRadius: "15px",
        transition: "transform 0.3s ease",
    },
    instructionVideoContainer: {
        position: "fixed",
        top: "8%",
        left: "60%",
        margin: "20px auto",
        textAlign: "center",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
    },
    instructionVideo: {
        width: "625px",
        borderRadius: "20px",
        border: "none",
    },
    confirmButton: {
        padding: "15px 40px",
        background: "linear-gradient(45deg, #3498db, #2c3e50)",
        color: "white",
        border: "none",
        borderRadius: "15px",
        fontSize: "24px",
        cursor: "pointer",
        margin: "30px 0",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: "600",
        transition: "all 0.3s ease",
        boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
        "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
        },
        "&:disabled": {
            background: "linear-gradient(45deg, #bdc3c7, #95a5a6)",
            cursor: "not-allowed",
            transform: "none",
            boxShadow: "none",
        },
    },
    feedbackVideoContainer: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    },
    feedbackVideo: {
        width: "800px",
        borderRadius: "20px",
        border: "none",
    },
    scorePopup: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        padding: "40px",
        borderRadius: "25px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
        width: "500px",
        height: "auto",
        minHeight: "300px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "20px",
        "& h2": {
            fontSize: "36px",
            background: "linear-gradient(45deg, #2c3e50, #3498db)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            margin: "0",
        },
        "& p": {
            fontSize: "24px",
            color: "#2c3e50",
            margin: "10px 0",
        },
    },
    playAgainButton: {
        padding: "15px 40px",
        background: "linear-gradient(45deg, #3498db, #2c3e50)",
        color: "white",
        border: "none",
        borderRadius: "15px",
        fontSize: "22px",
        cursor: "pointer",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: "600",
        transition: "all 0.3s ease",
        boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
        "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
        },
    },
    loading: {
        textAlign: "center",
        marginTop: "50px",
        fontSize: "28px",
        background: "linear-gradient(45deg, #3498db, #2c3e50)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        fontFamily: "'Poppins', sans-serif",
        fontWeight: "600",
    },
};

export default GameScreen;