import { Question, Operator, Difficulty } from './types';

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

export const generateQuestion = (level: number): Question => {
    const difficulty = Math.min(5, Math.ceil(level / 2)) as Difficulty;
    const operators: Operator[] = level <= 2 ? ['+'] : level <= 4 ? ['+', '-'] : ['+', '-', '×'];

    const maxNumber = difficulty <= 2 ? 10 : difficulty <= 3 ? 20 : difficulty <= 4 ? 50 : 100;
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let operand1: number, operand2: number, correctAnswer: number;

    do {
        operand1 = generateNumber(1, maxNumber);
        operand2 = generateNumber(1, maxNumber);

        switch (operator) {
            case '+':
                correctAnswer = operand1 + operand2;
                break;
            case '-':
                // Ensure positive results for subtraction
                if (operand1 < operand2) {
                    [operand1, operand2] = [operand2, operand1];
                }
                correctAnswer = operand1 - operand2;
                break;
            case '×':
                // Keep multiplication manageable
                operand1 = generateNumber(1, 12);
                operand2 = generateNumber(1, 12);
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
    streak: number
): number => {
    const baseScore = isCorrect ? 10 * difficulty : 0;
    const timeBonus = isCorrect ? Math.max(0, 5 - Math.floor(responseTime / 1000)) : 0;
    const streakBonus = isCorrect ? Math.floor(streak / 3) * 5 : 0;

    return baseScore + timeBonus + streakBonus;
};

export const shouldLevelUp = (
    correctAnswers: number,
    questionsAnswered: number,
    averageResponseTime: number
): boolean => {
    const accuracy = (correctAnswers / questionsAnswered) * 100;
    return accuracy >= 80 && averageResponseTime < 5000 && questionsAnswered >= 10;
}; 