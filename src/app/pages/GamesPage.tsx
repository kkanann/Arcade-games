import { useState } from 'react';
import { Link } from 'react-router';
import { BreakoutGame } from '../components/BreakoutGame';
import { SnakeGame } from '../components/SnakeGame';
import { SpaceInvadersGame } from '../components/SpaceInvadersGame';
import { LogOut } from 'lucide-react';

type GameType = 'breakout' | 'snake' | 'space-invaders' | null;

export function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);

  if (selectedGame) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedGame(null)}
            className="mb-4 px-6 py-3 bg-gray-700 hover:bg-gray-600 transition-colors border-2 border-gray-500"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '12px' }}
          >
            ← BACK
          </button>
          {selectedGame === 'breakout' && <BreakoutGame />}
          {selectedGame === 'snake' && <SnakeGame />}
          {selectedGame === 'space-invaders' && <SpaceInvadersGame />}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            GAME ROOM
          </h1>
          <Link
            to="/"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 transition-colors border-2 border-red-400 flex items-center gap-2"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '12px' }}
          >
            <LogOut className="size-4" />
            EXIT
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setSelectedGame('breakout')}
            className="bg-gradient-to-b from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 transition-colors p-8 border-4 border-blue-400 space-y-4"
          >
            <div className="text-6xl">🧱</div>
            <h2 className="text-2xl" style={{ fontFamily: "'Press Start 2P', cursive" }}>
              BREAKOUT
            </h2>
            <p className="text-sm text-blue-200">Break all the bricks!</p>
          </button>

          <button
            onClick={() => setSelectedGame('snake')}
            className="bg-gradient-to-b from-green-600 to-green-800 hover:from-green-500 hover:to-green-700 transition-colors p-8 border-4 border-green-400 space-y-4"
          >
            <div className="text-6xl">🐍</div>
            <h2 className="text-2xl" style={{ fontFamily: "'Press Start 2P', cursive" }}>
              SNAKE
            </h2>
            <p className="text-sm text-green-200">Eat and grow!</p>
          </button>

          <button
            onClick={() => setSelectedGame('space-invaders')}
            className="bg-gradient-to-b from-purple-600 to-purple-800 hover:from-purple-500 hover:to-purple-700 transition-colors p-8 border-4 border-purple-400 space-y-4"
          >
            <div className="text-6xl">👾</div>
            <h2 className="text-2xl" style={{ fontFamily: "'Press Start 2P', cursive" }}>
              INVADERS
            </h2>
            <p className="text-sm text-purple-200">Defend Earth!</p>
          </button>
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Use arrow keys and spacebar to play</p>
        </div>
      </div>
    </div>
  );
}
