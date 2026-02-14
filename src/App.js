import React, { useState, useEffect } from 'react';
import { 
  Trash2, TreeDeciduous, Sprout, 
  Lightbulb, BookOpen, Trophy, Download, PlusCircle, Calendar, Flame, CheckCircle2
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

  // --- STREAK LOGIC (Verified) ---
  const calculateStreak = () => {
    if (logs.length === 0) return 0;
    
    // Get unique dates sorted descending
    const sortedDates = [...new Set(logs.map(l => l.date))].sort().reverse();
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // If no entry today AND no entry yesterday, streak is 0
    if (sortedDates[0] !== today && sortedDates[0] !== yesterday) return 0;

    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) {
        streak++;
        continue;
      }
      const current = new Date(sortedDates[i]);
      const previous = new Date(sortedDates[i-1]);
      const diffTime = Math.abs(previous - current);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) streak++;
      else break;
    }
    return streak;
  };

  const saveDay = (e) => {
    e.preventDefault();
    if (!todayData.date) return;
    const updated = [todayData, ...logs.filter(l => l.date !== todayData.date)]
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (parseInt(todayData.learning, 10) >= 60) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
    
    setLogs(updated);
    localStorage.setItem('myHabitAppData', JSON.stringify(updated));
    setTodayData({ 
      date: new Date().toISOString().split('T')[0], 
      reading: '', exercise: '', fruits: 0, learning: '' 
    });
  };

  const deleteLog = (date) => {
    if (window.confirm('Permanently delete this entry?')) {
      const updated = logs.filter(l => l.date !== date);
      setLogs(updated);
      localStorage.setItem('myHabitAppData', JSON.stringify(updated));
    }
  };

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "habit_os_backup.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // --- Calculations & Styles ---
  const streakCount = calculateStreak();
  const totalPages = logs.reduce((acc, curr) => acc + (parseInt(curr.reading, 10) || 0), 0);
  const booksCompleted = Math.floor(totalPages / 250);
  const pagesInCurrentBook = totalPages % 250;
  const readStyle = { width: (pagesInCurrentBook / 250) * 100 + "%" };

  const workoutDays = logs.filter(l => l.exercise && l.exercise.trim() !== "").length;
  const exerciseStyle = { width: Math.min((workoutDays / 150) * 100, 100) + "%" };
  const daysRemaining = Math.max(150 - workoutDays, 0);

  const totalFruits = logs.reduce((acc, curr) => acc + (parseInt(curr.fruits, 10) || 0), 0);
  const treesCount = Math.floor(totalFruits / 2);
  const hasExtraSprout = totalFruits % 2 !== 0;

  const curLearn = parseInt(todayData.learning, 10) || 0;
  let bulbColor = "bg-slate-100 text-slate-300";
  if (curLearn >= 60) bulbColor = "bg-yellow-400 text-white shadow-lg shadow-yellow-100";
  else if (curLearn >= 30) bulbColor = "bg-yellow-200 text-yellow-700";

  // Last 7 Days Heatmap Logic
  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const active = logs.some(l => l.date === dateStr);
    return { date: dateStr, active };
  }).reverse();

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 text-slate-900 font-sans antialiased">
      {showConfetti && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white px-8 py-4 rounded-full font-black shadow-2xl animate-bounce">
          SYSTEM OPTIMIZED: +10 XP
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">HABIT_OS</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Neural Link Active</span>
              </div>
            </div>
            {streakCount > 0 && (
              <div className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-2xl shadow-lg shadow-orange-200">
                <Flame size={16} fill="white" />
                <span className="text-sm font-black italic">{streakCount}D STREAK</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[9px] font-black uppercase text-slate-400 mr-2">Weekly Loadout</span>
            <div className="flex gap-1.5">
              {last7Days.map((day, i) => (
                <div key={i} className={"h-3 w-3 rounded-sm " + (day.active ? "bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "bg-slate-100")} title={day.date}></div>
              ))}
            </div>
            <button onClick={exportData} className="ml-4 p-1 hover:text-indigo-600 transition-colors">
              <Download size={18} />
            </button>
          </div>
        </header>

        {/* INPUT TERMINAL */}
        <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-orange-500"></div>
          <div className="flex items-center gap-2 mb-8 text-slate-500">
            <PlusCircle size={18} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Input Protocol</h2>
          </div>
          <form onSubmit={saveDay} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { label: 'Date', type: 'date', key: 'date' },
              { label: 'Reading (PG)', type: 'number', key: 'reading' },
              { label: 'Fruit (Qty)', type: 'number', key: 'fruits' },
              { label: 'Learning Mins', type: 'number', key: 'learning' },
              { label: 'Exercise', type: 'text', key: 'exercise', placeholder: 'Activity' }
            ].map((field) => (
              <div key={field.key} className="flex flex-col gap-2">
                <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider ml-1">{field.label}</label>
                <input 
                  type={field.type} 
                  placeholder={field.placeholder || "0"}
                  className="p-4 bg-slate-50 rounded-2xl text-xs font-bold outline-none border border-transparent focus:border-indigo-100 focus:bg-white transition-all" 
                  value={todayData[field.key]} 
                  onChange={e => setTodayData({...todayData, [field.key]: e.target.value})} 
                />
              </div>
            ))}
            <div className="flex items-end">
              <button type="submit" className="w-full p-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 active:scale-95 transition-all shadow-xl shadow-indigo-100">Commit</button>
            </div>
          </form>
        </section>

        {/* STATS ENGINE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm relative group">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-500 rounded-xl"><BookOpen size={20}/></div>
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-400">Archive Growth</h3>
                  <p className="text-[10px] font-bold text-blue-500">{pagesInCurrentBook} / 250 PG TO NEXT VOL</p>
                </div>
              </div>
              <div className="h-2 w-32 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 transition-all duration-1000" style={readStyle}></div>
              </div>
            </div>
            <div className="flex items-end gap-3 overflow-x-auto h-24 pb-2 scrollbar-hide">
              {Array.from({ length: booksCompleted }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-10 h-20 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg border-r-4 border-indigo-700">
                  <span className="rotate-90 text-[8px] font-black text-white tracking-widest uppercase">Vol_{i+1}</span>
                </div>
              ))}
              <div className="flex-shrink-0 w-10 h-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center opacity-40">
                <PlusCircle size={14} className="text-slate-300" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className={"w-20 h-20 rounded-[2rem] flex items-center justify-center mb-6 transition-all duration-500 rotate-3 group-hover:rotate-0 " + bulbColor}>
              <Lightbulb size={32} />
            </div>
            <div className="text-3xl font-black italic">{curLearn}</div>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-2">Learning Mins Today</p>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase mb-6 tracking-widest flex items-center gap-2">
              <TreeDeciduous size={16} className="text-emerald-500"/> Ecosystem
            </h3>
            <div className="flex flex-wrap gap-3 content-start min-h-[50px]">
              {Array.from({ length: treesCount }).map((_, i) => <TreeDeciduous key={i} size={28} className="text-emerald-600 drop-shadow-sm" />)}
              {hasExtraSprout && <Sprout size={20} className="text-emerald-400 animate-bounce" />}
            </div>
          </div>

          <div className="md:col-span-2 bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Trophy size={120} />
            </div>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xs font-black uppercase text-slate-500