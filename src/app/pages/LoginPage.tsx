import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Gamepad2 } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - just navigate to games page
    if (username && password) {
      navigate('/games');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Gamepad2 className="size-16 mx-auto text-purple-500 mb-4" />
          <h1 className="text-3xl mb-2" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            LOGIN
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-8 border-4 border-purple-500">
          <div>
            <label className="block mb-2 text-gray-400" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '12px' }}>
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-black border-2 border-purple-400 text-white focus:outline-none focus:border-purple-300"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-400" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '12px' }}>
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black border-2 border-purple-400 text-white focus:outline-none focus:border-purple-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 transition-colors border-4 border-purple-400"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '14px' }}
          >
            ENTER
          </button>

          <div className="text-center">
            <Link to="/signup" className="text-purple-400 hover:text-purple-300 text-sm">
              Need an account? Sign up
            </Link>
          </div>
        </form>

        <div className="text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-400 text-sm">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
