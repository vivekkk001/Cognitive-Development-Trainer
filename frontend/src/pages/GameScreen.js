import React, { useState, useEffect } from "react";
import axios from "axios";

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

    useEffect(() => {
        fetchQuestions();
    }, []);

    const fetchQuestions = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/games/questions");
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
                const questionType = questions[questionIndex].type;
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
            const response = await axios.post("http://localhost:5000/api/games/save-session", sessionData);
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
        <div style={styles.container}>
            <h2 style={styles.title}>Game Time! 🎮</h2>
            <img 
                src={questions[questionIndex].image} 
                alt="Game Question" 
                style={styles.questionImage} 
            />

            {/* Render Options */}
            <div style={styles.optionsContainer}>
                {questions[questionIndex].options.map((opt, idx) => {
                    return (
                        <button
                            key={idx}
                            onClick={() => handleOptionClick(opt)}
                            style={{
                                ...styles.optionButton,
                                backgroundColor: emojiToColor[opt] || (opt.includes("http") ? "transparent" : "#f9f9f9"),
                                border: selectedOption === opt ? "4px solid #509b8e" : "2px solid #ccc",
                                boxShadow: selectedOption === opt ? "0 0 10px #509b8e" : "none"
                            }}
                        >
                            {opt.includes("http") ? <img src={opt} alt="Option" style={styles.optionImage} /> : opt}
                        </button>
                    );
                })}
            </div>

            {/* Instructional Video */}
            {showInstructionVideo && instructionVideoSrc && (
                <div style={styles.instructionVideoContainer}>
                    <video autoPlay loop muted style={styles.instructionVideo}>
                        <source src={instructionVideoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}

            {/* Confirm Button */}
            <button 
                onClick={handleConfirm} 
                disabled={selectedOption === null}
                style={styles.confirmButton}
            >
                Confirm ✅
            </button>

            {/* Feedback Video */}
            {showVideo && (
                <div style={styles.feedbackVideoContainer}>
                    <video autoPlay style={styles.feedbackVideo}>
                        <source src={videoSrc} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>
            )}

            {/* Score Popup */}
            {showScorePopup && (
                <div style={styles.scorePopup}>
                    <h2>Game Over! 🎉</h2>
                    <p>Your Score: {score} / {questions.length}</p>
                    <button 
                        onClick={handlePlayAgain}
                        style={styles.playAgainButton}
                    >
                        Play Again 🔄
                    </button>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        textAlign: "center",
        padding: "20px",
        backgroundColor: "#f0f8ff",
        minHeight: "100vh",
        fontFamily: "consolas",
        fontSize: "22px",
    },
    title: {
        fontSize: "40px",
        color: "black",
        marginBottom: "20px",
        fontFamily: "candara",
    },
    questionImage: {
        width: "250px",
        borderRadius: "15px",
        border: "4px solid #509b8e",
        margin: "20px auto",
    },
    optionsContainer: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        margin: "20px 0",
    },
    optionButton: {
        width: "160px",
        height: "160px",
        borderRadius: "15px",
        margin: "10px",
        cursor: "pointer",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "24px",
    },
    optionImage: {
        width: "100%",
        borderRadius: "10px",
    },
    instructionVideoContainer: {
        position: "fixed",
        top: "8%",
        left: "60%",
        margin: "20px auto",
        textAlign: "center",
    },
    instructionVideo: {
        width: "625px",
        borderRadius: "15px",
        border: "4px solid #509b8e",
    },
    confirmButton: {
        padding: "10px 20px",
        backgroundColor: "#509b8e",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "29px",
        cursor: "pointer",
        margin: "20px 0",
        fontFamily: "candara",
    },
    feedbackVideoContainer: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    },
    feedbackVideo: {
        width: "800px",
        borderRadius: "15px",
        border: "4px solid #509b8e",
    },
    scorePopup: {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.3)",
        textAlign: "center",
        fontfamily: "candara",
        width: "500px",
        height: "200px",
    },
    playAgainButton: {
        padding: "10px 20px",
        backgroundColor: "#509b8e",
        color: "white",
        border: "none",
        borderRadius: "10px",
        fontSize: "25px",
        cursor: "pointer",
        fontfamily: "candara",
    },
    loading: {
        textAlign: "center",
        marginTop: "50px",
        fontSize: "24px",
        color: "#509b8e",
    },
};

export default GameScreen;