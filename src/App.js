import React, { useState, useEffect } from 'react';
import { 
  TreeDeciduous, 
  Lightbulb, 
  Download 
} from 'lucide-react';

function App() {
  const [logs, setLogs] = useState([]);
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

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "habit_logs.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  // --- CALCULATIONS ---
  const totalPages = logs.reduce((acc, curr) => acc + (parseInt(curr.reading, 10) || 0), 0);
  const pagesInCurrentBook = totalPages % 250;
  const readPct = (pagesInCurrentBook / 250) * 100;
  const readStyle = { width: readPct + "%" };

  const workoutDays = logs.filter(l => l.exercise && l.exercise.trim() !== "").length;
  const exerciseTarget = 150;
  const exercisePct = Math.min((workoutDays / exerciseTarget) * 100, 100);
  const exerciseStyle = { width: exercisePct + "%" };
  const daysRemaining = Math.max(exerciseTarget - workoutDays, 0);

  const totalFruits = logs.reduce((acc, curr) => acc + (parseInt(curr.fruits, 10) || 0), 0);
  const treesCount = Math.floor(totalFruits / 2);

  const currentLearn = parseInt(todayData.learning, 10) || 0;
  let bulbColor = "bg-slate-100 text-slate-300";
  if (currentLearn >= 60) bulbColor = "bg-yellow-400 text-white shadow-lg shadow-yellow-100";
  else if (currentLearn >= 30) bulbColor = "bg-yellow-200 text-yellow-700";

  const bulbFullClass = "w-16 h-16 rounded-full flex items-center justify-center mb-4 " + bulbColor;

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black italic">HABIT_OS</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">v2.0 Terminal</p>
          </div>
          <button onClick={exportData} className="p-2 bg-white border rounded-xl hover:bg-slate-50 transition-colors">
            <Download size={20} className="text-slate-400" />
          </button>
        </header>

        {/* INPUT SECTION */}
        <section className="bg-white rounded-[2rem] p-6 shadow-sm mb-6 border border-slate-200">
          <form onSubmit={saveDay} className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Date</label>
              <input type="date" className="p-2 bg-slate-50 rounded-lg text-xs outline-none" value={todayData.date} onChange={(e) => setTodayData({...todayData, date: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Pages</label>
              <input type="number" placeholder="0" className="p-2 bg-slate-50 rounded-lg text-xs outline-none" value={todayData.reading} onChange={(e) => setTodayData({...todayData, reading: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Fruits</label>
              <input type="number" placeholder="0" className="p-2 bg-slate-50 rounded-lg text-xs outline-none" value={todayData.fruits} onChange={(e) => setTodayData({...todayData, fruits: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Mins</label>
              <input type="number" placeholder="0" className="p-2 bg-slate-50 rounded-lg text-xs outline-none" value={todayData.learning} onChange={(e) => setTodayData({...todayData, learning: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Exercise</label>
              <input type="text" placeholder="Activity" className="p-2 bg-slate-50 rounded-lg text-xs outline-none" value={todayData.exercise} onChange={(e) => setTodayData({...todayData, exercise: e.target.value})} />
            </div>
            <div className="flex items-end">
              <button type="submit" className="w-full p-2 bg-slate-900 text-white rounded-lg text-[10px] font-black uppercase hover:bg-indigo-600 transition-colors">Record</button>
            </div>
          </form>
        </section>

        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-bold uppercase text-slate-400">Library Progress</span>
              <span className="text-[10px] font-black text-blue-500">{pagesInCurrentBook}/250 PG</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={readStyle}></div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center">
            <div className={bulbFullClass}>
              <Lightbulb size={24} />
            </div>
            <div className="text-center font-black">
               <div className="text-2xl leading-none">{currentLearn}m</div>
               <div className="text-[8px] text-slate-400 uppercase tracking-widest mt-1">Daily Mastery</div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
             <div className="text-[10px] font-bold uppercase text-slate-400 mb-4">Nutrition Grove</div>
             <div className="flex flex-wrap gap-2">
                {Array.from({ length: treesCount }).map((_, i) => (
                  <TreeDeciduous key={i} size={20} className="text-emerald-500" />
                ))}
                {treesCount === 0 && <span className="text-[10px] italic text-slate-300">No trees yet...</span>}
             </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-[2rem] text-white shadow-xl">
            <div className="flex justify-between items-end mb-4">
              <div>
                <div className="text-4xl font-black italic">{workoutDays}</div>
                <div className="text-[8px] font-bold uppercase text-slate-400">Total Workouts</div>
              </div>
              <div className="text-[10px] font-bold uppercase text-orange-400">{daysRemaining} To Go</div>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500" style={exerciseStyle}></div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;