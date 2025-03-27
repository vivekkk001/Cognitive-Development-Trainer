# Cognitive Development Trainer – A Full-Stack MERN Application

## 📌 About
Cognitive Development Trainer is an interactive web application designed to enhance cognitive skills in children with developmental challenges through engaging coordination games. The project was originally developed for a 12-year-old with Down syndrome, aiming to provide a structured and skill-enhancing alternative to passive screen time, such as social media scrolling.

This application leverages the MERN (MongoDB, Express.js, React.js, Node.js) stack to deliver an intuitive, research-backed training experience. It focuses on improving pattern recognition, memory, and problem-solving skills through interactive gameplay, while offering parents a dedicated dashboard to track their child's progress.

## 🛠️ Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **File Storage:** Local server hosting for tutorial & feedback videos

## 🚀 Features

### 🎮 Game Types
- **🎨 Color Matching:** Select the correct color from multiple choices.
- **🔷 Shape Matching:** Identify and choose the correct shape.
- **🕵️ Shadow Matching:** Drag and drop the correct shadow to its corresponding shape.

### 🎥 Guided Learning
- **Tutorial Videos:** Auto-play on key questions (Q1, Q3, and Q5) to guide the child before answering.
- **Visual Feedback:** Correct/wrong response animations replace traditional text-based feedback.
- **Drag & Drop Mechanics:** Enhances engagement and motor skill coordination.

### 📊 Parental Dashboard
- **3-day Rolling Average Performance Tracking**
- **Game-Type-Specific Insights**
- **Total Sessions Played for Engagement Monitoring**
- **Secure Login for Parental Access**

## ⚙️ How It Works
1. **Game Selection & Tutorial**  
   - The child selects a game and answers questions. 
   - Tutorial videos loop on Q1, Q3, and Q5 for guidance.
   - Videos disappear upon selection to minimize distractions.

2. **Answer Submission & Feedback**  
   - The child submits a response.
   - A short animation/video plays to indicate correctness before proceeding.

3. **Session Completion & Data Logging**  
   - Each session consists of six questions (two per game type).
   - Performance data is recorded and reflected in the parental dashboard.

4. **Parental Dashboard Access**  
   - Parents log in securely.
   - They can track their child's progress without revealing answers, ensuring natural learning.
