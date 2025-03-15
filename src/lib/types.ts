export type Operator = '+' | '-' | '×' | '÷';
export type Difficulty = 1 | 2 | 3 | 4 | 5;

export interface Question {
    id: string;
    operand1: number;
    operand2: number;
    operator: Operator;
    correctAnswer: number;
    choices: number[];
    difficulty: Difficulty;
}

export interface GameState {
    currentLevel: number;
    score: number;
    lifetimeScore: number;  // Total score across all sessions
    questionsAnswered: number;
    correctAnswers: number;
    averageResponseTime: number;
    currentStreak: number;
    maxStreak: number;
    sessionQuestionsAnswered: number;
    sessionCorrectAnswers: number;
    uniqueOperatorsUsed: Set<Operator>;
    stars: number;
    lastQuestionTypes: Operator[];  // Track recent questions for variety
} 