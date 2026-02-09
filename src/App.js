import React, { useState, useEffect } from 'react';
import { 
  Trash2, TreeDeciduous, Sprout, 
  Dumbbell, Brain, Glasses, Flame, Activity
} from 'lucide-react';

function App() {
  const [logs, setLogs] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [todayData, setTodayData] = useState({
    date: new Date().toISOString().split('T')[0],
    reading: '',
    exercise: '',
    fruits: 0,
    learning: '',
    screentime: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('myHabitAppData');
    if (saved) {
      try { setLogs(JSON.parse(saved)); } catch (e) { setLogs([]); }
    }
  }, []);

  const saveDay = (e) => {
    e.preventDefault();
    if (!todayData.date) return;
    const updated = [todayData, ...logs.filter(l => l.date !== todayData.date)]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    if (parseInt(todayData.learning) >= 60) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    setLogs(updated);
    localStorage.setItem('myHabitAppData', JSON.stringify(updated));
    setTodayData({ ...todayData, reading: '', exercise: '', fruits: 0, learning: '', screentime: '' });
  };

  const deleteLog = (date) => {
    if (window.confirm('Delete?')) {
      const updated = logs.filter(l => l.date !== date);
      setLogs(updated);
      localStorage.setItem('myHabitAppData', JSON.stringify(updated));
    }
  };

  const totalPages = logs.reduce((acc, curr) => acc + (parseInt(curr.reading) || 0), 0);
  const totalFruits = logs.reduce((acc, curr) => acc + (parseInt(curr.fruits) || 0), 0);
  const workoutDays = logs.filter(l => l.exercise && l.exercise.trim() !== '').length;
  const booksCompleted = Math.floor(totalPages / 250);
  const treesCompleted = Math.floor(totalFruits / 2);
  const learnMins = parseInt(todayData.learning) || 0;

  let streak = 0;
  if (logs.length > 0) {
    streak = 1;
    for (let i = 0; i < logs.length - 1; i++) {
      const current = new Date(logs[i].date);
      const next = new Date(logs[i + 1].date);
      if ((current - next) / 86400000 === 1) streak++;
      else break;
    }
  }

  const isSyncing = learnMins >= 30 && learnMins < 60;
  const isFlow = learnMins >= 60;

  // SAFE CALCULATION: Pure numbers only
  const readVal = totalPages % 250 / 2.5;
  const trainVal = Math.min((workoutDays / 150) * 100, 100);

  // Dynamic Class Construction
  const brainCoreClass = isFlow ? 'bg-indigo-600' : (isSyncing ? 'bg-indigo-100' : 'bg-slate-50');
  const brainIconClass = isFlow ? 'text-white' : (isSyncing ? 'text-indigo-600' : 'text-slate-200');

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans antialiased">
      {showConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-md">
          <h2 className="text-4xl font-black text-indigo-600 animate-bounce">FLOW STATE</h2>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter">HABIT_OS</h1>
          <div className="flex gap-2">
            <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm font-bold">
              {logs.length}d
            </div>
            {streak >= 3 && (
              <div className="bg-orange-500 text-white px-4 py-2 rounded-2xl shadow-lg flex items-center gap-2">
                <Flame size={18} fill="currentColor" />
                <span className="font-bold">{streak}</span>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Glasses size={14}/> Library</span>
              <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                {/* CSS VARIABLE INJECTION: The safest way to pass percentage to style */}
                <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: readVal + '%' }}></div>
              </div>
            </div>
            <div className="flex items-end gap-2 overflow-x-auto pb-4 h-40">
              {[...Array(booksCompleted)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-10 h-32 bg-slate-50 border-2 border-slate-100 rounded-lg flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                  <span className="rotate-90 text-[8px] font-black">VOL_{i+1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
            <div className={`absolute inset-0 border-4 border-indigo-100 rounded-full animate-ping opacity-10 ${isFlow ? 'block' : 'hidden'}`}></div>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 transition-colors duration-500 ${brainCoreClass}`}>
              <Brain size={40} className={brainIconClass} />
            </div>
            <div className="text-center font-black">
              <div className="text-3xl">{learnMins}m</div>
              <div className="text-[10px] text-indigo-500 uppercase mt-1 tracking-widest">{isFlow ? 'FLOW' : 'READY'}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase mb-6 flex items-center gap-2"><TreeDeciduous size={14} className="text-emerald-500"/> Orchard</h3>
            <div className="flex flex-wrap gap-2 h-12">
              {[...Array(treesCompleted)].map((_, i) => <TreeDeciduous key={i} size={32} className="text-emerald-500 fill-emerald-500/10" />)}
              {totalFruits % 2 !== 0 && <Sprout size={24} className="text-emerald-300 animate-bounce" />}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl">
            <div className="flex justify-between items-end">
              <div className="text-6xl font-black">{workoutDays}</div>
              <div className="flex-1 ml-8 mb-2">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: trainVal + '%' }}></div>
                </div>
                <div className="text-[8px] font-black text-slate-500 mt-2 tracking-widest uppercase">Target 150</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl mb-6">
          <form onSubmit={saveDay} className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <input type="date" className="p-3 bg-slate-50 rounded-xl font-bold text-sm" value={todayData.date} onChange={e => setTodayData({...todayData, date: e.target.value})} />
            <input type="number" placeholder="Pages" className="p-3 bg-blue-50/50 rounded-xl font-bold text-sm" value={todayData.reading} onChange={e => setTodayData({...todayData, reading: e.target.value})} />
            <input type="number" placeholder="Fruits" className="p-3 bg-emerald-50/50 rounded-xl font-bold text-sm" value={todayData.fruits} onChange={e => setTodayData({...todayData, fruits: e.target.value})} />
            <input type="number" placeholder="Mins" className="p-3 bg-indigo-50/50 rounded-xl font-bold text-sm" value={todayData.learning} onChange={e => setTodayData({...todayData, learning: e.target.value})} />
            <input type="text" placeholder="Exercise" className="p-3 bg-slate-50 rounded-xl font-bold text-sm lg:col-span-1" value={todayData.exercise} onChange={e => setTodayData({...todayData, exercise: e.target.value})} />
            <button type="submit" className="p-3 bg-slate-900 text-white rounded-xl font-black text-sm hover:bg-indigo-600 transition-colors">LOG</button>
          </form>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <tbody>
              {logs.map(log => (
                <tr key={log.date} className="border-b border-slate-50 last:border-0">
                  <td className="p-4 text-xs font-bold text-slate-400">{log.date}</td>
                  <td className="p-4 font-black text-xs uppercase space-x-4">
                    <span className="text-blue-600">{log.reading || 0}p</span>
                    <span className="text-emerald-600">{log.fruits || 0}f</span>
                    <span className="text-indigo-600">{log.learning || 0}m</span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => deleteLog(log.date)} className="text-slate-200 hover:text-red-500"><Trash2 size={14}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;