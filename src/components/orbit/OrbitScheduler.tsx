import React, { useMemo, useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import { Plus, Trash2 } from 'lucide-react';

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
  const { tasks, toggleTask, addTask, updateTask, deleteTask, preferences } = useTrackStore();
  const [newTask, setNewTask] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

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

  const handleTitleEdit = (id: string, title: string) => {
    setEditingTaskId(id);
    setEditTitle(title);
  };

  const handleTitleSave = (id: string) => {
    if (editTitle.trim()) {
      updateTask(id, { title: editTitle });
      SoundManager.playPop();
    }
    setEditingTaskId(null);
  };

  const handleDelete = useCallback((id: string) => {
    if (preferences.confirmDelete && !window.confirm('Delete this task from orbit?')) {
      return;
    }
    SoundManager.playThud();
    deleteTask(id);
  }, [deleteTask, preferences.confirmDelete]);

  const completionPercentage = useMemo(() => {
    if (tasks.length === 0) return 0;
    return (tasks.filter(t => t.completed).length / tasks.length) * 100;
  }, [tasks]);

  return (
    <div className="p-6 lg:pl-80 space-y-8 min-h-screen bg-surface-lowest text-white">
      <header className="mb-8">
        <h2 className="text-secondary text-sm font-bold tracking-widest uppercase">Orbit Protocol</h2>
        <h1 className="text-4xl font-display font-black text-white">Daily Scheduler</h1>
        <p className="text-on-surface-variant">Sync your daily actions with the stellar timeline.</p>
      </header>

      <form onSubmit={handleSubmit} className="flex gap-2 bg-surface-high p-2 rounded-2xl border border-outline-variant shadow-lg max-w-2xl">
        <input 
          className="flex-1 bg-transparent px-4 py-2 focus:outline-none text-sm"
          placeholder="What is the next mission step?..."
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit" aria-label="Add task" className="p-3 bg-primary-container text-on-primary rounded-xl hover:shadow-[0_0_15px_rgba(var(--color-primary-container-rgb),0.3)] transition-all">
          <Plus size={20} />
        </button>
      </form>

      <section className="space-y-3 max-w-3xl">
        {tasks.map((task) => (
          <motion.div 
            key={task.id}
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-panel border p-4 rounded-2xl flex items-center gap-4 transition-all group ${task.completed ? 'opacity-60 grayscale-[0.5]' : 'hover:border-primary/50'} ${task.isVoid ? 'border-error/30 bg-error/5' : 'border-outline-variant'}`}
          >
            <input 
              className="font-mono bg-surface-high text-primary-container text-xs w-16 focus:outline-none focus:ring-1 focus:ring-primary p-2 rounded-lg border border-transparent"
              value={task.time}
              onChange={(e) => handleTimeChange(task.id, e.target.value)}
            />
            
            <div className="flex-1 min-w-0">
              {editingTaskId === task.id ? (
                <form onSubmit={(e) => { e.preventDefault(); handleTitleSave(task.id); }}>
                  <input 
                    autoFocus
                    className="w-full bg-surface-low p-2 rounded-lg border border-primary text-sm text-white focus:outline-none"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleTitleSave(task.id)}
                    onKeyDown={(e) => e.key === 'Escape' && setEditingTaskId(null)}
                  />
                </form>
              ) : (
                <div 
                  className={`text-sm font-medium truncate cursor-pointer transition-all ${task.completed ? 'line-through text-on-surface-variant' : 'text-white hover:text-primary'}`}
                  onClick={() => toggleTask(task.id)}
                  onDoubleClick={() => handleTitleEdit(task.id, task.title)}
                >
                  {task.title}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                aria-label="Delete task" 
                onClick={() => handleDelete(task.id)} 
                className="p-2 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-lg transition-all"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </section>

      <SyncGauge percentage={completionPercentage} />
    </div>
  );
};

export default React.memo(OrbitScheduler);
