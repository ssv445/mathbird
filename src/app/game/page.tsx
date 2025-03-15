'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function GamePage() {
    const [score, setScore] = useState(0);

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
                    <div className="text-lg font-medium">Score: {score}</div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-800">Level 1</h1>
                        <p className="text-gray-600">Addition</p>
                    </div>

                    <div className="space-y-6">
                        {/* Question will be added here */}
                        <p className="text-xl text-center">Coming soon...</p>
                    </div>
                </div>
            </div>
        </main>
    );
} 