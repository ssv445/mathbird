export const config = {
    session: {
        questionsPerSession: Number(process.env.QUESTIONS_PER_SESSION || 5),
    },
    levelUp: {
        minAccuracy: Number(process.env.MIN_ACCURACY_FOR_LEVEL_UP || 60),
        minAccuracyForReduction: Number(process.env.MIN_ACCURACY_FOR_DIFFICULTY_REDUCTION || 40),
    },
    scoring: {
        baseMultiplier: Number(process.env.BASE_SCORE_MULTIPLIER || 10),
        timeBonusThreshold: Number(process.env.TIME_BONUS_THRESHOLD || 5),
        timeBonusPerSecond: Number(process.env.TIME_BONUS_PER_SECOND || 2),
        streakBonusInterval: Number(process.env.STREAK_BONUS_INTERVAL || 3),
        streakBonusAmount: Number(process.env.STREAK_BONUS_AMOUNT || 5),
        varietyBonusPerOperator: Number(process.env.VARIETY_BONUS_PER_OPERATOR || 5),
    },
    rewards: {
        perfect: {
            accuracy: Number(process.env.PERFECT_ACCURACY || 90),
            time: Number(process.env.PERFECT_TIME || 3),
        },
        great: {
            accuracy: Number(process.env.GREAT_ACCURACY || 75),
            time: Number(process.env.GREAT_TIME || 4),
        },
        good: {
            accuracy: Number(process.env.GOOD_ACCURACY || 60),
        },
    },
    difficulty: {
        easy: {
            maxNumber: Number(process.env.EASY_MAX_NUMBER || 10),
        },
        medium: {
            maxNumber: Number(process.env.MEDIUM_MAX_NUMBER || 20),
        },
        hard: {
            maxNumber: Number(process.env.HARD_MAX_NUMBER || 50),
        },
        expert: {
            maxNumber: Number(process.env.EXPERT_MAX_NUMBER || 100),
        },
        multiplication: {
            maxNumber: Number(process.env.MAX_MULTIPLICATION_NUMBER || 12),
        },
    },
    operators: {
        subtractionMinLevel: Number(process.env.SUBTRACTION_MIN_LEVEL || 3),
        multiplicationMinLevel: Number(process.env.MULTIPLICATION_MIN_LEVEL || 5),
    },
} as const; 