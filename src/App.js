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
    const saved = localStorage.getItem('myHabitAppData');
    if (saved) {
      try {
        setLogs(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading data", e);
        setLogs([]);
      }
    }
  }, []);

  const saveDay = (e) => {
    e.preventDefault();
    if (!todayData.date) return;

    const learnVal = parseInt(todayData.learning) || 0;

    if (learnVal >= 60) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    const updated = [todayData, ...logs.filter(l => l.date !== todayData.date)]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    setLogs(updated);
    localStorage.setItem('myHabitAppData', JSON.stringify(updated));
    // Reset inputs but keep the date
    setTodayData({ ...todayData, reading: '', exercise: '', fruits: 0, learning: '', screentime: '' });
  };

  const deleteLog = (date) => {
    if (window.confirm('Delete entry for ' + date + '?')) {
      const updated = logs.filter(l => l.date !== date);
      setLogs(updated);
      localStorage.setItem('myHabitAppData', JSON.stringify(updated));
    }
  };

  // Pre-calculations for UI
  const totalPages = logs.reduce((acc, curr) => acc + (parseInt(curr.reading) || 0), 0);
  const totalFruits = logs.reduce((acc, curr) => acc + (parseInt(curr.fruits) || 0), 0);
  const workoutDays = logs.filter(l => l.exercise && l.exercise.trim() !== '').length;
  
  const booksCompleted = Math.floor(totalPages / 250);
  const treesCompleted = Math.floor(totalFruits / 2);
  const learnMins = parseInt(todayData.learning) || 0;

  const readingProgress = (totalPages % 250) / 2.5;
  const workoutProgress = Math.min((workoutDays / 150) * 100, 100);

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8 text-slate-900 font-sans antialiased">
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-white/40 backdrop-blur-md">
          <div className="text-4xl font-black text-indigo-600 animate-bounce uppercase tracking-tighter">Synapse Charged ⚡️</div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 uppercase">Habit<span className="text-indigo-600">_OS</span></h1>
            <p className="text-slate-500 font-medium italic mt-1">Growth Simulation Active</p>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest leading-none">Uptime</span>
              <span className="text-2xl font-black text-slate-900">{logs.length} <span className="text-xs text-slate-400 font-bold uppercase">Days</span></span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* LIBRARY */}
          <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-slate