import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AppState, loadState, saveState, LESSONS } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function Lessons() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<AppState>(loadState());

  const allLessons = [...LESSONS, ...(state.cL || [])];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setLocation('/')}
          className="text-white text-3xl mb-4 hover:opacity-75 transition"
        >
          ←
        </button>
        <h1 className="text-white font-black text-2xl mb-4">📚 Lessons</h1>

        <div className="space-y-3">
          {allLessons.map((lesson, i) => {
            const isDone = state.dL.includes(String(lesson.id));
            const isLocked = i > 0 && !state.dL.includes(String(allLessons[i - 1].id));

            return (
              <button
                key={lesson.id}
                onClick={() => {
                  if (!isLocked) {
                    const newState = { ...state, curL: lesson };
                    setState(newState);
                    saveState(newState);
                    setTimeout(() => setLocation('/lesson-read'), 100);
                  }
                }}
                disabled={isLocked}
                className={`w-full bg-white rounded-2xl p-4 flex items-center gap-3 transition-all ${
                  isDone
                    ? 'border-2 border-green-500 opacity-100'
                    : isLocked
                      ? 'opacity-50 cursor-not-allowed'
                      : 'border-2 border-gray-200 hover:shadow-lg'
                }`}
              >
                <div className={`text-3xl p-2 rounded-xl ${isLocked ? 'opacity-50' : ''}`}>
                  {isLocked ? '🔒' : lesson.e}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-gray-800 text-sm">
                    {lesson.t}
                    {lesson._c && <span className="ml-2 bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded">custom</span>}
                  </div>
                  <div className="text-gray-600 text-xs">
                    +{lesson.x} XP{isLocked ? ' · Complete previous first' : ''}
                  </div>
                </div>
                {isDone && <div className="text-2xl">✅</div>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
