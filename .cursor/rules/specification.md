# PWA Math Game - Requirements & Specifications

## 1. Functional Requirements

### Game Overview

- **Type:** Multiple-choice math game for kids (ages 5-15)
- **Math Topics:** Basic arithmetic (addition, subtraction, multiplication, division)
- **Game Mode:**
  - Display a question with four answer choices
  - Player selects an answer and gets immediate feedback (correct/wrong)
  - Score is based on accuracy and speed
  - Timer (optional) to encourage faster responses
- **Level Progression:**
  - Infinite levels, each containing 20 questions.
  - Unlock new levels by achieving high accuracy and speed.
  - Difficulty, variety, and complexity increase progressively.

### Screens

1. **Home Screen** - Start game, view progress
2. **Game Screen** - Display questions and answer choices
3. **Level-Up Screen** - Show progress and unlock the next level
4. **Progress Screen** - View accuracy, speed stats, and rewards
5. **Settings Screen (Optional)** - Reset progress, toggle sound

### Additional Features

- **Offline Support:** Works fully offline
- **Data Storage:** Player progress is stored locally on the device
- **Mobile-First:** Optimized for smartphones with a simple, touch-friendly UI

---

## 2. Screen Elements & Functions

### **1. Home Screen**

- **Game Title/Header:** Displays the name of the game.
- **Play Button:** Starts a new session of 20 questions.
- **View Progress Button:** Navigates to the progress screen.
- **Settings Button (Optional):** Allows users to reset progress or toggle sound.

### **2. Game Screen**

- **Question Display:** Shows the current math question.
- **Answer Choices (4 buttons):** Each button presents a multiple-choice answer.
  - Clicking an answer provides immediate feedback (correct/wrong).
- **Timer (Optional):** Displays time remaining per question.
- **Score Display:** Shows the current score based on accuracy and speed.
- **Next Question Button (Auto/Manual):** Moves to the next question.

### **3. Level-Up Screen**

- **Congratulatory Message:** Encourages the player for completing the session.
- **Stars (Rewards):** Displays earned stars based on performance.
- **Next Level Button:** Proceeds to the next session with higher difficulty.
- **Retry Button:** Allows replaying the session if performance was low.

### **4. Progress Screen**

- **Completed Levels List:** Shows past session scores and stars earned.
- **Accuracy Stats:** Displays the player’s correct answer percentage.
- **Speed Stats:** Shows the average response time per question.
- **Weak Area Highlight:** Indicates areas that need improvement.

### **5. Settings Screen (Optional)**

- **Reset Progress Button:** Clears all stored game data.
- **Sound Toggle:** Enables or disables sound effects.
- **Back Button:** Returns to the home screen.

---

## 3. Technical Requirements

### Technology Stack

- **Framework:** Next.js (no external libraries)
- **Styling:** Tailwind CSS for all UI elements
- **Routing:** Next.js pages (`/`, `/game`, `/level-up`, `/progress`, `/settings`)
- **State Management:** Use React state and LocalStorage/IndexedDB for storing progress
- **Performance:**
  - Optimize for fast loading and minimal re-renders
  - Use static export (`next export`) for full offline support
- **Accessibility:** Ensure readable text, large tappable buttons, and good color contrast
- **Modular Codebase:**
  - Game logic should be driven by a config file.
  - Use `.env` for environment-specific settings.
- **Libraries:**
  - Use `react-icons` for icons.
- **Code Structure:**
  - Store all constants in a config file.
  - Read config values from `process.env.var_name`.
  - Ensure all functions are unit testable.
  - Keep the code modular and simple.

---

## 4. Game Logic Rules

### Question Generation

- **Start Simple:** Begin with single-digit addition and subtraction.
- **Adaptive Difficulty:**
  - Increase difficulty if the player answers correctly multiple times in a row.
  - Reduce difficulty if the player struggles with multiple incorrect answers.
- **Question Variety:** Ensure questions are not repeated frequently.
- **Session Structure:** Each game session contains exactly 20 questions.

### Player Performance Tracking

- **Accuracy Rate:** Track the percentage of correct answers.
- **Speed Measurement:** Store response time for each question.
- **Progress Analysis:** Identify weak areas (e.g., struggling with multiplication) and generate more questions in those categories.

### Level Progression

- **Infinite Levels:** The game never ends; players keep progressing to higher difficulty levels.
- **Unlock Criteria:**
  - Achieve an accuracy of at least 80% in the current level.
  - Maintain an average response time under a set limit.
  - Answer at least 10 questions correctly in the current session.

### Reward System

- **Scoring Criteria:** Points awarded based on:
  - **Accuracy:** More points for correct answers.
  - **Speed:** Bonus points for fast responses.
  - **Variety:** More points for answering different types of problems.
  - **Complexity:** More challenging questions give higher points.
- **Session Rewards:** At the end of every 20-question session:
  - Players receive a **score** based on their performance.
  - Players earn **stars** as a reward for achievements.
  - Positive reinforcement messages encourage continued play.

---

## 5. Unit Testing Specifications

### **Game Logic**

- Ensure questions are generated correctly.
- Verify difficulty adapts based on player performance.
- Test scoring system (accuracy, speed, variety, complexity).
- Test

### **State Management**

- Verify local storage persistence for player progress.
- Ensure game session resumes correctly after closing/reopening.

### **UI Components**

- Test button clicks and navigation.
- Validate animations (e.g., correct answer glow, level-up pop-ups).
- Ensure answer selection provides immediate feedback (correct/wrong).

---

## 6. Motivation Behind the Game

Mathematics is a fundamental skill that shapes a child's problem-solving ability, logical thinking, and confidence. Many children struggle with math due to fear or a lack of engaging ways to practice. This game aims to remove that fear by making math fun, interactive, and rewarding.

The goal is to create a simple yet effective learning tool where kids can enjoy solving problems without pressure. By using immediate feedback, gamification, and adaptive learning, the game keeps players motivated while reinforcing basic arithmetic skills. The design ensures that kids stay engaged through positive reinforcement, leveling up, and personalized difficulty adjustments.

This game is not just about solving math problems—it’s about building confidence, encouraging curiosity, and making learning enjoyable for every child, regardless of their skill level.
