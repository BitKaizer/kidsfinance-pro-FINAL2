import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AppState, loadState, saveState } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function LessonRead() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<AppState>(loadState());
  const [lesson, setLesson] = useState(state.curL);

  useEffect(() => {
    const currentState = loadState();
    if (currentState.curL) {
      setLesson(currentState.curL);
      setState(currentState);
    } else {
      setLocation('/lessons');
    }
  }, [setLocation]);

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">📚</div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const handleStartQuiz = () => {
    const newState = {
      ...state,
      qStep: 0,
      qSc: 0,
      qAns: false,
    };
    setState(newState);
    saveState(newState);
    setTimeout(() => setLocation('/quiz'), 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setLocation('/lessons')}
          className="text-white text-3xl mb-4 hover:opacity-75 transition"
        >
          ←
        </button>

        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <div className="text-center mb-6">
            <div className="text-6xl mb-3">{lesson.e}</div>
            <h2 className="text-2xl font-black text-gray-800">{lesson.t}</h2>
          </div>

          <div className="max-h-96 overflow-y-auto mb-6">
            <p className="text-gray-700 text-sm leading-relaxed mb-4 whitespace-pre-wrap">{lesson.ct}</p>

            {lesson.p && lesson.p.length > 0 && (
              <div className="space-y-2 mb-4">
                <div className="font-bold text-gray-800 text-sm mb-2">📌 Key Points:</div>
                {lesson.p.map((point, i) => (
                  <div key={i} className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded text-sm text-gray-700">
                    ✓ {point}
                  </div>
                ))}
              </div>
            )}

            {lesson.ex && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-sm text-yellow-900">
                <div className="font-bold mb-2">💡 Example:</div>
                <p>{lesson.ex}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleStartQuiz}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition"
            >
              🧠 Take the Quiz!
            </Button>
            <Button
              onClick={() => setLocation('/lessons')}
              className="w-full bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300"
            >
              ← Back to Lessons
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
