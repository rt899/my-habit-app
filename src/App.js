import React, { useState, useEffect } from 'react';
import { 
  Save, Trash2, Book, TreeDeciduous, Sprout, 
  Dumbbell, Brain, Monitor
} from 'lucide-react';

function App() {
  const [logs, setLogs] = useState([]);
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
  const workoutProgress = Math.min((workoutDays / 150) * 100, 100);

  const getScreenColor = (mins) => {
    const m = parseInt(mins) || 0;
    if (m === 0) return "text-slate-300";
    if (m <= 45) return "text-cyan-500 fill-cyan-50";
    if (m <= 60) return "text-amber-500 fill-amber-50";
    return "text-red-500 fill-red-50 animate-pulse";
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] p-4 md:p-8 text-slate-900 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase">MY_HABIT_APP</h1>
            <p className="text-slate-500 font-medium italic">Simulating growth in real-time.</p>
          </div>
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-200">
            <span className="text-[10px] font-black text-slate-400 block uppercase">Total Score</span>
            <span className="text-xl font-black text-indigo-600">{logs.length} Days</span>
          </div>
        </header>

        <div className="bg-slate-900 rounded-[3rem] p-8 mb-8 text-white shadow-2xl flex flex-col md:flex-row items-center gap-10 border-b-[12px] border-orange-600/20">
           <div className="relative">
              <svg className="w-36 h-36 transform -rotate-90">
                <circle cx="72" cy="72" r="64" stroke="#1e293b" strokeWidth="10" fill="transparent" />
                <circle cx="72" cy="72" r="64" stroke="#f97316" strokeWidth="10" fill="transparent" 
                  strokeDasharray={402} strokeDashoffset={402 - (402 * Math.min(workoutDays, 150)) / 150} 
                  strokeLinecap="round" className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black">{workoutDays}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">/ 150</span>
              </div>
           </div>
           <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-3 justify-center md:justify-start">
                <Dumbbell className="text-orange-500" /> Fitness Peak
              </h2>
              <p className="text-slate-400 mt-2">Goal: 150 Workouts. You are {Math.round(workoutProgress)}% of the way there.</p>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-emerald-600 uppercase mb-4">Orchard (2 Fruits = 1 Tree)</h3>
            <div className="flex flex-wrap gap-2 min-h-[80px] items-end bg-emerald-50/30 p-3 rounded-2xl">
              {[...Array(treesCompleted)].map((_, i) => <TreeDeciduous key={i} size={32} className="text-emerald-500 fill-emerald-100" />)}
              {totalFruits % 2 !== 0 && <Sprout size={24} className="text-lime-500 animate-pulse" />}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-blue-600 uppercase mb-4">Library (250 Pgs = 1 Book)</h3>
            <div className="flex flex-wrap gap-2 min-h-[80px] items-end bg-blue-50/30 p-3 rounded-2xl">
              {[...Array(booksCompleted)].map((_, i) => <Book key={i} size={32} className="text-blue-500 fill-blue-100" />)}
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-violet-600 uppercase mb-4">Brain Lab</h3>
            <div className="flex items-center gap-4 bg-violet-50/30 p-3 rounded-2xl min-h-[80px]">
              <Brain size={40} className={parseInt(todayData.learning) >= 30 ? "text-violet-500 fill-violet-200" : "text-slate-200"} />
              <div>
                <div className="text-lg font-black">{todayData.learning || 0}m</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Daily Learning</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h3 className="text-[10px] font-black text-slate-400 uppercase mb-4">Zen Monitor</h3>
            <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl min-h-[80px]">
              <Monitor size={40} className={getScreenColor(todayData.screentime)} />
              <div>
                <div className="text-lg font-black">{todayData.screentime || 0}m</div>
                <div className="text-[10px] font-bold uppercase tracking-tighter">Screentime</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-slate-200 mb-10">
          <form onSubmit={saveDay} className="grid grid-cols-2 lg:grid-cols-6 gap-6 items-end">
            <div className="col-span-2 lg:col-span-1">
              <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase">Date</label>
              <input type="date" className="w-full bg-slate-100 p-3 rounded-2xl text-sm font-bold border-none" value={todayData.date} onChange={e => setTodayData({...todayData, date: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black text-blue-500 block mb-2 uppercase italic">Reading</label>
              <input type="number" placeholder="Pages" className="w-full bg-blue-50 p-3 rounded-2xl text-sm font-bold outline-none" value={todayData.reading} onChange={e => setTodayData({...todayData, reading: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black text-emerald-500 block mb-2 uppercase italic">Fruits</label>
              <input type="number" placeholder="Qty" className="w-full bg-emerald-50 p-3 rounded-2xl text-sm font-bold outline-none" value={todayData.fruits} onChange={e => setTodayData({...todayData, fruits: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black text-violet-500 block mb-2 uppercase italic">Learning</label>
              <input type="number" placeholder="Mins" className="w-full bg-violet-50 p-3 rounded-2xl text-sm font-bold outline-none" value={todayData.learning} onChange={e => setTodayData({...todayData, learning: e.target.value})} />
            </div>
            <div>
              <label className="text-[10px] font-black text-red-500 block mb-2 uppercase italic underline">Screen</label>
              <input type="number" placeholder="Mins" className="w-full bg-red-50 p-3 rounded-2xl text-sm font-bold outline-none" value={todayData.screentime} onChange={e => setTodayData({...todayData, screentime: e.target.value})} />
            </div>
            <button className="col-span-2 lg:col-span-1 bg-slate-900 text-white font-black h-[48px] rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-2">
              <Save size={18}/> LOG DAY
            </button>
          </form>
          <div className="mt-8 border-t border-slate-100 pt-6">
             <label className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Exercise Notes</label>
             <input type="text" placeholder="What was your workout today?" className="w-full bg-slate-50 p-4 rounded-2xl font-bold border-none ring-1 ring-slate-100" value={todayData.exercise} onChange={e => setTodayData({...todayData, exercise: e.target.value})} />
          </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 overflow-hidden">
           <div className="overflow-x-auto">
             <table className="w-full text-left">
               <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                 <tr>
                   <th className="p-6">Date</th>
                   <th className="p-6">Read</th>
                   <th className="p-6">Fruits</th>
                   <th className="p-6">Learn</th>
                   <th className="p-6">Screen</th>
                   <th className="p-6 text-center">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                 {logs.map(log => (
                   <tr key={log.date} className="hover:bg-slate-50/50">
                     <td className="p-6 text-xs font-bold text-slate-400">{log.date}</td>
                     <td className="p-6 font-bold text-blue-600">{log.reading || 0}p</td>
                     <td className="p-6 font-bold text-emerald-600">{log.fruits || 0}</td>
                     <td className="p-6 font-bold text-violet-600">{log.learning || 0}m</td>
                     <td className={`p-6 font-bold ${parseInt(log.screentime) > 60 ? 'text-red-500' : 'text-slate-400'}`}>{log.screentime || 0}m</td>
                     <td className="p-6 text-center">
                       <button onClick={() => deleteLog(log.date)} className="text-slate-200 hover:text-red-500"><Trash2 size={16}/></button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
}

export default App;