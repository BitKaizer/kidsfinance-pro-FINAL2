import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AppState, loadState, saveState, CHALLENGES } from '@/lib/store';

export default function Challenges() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<AppState>(loadState());

  const allChallenges = [...CHALLENGES, ...(state.cC || [])];

  const handleSelectChallenge = (challenge: any) => {
    const newState = { ...state, curC: challenge };
    setState(newState);
    saveState(newState);
    setTimeout(() => setLocation('/challenge-screen'), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setLocation('/')}
          className="text-white text-3xl mb-4 hover:opacity-75 transition"
        >
          ←
        </button>
        <h1 className="text-white font-black text-2xl mb-4">🧠 Challenges</h1>

        <div className="space-y-3">
          {allChallenges.length === 0 ? (
            <div className="text-white text-center py-8">
              <div className="text-4xl mb-2">📚</div>
              <p>No challenges available yet</p>
            </div>
          ) : (
            allChallenges.map((challenge) => {
              const isDone = state.dC.includes(String(challenge.id));

              return (
                <button
                  key={challenge.id}
                  onClick={() => handleSelectChallenge(challenge)}
                  className={`w-full bg-white rounded-2xl p-4 flex items-center gap-3 transition-all border-2 ${
                    isDone
                      ? 'border-green-500 opacity-100'
                      : 'border-gray-200 hover:shadow-lg'
                  }`}
                >
                  <div className="text-3xl p-2 rounded-xl bg-green-50">{challenge.e}</div>
                  <div className="flex-1 text-left">
                    <div className="font-bold text-gray-800 text-sm">
                      {challenge.t}
                      {challenge._c && <span className="ml-2 bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">custom</span>}
                    </div>
                    <div className="text-gray-600 text-xs">+{challenge.x} XP</div>
                  </div>
                  {isDone && <div className="text-2xl">✅</div>}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
