'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getGameState, updateGameState } from '@/lib/store';
import { GameState } from '@/lib/types';
import { playSound } from '@/lib/sounds';

export default function LevelRepeatPage() {
    const router = useRouter();
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [sessionData, setSessionData] = useState<{
        stars: number;
        message: string;
        score: number;
        accuracy: number;
    } | null>(null);

    useEffect(() => {
        const init = async () => {
            const state = await getGameState();
            setGameState(state);

            // Play wrong sound
            playSound('wrong');

            // Get session data from localStorage
            const data = localStorage.getItem('sessionData');
            if (data) {
                setSessionData(JSON.parse(data));
            } else {
                // If no data, redirect back to game
                router.replace('/game');
            }
        };
        init();
    }, [router]);

    const handleContinue = async () => {
        if (!gameState) return;

        // Reset session stats but keep the same level
        await updateGameState({
            sessionQuestionsAnswered: 0,
            sessionCorrectAnswers: 0,
            uniqueOperatorsUsed: new Set([]),
            score: 0,
            averageResponseTime: 0,
        });

        // Clear the session data and redirect
        localStorage.removeItem('sessionData');
        router.replace('/game');
    };

    if (!gameState || !sessionData) return <div>Loading...</div>;

    const encouragingMessages = [
        "Don't give up! You're learning and getting better! 💪",
        "Practice makes perfect! Let's try again! 🌟",
        "Every mistake is a chance to learn! Ready for another round? 🎯",
        "You've got this! Let's tackle this level again! 🚀",
        "Keep going! Success is just around the corner! ✨"
    ];

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-lg text-center shadow-lg"
                >
                    <motion.div
                        className="text-6xl mb-6"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                    >
                        🎯
                    </motion.div>

                    <motion.h1
                        initial={{ y: -20 }}
                        animate={{ y: 0 }}
                        className="text-3xl font-bold mb-6"
                    >
                        Keep Going!
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl mb-8 text-gray-600"
                    >
                        {encouragingMessages[Math.floor(Math.random() * encouragingMessages.length)]}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-4 mb-8"
                    >
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-2">Session Summary</h2>
                            <div className="space-y-2 text-gray-600">
                                <p>Level: {gameState.currentLevel}</p>
                                <p>Accuracy: {sessionData.accuracy.toFixed(1)}%</p>
                                <p>Score: {sessionData.score}</p>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <h2 className="text-lg font-semibold mb-2">Tips</h2>
                            <ul className="text-left text-gray-600 space-y-2">
                                <li>✓ Take your time to think</li>
                                <li>✓ Use paper for calculations if needed</li>
                                <li>✓ Practice similar problems</li>
                            </ul>
                        </div>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors w-full"
                        onClick={handleContinue}
                    >
                        Try Again
                    </motion.button>
                </motion.div>
            </div>
        </main>
    );
} 