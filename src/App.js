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
      try { setLogs(JSON.parse(saved)); } catch (e) { setLogs([]); }
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

  // --- Calculations ---
  const totalPages = logs.reduce((acc, curr) => acc + (parseInt(curr.reading) || 0), 0);
  const booksCompleted = Math.floor(totalPages / 250);
  const pagesInCurrentBook = totalPages % 250;
  const readWidth = (pagesInCurrentBook / 250) * 100 + "%";

  const workoutDays = logs.filter(l => l.exercise && l.exercise.trim() !== '').length;
  const exerciseTarget = 150;
  const exerciseProgress = Math.min((workoutDays / exerciseTarget) * 100, 100) + "%";
  const daysRemaining = Math.max(exerciseTarget - workoutDays, 0);

  const totalFruits = logs.reduce((acc, curr) => acc + (parseInt(curr.fruits) || 0), 0);
  const treesCount = Math.floor(totalFruits / 2);
  const hasExtraSprout = totalFruits % 2 !== 0;

  // Live Bulb Logic (Reacts to input state)
  const currentLearn = parseInt(todayData.learning) || 0;
  let bulbColor = 'bg-slate-100 text-slate-300';
  let neuralStatus = 'IDLE';
  if (currentLearn >= 60) { bulbColor = 'bg-yellow-400 text-white animate-pulse shadow-[0_0_