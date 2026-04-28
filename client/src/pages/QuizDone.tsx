import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AppState, loadState } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function QuizDone() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<AppState>(loadState());

  if (!state.curL) {
    setLocation('/lessons');
    return null;
  }

  const lesson = state.curL;
  const pct = Math.round((state.qSc || 0) / lesson.q.length * 100);
  const passed = pct >= 70;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 flex items-center justify-center">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl p-8 text-center">
          <div className="text-7xl mb-4">{passed ? '🎉' : '💪'}</div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">
            {passed ? 'Lesson Complete!' : 'Keep Practicing!'}
          </h2>
          <p className="text-gray-600 mb-6">
            Score: {state.qSc}/{lesson.q.length} ({pct}%)
          </p>
          <div className="bg-gradient-to-r from-yellow-300 to-orange-400 text-gray-800 font-bold py-3 px-4 rounded-xl mb-6">
            +{lesson.x} XP Earned! ⭐
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setLocation('/lessons')}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl"
            >
              Back to Lessons
            </Button>
            <Button
              onClick={() => setLocation('/')}
              className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-xl hover:bg-gray-300"
            >
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
