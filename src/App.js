import React, { useState, useEffect } from 'react';
import { 
  Trash2, TreeDeciduous, Sprout, 
  Brain, Glasses
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
    if (window.confirm('Delete entry?')) {
      const updated = logs.filter(l => l.date !== date);
      setLogs(updated);
      localStorage.setItem('myHabitAppData', JSON.stringify(updated));
    }
  };

  // --- Calculations ---
  const totalPages = logs.reduce((acc, curr) => acc + (parseInt(curr.reading) || 0), 0);
  const totalFruits = logs.reduce((acc, curr) => acc + (parseInt(curr.fruits) || 0), 0);
  const workoutDays = logs.filter(l => l.exercise && l.exercise.trim() !== '').length;
  const booksCompleted = Math.floor(totalPages / 250);
  const treesCompleted = Math.floor(totalFruits / 2);
  const learnMins = parseInt(todayData.learning) || 0;

  // --- Logic for UI States ---
  const isSyncing = learnMins >= 30 && learnMins < 60;
  const isFlow = learnMins >= 60;

  // Pre-formatting styles and classes to avoid "Unexpected Token" errors
  const readProgress = (totalPages % 250 / 2.5) + '%';
  const trainProgress = Math.min((workoutDays / 150) * 100, 100) + '%';

  let brainContainer = "w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all bg-slate-50";
  let brainIconColor = "text-slate-200";
  let neuralStatusText = "SYSTEM IDLE";

  if (isFlow) {
    brainContainer = "w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all bg-indigo-600 shadow-lg animate-pulse";
    brainIconColor = "text-white";
    neuralStatusText = "FLOW STATE";
  } else if (isSyncing) {
    brainContainer = "w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all bg-indigo-100";
    brainIconColor = "text-indigo-600";
    neuralStatusText = "SYNCHRONIZING";
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans antialiased">
      {showConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-md">
          <h2 className="text-4xl font-black text-indigo-600 italic">CORE_SYNCED⚡️</h2>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-black italic tracking-tighter">HABIT_OS</h1>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm font-bold">
            {logs.length} DAYS LOGGED
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* LIBRARY */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                <Glasses size={14}/> Knowledge Archive
              </span>
              <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: readProgress }}></div>
              </div>
            </div>
            <div className="flex items-end gap-2 overflow-x-auto h-32">
              {[...Array(booksCompleted)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-8 h-24 bg-slate-50 border border-slate-200 rounded flex items-center justify-center">
                  <span className="rotate-90 text-[8px] font-black text-slate-300">VOL_{i+1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* NEURAL STATUS */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 flex flex-col items-center justify-center">
            <div className={brainContainer}>
              <Brain size={32} className={brainIconColor} />
            </div>
            <div className="text-center font-black">
              <div className="text-2xl">{learnMins}m</div>
              <div className="text-[8px] text-indigo-500 uppercase mt-1 tracking-widest">{neuralStatusText}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200">
            <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
              <TreeDeciduous size={14} className="text-emerald-500"/> Orchard
            </h3>
            <div className="flex flex-wrap gap-2">
              {[...Array(treesCompleted)].map((_, i) => <TreeDeciduous key={i} size={28} className="text-emerald-500" />)}
              {totalFruits % 2 !== 0 && <Sprout size={20} className="text-emerald-300 animate-bounce" />}
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex items-center justify-between shadow-xl">
            <div>
              <div className="text-5xl font-black italic">{workoutDays}</div>
              <div className="text-[8px] text-slate-500 font-bold uppercase mt-1">Sessions</div>
            </div>
            <div className="w-1/2">
              <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500" style={{ width: trainProgress }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* INPUT */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-xl mb-6">
          <form onSubmit={saveDay} className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <input type="date" className="p-2 bg-slate-50 rounded-lg font-bold text-xs" value={todayData.date} onChange={e => setTodayData({...todayData, date: e.target.value})} />
            <input type="number" placeholder="Pages" className="p-2 bg-slate-50 rounded-lg font-bold text-xs" value={todayData.reading} onChange={e => setTodayData({...todayData, reading: e.target.value})} />
            <input type="number" placeholder="Fruits" className="p-2 bg-slate-50 rounded-lg font-bold text-xs" value={todayData.fruits} onChange={e => setTodayData({...todayData, fruits: e.target.value})} />
            <input type="number" placeholder="Mins" className="p-2 bg-slate-50 rounded-lg font-bold text-xs" value={todayData.learning} onChange={e => setTodayData({...todayData, learning: e.target.value})} />
            <input type="text" placeholder="Exercise" className="p-2 bg-slate-50 rounded-lg font-bold text-xs" value={todayData.exercise} onChange={e => setTodayData({...todayData, exercise: e.target.value})} />
            <button type="submit" className="p-2 bg-slate-900 text-white rounded-lg font-black text-xs uppercase">Log</button>
          </form>
        </div>

        {/* LOGS */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <tbody>
              {logs.map(log => (
                <tr key={log.date} className="border-b border-slate-50 last:border-0">
                  <td className="p-4 text-[10px] font-bold text-slate-400">{log.date}</td>
                  <td className="p-4 font-black text-[10px] uppercase space-x-3">
                    <span className="text-blue-600">{log.reading || 0}P</span>
                    <span className="text-emerald-600">{log.fruits || 0}F</span>
                    <span className="text-indigo-600">{log.learning || 0}M</span>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => deleteLog(log.date)} className="text-slate-200 hover:text-red-500"><Trash2 size={12}/></button>
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