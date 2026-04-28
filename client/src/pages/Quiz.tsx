import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AppState, loadState, saveState } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function Quiz() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<AppState>(loadState());
  const [answered, setAnswered] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    const currentState = loadState();
    if (!currentState.curL || currentState.qStep === undefined) {
      setLocation('/lessons');
    }
  }, [setLocation]);

  if (!state.curL || state.qStep === undefined) {
    return null;
  }

  const lesson = state.curL;
  const question = lesson.q[state.qStep];
  const isLastQuestion = state.qStep === lesson.q.length - 1;

  const handleAnswerClick = (index: number) => {
    if (answered) return;
    setAnswered(true);
    setSelectedIndex(index);

    if (index === question.c) {
      const newState = {
        ...state,
        qSc: (state.qSc || 0) + 1,
      };
      setState(newState);
      saveState(newState);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      const id = String(lesson.id);
      const finalScore = (state.qSc || 0) + (selectedIndex === question.c ? 1 : 0);
      const pct = Math.round((finalScore / lesson.q.length) * 100);
      
      const newState = {
        ...state,
        qSc: finalScore,
        dL: state.dL.includes(id) ? state.dL : [...state.dL, id],
        xp: state.xp + (state.dL.includes(id) ? 0 : lesson.x),
        qStep: 0,
      };
      setState(newState);
      saveState(newState);
      setLocation('/quiz-done');
    } else {
      const newState = {
        ...state,
        qStep: (state.qStep || 0) + 1,
      };
      setState(newState);
      saveState(newState);
      setAnswered(false);
      setSelectedIndex(null);
    }
  };

  const progressPercent = ((state.qStep || 0) / lesson.q.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setLocation('/lessons')}
          className="text-white text-3xl mb-4 hover:opacity-75 transition"
        >
          ←
        </button>

        <div className="bg-white rounded-2xl p-6">
          <div className="flex justify-between mb-4 text-xs font-bold text-gray-600">
            <span>Q{(state.qStep || 0) + 1}/{lesson.q.length}</span>
            <span className="text-indigo-600">Score: {state.qSc || 0}</span>
          </div>

          <div className="bg-gray-100 rounded-full h-2 mb-6 overflow-hidden">
            <div
              className="bg-indigo-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <h3 className="text-lg font-bold text-gray-800 mb-6">{question.q}</h3>

          <div className="space-y-2 mb-6">
            {question.o.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswerClick(i)}
                disabled={answered}
                className={`w-full p-3 rounded-lg border-2 font-semibold text-sm transition ${
                  !answered
                    ? 'border-gray-200 bg-gray-50 hover:border-indigo-400 cursor-pointer'
                    : i === question.c
                      ? 'border-green-500 bg-green-100 text-green-800'
                      : i === selectedIndex
                        ? 'border-red-500 bg-red-100 text-red-800'
                        : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {answered && (
            <div className="space-y-3">
              {selectedIndex !== question.c && (
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm text-blue-800">
                  <strong>💡 Hint:</strong> {question.o[question.c]}
                </div>
              )}
              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl"
              >
                {isLastQuestion ? 'Finish! 🎉' : 'Next →'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
