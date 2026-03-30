import React, { useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackStore, Task } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import { analyzeSchedule, ScheduleAnomaly } from '../../utils/StellarScheduler';
import { Plus, Trash2, Clock, AlertTriangle, ShieldCheck, Zap, BrainCircuit } from 'lucide-react';
import ReflectionModal from '../reflection/ReflectionModal';

const SyncGauge = React.memo(({ percentage }: { percentage: number }) => (
  <div className="fixed bottom-24 right-8 w-24 h-24 group">
    <svg className="w-full h-full rotate-[-90deg]">
      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="none" className="text-surface-high" />
      <motion.circle 
        cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="none" className="text-primary-container"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: percentage / 100 }}
        transition={{ duration: 1 }}
      />
    </svg>
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <div className="text-xl font-black text-white">{Math.round(percentage)}%</div>
      <div className="text-[8px] font-bold text-on-surface-variant uppercase tracking-widest">Sync</div>
    </div>
    <div className="absolute -top-4 -right-4 bg-primary text-on-primary text-[8px] font-black px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
      Orbital Lock
    </div>
  </div>
));

const OrbitScheduler = () => {
  const { tasks, toggleTask, addTask, updateTask, deleteTask, preferences, profile } = useTrackStore();
  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState(new Date().getHours().toString().padStart(2, '0') + ':00');
  const [newEndTime, setNewEndTime] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [reflectionType, setReflectionType] = useState<'daily-summary' | 'missed-task'>('daily-summary');

  const isPro = preferences.uiMode === 'professional';

  const anomalies = useMemo(() => analyzeSchedule(tasks), [tasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    addTask(newTime, newTask, undefined, {
      endTime: newEndTime || undefined,
      deadline: newDeadline || undefined,
      weightage: isPro ? 20 : 10
    });
    
    SoundManager.playPop();
    setNewTask('');
    setNewEndTime('');
    setNewDeadline('');
  };

  const handleToggle = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    await toggleTask(id);
    if (isPro && task && !task.completed) {
      setReflectionType('daily-summary');
      setIsReflectionOpen(true);
    }
  };

  const handleTimeChange = (id: string, time: string) => {
    updateTask(id, { time });
  };

  const handleEndTimeChange = (id: string, endTime: string) => {
    updateTask(id, { endTime });
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
    if (preferences.confirmDelete && !window.confirm('Eject this mission task from orbit?')) {
      return;
    }
    SoundManager.playThud();
    deleteTask(id);
  }, [deleteTask, preferences.confirmDelete]);

  const completionPercentage = useMemo(() => {
    if (tasks.length === 0) return 0;
    return (tasks.filter(t => t.completed).length / tasks.length) * 100;
  }, [tasks]);

  const globalAnomalies = anomalies.filter(a => a.taskId === 'global');

  return (
    <div className="p-6 lg:pl-80 space-y-8 min-h-screen bg-surface-lowest text-white pb-32">
      <header className="mb-8 relative">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-secondary text-sm font-bold tracking-widest uppercase">Orbit Protocol {isPro ? '(Professional)' : '(Standard)'}</h2>
            <h1 className="text-4xl font-display font-black text-primary uppercase">Daily Mission Log</h1>
            <p className="text-on-surface-variant max-w-lg">Synchronize your planetary rotation with stellar objectives.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-surface-high border border-outline-variant p-3 rounded-2xl flex items-center gap-3">
              <Zap className="text-primary-container" size={20} />
              <div className="text-right">
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Resonance</div>
                <div className="text-sm font-black text-primary">{profile.xp} XP</div>
              </div>
            </div>
            {isPro && (
              <button 
                onClick={() => { setReflectionType('daily-summary'); setIsReflectionOpen(true); }}
                className="flex items-center gap-2 p-2 px-4 rounded-xl border border-secondary/30 text-secondary hover:bg-secondary/10 transition-colors text-[10px] font-black uppercase tracking-widest"
              >
                <BrainCircuit size={14} />
                Neural Reflection
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {globalAnomalies.map((a, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`absolute top-0 right-0 max-w-xs p-4 rounded-2xl border flex gap-3 shadow-2xl z-10 ${a.severity === 'error' ? 'bg-error/10 border-error/30 text-error' : 'bg-warning/10 border-warning/30 text-warning'}`}
            >
              <AlertTriangle className="shrink-0" size={20} />
              <p className="text-xs font-bold leading-tight uppercase tracking-tighter">{a.message}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </header>

      <section className="glass-panel border border-outline-variant p-6 rounded-3xl space-y-4">
        <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] flex items-center gap-2">
          <Plus size={14} className="text-primary" />
          Initialize New Task
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
          <input 
            className="flex-1 min-w-[300px] bg-surface-high px-6 py-4 rounded-2xl border border-outline-variant focus:border-primary focus:outline-none text-sm transition-all"
            placeholder="Define the next mission parameter..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <div className="flex gap-2">
            <div className="bg-surface-high border border-outline-variant p-2 rounded-2xl flex items-center gap-2 px-4">
              <Clock size={14} className="text-on-surface-variant" />
              <input 
                type="time"
                className="bg-transparent text-xs font-mono focus:outline-none"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
            </div>
            
            {isPro && (
              <>
                <div className="bg-surface-high border border-outline-variant p-2 rounded-2xl flex items-center gap-2 px-4">
                  <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">Descent</div>
                  <input 
                    type="time"
                    className="bg-transparent text-xs font-mono focus:outline-none"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                  />
                </div>
                <div className="bg-surface-high border border-outline-variant p-2 rounded-2xl flex items-center gap-2 px-4">
                  <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">Deadline</div>
                  <input 
                    type="datetime-local"
                    className="bg-transparent text-[10px] font-mono focus:outline-none w-32"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          <button type="submit" aria-label="Add task" className="px-8 py-4 bg-primary-container text-on-primary rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_25px_rgba(var(--color-primary-container-rgb),0.4)] transition-all flex items-center gap-2">
            <Plus size={20} />
            Uplink
          </button>
        </form>
      </section>

      <section className="space-y-4 max-w-4xl">
        <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] flex items-center gap-2 px-2">
          <Clock size={14} className="text-secondary" />
          Mission Rotation
        </h3>
        
        {tasks.length === 0 && (
          <div className="py-20 text-center glass-panel border border-outline-variant border-dashed rounded-3xl">
            <div className="text-on-surface-variant font-display font-black text-2xl uppercase opacity-20 italic">No Orbital Activity Detected</div>
            <p className="text-on-surface-variant text-xs uppercase tracking-widest mt-2">Standing by for mission parameters.</p>
          </div>
        )}

        {tasks.sort((a,b) => a.time.localeCompare(b.time)).map((task) => {
          const taskAnomalies = anomalies.filter(a => a.taskId === task.id);
          const hasError = taskAnomalies.some(a => a.severity === 'error');
          const hasWarning = taskAnomalies.some(a => a.severity === 'warning');

          return (
            <motion.div 
              key={task.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-panel border p-5 rounded-3xl flex flex-col gap-4 transition-all group relative ${task.completed ? 'opacity-50 grayscale-[0.8]' : 'hover:border-primary/50'} ${task.isVoid ? 'border-error/30 bg-error/5' : 'border-outline-variant'} ${hasError ? 'border-error/50 ring-1 ring-error/20 shadow-[0_0_15px_rgba(var(--color-error-rgb),0.1)]' : ''}`}
            >
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-1">
                  <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">Entry</div>
                  <input 
                    className="font-mono bg-surface-high text-primary-container text-xs w-20 focus:outline-none focus:ring-1 focus:ring-primary p-2 rounded-xl border border-transparent text-center"
                    value={task.time}
                    onChange={(e) => handleTimeChange(task.id, e.target.value)}
                  />
                </div>

                {isPro && task.endTime && (
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">Descent</div>
                    <input 
                      className="font-mono bg-surface-high text-secondary text-xs w-20 focus:outline-none focus:ring-1 focus:ring-secondary p-2 rounded-xl border border-transparent text-center"
                      value={task.endTime}
                      onChange={(e) => handleEndTimeChange(task.id, e.target.value)}
                    />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  {editingTaskId === task.id ? (
                    <form onSubmit={(e) => { e.preventDefault(); handleTitleSave(task.id); }}>
                      <input 
                        autoFocus
                        className="w-full bg-surface-low p-3 rounded-xl border border-primary text-sm text-white focus:outline-none shadow-inner"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleTitleSave(task.id)}
                        onKeyDown={(e) => e.key === 'Escape' && setEditingTaskId(null)}
                      />
                    </form>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div 
                        className={`text-base font-bold truncate cursor-pointer transition-all flex-1 ${task.completed ? 'line-through text-on-surface-variant italic' : 'text-white hover:text-primary'}`}
                        onClick={() => handleToggle(task.id)}
                        onDoubleClick={() => handleTitleEdit(task.id, task.title)}
                      >
                        {task.title}
                      </div>
                      {task.completed && <ShieldCheck className="text-success shrink-0" size={18} />}
                    </div>
                  )}
                  
                  {isPro && task.deadline && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="text-[9px] font-black text-error uppercase tracking-widest flex items-center gap-1">
                        <AlertTriangle size={10} />
                        Deadline: {new Date(task.deadline).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    aria-label="Delete task" 
                    onClick={() => handleDelete(task.id)} 
                    className="p-3 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {taskAnomalies.length > 0 && !task.completed && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 border-t border-outline-variant space-y-2">
                      {taskAnomalies.map((a, i) => (
                        <div key={i} className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest ${a.severity === 'error' ? 'text-error' : 'text-warning'}`}>
                          <AlertTriangle size={12} />
                          {a.message}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </section>

      <SyncGauge percentage={completionPercentage} />

      <ReflectionModal 
        isOpen={isReflectionOpen} 
        onClose={() => setIsReflectionOpen(false)} 
        type={reflectionType}
        title={reflectionType === 'daily-summary' ? 'Neural Debrief' : 'Trajectory Analysis'}
      />
    </div>
  );
};

export default React.memo(OrbitScheduler);
