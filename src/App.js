import React, { useState, useEffect } from 'react';
import { 
  Trash2, TreeDeciduous, Sprout, 
  Lightbulb, BookOpen, Trophy
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
      try { 
        setLogs(JSON.parse(saved)); 
      } catch (e) { 
        setLogs([]); 
      }
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
    setTodayData({ 
      date: new Date().toISOString().split('T')[0], 
      reading: '', 
      exercise: '', 
      fruits: 0, 
      learning: '' 
    });
  };

  const deleteLog = (date) => {
    if (window.confirm('Delete?')) {
      const updated = logs.filter(l => l.date !== date);
      setLogs(updated);
      localStorage.setItem('myHabitAppData', JSON.stringify(updated));
    }
  };

  // --- Calculations ---
  const totalPages = logs.reduce((acc, curr) => acc + (parseInt(curr.reading) || 0), 0);
  const booksCompleted = Math.floor(totalPages / 250);
  const pagesInCurrentBook = totalPages % 250;
  const readWidth = (pagesInCurrentBook / 250 * 100) + '%';

  const workoutDays = logs.filter(l => l.exercise && l.exercise.trim() !== '').length;
  const exerciseTarget = 150;
  const exerciseProgress = Math.min((workoutDays / exerciseTarget) * 100, 100) + '%';
  const daysRemaining = Math.max(exerciseTarget - workoutDays, 0);

  const learnMins = parseInt(todayData.learning) || 0;
  const totalFruits = logs.reduce((acc, curr) => acc + (parseInt(curr.fruits) || 0), 0);
  const treesCount = Math.floor(totalFruits / 2);
  const hasExtraSprout = totalFruits % 2 !== 0;

  // --- Style Logic ---
  let bulbClass = 'w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all duration-500 bg-slate-50';
  let bulbIconColor = 'text-slate-200';
  let bulbShadow = 'none';
  let neuralStatus = 'POWER OFF';

  if (learnMins >= 60) {
    bulbClass = 'w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-yellow-400 animate-pulse';
    bulbIconColor = 'text-white';
    bulbShadow = '0 0 30px #fbbf24';
    neuralStatus = '100% RADIANT';
  } else if (learnMins >= 45) {
    bulbClass = 'w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-yellow-300';
    bulbIconColor = 'text-yellow-700';
    bulbShadow = '0 0 20px #fcd34d';
    neuralStatus = '75% BRIGHT';
  } else if (learnMins >= 30) {
    bulbClass = 'w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-yellow-100';
    bulbIconColor = 'text-yellow-500';
    bulbShadow = '0 0 10px #fef3c7';
    neuralStatus = '50% STEADY';
  } else if (learnMins >= 15) {
    bulbClass = 'w-20 h-20 rounded-full flex items-center justify-center mb-4 bg-orange-50';
    bulbIconColor = 'text-orange-300';
    bulbShadow = '0 0 5px #fff7ed';
    neuralStatus = '25% FLICKER';
  }

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
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Status: Consistent</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm font-bold text-xs uppercase">
            {logs.length} DAYS LOGGED
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
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
              {Array.from({ length: booksCompleted }).map((_, i) => {
                const pos = i + 1;
                let colorClass = 'bg-indigo-600 border-indigo-700';
                if (pos % 10 === 0) colorClass = 'bg-yellow-500 border-yellow-600';
                else if (pos % 5 === 0) colorClass = 'bg-rose-500 border-rose-600';
                else if (pos % 2 === 0) colorClass = 'bg-emerald-50