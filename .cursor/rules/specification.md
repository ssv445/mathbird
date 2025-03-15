# PWA Math Game - Requirements & Specifications

## 1. Functional Requirements

### Game Overview

- **Type:** Multiple-choice math game for kids (ages 5-15)
- **Math Topics:** Basic arithmetic (addition, subtraction, multiplication, division)
- **Game Mode:**
  - Display a question with four answer choices
  - Player taps an answer, gets instant feedback, and moves to the next question
  - Score is based on accuracy and speed
  - Simple progress bar shows how many questions are left in the session

### Level Progression

- **Infinite levels**, each containing **20 questions**
- **Gradual difficulty increase:**
  - Start with basic single-digit addition/subtraction
  - Progress to harder problems based on accuracy
  - If struggling, repeat similar questions instead of increasing difficulty
- **No Level Selection:** Auto-unlock new difficulty levels

### Screens

1. **Home Screen** - Start game, view progress
2. **Game Screen** - Display questions and answer choices
3. **Level-Up Screen** - Show progress and unlock the next level
4. **Progress Screen** - View accuracy, speed stats, and rewards
5. **Settings Screen (Optional)** - Reset progress, toggle sound

### Additional Features

- **Offline Support:** Works fully offline
- **Data Storage:** Player progress is stored locally on the device
- **Mobile-First:** Optimized for touch-friendly play

---

## 2. Screen Elements & Functions

### **1. Home Screen**

- **Game Title/Header:** Displays the name of the game.
- **Play Button:** Starts a new session of 20 questions.
- **View Progress Button:** Navigates to the progress screen.
- **Settings Button (Optional):** Allows users to reset progress or toggle sound.

### **2. Game Screen**

- **Question Display:** Shows the current math question.
- **Answer Choices (4 large buttons):** Each button presents a multiple-choice answer.
  - Clicking an answer provides **instant feedback (correct/wrong)**.
  - **Correct Answer Feedback:** Confetti, stars, or happy face animation.
  - **Wrong Answer Feedback:** Gentle shake or small bounce with _"Try Again!"_ message.
- **Progress Bar:** Shows how many questions remain.
- **Auto-Next Question:** Moves automatically after selecting an answer.

### **3. Level-Up Screen**

- **Congratulatory Message:** Encourages the player after completing the session.
- **Stars (Rewards):**
  - 3 stars for **90%+ accuracy**
  - 2 stars for **70-89% accuracy**
  - 1 star for **below 70% accuracy**
- **Next Level Button:** Proceeds to the next session.
- **Retry Button:** Allows replaying the session without penalty.

### **4. Progress Screen**

- **Completed Levels List:** Shows past session scores and stars earned.
- **Accuracy Stats:** Displays the player’s correct answer percentage.
- **Speed Stats:** Shows the average response time per question.

### **5. Settings Screen (Optional)**

- **Reset Progress Button:** Clears all stored game data.
- **Sound Toggle:** Enables or disables sound effects.
- **Back Button:** Returns to the home screen.

---

## 3. Technical Requirements

### Technology Stack

- **Framework:** Next.js 15 with App Router
- **Styling:** Tailwind CSS for all UI elements
- **Routing:** Next.js App Router (`/`, `/game`, `/level-up`, `/progress`, `/settings`)
- **State Management:** Use React state and LocalStorage for storing progress
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
  - Keep the code modular and simple.

---

## 4. Simplified Game Logic Rules

### Question Generation

- **Start Easy:** Simple single-digit addition and subtraction.
- **Adaptive Difficulty:**
  - If accuracy **≥ 80%**, increase difficulty.
  - If accuracy **< 50%**, keep difficulty the same.
- **Randomized Questions:** Prevent repetition.
- **Fixed Session Size:** Each session has **20 questions**.

### Reward System

- **Stars & Encouragement:**
  - **3 stars:** 90%+ accuracy.
  - **2 stars:** 70-89% accuracy.
  - **1 star:** Below 70% accuracy.
- **Positive Reinforcement:** Confetti, happy faces, and motivational messages.
- **No Game Over:** Kids can always retry without penalty.

### Data Storage and Offline Play

- **Local Storage:** Save game progress, accuracy stats, and question history on the device.
- **Session Continuity:** Resume from the last played level automatically when reopening the game.

---

## 5. Manual Testing Scenarios

Instead of automated unit tests, junior testers should manually verify the following **20 test scenarios**:

### **Core Gameplay**

1. Start a new game and answer all 20 questions.
2. Verify correct answer feedback (animation, score increase).
3. Verify incorrect answer feedback (shake, encouragement message).
4. Ensure the next question loads automatically after selecting an answer.
5. Confirm the game progresses to the level-up screen after 20 questions.
6. Verify that earned stars reflect performance correctly.

### **Progress & Data Handling**

7. Check that accuracy and speed stats update correctly.
8. Restart the game and confirm past progress is saved.
9. Close and reopen the game to ensure progress persists.
10. Reset progress and confirm all stored data is cleared.

### **User Interface & Experience**

11. Ensure all buttons are tappable and responsive.
12. Verify that text and numbers are easy to read.
13. Check if the game works smoothly in both portrait and landscape mode.
14. Test different screen sizes to ensure UI responsiveness.

### **Performance & Edge Cases**

15. Answer rapidly to check if the game handles quick taps properly.
16. Simulate slow responses to verify if the game allows completion at any pace.
17. Test offline mode—confirm that the game works without internet access.
18. Fill local storage and see if the game still functions correctly.
19. Simulate a phone call interruption and confirm the game resumes correctly.
20. Try refreshing the page mid-session and verify progress is maintained.

---

## 6. Motivation Behind the Game

Mathematics is a fundamental skill that shapes a child's problem-solving ability, logical thinking, and confidence. Many children struggle with math due to fear or a lack of engaging ways to practice. This game aims to remove that fear by making math fun, interactive, and rewarding.

The goal is to create a simple yet effective learning tool where kids can enjoy solving problems without pressure. By using immediate feedback, gamification, and adaptive learning, the game keeps players motivated while reinforcing basic arithmetic skills. The design ensures that kids stay engaged through positive reinforcement, leveling up, and personalized difficulty adjustments.

This game is not just about solving math problems—it’s about building confidence, encouraging curiosity, and making learning enjoyable for every child, regardless of their skill level.
