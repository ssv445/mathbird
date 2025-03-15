'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRightIcon, TrashIcon } from '@heroicons/react/24/outline';
import { getGameState, resetGameState } from '@/lib/store';
import { GameState } from '@/lib/types';

export default function HomePage() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const init = async () => {
      const state = await getGameState();
      setGameState(state);
    };
    init();
  }, []);

  const handleCompleteReset = async () => {
    await resetGameState();
    const state = await getGameState();
    setGameState(state);
  };

  if (!gameState) return <div>Loading...</div>;

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h1 className="text-4xl font-bold mb-6 text-center">MathBird</h1>

          <div className="text-center mb-8">
            <div className="text-2xl font-semibold mb-2">Lifetime Score</div>
            <div className="text-5xl font-bold text-blue-600">{gameState.lifetimeScore}</div>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/game"
              className="flex items-center justify-center gap-2 bg-blue-500 text-white px-6 py-4 rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Play Now
              <ArrowRightIcon className="w-6 h-6" />
            </Link>

            <button
              onClick={handleCompleteReset}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
            >
              <TrashIcon className="w-5 h-5" />
              Reset All Progress
            </button>
          </div>
        </div>

        <div className="bg-white/90 rounded-lg p-6 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-4">Your Stats</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">
                {gameState.currentLevel}
              </div>
              <div className="text-sm text-gray-600">Current Level</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">
                ⭐ {gameState.stars}
              </div>
              <div className="text-sm text-gray-600">Stars Earned</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
