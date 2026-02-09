import React, { useState, useEffect } from 'react';
import { 
  Trash2, TreeDeciduous, Sprout, 
  Brain, Glasses, Flame
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
    
    // Trigger celebration for deep work (60m+)
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

  // --- Verified Calculations ---
  const totalPages = logs.reduce((acc, curr) => acc + (parseInt(curr.reading) || 0), 0);
  const totalFruits = logs.reduce((acc, curr) => acc + (parseInt(curr.fruits) || 0), 0);
  const workoutDays = logs.filter(l => l.exercise && l.exercise.trim() !== '').length;
  const booksCompleted = Math.floor(totalPages / 250);
  const treesCompleted = Math.floor(totalFruits / 2);
  const learnMins = parseInt(todayData.learning) || 0;

  // --- Build-Safe Logic Gates ---
  const isSyncing = learnMins >= 30 && learnMins < 60;
  const isFlow = learnMins >= 60;

  // Style Widths (Using safe string concatenation)
  const readWidth = (totalPages % 250 / 2.5) + '%';
  const trainWidth = Math.min((workoutDays / 150) * 100, 100) + '%';

  // --- Neural Processor Class Logic ---
  let brainBoxClass = 'w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-all ';
  let brainIconColor = 'text-slate-200';
  let neuralText = 'SYSTEM IDLE';

  if (isFlow) {
    brainBoxClass += 'bg-indigo-600 shadow-xl shadow-indigo-200 animate-pulse';
    brainIconColor = 'text-white';
    neuralText = 'FLOW STATE';
  } else if (isSyncing) {
    brainBoxClass += 'bg-indigo-100 animate-spin-slow';
    brainIconColor = 'text-indigo-600';
    neuralText = 'SYNCHRONIZING';
  } else {
    brainBoxClass += 'bg-slate-50';
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans antialiased">
      {showConfetti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-md">
          <h2 className="text-5xl font-black text-indigo-600 tracking-tighter italic">NEURAL_STRIKE⚡️</h2>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>