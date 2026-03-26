import { Link } from 'react-router';
import { Gamepad2 } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-2xl">
        <Gamepad2 className="size-24 mx-auto text-purple-500" />
        <h1 className="text-5xl" style={{ fontFamily: "'Press Start 2P', cursive" }}>
          RETRO ARCADE
        </h1>
        <p className="text-xl text-gray-400">
          Step into the ultimate retro gaming experience
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Link
            to="/login"
            className="px-8 py-4 bg-purple-600 hover:bg-purple-700 transition-colors border-4 border-purple-400"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '14px' }}
          >
            LOGIN
          </Link>
          <Link
            to="/signup"
            className="px-8 py-4 bg-pink-600 hover:bg-pink-700 transition-colors border-4 border-pink-400"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '14px' }}
          >
            SIGNUP
          </Link>
        </div>
      </div>
    </div>
  );
}
