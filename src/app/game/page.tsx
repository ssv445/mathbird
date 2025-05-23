'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Question, GameState, Operator } from '@/lib/types';
import { generateQuestion, calculateScore, shouldLevelUp, shouldReduceDifficulty, isSessionComplete, calculateSessionRewards } from '@/lib/game';
import { getGameState, updateGameState, resetGameState } from '@/lib/store';
import { config } from '@/lib/config';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { playSound } from '@/lib/sounds';
import confetti from 'canvas-confetti';

export default function GamePage() {
    const router = useRouter();
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [question, setQuestion] = useState<Question | null>(null);
    const [startTime, setStartTime] = useState<number>(0);
    const [feedback, setFeedback] = useState<{ message: string; isCorrect: boolean } | null>(null);

    useEffect(() => {
        // Prefetch the level-complete page
        router.prefetch('/level-complete');

        const init = async () => {
            const state = await getGameState();
            setGameState(state);
            generateNewQuestion(state.currentLevel, state.lastQuestionTypes);
        };
        init();
    }, [router]);

    const generateNewQuestion = (level: number, lastQuestions: Operator[]) => {
        const newQuestion = generateQuestion(level, lastQuestions);
        setQuestion(newQuestion);
        setStartTime(Date.now());
        setFeedback(null);
    };

    const handleAnswer = async (choice: number) => {
        if (!question || !gameState || feedback) return;

        playSound('click');
        const responseTime = Date.now() - startTime;
        const isCorrect = choice === question.correctAnswer;

        if (isCorrect) {
            playSound('correct');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        } else {
            playSound('wrong');
        }

        const feedbackMessage = isCorrect ? 'Correct!' : getEncouragingFeedback(question);

        const newStreak = isCorrect ? gameState.currentStreak + 1 : 0;
        const newOperatorsUsed = new Set(gameState.uniqueOperatorsUsed).add(question.operator);
        const score = calculateScore(
            isCorrect,
            responseTime,
            question.difficulty,
            newStreak,
            newOperatorsUsed.size
        );

        const newAverageResponseTime = gameState.sessionQuestionsAnswered === 0
            ? responseTime
            : (gameState.averageResponseTime * gameState.sessionQuestionsAnswered + responseTime) /
            (gameState.sessionQuestionsAnswered + 1);

        const newState = await updateGameState({
            score: gameState.score + score,
            sessionQuestionsAnswered: gameState.sessionQuestionsAnswered + 1,
            sessionCorrectAnswers: gameState.sessionCorrectAnswers + (isCorrect ? 1 : 0),
            averageResponseTime: newAverageResponseTime,
            currentStreak: newStreak,
            maxStreak: Math.max(gameState.maxStreak, newStreak),
            uniqueOperatorsUsed: newOperatorsUsed,
            lastQuestionTypes: [...gameState.lastQuestionTypes, question.operator].slice(-5),
        });

        setGameState(newState);
        setFeedback({
            message: feedbackMessage,
            isCorrect
        });

        if (isSessionComplete(newState.sessionQuestionsAnswered)) {
            const rewards = calculateSessionRewards(newState);
            const shouldAdvanceLevel = shouldLevelUp(newState);
            const accuracy = (newState.sessionCorrectAnswers / newState.sessionQuestionsAnswered) * 100;

            // Store all necessary data in localStorage
            localStorage.setItem('sessionData', JSON.stringify({
                isLevelUp: shouldAdvanceLevel,
                stars: rewards.stars,
                message: rewards.message,
                score: gameState.score,
                accuracy: accuracy,
                pendingUpdate: {
                    stars: gameState.stars + rewards.stars,
                    lifetimeScore: gameState.lifetimeScore + gameState.score,
                    currentLevel: shouldAdvanceLevel ? gameState.currentLevel + 1 : gameState.currentLevel
                }
            }));

            // Redirect to appropriate page based on performance
            if (accuracy < config.levelUp.minAccuracyForReduction) {
                router.replace('/level-repeat');
            } else {
                router.replace('/level-complete');
            }
        } else if (shouldReduceDifficulty(newState)) {
            const newLevel = Math.max(1, gameState.currentLevel - 1);
            await updateGameState({
                currentLevel: newLevel,
                sessionQuestionsAnswered: 0,
                sessionCorrectAnswers: 0,
                averageResponseTime: 0,
            });
            generateNewQuestion(newLevel, newState.lastQuestionTypes);
        } else {
            setTimeout(() => {
                generateNewQuestion(newState.currentLevel, newState.lastQuestionTypes);
            }, 1000);
        }
    };

    const handleReset = async () => {
        await resetGameState();
        const state = await getGameState();
        setGameState(state);
        setQuestion(null);
        setFeedback(null);
        generateNewQuestion(1, []);
    };

    const getProgressHints = () => {
        if (!gameState) return null;

        const accuracy = gameState.sessionQuestionsAnswered > 0
            ? ((gameState.sessionCorrectAnswers / gameState.sessionQuestionsAnswered) * 100).toFixed(1)
            : '0';
        const accuracyNum = Number(accuracy);

        return (
            <div className="bg-white/90 rounded-lg p-4 mb-4 shadow-sm backdrop-blur-sm">
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Level {gameState.currentLevel}</h3>
                <div className="text-sm">
                    <div>
                        <div className="flex justify-between items-center">
                            <span>Accuracy:</span>
                            <span className={accuracyNum >= config.levelUp.minAccuracy ? 'text-green-500' : 'text-blue-500'}>
                                {accuracy}%
                            </span>
                        </div>
                        <div className="h-1 bg-gray-200 rounded-full mt-1">
                            <div
                                className={`h-full rounded-full ${accuracyNum >= config.levelUp.minAccuracy ? 'bg-green-500' : 'bg-blue-500'}`}
                                style={{ width: `${Math.min(100, accuracyNum)}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Need: {config.levelUp.minAccuracy}% for next level</div>
                    </div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
                    <span>Questions: {gameState.sessionQuestionsAnswered}/{config.session.questionsPerSession}</span>
                    <span>⭐ {gameState.stars}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${(gameState.sessionQuestionsAnswered / config.session.questionsPerSession) * 100}%` }}
                    />
                </div>
            </div>
        );
    };

    const getEncouragingFeedback = (question: Question): string => {
        const messages = [
            `Almost! ${question.operand1} ${question.operator} ${question.operand2} = ${question.correctAnswer}`,
            "You can do it! Try again!",
            "Keep going! Practice makes perfect!",
            "Not quite, but you're learning!",
            "That's okay! Math takes time to master."
        ];
        return messages[Math.floor(Math.random() * messages.length)];
    };

    if (!gameState || !question) return <div>Loading...</div>;

    return (
        <main className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
            <div className="max-w-2xl mx-auto h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <Link
                        href="/"
                        className="flex items-center text-blue-600 hover:text-blue-700"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-1" />
                        Back
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <div className="text-lg font-medium">Score: {gameState.score}</div>
                            <div className="text-sm text-gray-600">Total: {gameState.lifetimeScore}</div>
                        </div>
                        <button
                            onClick={handleReset}
                            className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            <ArrowPathIcon className="w-4 h-4" />
                            Reset
                        </button>
                    </div>
                </div>

                {getProgressHints()}

                <div className="flex-1" /> {/* Spacer */}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={question.id}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="bg-white rounded-lg shadow-lg p-6"
                    >
                        <motion.div
                            className="text-3xl font-bold text-center mb-6"
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                        >
                            {question.operand1} {question.operator} {question.operand2} = ?
                        </motion.div>

                        {feedback && (
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`text-xl font-bold text-center mb-4 ${feedback.isCorrect ? 'text-green-500' : 'text-red-500'
                                    }`}
                            >
                                <motion.div
                                    animate={feedback.isCorrect ? {
                                        scale: 1.1,
                                        rotate: 5
                                    } : {
                                        x: [-10, 10]
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        type: feedback.isCorrect ? "spring" : "tween",
                                        repeat: feedback.isCorrect ? 1 : 3,
                                        repeatType: "reverse"
                                    }}
                                >
                                    {feedback.message}
                                    {feedback.isCorrect && (
                                        <span className="ml-2" role="img" aria-label="celebration">
                                            {['🌟', '⭐', '✨', '🎉'][Math.floor(Math.random() * 4)]}
                                        </span>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            {question.choices.map((choice, index) => (
                                <motion.button
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`p-6 text-2xl font-bold rounded-lg ${feedback
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
                    </motion.div>
                </AnimatePresence>
            </div>
        </main>
    );
} 