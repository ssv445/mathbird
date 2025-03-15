import { openDB, IDBPDatabase } from 'idb';
import { GameState } from './types';

const DB_NAME = 'mathbird';
const STORE_NAME = 'gameState';

const initialState: GameState = {
    currentLevel: 1,
    score: 0,
    lifetimeScore: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    averageResponseTime: 0,
    currentStreak: 0,
    maxStreak: 0,
    sessionQuestionsAnswered: 0,
    sessionCorrectAnswers: 0,
    uniqueOperatorsUsed: new Set([]),
    stars: 0,
    lastQuestionTypes: [],
};

let db: IDBPDatabase | null = null;

export const initDB = async () => {
    if (!db) {
        db = await openDB(DB_NAME, 1, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            },
        });
    }
    return db;
};

export const getGameState = async (): Promise<GameState> => {
    const db = await initDB();
    const state = await db.get(STORE_NAME, 'current');
    return state ? {
        ...state,
        lastQuestionTypes: Array.isArray(state.lastQuestionTypes) ? state.lastQuestionTypes : [],
        uniqueOperatorsUsed: new Set(state.uniqueOperatorsUsed || []),
        lifetimeScore: state.lifetimeScore || 0
    } : initialState;
};

export const updateGameState = async (state: Partial<GameState>): Promise<GameState> => {
    const db = await initDB();
    const currentState = await getGameState();
    const newState = { ...currentState, ...state };
    await db.put(STORE_NAME, newState, 'current');
    return newState;
};

export const resetGameState = async (): Promise<void> => {
    const db = await initDB();
    await db.put(STORE_NAME, initialState, 'current');
}; 