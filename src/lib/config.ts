export const config = {
    session: {
        questionsPerSession: Number(process.env.NEXT_PUBLIC_QUESTIONS_PER_SESSION || 20),
    },
    levelUp: {
        minAccuracy: Number(process.env.NEXT_PUBLIC_MIN_ACCURACY_FOR_LEVEL_UP || 60),
        minAccuracyForReduction: Number(process.env.NEXT_PUBLIC_MIN_ACCURACY_FOR_DIFFICULTY_REDUCTION || 40),
    },
    scoring: {
        baseMultiplier: Number(process.env.NEXT_PUBLIC_BASE_SCORE_MULTIPLIER || 10),
        timeBonusThreshold: Number(process.env.NEXT_PUBLIC_TIME_BONUS_THRESHOLD || 5),
        timeBonusPerSecond: Number(process.env.NEXT_PUBLIC_TIME_BONUS_PER_SECOND || 2),
        streakBonusInterval: Number(process.env.NEXT_PUBLIC_STREAK_BONUS_INTERVAL || 3),
        streakBonusAmount: Number(process.env.NEXT_PUBLIC_STREAK_BONUS_AMOUNT || 5),
        varietyBonusPerOperator: Number(process.env.NEXT_PUBLIC_VARIETY_BONUS_PER_OPERATOR || 5),
    },
    rewards: {
        perfect: {
            accuracy: Number(process.env.NEXT_PUBLIC_PERFECT_ACCURACY || 90),
            time: Number(process.env.NEXT_PUBLIC_PERFECT_TIME || 5),
        },
        great: {
            accuracy: Number(process.env.NEXT_PUBLIC_GREAT_ACCURACY || 70),
            time: Number(process.env.NEXT_PUBLIC_GREAT_TIME || 7),
        },
        good: {
            accuracy: Number(process.env.NEXT_PUBLIC_GOOD_ACCURACY || 0),
        },
    },
    difficulty: {
        easy: {
            maxNumber: Number(process.env.NEXT_PUBLIC_EASY_MAX_NUMBER || 10),
        },
        medium: {
            maxNumber: Number(process.env.NEXT_PUBLIC_MEDIUM_MAX_NUMBER || 20),
        },
        hard: {
            maxNumber: Number(process.env.NEXT_PUBLIC_HARD_MAX_NUMBER || 50),
        },
        expert: {
            maxNumber: Number(process.env.NEXT_PUBLIC_EXPERT_MAX_NUMBER || 100),
        },
        multiplication: {
            maxNumber: Number(process.env.NEXT_PUBLIC_MAX_MULTIPLICATION_NUMBER || 12),
        },
    },
    operators: {
        subtractionMinLevel: Number(process.env.NEXT_PUBLIC_SUBTRACTION_MIN_LEVEL || 3),
        multiplicationMinLevel: Number(process.env.NEXT_PUBLIC_MULTIPLICATION_MIN_LEVEL || 5),
    },
} as const; 