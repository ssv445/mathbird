'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getGameState, updateGameState } from '@/lib/store';
import { GameState } from '@/lib/types';
import { playSound } from '@/lib/sounds';
import confetti from 'canvas-confetti';

export default function LevelCompletePage() {
    const router = useRouter();
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [sessionData, setSessionData] = useState<{
        isLevelUp: boolean;
        stars: number;
        message: string;
        score: number;
        pendingUpdate: {
            stars: number;
            lifetimeScore: number;
            currentLevel: number;
        };
    } | null>(null);

    useEffect(() => {
        const init = async () => {
            const state = await getGameState();
            setGameState(state);

            // Play level up sound and trigger confetti
            playSound('levelUp');
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.3 },
                gravity: 0.5,
                scalar: 1.2
            });

            // Prefetch the game page for faster return
            router.prefetch('/game');

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
        if (!sessionData) return;

        // Apply the pending state update
        await updateGameState({
            stars: sessionData.pendingUpdate.stars,
            sessionQuestionsAnswered: 0,
            sessionCorrectAnswers: 0,
            uniqueOperatorsUsed: new Set([]),
            lifetimeScore: sessionData.pendingUpdate.lifetimeScore,
            score: 0,
            averageResponseTime: 0,
            currentLevel: sessionData.pendingUpdate.currentLevel,
        });

        // Clear the session data and redirect
        localStorage.removeItem('sessionData');
        router.replace('/game');
    };

    if (!gameState || !sessionData) return <div>Loading...</div>;

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-8 rounded-lg text-center shadow-lg"
                >
                    <motion.h1
                        initial={{ y: -50 }}
                        animate={{ y: 0 }}
                        className="text-4xl font-bold mb-8"
                    >
                        {sessionData.isLevelUp ? 'Level Up!' : 'Session Complete!'}
                    </motion.h1>

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            type: "spring",
                            bounce: 0.5
                        }}
                        className="text-6xl mb-8"
                    >
                        {Array.from({ length: sessionData.stars }).map((_, i) => (
                            <motion.span
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.2 }}
                                className="inline-block animate-bounce"
                                style={{ animationDelay: `${i * 0.1}s` }}
                            >
                                ⭐
                            </motion.span>
                        ))}
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-xl mb-6"
                    >
                        {sessionData.message}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-4 mb-8"
                    >
                        <div className="text-gray-600">
                            <p className="text-lg">
                                Accuracy: {gameState.sessionQuestionsAnswered > 0
                                    ? ((gameState.sessionCorrectAnswers / gameState.sessionQuestionsAnswered) * 100).toFixed(1)
                                    : '0'}%
                            </p>
                        </div>

                        {sessionData.isLevelUp && (
                            <motion.p
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                    type: "spring",
                                    bounce: 0.5,
                                    delay: 1
                                }}
                                className="text-2xl text-green-600 font-medium"
                            >
                                Advanced to Level {sessionData.pendingUpdate.currentLevel}! 🎉
                            </motion.p>
                        )}

                        <div className="text-gray-600">
                            <p className="text-lg">Session Score: {sessionData.score}</p>
                            <p className="text-sm">Total Score: {sessionData.pendingUpdate.lifetimeScore}</p>
                        </div>
                    </motion.div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors w-full"
                        onClick={handleContinue}
                    >
                        Continue Playing
                    </motion.button>
                </motion.div>
            </div>
        </main>
    );
} 