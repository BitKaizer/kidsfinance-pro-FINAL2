import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AppState, loadState, LESSONS, CHALLENGES } from '@/lib/store';

export default function Badges() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<AppState>(loadState());

  const allItems = [...LESSONS, ...CHALLENGES];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setLocation('/')}
          className="text-white text-3xl mb-4 hover:opacity-75 transition"
        >
          ←
        </button>
        <h1 className="text-white font-black text-2xl mb-4">🏅 Badges</h1>

        <div className="grid grid-cols-3 gap-3">
          {allItems.map((item) => {
            const isDone = state.dL.includes(String(item.id)) || state.dC.includes(String(item.id));

            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-4 text-center border-2 transition ${
                  isDone
                    ? 'border-indigo-500'
                    : 'border-gray-200 opacity-50'
                }`}
              >
                <div
                  className={`text-4xl mb-2 ${isDone ? '' : 'grayscale'}`}
                  style={{ filter: isDone ? 'none' : 'grayscale(100%)' }}
                >
                  {item.e}
                </div>
                <div className="font-bold text-gray-800 text-xs">{item.t}</div>
                <div
                  className={`text-xs mt-1 ${
                    isDone ? 'text-indigo-600' : 'text-gray-400'
                  }`}
                >
                  +{item.x} XP
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
