'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { Question, GameState } from '@/lib/types';
import { generateQuestion, calculateScore, shouldLevelUp } from '@/lib/game';
import { getGameState, updateGameState } from '@/lib/store';
import { motion } from 'framer-motion';

export default function GamePage() {
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [question, setQuestion] = useState<Question | null>(null);
    const [startTime, setStartTime] = useState<number>(0);
    const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);
    const [isLevelUp, setIsLevelUp] = useState(false);

    useEffect(() => {
        const init = async () => {
            const state = await getGameState();
            setGameState(state);
            generateNewQuestion(state.currentLevel);
        };
        init();
    }, []);

    const generateNewQuestion = (level: number) => {
        const newQuestion = generateQuestion(level);
        setQuestion(newQuestion);
        setStartTime(Date.now());
        setFeedback(null);
    };

    const handleAnswer = async (choice: number) => {
        if (!question || !gameState || feedback) return;

        const responseTime = Date.now() - startTime;
        const isCorrect = choice === question.correctAnswer;

        const newStreak = isCorrect ? gameState.currentStreak + 1 : 0;
        const score = calculateScore(isCorrect, responseTime, question.difficulty, newStreak);

        const newState = await updateGameState({
            score: gameState.score + score,
            questionsAnswered: gameState.questionsAnswered + 1,
            correctAnswers: gameState.correctAnswers + (isCorrect ? 1 : 0),
            averageResponseTime:
                (gameState.averageResponseTime * gameState.questionsAnswered + responseTime) /
                (gameState.questionsAnswered + 1),
            currentStreak: newStreak,
            maxStreak: Math.max(gameState.maxStreak, newStreak)
        });

        setGameState(newState);
        setFeedback({
            message: isCorrect ? 'Correct!' : 'Try again!',
            isCorrect
        });

        if (shouldLevelUp(newState.correctAnswers, newState.questionsAnswered, newState.averageResponseTime)) {
            setIsLevelUp(true);
            await updateGameState({ currentLevel: gameState.currentLevel + 1 });
        } else {
            setTimeout(() => {
                generateNewQuestion(newState.currentLevel);
            }, 1500);
        }
    };

    if (!gameState || !question) return <div>Loading...</div>;

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
            <div className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Link
                        href="/"
                        className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-1" />
                        Back
                    </Link>
                    <div className="flex gap-4">
                        <div className="text-lg font-medium">Level: {gameState.currentLevel}</div>
                        <div className="text-lg font-medium">Score: {gameState.score}</div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="text-center mb-8">
                        <div className="text-3xl font-bold mb-4">
                            {question.operand1} {question.operator} {question.operand2} = ?
                        </div>
                        {feedback && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`text-xl font-bold ${feedback.isCorrect ? 'text-green-500' : 'text-red-500'
                                    }`}
                            >
                                {feedback.message}
                            </motion.div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {question.choices.map((choice, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-4 text-xl font-bold rounded-lg ${feedback
                                    ? choice === question.correctAnswer
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-100 text-gray-700'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                                onClick={() => handleAnswer(choice)}
                                disabled={!!feedback}
                            >
                                {choice}
                            </motion.button>
                        ))}
                    </div>

                    {isLevelUp && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center"
                        >
                            <div className="bg-white p-8 rounded-lg text-center">
                                <h2 className="text-2xl font-bold mb-4">Level Up!</h2>
                                <p className="mb-4">You&apos;ve advanced to level {gameState.currentLevel + 1}</p>
                                <button
                                    className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                                    onClick={() => {
                                        setIsLevelUp(false);
                                        generateNewQuestion(gameState.currentLevel + 1);
                                    }}
                                >
                                    Continue
                                </button>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </main>
    );
} 