import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AppState, loadState, saveState, LEVELS, LESSONS, CHALLENGES, Lesson, Quiz } from '@/lib/store';
import { downloadJSON, downloadCSV, generateBackupFilename } from '@/lib/export-utils';
import { Button } from '@/components/ui/button';

export default function ParentArea() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<AppState>(loadState());
  const [tab, setTab] = useState<'overview' | 'lessons' | 'challenges' | 'settings'>('overview');

  // Lesson form
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonEmoji, setLessonEmoji] = useState('✏️');
  const [lessonContent, setLessonContent] = useState('');
  const [lessonXP, setLessonXP] = useState('20');
  const [lessonPoints, setLessonPoints] = useState('');
  const [lessonQuestions, setLessonQuestions] = useState<any[]>([{ q: '', o: ['', '', ''], c: 0 }]);

  // Challenge form
  const [challengeTitle, setChallengeTitle] = useState('');
  const [challengeEmoji, setChallengeEmoji] = useState('🎯');
  const [challengeDesc, setChallengeDesc] = useState('');
  const [challengeAnswer, setChallengeAnswer] = useState('');
  const [challengeHint, setChallengeHint] = useState('');
  const [challengeXP, setChallengeXP] = useState('20');

  // Settings
  const [childName, setChildName] = useState(state.name);
  const [newPin1, setNewPin1] = useState('');
  const [newPin2, setNewPin2] = useState('');
  const [bonusXP, setBonusXP] = useState('');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const currentLevel = LEVELS.slice().reverse().find(l => state.xp >= l.x) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.x > state.xp);

  const handleSaveLesson = () => {
    if (!lessonTitle || !lessonContent) {
      setMessage({ type: 'error', text: 'Fill in title and content.' });
      return;
    }

    const newLesson: Lesson = {
      id: `custom-${Date.now()}`,
      t: lessonTitle,
      e: lessonEmoji,
      ct: lessonContent,
      x: parseInt(lessonXP) || 20,
      p: lessonPoints ? lessonPoints.split('|').map(p => p.trim()) : [],
      q: lessonQuestions.filter(q => q.q && q.o[0] && q.o[1] && q.o[2]),
      _c: true,
    };

    if (newLesson.q.length === 0) {
      setMessage({ type: 'error', text: 'Add at least 1 question.' });
      return;
    }

    const newState = {
      ...state,
      cL: [...(state.cL || []), newLesson],
    };
    setState(newState);
    saveState(newState);
    setMessage({ type: 'success', text: `✅ "${lessonTitle}" saved!` });
    setLessonTitle('');
    setLessonEmoji('✏️');
    setLessonContent('');
    setLessonXP('20');
    setLessonPoints('');
    setLessonQuestions([{ q: '', o: ['', '', ''], c: 0 }]);
    setTimeout(() => setMessage(null), 2000);
  };

  const handleSaveChallenge = () => {
    if (!challengeTitle || !challengeDesc || !challengeAnswer) {
      setMessage({ type: 'error', text: 'Fill in all fields.' });
      return;
    }

    const newChallenge = {
      id: `custom-${Date.now()}`,
      t: challengeTitle,
      e: challengeEmoji,
      d: challengeDesc,
      a: challengeAnswer,
      x: parseInt(challengeXP) || 20,
      h: challengeHint || 'Think carefully!',
      _c: true,
    };

    const newState = {
      ...state,
      cC: [...(state.cC || []), newChallenge],
    };
    setState(newState);
    saveState(newState);
    setMessage({ type: 'success', text: `✅ "${challengeTitle}" saved!` });
    setChallengeTitle('');
    setChallengeEmoji('🎯');
    setChallengeDesc('');
    setChallengeAnswer('');
    setChallengeHint('');
    setChallengeXP('20');
    setTimeout(() => setMessage(null), 2000);
  };

  const handleChangeName = () => {
    const newState = { ...state, name: childName };
    setState(newState);
    saveState(newState);
    setMessage({ type: 'success', text: '✅ Name saved!' });
    setTimeout(() => setMessage(null), 2000);
  };

  const handleChangePin = () => {
    if (newPin1.length < 4) {
      setMessage({ type: 'error', text: 'Min 4 digits.' });
      return;
    }
    if (newPin1 !== newPin2) {
      setMessage({ type: 'error', text: "PINs don't match." });
      return;
    }
    const newState = { ...state, pin: newPin1 };
    setState(newState);
    saveState(newState);
    setMessage({ type: 'success', text: '✅ PIN updated!' });
    setNewPin1('');
    setNewPin2('');
    setTimeout(() => setMessage(null), 2000);
  };

  const handleGiveBonus = () => {
    const v = parseInt(bonusXP);
    if (v > 0) {
      const newState = { ...state, xp: state.xp + v };
      setState(newState);
      saveState(newState);
      setMessage({ type: 'success', text: `✅ +${v} XP given!` });
      setBonusXP('');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure? This will reset all progress.')) {
      const newState = {
        ...state,
        xp: 0,
        dL: [],
        dC: [],
        piggy: 0,
        tx: [],
        goal: null,
        streak: 0,
      };
      setState(newState);
      saveState(newState);
      setMessage({ type: 'success', text: '✅ Reset done.' });
      setTimeout(() => setMessage(null), 2000);
    }
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

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4">
          {(['overview', 'lessons', 'challenges', 'settings'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg font-bold text-xs transition ${
                tab === t
                  ? 'bg-white text-indigo-600'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              {t === 'overview' && '📊'}
              {t === 'lessons' && '📚'}
              {t === 'challenges' && '🧠'}
              {t === 'settings' && '⚙️'}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6">
          {/* Overview Tab */}
          {tab === 'overview' && (
            <>
              <h2 className="text-xl font-black text-gray-800 mb-4">CHILD PROGRESS</h2>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-indigo-600">{state.xp}</div>
                  <div className="text-xs text-gray-600 mt-1">Total XP</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-600">{currentLevel.e}</div>
                  <div className="text-xs text-gray-600 mt-1">{currentLevel.n}</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-600">{state.dL.length}</div>
                  <div className="text-xs text-gray-600 mt-1">Lessons Done</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-orange-600">{state.dC.length}</div>
                  <div className="text-xs text-gray-600 mt-1">Challenges Done</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-800 mb-2">💰 ${(state.piggy || 0).toFixed(2)}</div>
                <div className="text-xs text-gray-600">Saved in Piggy Bank</div>
              </div>
            </>
          )}

          {/* Lessons Tab */}
          {tab === 'lessons' && (
            <>
              <h2 className="text-xl font-black text-gray-800 mb-4">ADD CUSTOM LESSON</h2>
              <input
                type="text"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
                placeholder="Title"
                className="w-full p-2 border-2 border-gray-300 rounded-lg mb-2 focus:border-indigo-600 focus:outline-none text-sm"
              />
              <input
                type="text"
                value={lessonEmoji}
                onChange={(e) => setLessonEmoji(e.target.value)}
                placeholder="Emoji"
                className="w-full p-2 border-2 border-gray-300 rounded-lg mb-2 focus:border-indigo-600 focus:outline-none text-sm"
              />
              <textarea
                value={lessonContent}
                onChange={(e) => setLessonContent(e.target.value)}
                placeholder="Content"
                className="w-full p-2 border-2 border-gray-300 rounded-lg mb-2 focus:border-indigo-600 focus:outline-none text-sm min-h-20"
              />
              <input
                type="text"
                value={lessonPoints}
                onChange={(e) => setLessonPoints(e.target.value)}
                placeholder="Key points (separated by |)"
                className="w-full p-2 border-2 border-gray-300 rounded-lg mb-2 focus:border-indigo-600 focus:outline-none text-sm"
              />
              <input
                type="number"
                value={lessonXP}
                onChange={(e) => setLessonXP(e.target.value)}
                placeholder="XP"
                className="w-full p-2 border-2 border-gray-300 rounded-lg mb-4 focus:border-indigo-600 focus:outline-none text-sm"
              />

              {message && (
                <div
                  className={`p-3 rounded-lg mb-3 text-sm font-bold ${
                    message.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button
                onClick={handleSaveLesson}
                className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700"
              >
                💾 Save Lesson
              </Button>

              {state.cL && state.cL.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm font-bold text-gray-800 mb-2">Custom Lessons ({state.cL.length})</div>
                  {state.cL.map((lesson, i) => (
                    <div key={i} className="bg-gray-100 rounded-lg p-2 mb-2 text-sm">
                      <div className="font-bold">{lesson.e} {lesson.t}</div>
                      <div className="text-xs text-gray-600">{lesson.q.length} questions · +{lesson.x} XP</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Challenges Tab */}
          {tab === 'challenges' && (
            <>
              <h2 className="text-xl font-black text-gray-800 mb-4">ADD CUSTOM CHALLENGE</h2>
              <input
                type="text"
                value={challengeTitle}
                onChange={(e) => setChallengeTitle(e.target.value)}
                placeholder="Title"
                className="w-full p-2 border-2 border-gray-300 rounded-lg mb-2 focus:border-indigo-600 focus:outline-none text-sm"
              />
              <input
                type="text"
                value={challengeEmoji}
                onChange={(e) => setChallengeEmoji(e.target.value)}
                placeholder="Emoji"
                className="w-full p-2 border-2 border-gray-300 rounded-lg mb-2 focus:border-indigo-600 focus:outline-none text-sm"
              />
              <textarea
                value={challengeDesc}
                onChange={(e) => setChallengeDesc(e.target.value)}
                placeholder="Description"
                className="w-full p-2 border-2 border-gray-300 rounded-lg mb-2 focus:border-indigo-600 focus:outline-none text-sm min-h-16"
              />
              <input
                type="text"
                value={challengeAnswer}
                onChange={(e) => setChallengeAnswer(e.target.value)}
                placeholder="Answer"
                className="w-full p-2 border-2 border-gray-300 rounded-lg mb-2 focus:border-indigo-600 focus:outline-none text-sm"
              />
              <input
                type="text"
                value={challengeHint}
                onChange={(e) => setChallengeHint(e.target.value)}
                placeholder="Hint"
                className="w-full p-2 border-2 border-gray-300 rounded-lg mb-2 focus:border-indigo-600 focus:outline-none text-sm"
              />
              <input
                type="number"
                value={challengeXP}
                onChange={(e) => setChallengeXP(e.target.value)}
                placeholder="XP"
                className="w-full p-2 border-2 border-gray-300 rounded-lg mb-4 focus:border-indigo-600 focus:outline-none text-sm"
              />

              {message && (
                <div
                  className={`p-3 rounded-lg mb-3 text-sm font-bold ${
                    message.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button
                onClick={handleSaveChallenge}
                className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700"
              >
                💾 Save Challenge
              </Button>

              {state.cC && state.cC.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm font-bold text-gray-800 mb-2">Custom Challenges ({state.cC.length})</div>
                  {state.cC.map((challenge, i) => (
                    <div key={i} className="bg-gray-100 rounded-lg p-2 mb-2 text-sm">
                      <div className="font-bold">{challenge.e} {challenge.t}</div>
                      <div className="text-xs text-gray-600">Answer: {challenge.a} · +{challenge.x} XP</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Settings Tab */}
          {tab === 'settings' && (
            <>
              <h2 className="text-xl font-black text-gray-800 mb-4">SETTINGS</h2>

              <div className="mb-6">
                <label className="text-sm font-bold text-gray-800 block mb-2">CHILD NAME</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none text-sm"
                />
                <Button
                  onClick={handleChangeName}
                  className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 mt-2"
                >
                  Save
                </Button>
              </div>

              <div className="mb-6">
                <label className="text-sm font-bold text-gray-800 block mb-2">CHANGE PIN</label>
                <input
                  type="password"
                  value={newPin1}
                  onChange={(e) => setNewPin1(e.target.value)}
                  placeholder="New PIN"
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none text-sm mb-2"
                />
                <input
                  type="password"
                  value={newPin2}
                  onChange={(e) => setNewPin2(e.target.value)}
                  placeholder="Confirm PIN"
                  className="w-full p-2 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none text-sm"
                />
                <Button
                  onClick={handleChangePin}
                  className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg hover:bg-indigo-700 mt-2"
                >
                  Update PIN
                </Button>
              </div>

              <div className="mb-6">
                <label className="text-sm font-bold text-gray-800 block mb-2">BONUS XP</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={bonusXP}
                    onChange={(e) => setBonusXP(e.target.value)}
                    placeholder="Amount"
                    className="flex-1 p-2 border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none text-sm"
                  />
                  <Button
                    onClick={handleGiveBonus}
                    className="bg-green-600 text-white font-bold px-4 rounded-lg hover:bg-green-700"
                  >
                    Give!
                  </Button>
                </div>
              </div>

              {message && (
                <div
                  className={`p-3 rounded-lg mb-3 text-sm font-bold ${
                    message.type === 'success'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {message.text}
                </div>
              )}

              <Button
                onClick={handleReset}
                className="w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700 mb-4"
              >
                🗑️ Reset Progress
              </Button>

              <div className="border-t pt-4">
                <label className="text-sm font-bold text-gray-800 block mb-3">BACKUP & EXPORT</label>
                <Button
                  onClick={() => downloadJSON(state, generateBackupFilename())}
                  className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700 mb-2"
                >
                  📤 Export JSON
                </Button>
                <Button
                  onClick={() => downloadCSV(state, `kidsfinance-backup-${new Date().toISOString().split('T')[0]}.csv`)}
                  className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700"
                >
                  📊 Export CSV
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
