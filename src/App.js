import React, { useState, useEffect } from 'react';
import { 
  Trash2, TreeDeciduous, Sprout, 
  Lightbulb, BookOpen, Trophy, Download, PlusCircle, Calendar
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
    if (window.confirm('Delete this entry?')) {
      const updated = logs.filter(l => l.date !== date);
      setLogs(updated);
      localStorage.setItem('myHabitAppData', JSON.stringify(updated));
    }
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "habit_logs.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // --- SAFE CALCULATIONS ---
  const totalPages = logs.reduce((acc, curr) => acc + (parseInt(curr.reading) || 0), 0);
  const booksCompleted = Math.floor(totalPages / 250);
  const pagesInCurrentBook = totalPages % 250;
  
  // Moved string creation here to avoid line 125 error
  const readProgressStyle = { width: (pagesInCurrentBook / 250) * 100 + "%" };

  const workoutDays = logs.filter(l => l.exercise && l.exercise.trim() !== '').length;
  const exerciseTarget = 150;
  const exerciseProgressValue = Math.min((workoutDays / exerciseTarget) * 100, 100);
  
  // Moved string creation here to avoid line 125 error
  const exerciseProgressStyle = { width: exerciseProgressValue + "%" };
  
  const daysRemaining = Math.max(exerciseTarget - workoutDays, 0);

  const totalFruits = logs.reduce((acc, curr) => acc + (parseInt(curr.fruits) || 0), 0);
  const treesCount = Math.floor(totalFruits / 2);
  const hasExtraSprout = totalFruits % 2 !== 0;

  const currentLearn = parseInt(todayData.learning) || 0;
  let bulbState = "bg-slate-100 text-slate-300";
  let neuralStatus = "IDLE";

  if (currentLearn >= 60) { 
    bulbState = "bg-yellow-400 text-white shadow-lg"; 
    neuralStatus = "RADIANT"; 
  } else if (currentLearn >= 30) { 
    bulbState = "bg-yellow-200 text-yellow-700"; 
    neuralStatus = "STEADY"; 
  } else if (currentLearn > 0) { 
    bulbState = "bg-orange-100 text-orange-400"; 
    neuralStatus = "FLICKERING"; 
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans">
      {showConfetti && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-yellow-400 text-white px-8 py-4 rounded-full font-black shadow-2xl">
          MASTERY ACHIEVED!
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-black italic uppercase leading-none">HABIT_OS</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">v2.0 Terminal</p>
          </div>
          <button onClick={exportData} className="p-3 bg-white border border-slate-200 rounded-2xl">
            <Download size={18} className="text-slate-400" />
          </button>
        </header>

        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-200 mb-8">
          <form onSubmit={saveDay} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Date</label>
              <input type="date" className="p-3 bg-slate-50 rounded-2xl text-xs outline-none" value={todayData.date} onChange={(e) => setTodayData({...todayData, date: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Pages</label>
              <input type="number" className="p-3 bg-slate-50 rounded-2xl text-xs outline-none" value={todayData.reading} onChange={(e) => setTodayData({...todayData, reading: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Fruits</label>
              <input type="number" className="p-3 bg-slate-50 rounded-2xl text-xs outline-none" value={todayData.fruits} onChange={(e) => setTodayData({...todayData, fruits: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Mins</label>
              <input type="number" className="p-3 bg-slate-50 rounded-2xl text-xs outline-none" value={todayData.learning} onChange={(e) => setTodayData({...todayData, learning: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Exercise</label>
              <input type="text" className="p-3 bg-slate-50 rounded-2xl text-xs outline-none" value={todayData.exercise} onChange={(e) => setTodayData({...todayData, exercise: e.target.value})} />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full p-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase">Record</button>
            </div>
          </form>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded