## Game Logic Rules

### Question Generation
- **Start Simple:** Begin with single-digit addition and subtraction.
- **Adaptive Difficulty:** 
  - Increase difficulty if the player answers correctly multiple times in a row.
  - Reduce difficulty if the player struggles with multiple incorrect answers.
- **Question Variety:** Ensure questions are not repeated frequently.

### Player Performance Tracking
- **Accuracy Rate:** Track the percentage of correct answers.
- **Speed Measurement:** Store response time for each question.
- **Progress Analysis:** Identify weak areas (e.g., struggling with multiplication) and generate more questions in those categories.

### Level Progression
- **Unlock Criteria:** 
  - Achieve an accuracy of at least 80% in the current level.
  - Maintain an average response time under a set limit.
  - Answer at least 10 questions correctly in the current session.
- **Penalty for Mistakes:** If accuracy drops below 50% in a level, reintroduce easier questions before progressing.

### Reward System
- **Stars & Badges:** Award stars based on accuracy and speed.
- **Bonus Questions:** Offer extra points for answering multiple correct questions in a row.

### Data Storage and Offline Play
- **Local Storage:** Save game progress, accuracy stats, and question history on the device.
- **Session Continuity:** Resume from the last played level automatically when reopening the game.

This ensures the game engine dynamically adjusts difficulty and keeps the experience engaging for all skill levels.
