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
    if (window.confirm('Delete?')) {
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

  // --- PRE-CALCULATED VALUES ---
  const totalPages = logs.reduce((acc, curr) => acc + (parseInt(curr.reading) || 0), 0);
  const booksCompleted = Math.floor(totalPages / 250);
  const pagesInCurrentBook = totalPages % 250;
  
  // Clean Percentages
  const readPct = (pagesInCurrentBook / 250) * 100;
  const readStyle = { width: readPct + "%" };

  const workoutDays = logs.filter(l => l.exercise && l.exercise.trim() !== '').length;
  const exerciseTarget = 150;
  const exercisePct = Math.min((workoutDays / exerciseTarget) * 100, 100);
  const exerciseStyle = { width: exercisePct + "%" };
  
  const daysRemaining = Math.max(exerciseTarget - workoutDays, 0);

  const totalFruits = logs.reduce((acc, curr) => acc + (parseInt(curr.fruits) || 0), 0);
  const treesCount = Math.floor(totalFruits / 2);

  const currentLearn = parseInt(todayData.learning) || 0;
  let bulbColor = "bg-slate-100 text-slate-300";
  if (currentLearn >= 60) bulbColor = "bg-yellow-400 text-white";
  else if (currentLearn >= 30) bulbColor = "bg-yellow-200 text-yellow-700";

  // Build-safe bulb class
  const bulbFullClass = "w-16 h-16 rounded-full flex items-center justify-center mb-4 " + bulbColor;

  return (
    <div className="min-h-screen bg-slate-50 p-4 text-slate-900">
      <div className="max-w-4xl mx-auto">
        
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black italic">HABIT_OS</h1>
          <button onClick={exportData} className="p-2 bg-white border rounded-xl">
            <Download size={20} />
          </button>
        </header>

        <section className="bg-white rounded-3xl p-6 shadow-sm mb-6 border border-slate-200">
          <form onSubmit={saveDay} className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <input type="date" className="p-2 bg-slate-100 rounded-lg text-xs" value={todayData.date} onChange={(e) => setTodayData({...todayData, date: e.target.value})} />
            <input type="number" placeholder="Pages" className="p-2 bg-slate-100 rounded-lg text-xs" value={todayData.reading} onChange={(e) => setTodayData({...todayData, reading: e.target.value})} />
            <input type="number" placeholder="Fruits" className="p-2 bg-slate-100 rounded-lg text-xs" value={todayData.fruits} onChange={(e) => setTodayData({...todayData, fruits: e.target.value})} />
            <input type="number" placeholder="Mins" className="p-2 bg-slate-100 rounded-lg text-xs" value={todayData.learning} onChange={(e) => setTodayData({...todayData, learning: e.target.value})} />
            <input type="text" placeholder="Exercise" className="p-2 bg-slate-100 rounded-lg text-xs" value={todayData.exercise} onChange={(e) => setTodayData({...todayData, exercise: e.target.value})} />
            <button type="submit" className="bg-slate-900 text-white rounded-lg text-xs font-bold uppercase">Save</button>
          </form>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200">
            <div className="flex justify-between mb-4">
              <span className="text-xs font-bold uppercase text-slate-400">Reading</span>
              <span className="text-xs font-bold text-blue-500">{pagesInCurrentBook}/250</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500" style={readStyle}></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col items-center">
            <div className={bulbFullClass}>
              <Lightbulb size={24} />
            </div>
            <span className="text-xl font-black">{currentLearn}m</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200">
             <div className="flex flex-wrap gap-2">
                {Array.from({ length: treesCount }).map((_, i) => (
                  <TreeDeciduous key={i} size={20} className="text-emerald-500" />
                ))}
             </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-3xl text-white">
            <div className="flex justify-between mb-4">
              <span className="text-4xl font-black">{workoutDays}</span>
              <span className="text-xs text-orange-400">{daysRemaining} Left</span>
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