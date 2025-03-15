import { Question, Operator, Difficulty, GameState } from './types';
import { config } from './config';

const generateNumber = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const generateChoices = (correctAnswer: number, difficulty: Difficulty): number[] => {
    const choices = new Set<number>([correctAnswer]);
    const range = difficulty <= 2 ? 5 : 10;

    while (choices.size < 4) {
        const choice = correctAnswer + generateNumber(-range, range);
        if (choice >= 0) {
            choices.add(choice);
        }
    }

    return Array.from(choices).sort(() => Math.random() - 0.5);
};

const selectOperator = (level: number, lastQuestions?: Operator[]): Operator => {
    // Start with basic single-digit addition/subtraction
    const availableOperators: Operator[] = level <= 2
        ? ['+']  // Level 1-2: Only addition
        : level <= 4
            ? ['+', '-']  // Level 3-4: Addition and subtraction
            : ['+', '-', '×'];  // Level 5+: All operators

    // If no last questions or empty array, return random operator
    if (!lastQuestions?.length) {
        return availableOperators[Math.floor(Math.random() * availableOperators.length)];
    }

    // Avoid repeating the same operator too frequently
    const recentOperators = new Set(lastQuestions.slice(-2));
    const preferredOperators = availableOperators.filter(op => !recentOperators.has(op));

    return preferredOperators.length > 0
        ? preferredOperators[Math.floor(Math.random() * preferredOperators.length)]
        : availableOperators[Math.floor(Math.random() * availableOperators.length)];
};

export const generateQuestion = (level: number, lastQuestions?: Operator[]): Question => {
    const difficulty = Math.min(5, Math.ceil(level / 2)) as Difficulty;
    const operator = selectOperator(level, lastQuestions);

    // Start with single-digit numbers for early levels
    const maxNumber = difficulty <= 2
        ? 9  // Single digit for early levels
        : difficulty <= 3
            ? config.difficulty.medium.maxNumber
            : difficulty <= 4
                ? config.difficulty.hard.maxNumber
                : config.difficulty.expert.maxNumber;

    let operand1: number, operand2: number, correctAnswer: number;

    do {
        // For early levels (1-2), ensure single digit numbers
        if (difficulty <= 2) {
            operand1 = generateNumber(1, 9);
            operand2 = generateNumber(1, 9);
        } else {
            operand1 = generateNumber(1, maxNumber);
            operand2 = generateNumber(1, maxNumber);
        }

        switch (operator) {
            case '+':
                correctAnswer = operand1 + operand2;
                break;
            case '-':
                // Ensure no negative results
                if (operand1 < operand2) {
                    [operand1, operand2] = [operand2, operand1];
                }
                correctAnswer = operand1 - operand2;
                break;
            case '×':
                // Keep multiplication tables manageable
                operand1 = generateNumber(1, Math.min(12, maxNumber));
                operand2 = generateNumber(1, Math.min(12, maxNumber));
                correctAnswer = operand1 * operand2;
                break;
            default:
                correctAnswer = operand1 + operand2;
        }
    } while (correctAnswer > maxNumber * 2);

    const choices = generateChoices(correctAnswer, difficulty);

    return {
        id: Math.random().toString(36).substring(2),
        operand1,
        operand2,
        operator,
        correctAnswer,
        choices,
        difficulty,
    };
};

export const calculateScore = (
    isCorrect: boolean,
    responseTime: number,
    difficulty: Difficulty,
    streak: number,
    uniqueOperatorsCount: number
): number => {
    if (!isCorrect) return 0;

    const baseScore = config.scoring.baseMultiplier * difficulty;
    const timeBonus = Math.max(0, config.scoring.timeBonusThreshold - Math.floor(responseTime / 1000))
        * config.scoring.timeBonusPerSecond;
    const streakBonus = Math.floor(streak / config.scoring.streakBonusInterval)
        * config.scoring.streakBonusAmount;
    const varietyBonus = uniqueOperatorsCount * config.scoring.varietyBonusPerOperator;

    return baseScore + timeBonus + streakBonus + varietyBonus;
};

export const shouldLevelUp = (state: GameState): boolean => {
    // Calculate session accuracy
    const sessionAccuracy = (state.sessionCorrectAnswers / state.sessionQuestionsAnswered) * 100;

    // Level up if accuracy is at least 60% in a completed session (per spec)
    return sessionAccuracy >= config.levelUp.minAccuracy &&
        state.sessionQuestionsAnswered === config.session.questionsPerSession;
};

export const shouldReduceDifficulty = (state: GameState): boolean => {
    // Only check difficulty reduction after at least 5 questions
    if (state.sessionQuestionsAnswered < 5) return false;

    const accuracy = (state.sessionCorrectAnswers / state.sessionQuestionsAnswered) * 100;
    // Reduce difficulty if accuracy is below 40% (struggling)
    return accuracy < config.levelUp.minAccuracyForReduction;
};

export const isSessionComplete = (questionsAnswered: number): boolean => {
    return questionsAnswered >= config.session.questionsPerSession;
};

export const calculateSessionRewards = (state: GameState): { stars: number; message: string } => {
    const accuracy = (state.sessionCorrectAnswers / state.sessionQuestionsAnswered) * 100;

    let stars = 0;
    let message = '';

    if (accuracy >= 90) {
        stars = 3;
        message = 'Outstanding! You\'re a math genius! 🌟🌟🌟';
    } else if (accuracy >= 70) {
        stars = 2;
        message = 'Great job! Keep it up! 🌟🌟';
    } else {
        stars = 1;
        message = 'Good effort! Practice makes perfect! 🌟';
    }

    return { stars, message };
}; 