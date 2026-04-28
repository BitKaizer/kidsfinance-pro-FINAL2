import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AppState, loadState } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function ParentGate() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<AppState>(loadState());
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleEnter = () => {
    if (pin === state.pin) {
      setPin('');
      setError(false);
      setLocation('/parent-area');
    } else {
      setError(true);
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 flex items-center justify-center">
      <div className="max-w-md mx-auto w-full">
        <button
          onClick={() => setLocation('/')}
          className="text-white text-3xl mb-4 hover:opacity-75 transition"
        >
          ←
        </button>

        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="text-2xl font-black text-gray-800 mb-2">Parent Area</h2>
          <p className="text-gray-600 mb-6">Enter PIN to access parent controls</p>

          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="PIN"
            className={`w-full p-4 border-2 rounded-lg mb-4 text-center text-2xl font-bold tracking-widest focus:outline-none transition ${
              error ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-indigo-600'
            }`}
            onKeyPress={(e) => e.key === 'Enter' && handleEnter()}
          />

          {error && (
            <div className="bg-red-100 text-red-800 text-sm font-bold p-3 rounded-lg mb-4">
              ❌ Wrong PIN. Try again.
            </div>
          )}

          <Button
            onClick={handleEnter}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition"
          >
            Enter →
          </Button>
        </div>
      </div>
    </div>
  );
}
