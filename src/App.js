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
    if (window.confirm('Delete entry?')) {
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

  // Streak Logic
  let streak = 0;
  if (logs.length > 0) {
    streak = 1;
    for (let i = 0; i < logs.length - 1; i++) {
      const current = new Date(logs[i].date);
      const next = new Date(logs[i + 1].date);
      const diff = (current - next) / (1000 * 60 * 60 * 24);
      if (diff === 1) streak++;
      else break;
    }
  }

  // --- Dynamic UI Logic for Neural Status ---
  const isSyncing = learnMins >= 30 && learnMins < 60;
  const isFlow = learnMins >= 60;
  
  const readingStyle = { width: (totalPages % 250 / 2.5) + "%" };
  const trainingStyle = { width: Math.min((workoutDays / 150) * 100, 100) + "%" };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-900 font-sans selection:bg-indigo-100 antialiased">
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-white/40 backdrop-blur-md">
          <div className="text-4xl font-black text-indigo-600 animate-pulse uppercase tracking-tighter">Flow State Achieved</div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 italic">HABIT_OS</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 ml-1">v2.1 Stable Build</p>
          </div>
          
          <div className="flex gap-3">
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
               <div className="text-right">
                  <span className="text-[10px] font-black uppercase text-slate-400 block leading-none mb-1">Runtime</span>
                  <span className="text-2xl font-black">{logs.length}d</span>
               </div>
            </div>
            {streak >= 3 && (
              <div className="bg-orange-500 p-4 rounded-3xl shadow-lg shadow-orange-200 flex items-center gap-3 text-white animate-bounce">
                <Flame size={24} fill="currentColor" />
                <span className="text-2xl font-black">{streak}</span>
              </div>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* KNOWLEDGE ARCHIVE */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] flex items-center gap-2">
                <Glasses size={14} /> Library Progress
              </h3>
              <div className="h-1.5 w-32 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 transition-all duration-1000" style={readingStyle}></div>
              </div>
            </div>
            <div className="flex items-end gap-3 bg-slate-50/50 p-6 rounded-[2rem] min-h-[180px] border-b-2 border-slate-200 overflow-x-auto scrollbar-hide">
              {[...Array(booksCompleted)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-12 h-36 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center hover:bg-indigo-600 transition-all group">
                  <div className="rotate-90 text-[10px] font-black text-slate-300 group-hover:text-white whitespace-nowrap uppercase">VOL_{i+1}</div>
                </div>
              ))}
              {booksCompleted === 0 && <div className="w-full text-center text-slate-300 italic text-sm py-10">Empty Shelf</div>}
            </div>
          </div>

          {/* NEURAL STATUS - INTUITIVE VERSION */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-indigo-100/50 border border-indigo-50 flex flex-col items-center justify-center relative group overflow-hidden">
             <div className="absolute top-8 left-8">
                <h3 className="font-black text-slate-400 uppercase tracking-widest text-[10px] flex items-center gap-2">
                   <Activity size={12}/> Neural Status
                </h3>
             </div>

             {/* Dynamic Brain Core */}
             <div className="relative flex items-center justify-center w-48 h-48">
                {/* Outer Ring: Flow Aura */}
                <div className={`absolute inset-0 rounded-full border-2 border-indigo-100 transition-all duration-1000 ${isFlow ? 'animate-ping scale-125 opacity-20' : 'scale-0 opacity-0'}`}></div>
                
                {/* Middle Ring: Sync Pulse */}
                <div className={`absolute inset-4 rounded-full border-2 border-dashed border-indigo-200 transition-all duration-700 ${isSyncing || isFlow ? 'animate-spin-slow opacity-100' : 'scale-50 opacity-0'}`}></div>
                
                {/* Center Core */}
                <div className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all duration-500 shadow-2xl ${isFlow ? 'bg-indigo-600 shadow-indigo-300' : isSyncing ? 'bg-indigo-100' : 'bg-slate-50'}`}>
                   <Brain size={44} className={`transition-colors duration-500 ${isFlow ? 'text-white' : isSyncing ? 'text-indigo-600' : 'text-slate-200'}`} />
                </div>
             </div>

             <div className="mt-6 text-center">
                <div className={`text-4xl font-black transition-colors ${isFlow ? 'text-indigo-600' : 'text-slate-900'}`}>
                  {learnMins}<span className="text-sm text-slate-400 ml-1">min</span>
                </div>
                <div className={`text-[10px] font-black uppercase tracking-widest mt-2 px-3 py-1 rounded-full ${isFlow ? 'bg-indigo-600 text-white' : isSyncing ? 'bg-indigo-100 text-indigo-600' : 'text-slate-300'}`}>
                  {isFlow ? 'FLOW STATE' : isSyncing ? 'SYNCHRONIZING' : 'SYSTEM IDLE'}
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           {/* ORCHARD */}
           <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-emerald-50">
              <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                <TreeDeciduous size={14} className="text-emerald-500" /> Orchard
              </h3>
              <div className="flex flex-wrap gap-4 min-h-[100px] items-center">
                {[...Array(treesCompleted)].map((_, i) => <TreeDeciduous key={i} size={48} className="text-emerald-500/10 fill-emerald-500" />)}
                {totalFruits % 2 !== 0 && <Sprout size={32} className="text-emerald-300 animate-bounce" />}
              </div>
           </div>

           {/* TRAINING */}
           <div className="bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="font-bold text-slate-500 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                <Dumbbell size={14} className="text-orange-500" /> Training Stadium
              </h3>
              <div className="flex items-center gap-8 text-white">
                <div className="text-7xl font-black">{workoutDays}</div>
                <div className="flex-1">
                   <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-orange-500 transition-all duration-1000" style={trainingStyle}></div>
                   </div>
                   <p className="text-[10px] font-black text-slate-500 uppercase mt-4">150 Session Milestone</p>
                </div>
              </div>
           </div>
        </div>

        {/* INPUT FORM */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 mb-8">
          <form onSubmit={saveDay} className="grid grid-cols-2 lg:grid-cols-6 gap-6 items-end">
            <div className="col-span-2 lg:col-span-1">
              <label className="text-[10px] font-black text