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
    const availableOperators: Operator[] = level <= 2
        ? ['+']
        : level <= config.operators.subtractionMinLevel
            ? ['+', '-']
            : ['+', '-', '×'];

    // If no last questions or empty array, return random operator
    if (!lastQuestions?.length) {
        return availableOperators[Math.floor(Math.random() * availableOperators.length)];
    }

    // Avoid repeating the same operator too frequently
    const recentOperators = new Set(lastQuestions.slice(-3));
    const preferredOperators = availableOperators.filter(op => !recentOperators.has(op));

    return preferredOperators.length > 0
        ? preferredOperators[Math.floor(Math.random() * preferredOperators.length)]
        : availableOperators[Math.floor(Math.random() * availableOperators.length)];
};

export const generateQuestion = (level: number, lastQuestions?: Operator[]): Question => {
    const difficulty = Math.min(5, Math.ceil(level / 2)) as Difficulty;
    const operator = selectOperator(level, lastQuestions);

    const maxNumber = difficulty <= 2
        ? config.difficulty.easy.maxNumber
        : difficulty <= 3
            ? config.difficulty.medium.maxNumber
            : difficulty <= 4
                ? config.difficulty.hard.maxNumber
                : config.difficulty.expert.maxNumber;

    let operand1: number, operand2: number, correctAnswer: number;

    do {
        operand1 = generateNumber(1, maxNumber);
        operand2 = generateNumber(1, maxNumber);

        switch (operator) {
            case '+':
                correctAnswer = operand1 + operand2;
                break;
            case '-':
                if (operand1 < operand2) {
                    [operand1, operand2] = [operand2, operand1];
                }
                correctAnswer = operand1 - operand2;
                break;
            case '×':
                operand1 = generateNumber(1, config.difficulty.multiplication.maxNumber);
                operand2 = generateNumber(1, config.difficulty.multiplication.maxNumber);
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

    // Level up if accuracy is at least 60% in a completed session
    return sessionAccuracy >= config.levelUp.minAccuracy && state.sessionQuestionsAnswered === config.session.questionsPerSession;
};

export const shouldReduceDifficulty = (state: GameState): boolean => {
    const accuracy = (state.sessionCorrectAnswers / state.sessionQuestionsAnswered) * 100;
    return accuracy < config.levelUp.minAccuracyForReduction && state.sessionQuestionsAnswered >= config.session.questionsPerSession;
};

export const isSessionComplete = (questionsAnswered: number): boolean => {
    return questionsAnswered >= config.session.questionsPerSession;
};

export const calculateSessionRewards = (state: GameState): { stars: number; message: string } => {
    const accuracy = (state.sessionCorrectAnswers / state.sessionQuestionsAnswered) * 100;
    const avgTime = state.averageResponseTime / 1000;

    let stars = 0;
    let message = '';

    if (accuracy >= config.rewards.perfect.accuracy && avgTime < config.rewards.perfect.time) {
        stars = 3;
        message = 'Perfect! You\'re a math genius! 🌟🌟🌟';
    } else if (accuracy >= config.rewards.great.accuracy && avgTime < config.rewards.great.time) {
        stars = 2;
        message = 'Great job! Keep it up! 🌟🌟';
    } else if (accuracy >= config.rewards.good.accuracy) {
        stars = 1;
        message = 'Good work! Practice makes perfect! 🌟';
    } else {
        message = 'Keep practicing! You\'ll get better! 💪';
    }

    return { stars, message };
}; 