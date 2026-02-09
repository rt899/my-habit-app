import React, { useState, useEffect } from 'react';
import { 
  Trash2, TreeDeciduous, Sprout, 
  Dumbbell, Brain, Zap, Glasses
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
    const saved = JSON.parse(localStorage.getItem('myHabitAppData') || '[]');
    setLogs(saved);
  }, []);

  const saveDay = (e) => {
    e.preventDefault();
    if (!todayData.date) return;

    if (parseInt(todayData.learning) >= 60) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    const updated = [todayData, ...logs.filter(l => l.date !== todayData.date)]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setLogs(updated);
    localStorage.setItem('myHabitAppData', JSON.stringify(updated));
    setTodayData({ ...todayData, reading: '', exercise: '', fruits: 0, learning: '', screentime: '' });
  };

  const deleteLog = (date) => {
    if (window.confirm('Delete entry for ' + date + '?')) {
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

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8 text-slate-900 font-sans">
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="text-4xl font-black text-indigo-600 animate-pulse">SYNAPSE CHARGED ⚡️</div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">HABIT_OS</h1>
            <p className="text-slate-500 font-medium italic">Daily Growth Simulation</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">Active Runtime</span>
            <span className="text-3xl font-black text-slate-900">{logs.length} <span className="text-sm text-slate-400">Days</span></span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* LIBRARY */}
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs flex items-center gap-2">
                <Glasses size={16} /> Knowledge Archive
              </h3>
              <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: ((totalPages % 250) / 2.5) + '%' }}></div>
              </div>
            </div>
            
            <div className="flex items-end gap-2 bg-slate-50 p-6 rounded-2xl min-h-[160px] border-b-4 border-slate-200">
              {[...Array(booksCompleted)].map((_, i) => (
                <div key={i} className="w-10 h-32 bg-white border-2 border-indigo-100 rounded-lg shadow-sm flex items-center justify-center group hover:bg-indigo-600 hover:border-indigo-600 transition-all duration-300">
                  <div className="rotate-90 text-[8px] font-black text-slate-300 group-hover:text-white whitespace-nowrap">BOOK_{i+1}</div>
                </div>
              ))}
              {booksCompleted === 0 && (totalPages % 250 === 0) && (
                <div className="w-full text-center text-slate-300 italic text-sm py-10 font-medium">Archive empty. Begin reading to store volumes.</div>
              )}
            </div>
          </div>

          {/* SYNAPSE CORE */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-indigo-100/50 border border-indigo-50 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-6 left-8">
                <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Synapse Core</h3>
             </div>
             
             <div className="relative flex items-center justify-center w-40 h-40">
                <div className={`absolute inset-0 rounded-full border-2 border-indigo-100 transition-all duration-700 ${learnMins > 0 ? 'scale-110 opacity-100' : 'scale-75 opacity-0'}`}></div>
                <div className={`absolute inset-2 rounded-full border-2 border-indigo-50 transition-all duration-1000 delay-100 ${learnMins >= 30 ? 'scale-125 opacity-100' : 'scale-75 opacity-0'}`}></div>
                
                <div className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-inner ${learnMins >= 60 ? 'bg-indigo-600 shadow-indigo-400' : 'bg-slate-50'}`}>
                   <Brain size={40} className={learnMins >= 60 ? "text-white animate-pulse" : learnMins > 0 ? "text-indigo-500" : "text-slate-200"} />
                   {learnMins >= 60 && <Zap size={16} className="absolute -top-1 -right-1 text-yellow-400" />}
                </div>
             </div>

             <div className="mt-6 text-center">
                <div className="text-3xl font-black text-slate-900">{learnMins}<span className="text-sm text-slate-400">m</span></div>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest mt-1">
                  {learnMins >= 60 ? 'Focus Overdrive' : learnMins >= 30 ? 'Neural Active' : 'Resting'}
                </p>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap