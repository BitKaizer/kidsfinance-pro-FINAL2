import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AppState, loadState, saveState } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function ChallengeScreen() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<AppState>(loadState());
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    const currentState = loadState();
    if (!currentState.curC) {
      setLocation('/challenges');
    }
  }, [setLocation]);

  if (!state.curC) {
    return null;
  }

  const challenge = state.curC;

  const handleCheckAnswer = () => {
    const userAnswer = answer.trim().toLowerCase();
    const correctAnswer = String(challenge.a).toLowerCase();

    if (userAnswer === correctAnswer) {
      setResult({ type: 'success', message: `🎉 Correct! +${challenge.x} XP!` });
      setIsChecked(true);
      
      const id = String(challenge.id);
      if (!state.dC.includes(id)) {
        const newState = {
          ...state,
          dC: [...state.dC, id],
          xp: state.xp + challenge.x,
        };
        setState(newState);
        saveState(newState);
      }
    } else {
      setResult({
        type: 'error',
        message: `💡 Hint: ${challenge.h}`,
      });
      setIsChecked(false);
    }
  };

  const handleReset = () => {
    setAnswer('');
    setResult(null);
    setIsChecked(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setLocation('/challenges')}
          className="text-white text-3xl mb-4 hover:opacity-75 transition"
        >
          ←
        </button>

        <div className="bg-white rounded-2xl p-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{challenge.e}</div>
            <h2 className="text-2xl font-black text-gray-800">{challenge.t}</h2>
          </div>

          <p className="text-gray-700 text-base leading-relaxed mb-6">{challenge.d}</p>

          <input
            type="text"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer..."
            disabled={isChecked}
            className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 focus:border-indigo-600 focus:outline-none disabled:opacity-50"
            onKeyPress={(e) => e.key === 'Enter' && !isChecked && handleCheckAnswer()}
          />

          {result && (
            <div
              className={`p-4 rounded-lg mb-4 text-sm font-bold ${
                result.type === 'success'
                  ? 'bg-green-100 text-green-800 border-l-4 border-green-500'
                  : 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500'
              }`}
            >
              {result.message}
            </div>
          )}

          <div className="space-y-2">
            {!isChecked ? (
              <Button
                onClick={handleCheckAnswer}
                disabled={!answer.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition disabled:opacity-50"
              >
                Check Answer ✓
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleReset}
                  className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700"
                >
                  Try Again
                </Button>
                <Button
                  onClick={() => setLocation('/challenges')}
                  className="w-full bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300"
                >
                  Back to Challenges
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
