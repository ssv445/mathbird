## Game Logic Rules

- **Start Simple:** Begin with single-digit addition and subtraction.
- **Adaptive Difficulty:**
  - Increase difficulty if the player answers correctly multiple times in a row.
  - Reduce difficulty if the player struggles with multiple incorrect answers.
- **Question Variety:** Ensure questions are not repeated frequently.
- **Session Structure:** Each game session contains exactly 5 questions.

### Player Performance Tracking

- **Accuracy Rate:** Track the percentage of correct answers.
- **Speed Measurement:** Store response time for each question.
- **Progress Analysis:** Identify weak areas (e.g., struggling with multiplication) and generate more questions in those categories.

### Level Progression

- **Infinite Levels:** The game never ends; players keep progressing to higher difficulty levels.
- **Unlock Criteria:**
  - Achieve an accuracy of at least 60% in the current level.
  - Maintain an average response time under 60 seconds a set limit. It reduced by
  - Answer at least 10 questions correctly in the current session.
- **Penalty for Mistakes:** If accuracy drops below 40% in a level, reintroduce easier questions before progressing.

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

### Data Storage and Offline Play

- **Local Storage:** Save game progress, accuracy stats, and question history on the device.
- **Session Continuity:** Resume from the last played level automatically when reopening the game.

This ensures the game engine dynamically adjusts difficulty and keeps the experience engaging for all skill levels.
