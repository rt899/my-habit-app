import React, { useState, useEffect } from 'react';
import { 
  Trash2, TreeDeciduous, Sprout, 
  Lightbulb, Glasses, BookOpen, Trophy
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
    setTodayData({ ...todayData, date: new Date().toISOString().split('T')[0], reading: '', exercise: '', fruits: 0, learning: '' });
  };

  const deleteLog = (date) => {
    if (window.confirm('Delete?')) {
      const updated = logs.filter(l => l.date !== date);
      setLogs(updated);
      localStorage.setItem('myHabitAppData', JSON.stringify(updated));
    }
  };

  // --- READING CALCULATIONS (250 pg/book + Color Logic) ---
  const totalPages = logs.reduce((acc, curr) => acc + (parseInt(curr.reading) || 0), 0);
  const booksCompleted = Math.floor(totalPages / 250);
  const pagesInCurrentBook = totalPages % 250;
  const readWidth = (pagesInCurrentBook / 250 * 100) + '%';

  const getBookColor = (index) => {
    if ((index + 1) % 10 === 0) return 'bg-yellow-500 border-yellow-600'; 
    if ((index + 1) % 5 === 0) return 'bg-rose-500 border-rose-600';     
    if ((index + 1) % 2 === 0) return 'bg-emerald-500 border-emerald-600'; 
    return 'bg-indigo-600 border-indigo-700'; 
  };

  // --- EXERCISE CALCULATIONS (150 Day Target) ---
  const workoutDays = logs.filter(l => l.exercise && l.exercise.trim() !== '').length;
  const exerciseTarget = 150;
  const exerciseProgress = Math.min((workoutDays / exerciseTarget) * 100, 100) + '%';
  const daysRemaining = Math.max(exerciseTarget - workoutDays, 0);

  // --- LEARNING BULB LOGIC (15/30/45/60 Glow) ---
  const learnMins = parseInt(todayData.learning) || 0;
  let bulbClass = 'w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 bg-slate-50';
  let bulbIconColor = 'text-slate-200';
  let bulbShadow = 'none';
  let neuralStatus = 'POWER OFF';

  if (learnMins >= 60) {
    bulbClass = 'w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 bg-yellow-400 animate-pulse';
    bulbIconColor = 'text-white';
    bulbShadow = '0 0 30px #fbbf24';
    neuralStatus = '100% RADIANT';
  } else if (learnMins >= 45) {
    bulbClass = 'w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 bg-yellow-300';
    bulbIconColor = 'text-yellow-700';
    bulbShadow = '0 0 20px #fcd34d';
    neuralStatus = '75% BRIGHT';
  } else if (learnMins >= 30) {
    bulbClass = 'w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 bg-yellow-100';
    bulbIconColor = 'text-yellow-500';
    bulbShadow = '0 0 10px #fef3c7';
    neuralStatus = '50% STEADY';
  } else if (learnMins >= 15) {
    bulbClass = 'w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 bg-orange-50';
    bulbIconColor = 'text-orange-300';
    bulbShadow = '0 0 5px #fff7ed';
    neuralStatus = '25% FLICKER';
  }

  // --- FRUIT LOGIC ---
  const totalFruits = logs.reduce((acc, curr) => acc + (parseInt(curr.fruits) || 0), 0);
  const treesCount = Math.floor(totalFruits / 2);
  const hasExtraSprout = totalFruits % 2 !== 0;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans antialiased">
      {showConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-md">
          <h2 className="text-4xl font-black text-yellow-500 italic uppercase drop-shadow-lg text-center">Mastery Achieved</h2>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">HABIT_TRACKER</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: {workoutDays >= 150 ? 'Elite Athlete' : 'On The Climb'}</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm font-bold text-xs">
            {logs.length} DAYS LOGGED
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* READING SECTION */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-2">
                <BookOpen size={14}/> {pagesInCurrentBook}/250 Pages (Current Vol)
              </span>
              <div className="h-1.5 w-48 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: readWidth }}></div>
              </div>
            </div>
            <div className="flex items-end gap-2 overflow-x-auto h-32 pb-2">
              {Array.from({ length: booksCompleted }).map((_, i) => (
                <div key={i} className={`flex-shrink-0 w-8 h-24 ${getBookColor(i)} border rounded shadow-md flex items-center justify-center transition-transform hover:-translate-y-1`}>
                  <span className="rotate-90 text-[8px] font-black text-white uppercase tracking-tighter">Vol {i + 1}</span>
                </div>
              ))}
              <div className="flex-shrink-0 w-8 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded flex items-center justify-center opacity-40">
                <span className="rotate-90 text-[8px] font-black text-slate-300 uppercase">Vol {booksCompleted + 1}</span>
              </div>
            </div>
          </div>

          {/* LEARNING BULB SECTION */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 flex flex-col items-center justify-center shadow-sm">
            <div className={bulbClass} style={{ boxShadow: bulbShadow }}>
              <Lightbulb size={32} className={bulbIconColor} />
            </div>
            <div className="text-center font-black">
              <div className="text-2xl tracking-tighter">{learnMins}m</div>
              <div className="text-[8px] text-yellow-600 uppercase mt-1 tracking-widest">{neuralStatus}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* FRUITS SECTION */}
          <div className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4 flex items-center gap-2">
              <TreeDeciduous size={14} className="text-emerald-500"/> Healthy Habits (2 Fruits = 1 Tree)
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: treesCount }).map((_, i) => (
                <TreeDeciduous key={i} size={28} className="text-emerald-500" />
              ))}
              {hasExtraSprout && <Sprout size={20} className="text-emerald-300 animate-bounce" />}
            </div>
          </div>

          {/* EXERCISE SECTION (150 DAY TARGET) */}
          <div className="bg-slate-900 rounded-[2rem] p-8 text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
              <div>
                <div className="text-5xl font-black italic tracking-tighter">{workoutDays}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">Sessions this year</div>
              </div>
              <Trophy size={40} className={workoutDays >= 150 ? "text-yellow-400" : "text-slate-700"} />
            </div>
            <div className="mt-8 z-10">
              <div className="flex justify-between text-[8px] font-black uppercase mb-2">
                <span>Annual Target: 150</span>
                <span className="text-orange-400">{daysRemaining} Days Left</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-orange-500 transition-all duration-1000" style={{ width: exerciseProgress }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* INPUT FORM */}
        <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-xl mb-6">
          <form onSubmit={saveDay} className="grid grid-cols-2 lg:grid-cols-6 gap-3">
            <input type="date" className="p-3 bg-slate-50 rounded-xl font-bold text-xs outline-none focus:ring-2 ring-indigo-500" value={todayData.date} onChange={e => setTodayData({...todayData, date: e.target.value})} />
            <input type="number" placeholder="Pages" className="p-3 bg-slate-50 rounded-xl font-bold text-xs outline-none" value={todayData.reading} onChange={e => setTodayData({...todayData, reading: e.target.value})} />
            <input type="number" placeholder="Fruits" className="p-3 bg-slate-50 rounded-xl font-bold text-xs outline-none" value={todayData.fruits} onChange={e => setTodayData({...todayData, fruits: e.target.value})} />
            <input type="number" placeholder="Learn Mins" className="p-3 bg-slate-50 rounded-xl font-bold text-xs outline-none" value={todayData.learning} onChange={e => setTodayData({...todayData, learning: e.target.value})} />
            <input type="text" placeholder="Exercise Type" className="p-3 bg-slate-50 rounded-xl font-bold text-xs outline-none lg:col-span-1" value={todayData.exercise} onChange={e => setTodayData({...todayData, exercise: e.target.value})} />
            <button type="submit" className="p-3 bg-slate-900 text-white rounded-xl font-black text-xs uppercase hover:bg-indigo-600 transition-colors">Record Day</button>
          </form>
        </div>

        {/* LOGS TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mb-10">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-4">Date</th>
                <th className="p-4">Reading</th>
                <th className="p-4">Nutrition</th>
                <th className="p-4">Learning</th>
                <th className="p-4">Exercise</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.date} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="p-4 text-[10px] font-bold text-slate-400">{log.date}</td>
                  <td className="p-4 font-black text-[10px] text-blue-600 uppercase">{log.reading || 0} Pages</td>
                  <td className="p-4 font-black text-[10px] text-emerald-600 uppercase">{