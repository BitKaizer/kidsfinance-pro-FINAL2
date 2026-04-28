import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AppState, loadState, saveState, LEVELS, LESSONS, CHALLENGES, TRANSLATIONS } from '@/lib/store';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';

export default function Home() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<AppState>(loadState());
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstall, setShowInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowInstall(false);
    }
  };

  const t = TRANSLATIONS[state.lang];
  const currentLevel = LEVELS.slice().reverse().find(l => state.xp >= l.x) || LEVELS[0];
  const nextLevel = LEVELS.find(l => l.x > state.xp);
  const progressPercent = nextLevel ? ((state.xp - currentLevel.x) / (nextLevel.x - currentLevel.x)) * 100 : 100;

  const lessonsCount = LESSONS.length + (state.cL?.length || 0);
  const challengesCount = CHALLENGES.length + (state.cC?.length || 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center py-6">
          <Logo size="lg" light />
          <p className="text-white/75 text-sm mt-2">{t.appSub}</p>
        </div>

        {/* Level Card */}
        <div className="bg-white/15 backdrop-blur-md rounded-3xl p-5 mb-4 border border-white/20">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-4xl">{currentLevel.e}</div>
            <div className="flex-1">
              <div className="text-white font-black text-sm">{currentLevel.n}</div>
              <div className="text-white/70 text-xs">
                {state.xp} XP · 🔥 {state.streak} {t.streak}
              </div>
            </div>
          </div>
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-yellow-300 to-orange-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="text-white/70 text-xs mt-2">
            {nextLevel ? `${nextLevel.x - state.xp} ${t.xpTo} ${nextLevel.n}` : t.maxLevel}
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="space-y-3 mb-4">
          {/* Lessons */}
          <button
            onClick={() => setLocation('/lessons')}
            className="w-full bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:scale-105 transition-transform text-left flex items-center gap-3"
          >
            <div className="text-3xl bg-white/20 rounded-xl p-2">📚</div>
            <div className="flex-1">
              <div className="text-white font-bold text-base">{t.lessons}</div>
              <div className="text-white/70 text-xs">
                {state.dL.length}/{lessonsCount} {t.lessons.toLowerCase()}
              </div>
            </div>
            <div className="text-white/40 text-2xl">›</div>
          </button>

          {/* Challenges */}
          <button
            onClick={() => setLocation('/challenges')}
            className="w-full bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:scale-105 transition-transform text-left flex items-center gap-3"
          >
            <div className="text-3xl bg-white/20 rounded-xl p-2">🧠</div>
            <div className="flex-1">
              <div className="text-white font-bold text-base">{t.challenges}</div>
              <div className="text-white/70 text-xs">
                {state.dC.length}/{challengesCount} {t.challenges.toLowerCase()}
              </div>
            </div>
            <div className="text-white/40 text-2xl">›</div>
          </button>

          {/* Piggy Bank */}
          <button
            onClick={() => setLocation('/piggy')}
            className="w-full bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:scale-105 transition-transform text-left flex items-center gap-3"
          >
            <div className="text-3xl bg-white/20 rounded-xl p-2">🐷</div>
            <div className="flex-1">
              <div className="text-white font-bold text-base">{t.piggyBank}</div>
              <div className="text-white/70 text-xs">${(state.piggy || 0).toFixed(2)} {t.balance}</div>
            </div>
            <div className="text-white/40 text-2xl">›</div>
          </button>

          {/* Badges */}
          <button
            onClick={() => setLocation('/badges')}
            className="w-full bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:scale-105 transition-transform text-left flex items-center gap-3"
          >
            <div className="text-3xl bg-white/20 rounded-xl p-2">🏅</div>
            <div className="flex-1">
              <div className="text-white font-bold text-base">{t.badges}</div>
              <div className="text-white/70 text-xs">
                {state.dL.length + state.dC.length} {t.badges.toLowerCase()}
              </div>
            </div>
            <div className="text-white/40 text-2xl">›</div>
          </button>

          {/* Parent Area */}
          <button
            onClick={() => setLocation('/parent-gate')}
            className="w-full bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/20 hover:scale-105 transition-transform text-left flex items-center gap-3"
          >
            <div className="text-3xl bg-white/20 rounded-xl p-2">👨‍👩‍👧</div>
            <div className="flex-1">
              <div className="text-white font-bold text-base">{t.parentArea}</div>
              <div className="text-white/70 text-xs">{t.parentSub}</div>
            </div>
            <div className="text-white/40 text-2xl">›</div>
          </button>
        </div>

        {/* Install Banner */}
        {showInstall && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-4 mb-4 flex items-center gap-3 border border-white/20">
            <div className="text-3xl">📲</div>
            <div className="flex-1">
              <div className="text-white font-bold text-sm">{t.installApp}</div>
              <div className="text-white/80 text-xs">{t.installSub}</div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                className="bg-white text-indigo-600 hover:bg-white/90 text-xs font-bold px-3 py-1"
              >
                {t.install}
              </Button>
              <button
                onClick={() => setShowInstall(false)}
                className="text-white/70 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center py-4">
          <div className="mb-1"><Logo size="sm" light /></div>
          <div className="text-white/30 text-xs">© 2025 KidsFinance Pro</div>
        </div>
      </div>
    </div>
  );
}
