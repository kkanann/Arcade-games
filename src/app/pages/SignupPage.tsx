import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Gamepad2 } from 'lucide-react';

export function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup - just navigate to games page
    if (username && email && password) {
      navigate('/games');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Gamepad2 className="size-16 mx-auto text-pink-500 mb-4" />
          <h1 className="text-3xl mb-2" style={{ fontFamily: "'Press Start 2P', cursive" }}>
            SIGNUP
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-900 p-8 border-4 border-pink-500">
          <div>
            <label className="block mb-2 text-gray-400" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '12px' }}>
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-black border-2 border-pink-400 text-white focus:outline-none focus:border-pink-300"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-gray-400" style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '12px' }}>
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-black border-2 border-pink-400 text-white focus:outline-none focus:border-pink-300"
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
              className="w-full px-4 py-3 bg-black border-2 border-pink-400 text-white focus:outline-none focus:border-pink-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-4 bg-pink-600 hover:bg-pink-700 transition-colors border-4 border-pink-400"
            style={{ fontFamily: "'Press Start 2P', cursive", fontSize: '14px' }}
          >
            CREATE
          </button>

          <div className="text-center">
            <Link to="/login" className="text-pink-400 hover:text-pink-300 text-sm">
              Already have an account? Login
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
