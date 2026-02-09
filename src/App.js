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
    localStorage.setItem('myHabitAppData', updated);
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
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8 text-slate-900 font-sans selection:bg-indigo-100">
      
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
          <div className="text-4xl font-black text-indigo-600 animate-pulse">SYNAPSE CHARGED ⚡️</div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">HABIT<span className="text-indigo-600">OS</span></h1>
            <p className="text-slate-500 font-medium">Daily Growth Simulation</p>
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
                <div className="h-full bg-blue-500" style={{ width: (totalPages % 250 / 2.5) + '%' }}></div>
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

          {/* NEW SYNAPSE CORE */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-indigo-100/50 border border-indigo-50 flex flex-col items-center justify-center relative overflow-hidden">
             <div className="absolute top-6 left-8">
                <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Synapse Core</h3>
             </div>
             
             <div className="relative flex items-center justify-center w-40 h-40">
                {/* Ripple rings */}
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

        {/* BOTTOM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <div className="bg-white rounded-[2rem] p-8 shadow-lg shadow-emerald-100/40 border border-emerald-50">
              <h3 className="font-bold text-slate-400 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                <TreeDeciduous size={14} className="text-emerald-500" /> Orchard Evolution
              </h3>
              <div className="flex flex-wrap gap-4 min-h-[80px]">
                {[...Array(treesCompleted)].map((_, i) => <TreeDeciduous key={i} size={44} className="text-emerald-500/20 fill-emerald-500" />)}
                {totalFruits % 2 !== 0 && <Sprout size={32} className="text-emerald-300 animate-bounce mt-2" />}
              </div>
           </div>

           <div className="bg-slate-900 rounded-[2rem] p-8 shadow-xl">
              <h3 className="font-bold text-slate-500 uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
                <Dumbbell size={14} className="text-orange-500" /> Training Stadium
              </h3>
              <div className="flex items-center gap-8">
                <div className="text-6xl font-black text-white">{workoutDays}</div>
                <div className="flex-1">
                   <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-600 to-orange-400" style={{ width: (workoutDays/150*100) + '%' }}></div>
                   </div>
                   <p className="text-[10px] font-black text-slate-500 uppercase mt-3 tracking-widest">Progress to 150 Sessions</p>
                </div>
              </div>
           </div>
        </div>

        {/* INPUT LEDGER */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-300/50 border border-slate-100 mb-8">
          <form onSubmit={saveDay} className="grid grid-cols-2 lg:grid-cols-6 gap-6 items-end">
            <div className="col-span-2 lg:col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 ml-1">Log Date</label>
              <input type="date" className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none focus:ring-2 focus:ring-indigo-500 transition-all" value={todayData.date} onChange={e => setTodayData({...todayData, date: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black text-blue-500 uppercase block mb-3 ml-1">Pages</label>
              <input type="number" className="w-full bg-blue-50/50 p-4 rounded-2xl font-bold border-none focus:ring-2 focus:ring-blue-500 outline-none" value={todayData.reading} onChange={e => setTodayData({...todayData, reading: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black text-emerald-500 uppercase block mb-3 ml-1">Fruits</label>
              <input type="number" className="w-full bg-emerald-50/50 p-4 rounded-2xl font-bold border-none focus:ring-2 focus:ring-emerald-500 outline-none" value={todayData.fruits} onChange={e => setTodayData({...todayData, fruits: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black text-indigo-500 uppercase block mb-3 ml-1">Learning</label>
              <input type="number" className="w-full bg-indigo-50/50 p-4 rounded-2xl font-bold border-none focus:ring-2 focus:ring-indigo-500 outline-none" value={todayData.learning} onChange={e => setTodayData({...todayData, learning: e.target.value})} />
            </div>
            <div className="col-span-2 lg:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase block mb-3 ml-1">Exercise Notes</label>
              <div className="flex gap-2">
                <input type="text" placeholder="Session details..." className="flex-1 bg-slate-50 p-4 rounded-2xl font-bold border-none focus:ring-2 focus:ring-slate-900 outline-none" value={todayData.exercise} onChange={e => setTodayData({...todayData, exercise: e.target.value})} />
                <button type="submit" className="bg-slate-900 text-white font-black px-6 rounded-2xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200">COMMIT</button>
              </div>
            </div>
          </form>
        </div>

        {/* LOGS LIST */}
        <div className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm">
           <table className="w-full text-left">
             <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400">
               <tr>
                 <th className="p-6">Timeline</th>
                 <th className="p-6">Pages</th>
                 <th className="p-6">Fruits</th>
                 <th className="p-6">Brain</th>
                 <th className="p-6 text-right">Action</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {logs.map(log => (
                 <tr key={log.date} className="group hover:bg-slate-50/30 transition-colors">
                   <td className="p-6 text-sm font-bold text-slate-400">{log.date}</td>
                   <td className="p-6 font-bold text-slate-900">{log.reading || 0}p</td>
                   <td className="p-6 font-bold text-slate-900">{log.fruits || 0}</td>
                   <td className="p-6 font-bold text-indigo-600">{log.learning || 0}m</td>
                   <td className="p-6 text-right">
                     <button onClick