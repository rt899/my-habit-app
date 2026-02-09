import React, { useState, useEffect } from 'react';
import { 
  Save, Trash2, Book, TreeDeciduous, Sprout, 
  Dumbbell, Brain, Monitor, Zap, Glasses
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
  
  // Brain Lab Logic
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
          
          {/* 1. THE LIBRARY (Bookshelf Style) */}
          <div className="lg:col-span-2 bg-white border-2 border-slate-900 p-6 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black uppercase flex items-center gap-2">
                <Glasses size={24} /> Knowledge Archive
              </h3>
              <span className="text-xs font-bold bg-blue-100 text-blue-700 px-2 py-1">{totalPages} Pages Read</span>
            </div>
            
            <div className="relative bg-[#efe4d1] p-4 rounded-sm border-b-8 border-[#8b5e3c] min-h-[140px] flex items-end gap-1">
              {[...Array(booksCompleted)].map((_, i) => (
                <div key={i} className="w-8 h-32 bg-indigo-600 border-2 border-slate-900 flex items-center justify-center transform hover:-translate-y-2 transition-transform cursor-help" title="1 Complete Book (250 pgs)">
                  <div className="rotate-90 text-[10px] text-white font-bold whitespace-nowrap">VOLUME {i+1}</div>
                </div>
              ))}
              {totalPages % 250 > 0 && (
                <div className="w-4 bg-indigo-400 border-2 border-slate-900 animate-pulse" style={{ height: `${(totalPages % 250) / 2.5}%` }}></div>
              )}
              {booksCompleted === 0 && (totalPages % 250 === 0) && (
                <p className="text-[#8b5e3c]/40 italic absolute inset-0 flex items-center justify-center font-serif">Shelves are empty...</p>
              )}
            </div>
          </div>

          {/* 2. BRAIN LAB (Processor Style) */}
          <div className={`bg-white border-2 border-slate-900 p-6 shadow-[8px_8px_0px_0px_rgba(139,92,246,1)] transition-all ${learnMins >= 60 ? 'ring-4 ring-yellow-400' : ''}`}>
            <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
              <Brain size={24} className={learnMins > 0 ? "text-violet-600" : ""} /> Neural Processor
            </h3>
            
            <div className="flex flex-col items-center justify-center p-4 bg-slate-900 rounded-3xl mb-4 relative overflow-hidden">
               {/* Synapse Pulse Effect */}
               {learnMins >= 60 && <div className="absolute inset-0 bg-violet-500/20 animate-pulse"></div>}
               
               <div className={`z-10 p-4 rounded-full border-4 transition-all duration-500 ${learnMins >= 30 ? 'bg-violet-600 border-violet-400' : 'bg-slate-800 border-slate-700'}`}>
                  <Zap size={48} className={learnMins >= 60 ? "text-yellow-400 animate-bounce" : "text-slate-600"} />
               </div>
               
               <div className="z-10 mt-4 w-full px-4">
                  <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-1">
                    <span>Charge Status</span>
                    <span>{brainProgress.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-3 bg-slate-800 rounded-full border border-slate-700">
                    <div className="h-full bg-violet-500 rounded-full transition-all duration-1000" style={{ width: `${brainProgress}%` }}></div>
                  </div>
               </div>
            </div>
            <p className="text-center text-xs font-black uppercase text-slate-400 tracking-tighter">
               {learnMins < 30 ? "Idle Mode" : learnMins < 60 ? "Active Cognition" : "MAX OVERDRIVE"}
            </p>
          </div>
        </div>

        {/* 3. ORCHARD & WORKOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
           {/* Orchard */}
           <div className="bg-white border-2 border-slate-900 p-6 shadow-[8px_8px_0px_0px_rgba(16,185,129,1)]">
              <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2"><TreeDeciduous className="text-emerald-500" /> Orchard</h3>
              <div className="flex flex-wrap gap-3 bg-emerald-50/50 p-4 rounded-xl min-h-[100px] border border-emerald-100">
                {[...Array(treesCompleted)].map((_, i) => <TreeDeciduous key={i} size={40} className="text-emerald-600 fill-emerald-100" />)}
                {totalFruits % 2 !== 0 && <Sprout size={32} className="text-lime-500 animate-pulse" />}
              </div>
           </div>

           {/* Workout Stadium */}
           <div className="bg-slate-900 text-white p-6 shadow-[8px_8px_0px_0px_rgba(249,115,22,1)]">
              <h3 className="text-xl font-black uppercase mb-4 flex items-center gap-2"><Dumbbell className="text-orange-500" /> Stadium</h3>
              <div className="flex items-center gap-6">
                <div className="text-5xl font-black text-orange-500">{workoutDays}</div>
                <div className="flex-1">
                  <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div className="h-full bg-orange-500" style={{ width: `${(workoutDays/150)*100}%` }}></div>
                  </div>
                  <p className="text-[10px] font-bold uppercase mt-2 text-slate-400">Road to 150 Sessions</p>
                </div>
              </div>
           </div>
        </div>

        {/* INPUT LEDGER */}
        <div className="bg-white border-4 border-slate-900 p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-10">
          <form onSubmit={saveDay} className="grid grid-cols-2 lg:grid-cols-6 gap-6 items-end">
            <div className="col-span-2 lg:col-span-1">
              <label className="text-xs font-black uppercase mb-2 block">Date</label>
              <input type="date" className="w-full bg-slate-100 p-3 border-2 border-slate-900 font-bold" value={todayData.date} onChange={e => setTodayData({...todayData, date: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-black uppercase mb-2 block text-blue-600">Pages</label>
              <input type="number" className="w-full bg-blue-50 p-3 border-2 border-slate-900 font-bold" value={todayData.reading} onChange={e => setTodayData({...todayData, reading: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-black uppercase mb-2 block text-emerald-600">Fruits</label>
              <input type="number" className="w-full bg-emerald-50 p-3 border-2 border-slate-900 font-bold" value={todayData.fruits} onChange={e => setTodayData({...todayData, fruits: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-black uppercase mb-2 block text-violet-600">Learning</label>
              <input type="number" className="w-full bg-violet-50 p-3 border-2 border-slate-900 font-bold" value={todayData.learning} onChange={e => setTodayData({...todayData, learning: e.target.value})} />
            </div>
            <div>
              <label className="text-xs font-black uppercase mb-2 block text-red-600">Screen</label>
              <input type="number" className="w-full bg-red-50 p-3 border-2 border-slate-900 font-bold" value={todayData.screentime} onChange={e => setTodayData({...todayData, screentime: e.target.value})} />
            </div>
            <button className="col-span-2 lg:col-span-1 bg-slate-900 text-white font-black h-[54px] border-2 border-slate-900 hover:bg-indigo-600 hover:-translate-y-1 active:translate-y-0 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
              COMMIT
            </button>
          </form>
          <div className="mt-8 border-t-2 border-slate-100 pt-6">
             <input type="text" placeholder="Workout details..." className="w-full bg-slate-50 p-4 border-2 border-slate-900 font-bold italic" value={todayData.exercise} onChange={e => setTodayData({...todayData, exercise: e.target.value})} />
          </div>
        </div>

        {/* LOGS TABLE */}
        <div className="bg-white border-2 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
           <table className="w-full text-left border-collapse">
             <thead className="bg-slate-900 text-white text-xs font-black uppercase">
               <tr>
                 <th className="p-4">Date</th>
                 <th className="p-4">Read</th>
                 <th className="p-4">Fruits</th>
                 <th className="p-4">Learn</th>
                 <th className="p-4 text-center">Delete</th>
               </tr>
             </thead>
             <tbody className="divide-y-2 divide-slate-100">
               {logs.map(log => (
                 <tr key={log.date} className="font-bold hover:bg-slate-50">
                   <td className="p-4 text-slate-400">{log.date}</td>
                   <td className="p-4 text-blue-600">{log.reading || 0}p</td>
                   <td className="p-4 text-emerald-600">{log.fruits || 0}</td>
                   <td className="p-4 text-violet-600">{log.learning || 0}m</td>
                   <td className="p-4 text-center">
                     <button onClick={() => deleteLog(log.date)} className="text-slate-300 hover:text-red-500 transition"><Trash2 size={18}/></button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}

export default App;