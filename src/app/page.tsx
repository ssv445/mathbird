import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-100 to-purple-100">
      <div className="max-w-md w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600">MathBird</h1>
        <p className="text-lg text-gray-600">Learn math through fun!</p>

        <div className="space-y-4">
          <Link
            href="/game"
            className="block w-full py-3 px-6 text-xl font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Start Game
          </Link>

          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/progress"
              className="py-2 px-4 text-sm font-medium text-blue-600 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              Progress
            </Link>
            <Link
              href="/settings"
              className="py-2 px-4 text-sm font-medium text-blue-600 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
