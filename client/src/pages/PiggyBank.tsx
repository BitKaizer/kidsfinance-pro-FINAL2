import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AppState, loadState, saveState, Transaction } from '@/lib/store';
import { Button } from '@/components/ui/button';

export default function PiggyBank() {
  const [, setLocation] = useLocation();
  const [state, setState] = useState<AppState>(loadState());
  const [tab, setTab] = useState<'view' | 'add' | 'spend'>('view');
  const [addAmount, setAddAmount] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [addPin, setAddPin] = useState('');
  const [spendAmount, setSpendAmount] = useState('');
  const [spendDesc, setSpendDesc] = useState('');
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleAddMoney = () => {
    const amt = parseFloat(addAmount);
    if (!amt || amt <= 0) {
      setMessage({ type: 'error', text: 'Enter a valid amount.' });
      return;
    }
    if (addPin !== state.pin) {
      setMessage({ type: 'error', text: '❌ Wrong PIN!' });
      setAddPin('');
      return;
    }

    const now = new Date();
    const newTx: Transaction = {
      amt,
      type: 'in',
      desc: addDesc || 'Money added',
      date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };

    const newState = {
      ...state,
      piggy: (state.piggy || 0) + amt,
      tx: [newTx, ...(state.tx || [])],
    };
    setState(newState);
    saveState(newState);
    setMessage({ type: 'success', text: `✅ $${amt.toFixed(2)} added!` });
    setAddAmount('');
    setAddDesc('');
    setAddPin('');
    setTimeout(() => setMessage(null), 2000);
  };

  const handleSpendMoney = () => {
    const amt = parseFloat(spendAmount);
    if (!amt || amt <= 0) {
      setMessage({ type: 'error', text: 'Enter a valid amount.' });
      return;
    }
    if (amt > (state.piggy || 0)) {
      setMessage({ type: 'error', text: '❌ Not enough money!' });
      return;
    }

    const now = new Date();
    const newTx: Transaction = {
      amt,
      type: 'out',
      desc: spendDesc || 'Purchase',
      date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      time: now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };

    const newState = {
      ...state,
      piggy: (state.piggy || 0) - amt,
      tx: [newTx, ...(state.tx || [])],
    };
    setState(newState);
    saveState(newState);
    setMessage({ type: 'success', text: `✅ $${amt.toFixed(2)} spent on "${spendDesc}"` });
    setSpendAmount('');
    setSpendDesc('');
    setTimeout(() => setMessage(null), 2000);
  };

  const handleSetGoal = () => {
    const amt = parseFloat(goalAmount);
    if (goalName && amt > 0) {
      const newState = {
        ...state,
        goal: { n: goalName, a: amt },
      };
      setState(newState);
      saveState(newState);
      setGoalName('');
      setGoalAmount('');
      setMessage({ type: 'success', text: '✅ Goal set!' });
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const icons = ['🐷', '💰', '💎', '🏆', '🌟', '👑'];
  const piggyIcon = icons[Math.min(Math.floor((state.piggy || 0) / 10), icons.length - 1)];

  const txs = state.tx || [];
  const tIn = txs.filter(t => t.type === 'in').reduce((s, t) => s + t.amt, 0);
  const tOut = txs.filter(t => t.type === 'out').reduce((s, t) => s + t.amt, 0);

  const goalProgress = state.goal ? Math.min(100, ((state.piggy || 0) / state.goal.a) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => setLocation('/')}
          className="text-white text-3xl mb-4 hover:opacity-75 transition"
        >
          ←
        </button>

        <div className="bg-white rounded-2xl p-6">
          {/* View Tab */}
          {tab === 'view' && (
            <>
              <div className="text-center mb-6">
                <div className="text-6xl mb-2">{piggyIcon}</div>
                <div className="text-4xl font-black text-gray-800 mb-2">
                  ${(state.piggy || 0).toFixed(2)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">${tIn.toFixed(2)}</div>
                  <div className="text-xs text-gray-600">Total In ↑</div>
                </div>
                <div className="bg-gray-100 rounded-lg p-3 text-center">
                  <div className="text-2xl font-bold text-red-600">${tOut.toFixed(2)}</div>
                  <div className="text-xs text-gray-600">Total Out ↓</div>
                </div>
              </div>

              {state.goal && (
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg p-4 mb-6">
                  <div className="font-bold text-gray-800 mb-2">🎯 {state.goal.n} — ${state.goal.a}</div>
                  <div className="bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all"
                      style={{ width: `${goalProgress}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-600">
                    ${(state.piggy || 0).toFixed(2)} / ${state.goal.a} ({Math.round(goalProgress)}%)
                    {goalProgress >= 100 && ' ✅ Goal reached! 🎉'}
                  </div>
                </div>
              )}

              <div className="space-y-2 mb-6">
                <Button
                  onClick={() => setTab('add')}
                  className="w-full bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600"
                >
                  💰 Add Money
                </Button>
                <Button
                  onClick={() => setTab('spend')}
                  className="w-full bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600"
                >
                  💸 I Spent
                </Button>
              </div>

              <div className="border-t pt-4">
                <div className="text-sm font-bold text-gray-800 mb-3">📋 History ({txs.length} entries)</div>
                {txs.length === 0 ? (
                  <div className="text-center text-gray-400 text-sm py-4">No transactions yet 👀</div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {txs.slice(0, 20).map((tx, i) => (
                      <div key={i} className="flex items-center gap-3 pb-2 border-b">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                            tx.type === 'in' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {tx.type === 'in' ? '↑' : '↓'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-800 text-sm truncate">{tx.desc}</div>
                          <div className="text-xs text-gray-500">{tx.date} · {tx.time}</div>
                        </div>
                        <div
                          className={`font-bold text-sm flex-shrink-0 ${
                            tx.type === 'in' ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {tx.type === 'in' ? '+' : '-'}${tx.amt.toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Add Money Tab */}
          {tab === 'add' && (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-4">💰 Add Money</h3>
              <input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="Amount"
                className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-green-500 focus:outline-none"
              />
              <input
                type="text"
                value={addDesc}
                onChange={(e) => setAddDesc(e.target.value)}
                placeholder="Where from? (e.g. allowance)"
                className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-green-500 focus:outline-none"
              />
              <input
                type="password"
                value={addPin}
                onChange={(e) => setAddPin(e.target.value)}
                placeholder="Parent PIN"
                className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-green-500 focus:outline-none"
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
              <div className="space-y-2">
                <Button
                  onClick={handleAddMoney}
                  className="w-full bg-green-500 text-white font-bold py-3 rounded-lg hover:bg-green-600"
                >
                  Add Money ✓
                </Button>
                <Button
                  onClick={() => setTab('view')}
                  className="w-full bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300"
                >
                  Back
                </Button>
              </div>
            </>
          )}

          {/* Spend Money Tab */}
          {tab === 'spend' && (
            <>
              <h3 className="text-xl font-bold text-gray-800 mb-4">💸 I Spent</h3>
              <input
                type="number"
                value={spendAmount}
                onChange={(e) => setSpendAmount(e.target.value)}
                placeholder="Amount"
                className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-red-500 focus:outline-none"
              />
              <input
                type="text"
                value={spendDesc}
                onChange={(e) => setSpendDesc(e.target.value)}
                placeholder="What did you buy?"
                className="w-full p-3 border-2 border-gray-300 rounded-lg mb-3 focus:border-red-500 focus:outline-none"
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
              <div className="space-y-2">
                <Button
                  onClick={handleSpendMoney}
                  className="w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600"
                >
                  Record Spending 💸
                </Button>
                <Button
                  onClick={() => setTab('view')}
                  className="w-full bg-gray-200 text-gray-800 font-bold py-2 rounded-lg hover:bg-gray-300"
                >
                  Back
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
