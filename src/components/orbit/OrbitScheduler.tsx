import React, { useMemo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import { Plus, Edit2 } from 'lucide-react';

const SyncGauge = React.memo(({ percentage }: { percentage: number }) => (
  <div className="fixed bottom-24 right-8 w-24 h-24">
    <svg className="w-full h-full rotate-[-90deg]">
      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="none" className="text-surface-high" />
      <motion.circle 
        cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="none" className="text-primary-container"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: percentage / 100 }}
        transition={{ duration: 1 }}
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center font-black">{Math.round(percentage)}%</div>
  </div>
));

const OrbitScheduler = () => {
  const { tasks, toggleTask, addTask, updateTask, ambitions } = useTrackStore();
  const [newTask, setNewTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const time = new Date().getHours().toString().padStart(2, '0') + ':00';
    addTask(time, newTask);
    SoundManager.playPop();
    setNewTask('');
  };

  const handleTimeChange = (id: string, time: string) => {
    updateTask(id, { time });
  };

  const completionPercentage = useMemo(() => {
    if (tasks.length === 0) return 0;
    return (tasks.filter(t => t.completed).length / tasks.length) * 100;
  }, [tasks]);

  return (
    <div className="p-6 lg:pl-80 space-y-8">
      <h2 className="text-on-surface-variant text-sm tracking-widest uppercase font-medium">Orbit (Daily Protocol)</h2>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          className="flex-1 bg-surface-high p-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none"
          placeholder="New task..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="p-3 bg-primary-container text-on-primary rounded-xl"><Plus /></button>
      </form>

      <section className="space-y-4">
        {tasks.map((task) => (
          <motion.div 
            key={task.id}
            className={`glass-panel border p-4 rounded-xl flex items-center gap-4 ${task.isVoid ? 'border-error/30' : 'border-outline-variant'}`}
          >
            <input 
              className="font-mono bg-transparent text-primary-container text-sm w-16 focus:outline-none"
              value={task.time}
              onChange={(e) => handleTimeChange(task.id, e.target.value)}
            />
            <span className={`flex-1 ${task.completed ? 'line-through opacity-50' : ''}`} onClick={() => toggleTask(task.id)}>
              {task.title}
            </span>
          </motion.div>
        ))}
      </section>

      <SyncGauge percentage={completionPercentage} />
    </div>
  );
};

export default React.memo(OrbitScheduler);
