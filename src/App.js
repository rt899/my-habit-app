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
    if (window.confirm(`Delete entry for ${date}?`)) {
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
  const brainProgress = Math.min((learnMins / 60) * 100, 100);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 text-slate-900 font-sans relative">
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-white/20 backdrop-blur-sm">
          <div className="text-6xl font-black animate-bounce text-violet-600 drop-shadow-lg">SUPER BRAIN! ⚡️</div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-slate-900">HABIT<span className="text-indigo-600">_OS</span></h1>
            <p className="text-slate-500 font-medium">Evolutionary Tracking Simulation</p>
          </div>
          <div className="bg-white border-2 border-slate-900 p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-xs font-black uppercase block">Uptime</span>
            <span className="text-2xl font-black">{logs.length} DAYS</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          <div className="lg:col-span-2 bg-white border-2 border-slate-900 p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase flex items-center gap-2">
                <Glasses size={24} /> Knowledge Archive
              </h3>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1">{totalPages} Pages Read</span>
            </div>
            
            <div className="relative bg-[#efe4d1] p-4 rounded-sm border-b-8 border-[#8b5e3c] min-h-[140px] flex items-end gap-1">
              {[...Array(booksCompleted)].map((_, i) => (
                <div key={i} className="w-8 h-32 bg-indigo-600 border-2 border-slate-900 flex items-center justify-center transform hover:-translate-y-2 transition-transform cursor-help">
                  <div className="rotate-90 text-[10px] text-white font-bold whitespace-nowrap">VOLUME {i+1}</div>
                </div>
              ))}
              {totalPages % 250 > 0 && (
                <div className="w-4 bg-indigo-400 border-2 border-slate-900 animate-pulse" style={{ height: `${(totalPages % 250) / 2.5}%` }}></div>
              )}
              {booksCompleted === 0 && (totalPages % 250 === 0) && (
                <p className="text-[#8b5e3c]/40 italic absolute inset-0 flex items-center justify-center