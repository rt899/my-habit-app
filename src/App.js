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

  // --- COMPILER SAFE UI LOGIC ---
  const isSyncing = learnMins >= 30 && learnMins < 60;
  const isFlow = learnMins >= 60;
  
  const readingStyle = { width: (totalPages % 250 / 2.5) + "%" };
  const trainingStyle = { width: (Math.min((workoutDays / 150) * 100, 100)) + "%" };

  // Pre-constructing classes to avoid line 197 syntax errors
  const outerRingClass = isFlow ? "absolute inset-0 rounded-full border-2 border-indigo-100 animate-ping scale-125 opacity-20" : "absolute inset-0 rounded-full border-2 border-indigo-100 scale-0 opacity-0";
  const middleRingClass = (isSyncing || isFlow) ? "absolute inset-4 rounded-full border-2 border-dashed border-indigo-200 animate-spin opacity-100" : "absolute inset-4 rounded-full border-2 border-dashed border-indigo-200 scale-50 opacity-0";
  const coreBgClass = isFlow ? "relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center bg-indigo-600 shadow-2xl" : (isSyncing ? "relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center bg-indigo-100" : "relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center bg-slate-50");
  const brainColor = isFlow ? "text-white" : (isSyncing ? "text-indigo-600" : "text-slate-200");
  const statusLabelClass = isFlow ? "text-[10px] font-black uppercase tracking-widest mt-2 px-3 py-1 rounded-full bg-indigo-600 text-white" : (isSyncing ? "text-[10px] font-black uppercase tracking-widest mt-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-600" : "text-[10px] font-black uppercase tracking-widest mt-2 px-3 py-1 rounded-full text-slate-300");
  const minuteTextClass = isFlow ? "text-4xl font-black text-indigo-600" : "text-4xl font-black text-slate-900";

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-900 font-sans antialiased">
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-white/40 backdrop-blur-md">
          <div className="text-4xl font-black text-indigo-600 animate-pulse">FLOW STATE</div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900 italic">HABIT_OS</h1>
            <p className="text-slate