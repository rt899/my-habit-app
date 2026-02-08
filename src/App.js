import React, { useState } from 'react';
import { CheckCircle2, Circle, Trophy, Flame } from 'lucide-react';

export default function HabitApp() {
  const [habits, setHabits] = useState([
    { id: 1, name: 'Morning Meditation', completed: false, streak: 5 },
    { id: 2, name: 'Read 20 Pages', completed: true, streak: 12 },
    { id: 3, name: 'Exercise', completed: false, streak: 3 }
  ]);

  const toggleHabit = (id) => {
    setHabits(habits.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-md mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">My Habit App</h1>
          <p className="text-slate-500">Stay consistent, stay awesome.</p>
        </header>

        <div className="space-y-4">
          {habits.map(habit => (
            <div key={habit.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button onClick={() => toggleHabit(habit.id)}>
                  {habit.completed ? 
                    <CheckCircle2 className="text-green-500" /> : 
                    <Circle className="text-slate-300" />
                  }
                </button>
                <span className={habit.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}>
                  {habit.name}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-lg">
                <Flame size={16} className="text-orange-500" />
                <span className="text-orange-700 text-sm font-bold">{habit.streak}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-indigo-600 p-6 rounded-3xl text-white shadow-xl">
          <div className="flex items-center gap-3 mb-2">
            <Trophy />
            <span className="font-bold">Weekly Progress</span>
          </div>
          <p className="text-indigo-100 text-sm">You've completed 85% of your goals this week. Keep going!</p>
        </div>
      </div>
    </div>
  );
}