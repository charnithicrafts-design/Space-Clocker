import React, { useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackStore, Task } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import { analyzeSchedule, ScheduleAnomaly } from '../../utils/StellarScheduler';
import { getTodayLocalISO, getLocalTimeHHmm } from '../../utils/DateTimeUtils';
import { Plus, Trash2, Edit2, Clock, AlertTriangle, ShieldCheck, Zap, BrainCircuit, Calendar, Timer, Signal, Share2, Send, Check, ExternalLink, Info } from 'lucide-react';
import ReflectionModal from '../reflection/ReflectionModal';
import OrbitSubNav, { OrbitHorizon } from './OrbitSubNav';
import VoidList from '../void-protocol/VoidList';
import ConfirmModal from '../layout/ConfirmModal';
import { ActionMenu } from '../layout/ActionMenu';


const SyncGauge = React.memo(({ percentage }: { percentage: number }) => (
  <div className="fixed bottom-24 right-8 w-24 h-24 group z-40">
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
  const { tasks, toggleTask, toggleMilestoneTask, addTask, updateTask, updateTaskDate, deleteTask, updateMilestoneTask, deleteMilestoneTask, preferences, profile, ambitions } = useTrackStore();
  const [activeHorizon, setActiveHorizon] = useState<OrbitHorizon>('daily');
  const [selectedDate, setSelectedDate] = useState(getTodayLocalISO());
  const [showTransmissionPreview, setShowTransmissionPreview] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const [newTask, setNewTask] = useState('');
  const [newTime, setNewTime] = useState(getLocalTimeHHmm().split(':')[0] + ':00');
  const [newEndTime, setNewEndTime] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editDeadline, setEditDeadline] = useState('');

  
  const [isReflectionOpen, setIsReflectionOpen] = useState(false);
  const [reflectionType, setReflectionType] = useState<'daily-summary' | 'missed-task'>('daily-summary');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const isPro = preferences.uiMode === 'professional';

  // Consolidate all tasks (standalone + milestone tasks)
  const allTasks = useMemo(() => {
    const milestoneTasks = ambitions.flatMap(a => a.milestones.flatMap(m => m.tasks));
    return [...tasks, ...milestoneTasks];
  }, [tasks, ambitions]);

  // Filter tasks based on selected date and active horizon
  const filteredTasks = useMemo(() => {
    if (activeHorizon === 'void') return [];
    
    return allTasks.filter(t => {
      if (!t.plannedDate) return false;
      
      const isCorrectDate = t.plannedDate === selectedDate;
      
      if (activeHorizon === 'daily') {
        // Daily view logic:
        // 1. Show Daily tasks for the selected date (standalone or milestone)
        if (t.horizon === 'daily' && isCorrectDate) return true;
        // 2. Weekly tasks' deadline can be shown in daily timeline
        if (t.horizon === 'weekly' && t.deadline) {
           const deadlineDate = t.deadline.split('T')[0];
           return deadlineDate === selectedDate;
        }
        return false;
      }
      
      if (activeHorizon === 'weekly') {
        // Weekly view logic:
        // 1. Daily tasks should not be shown in weekly timeline
        if (t.horizon === 'daily') return false;
        // 2. Milestone task's deadline should be shown in weekly timeline
        if (t.milestoneId) {
          if (!t.deadline) return false;
          const deadlineDate = t.deadline.split('T')[0];
          return deadlineDate === selectedDate;
        }
        // 3. Weekly tasks should be shown for the selected date
        if (t.horizon === 'weekly' && isCorrectDate) return true;
        return false;
      }

      return false;
    });
  }, [allTasks, activeHorizon, selectedDate]);

  const anomalies = useMemo(() => analyzeSchedule(filteredTasks), [filteredTasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    addTask(newTime, newTask, undefined, {
      endTime: newEndTime || undefined,
      deadline: newDeadline || undefined,
      plannedDate: selectedDate,
      horizon: activeHorizon === 'void' ? 'daily' : activeHorizon,
      weightage: isPro ? (activeHorizon === 'weekly' ? 50 : 20) : 10
    });
    
    SoundManager.playPop();
    setNewTask('');
    setNewEndTime('');
    setNewDeadline('');
  };

  const handleToggle = async (id: string) => {
    const milestoneTask = ambitions.flatMap(a => a.milestones.flatMap(m => m.tasks.map(t => ({ ...t, ambitionId: a.id })) )).find(t => t.id === id);
    
    if (milestoneTask) {
      await toggleMilestoneTask(milestoneTask.ambitionId, milestoneTask.milestoneId!, id);
      if (isPro && !milestoneTask.completed) {
        setReflectionType('daily-summary');
        setIsReflectionOpen(true);
      }
    } else {
      const task = tasks.find(t => t.id === id);
      await toggleTask(id);
      if (isPro && task && !task.completed) {
        setReflectionType('daily-summary');
        setIsReflectionOpen(true);
      }
    }
  };

  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditTime(task.time);
    setEditEndTime(task.endTime || '');
    setEditDate(task.plannedDate || getTodayLocalISO());
    setEditDeadline(task.deadline || '');
  };

  const handleSaveTaskEdit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!editingTaskId) return;

    const titleToSave = editTitle.trim();
    if (!titleToSave) return;

    const updates: Partial<Task> = {
      title: titleToSave,
      time: editTime,
      endTime: editEndTime || undefined,
      plannedDate: editDate || undefined,
      deadline: editDeadline || undefined,
    };

    const milestoneTask = ambitions.flatMap(a => a.milestones.flatMap(m => m.tasks.map(t => ({ ...t, ambitionId: a.id })) )).find(t => t.id === editingTaskId);

    if (milestoneTask) {
      await updateMilestoneTask(milestoneTask.ambitionId, milestoneTask.milestoneId!, editingTaskId, updates);
    } else {
      await updateTask(editingTaskId, updates);
    }

    SoundManager.playPop();
    setEditingTaskId(null);
  };

  const handleDelete = useCallback((id: string) => {
    if (preferences.confirmDelete) {
      setDeleteTaskId(id);
      setIsDeleteModalOpen(true);
      return;
    }
    SoundManager.playThud();
    const milestoneTask = ambitions.flatMap(a => a.milestones.flatMap(m => m.tasks.map(t => ({ ...t, ambitionId: a.id })) )).find(t => t.id === id);
    if (milestoneTask) {
      deleteMilestoneTask(milestoneTask.ambitionId, milestoneTask.milestoneId!, id);
    } else {
      deleteTask(id);
    }
  }, [deleteTask, deleteMilestoneTask, ambitions, preferences.confirmDelete]);

  const handleDeleteConfirm = async () => {
    if (deleteTaskId) {
      SoundManager.playThud();
      const milestoneTask = ambitions.flatMap(a => a.milestones.flatMap(m => m.tasks.map(t => ({ ...t, ambitionId: a.id })) )).find(t => t.id === deleteTaskId);
      if (milestoneTask) {
        await deleteMilestoneTask(milestoneTask.ambitionId, milestoneTask.milestoneId!, deleteTaskId);
      } else {
        await deleteTask(deleteTaskId);
      }
      setDeleteTaskId(null);
    }
  };


  const completionPercentage = useMemo(() => {
    if (filteredTasks.length === 0) return 0;
    return (filteredTasks.filter(t => t.completed).length / filteredTasks.length) * 100;
  }, [filteredTasks]);

  const globalAnomalies = anomalies.filter(a => a.taskId === 'global');

  return (
    <div className="p-6 lg:pl-80 space-y-8 min-h-screen bg-surface-lowest text-white pb-32">
      <header className="mb-8 relative">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-secondary text-sm font-bold tracking-widest uppercase">Orbit Protocol {isPro ? '(Professional)' : '(Standard)'}</h2>
            <h1 className="text-4xl font-display font-black text-primary uppercase">Mission Control</h1>
            <p className="text-on-surface-variant max-w-lg">Synchronize your planetary rotation with stellar objectives.</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="bg-surface-high border border-outline-variant p-3 rounded-2xl flex items-center gap-3 shadow-lg">
              <Zap className="text-primary-container" size={20} />
              <div className="text-right">
                <div className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Resonance</div>
                <div className="text-sm font-black text-primary">{profile.xp} XP</div>
              </div>
            </div>
            {isPro && (
              <button 
                onClick={() => { setReflectionType('daily-summary'); setIsReflectionOpen(true); }}
                className="flex items-center gap-2 p-2 px-4 rounded-xl border border-secondary/30 text-secondary hover:bg-secondary/10 transition-colors text-[10px] font-black uppercase tracking-widest glass-panel"
              >
                <BrainCircuit size={14} />
                Neural Reflection
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <OrbitSubNav active={activeHorizon} onChange={setActiveHorizon} />
        
        {activeHorizon !== 'void' && (
          <div className="flex items-center gap-3 glass-panel p-2 px-4 rounded-2xl border border-outline-variant mb-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <Calendar size={16} className="text-primary" />
            <input 
              type="date"
              className="bg-transparent text-sm font-bold font-mono focus:outline-none uppercase"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {activeHorizon === 'void' ? (
          <motion.div 
            key="void-mode"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl"
          >
            <VoidList />
          </motion.div>
        ) : (
          <motion.div 
            key="mission-mode"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <section className="glass-panel border border-outline-variant p-6 rounded-3xl space-y-4">
              <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] flex items-center gap-2">
                <Plus size={14} className="text-primary" />
                Initialize New {activeHorizon === 'weekly' ? 'Weekly Milestone' : 'Daily Parameter'}
              </h3>
              <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
                <input 
                  className="flex-1 min-w-[300px] bg-surface-high px-6 py-4 rounded-2xl border border-outline-variant focus:border-primary focus:outline-none text-sm transition-all"
                  placeholder={activeHorizon === 'weekly' ? "Define a weekly resonance milestone..." : "Define the next mission parameter..."}
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
                <div className="flex gap-2">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="bg-surface-high border border-outline-variant p-2 rounded-2xl flex items-center gap-2 px-4">
                      <Clock size={14} className="text-on-surface-variant" />
                      <input 
                        type="time"
                        className="bg-transparent text-xs font-mono focus:outline-none"
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                      />
                    </div>
                    
                    <div className="bg-surface-high border border-outline-variant p-2 rounded-2xl flex items-center gap-2 px-4">
                      <Timer size={14} className="text-on-surface-variant" />
                      <input 
                        type="time"
                        className="bg-transparent text-xs font-mono focus:outline-none"
                        value={newEndTime}
                        onChange={(e) => setNewEndTime(e.target.value)}
                      />
                    </div>
                    <div className="bg-surface-high border border-outline-variant p-2 rounded-2xl flex items-center gap-2 px-4">
                      <AlertTriangle size={14} className="text-error" />
                      <input 
                        type="datetime-local"
                        className="bg-transparent text-[10px] font-mono focus:outline-none w-32"
                        value={newDeadline}
                        onChange={(e) => setNewDeadline(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <button type="submit" aria-label="Add task" className="px-8 py-4 bg-primary-container text-on-primary rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_25px_rgba(var(--color-primary-container-rgb),0.4)] transition-all flex items-center gap-2">
                  <Plus size={20} />
                  Uplink
                </button>
              </form>
            </section>

            <section className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] flex items-center gap-2">
                  <Clock size={14} className="text-secondary" />
                  Mission Rotation: {new Date(selectedDate).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
                </h3>
                {globalAnomalies.length > 0 && (
                   <div className="flex gap-2">
                    {globalAnomalies.map((a, i) => (
                      <div key={i} className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${a.severity === 'error' ? 'text-error' : 'text-warning'}`}>
                        <AlertTriangle size={12} />
                        {a.message}
                      </div>
                    ))}
                   </div>
                )}
              </div>
              
              {filteredTasks.length === 0 && (
                <div className="py-20 text-center glass-panel border border-outline-variant border-dashed rounded-3xl">
                  <div className="text-on-surface-variant font-display font-black text-2xl uppercase opacity-20 italic">No Orbital Activity Detected</div>
                  <p className="text-on-surface-variant text-xs uppercase tracking-widest mt-2">Standing by for mission parameters.</p>
                </div>
              )}

              {filteredTasks.some(t => t.completed) && !localStorage.getItem('hasSeenTransmissionPreview') && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-3xl border border-secondary/40 bg-secondary/5 flex flex-col md:flex-row items-center gap-6 shadow-[0_0_20px_rgba(var(--color-secondary-rgb),0.15)] mb-6"
                >
                  <div className="w-12 h-12 rounded-2xl bg-secondary/15 text-secondary flex items-center justify-center border border-secondary/20 shrink-0">
                    <Signal size={24} className="animate-pulse" />
                  </div>
                  <div className="space-y-1 text-center md:text-left flex-1">
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">📡 Mission Telemetry Ready</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      You completed your first daily parameter! See what a 1-click progress transmission looks like for your mentor.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      SoundManager.playSwell();
                      setShowTransmissionPreview(true);
                    }}
                    className="bg-secondary text-on-secondary px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-secondary/80 transition-colors shadow-lg flex items-center gap-2 cursor-pointer border-none outline-none"
                  >
                    Generate Telemetry Preview
                  </button>
                </motion.div>
              )}

              {filteredTasks.sort((a,b) => a.time.localeCompare(b.time)).map((task) => {
                const taskAnomalies = anomalies.filter(a => a.taskId === task.id);
                const hasError = taskAnomalies.some(a => a.severity === 'error');
                
                // Calculate if deadline is critical (within 24 hours)
                const isDeadlineCritical = task.deadline && !task.completed && (new Date(task.deadline).getTime() - Date.now() < 86400000);

                return (
                  <motion.div 
                    key={task.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`glass-panel border p-5 rounded-3xl flex flex-col gap-4 transition-all group relative ${task.completed ? 'opacity-50 grayscale-[0.8]' : 'hover:border-primary/50'} ${task.isVoid ? 'border-error/30 bg-error/5' : 'border-outline-variant'} ${hasError ? 'border-error/50 ring-1 ring-error/20 shadow-[0_0_15px_rgba(var(--color-error-rgb),0.1)]' : ''} ${isDeadlineCritical ? 'border-error shadow-[0_0_15px_rgba(var(--color-error-rgb),0.2)]' : ''}`}
                  >
                    {editingTaskId === task.id ? (
                      <form 
                        onSubmit={handleSaveTaskEdit} 
                        className="w-full flex flex-col gap-3 p-4 bg-surface-high/20 rounded-2xl" 
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="flex flex-col gap-1">
                          <label className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Parameter Title</label>
                          <input 
                            autoFocus
                            className="w-full bg-surface-low px-3 py-2 rounded-xl border border-outline-variant focus:border-primary focus:outline-none text-xs text-white"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => handleSaveTaskEdit()}
                            onKeyDown={(e) => e.key === 'Escape' && setEditingTaskId(null)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Entry</label>
                            <div className="flex items-center gap-2 bg-surface-low px-3 py-2 rounded-xl border border-outline-variant">
                              <Clock size={12} className="text-primary" />
                              <input 
                                type="time" 
                                className="bg-transparent text-xs font-mono text-white focus:outline-none w-full" 
                                value={editTime} 
                                onChange={e => setEditTime(e.target.value)} 
                                onBlur={() => handleSaveTaskEdit()} 
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Descent</label>
                            <div className="flex items-center gap-2 bg-surface-low px-3 py-2 rounded-xl border border-outline-variant">
                              <Timer size={12} className="text-secondary" />
                              <input 
                                type="time" 
                                className="bg-transparent text-xs font-mono text-white focus:outline-none w-full" 
                                value={editEndTime} 
                                onChange={e => setEditEndTime(e.target.value)} 
                                onBlur={() => handleSaveTaskEdit()} 
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest">Mission Date</label>
                            <div className="flex items-center gap-2 bg-surface-low px-3 py-2 rounded-xl border border-outline-variant">
                              <Calendar size={12} className="text-primary-container" />
                              <input 
                                type="date" 
                                className="bg-transparent text-xs font-mono text-white focus:outline-none w-full uppercase" 
                                value={editDate} 
                                onChange={e => setEditDate(e.target.value)} 
                                onBlur={() => handleSaveTaskEdit()} 
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <label className="text-[8px] font-black text-on-surface-variant uppercase tracking-widest text-error">Deadline Lock</label>
                            <div className="flex items-center gap-2 bg-surface-low px-3 py-2 rounded-xl border border-error/30">
                              <AlertTriangle size={12} className="text-error" />
                              <input 
                                type="datetime-local" 
                                className="bg-transparent text-xs font-mono text-white focus:outline-none w-full" 
                                value={editDeadline} 
                                onChange={e => setEditDeadline(e.target.value)} 
                                onBlur={() => handleSaveTaskEdit()} 
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 mt-2">
                          <button 
                            type="button" 
                            onClick={() => setEditingTaskId(null)} 
                            className="p-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-white"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="p-2 px-4 bg-primary text-on-primary rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                          >
                            <Check size={12} />
                            Save
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-wrap items-center gap-6">
                        <div className="flex flex-col items-center gap-1">
                          <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">Entry</div>
                          <div className="font-mono bg-surface-high text-primary-container text-xs w-20 p-2 rounded-xl text-center border border-outline-variant/30">
                            {task.time}
                          </div>
                        </div>

                        {isPro && task.endTime && (
                          <div className="flex flex-col items-center gap-1">
                            <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-tighter">Descent</div>
                            <div className="font-mono bg-surface-high text-secondary text-xs w-20 p-2 rounded-xl text-center border border-outline-variant/30">
                              {task.endTime}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div 
                              className={`text-base font-bold break-words whitespace-normal cursor-pointer transition-all flex-1 ${task.completed ? 'line-through text-on-surface-variant italic' : 'text-white hover:text-primary'}`}
                              onClick={() => handleToggle(task.id)}
                              onDoubleClick={() => startEditingTask(task)}
                            >
                              {task.title}
                            </div>
                            {task.completed && <ShieldCheck className="text-success shrink-0" size={18} />}
                          </div>
                          
                          {(task.plannedDate || (isPro && task.deadline)) && (
                            <div className="flex flex-wrap items-center gap-3 mt-1.5">
                              {task.plannedDate && (
                                <div className="flex items-center gap-1 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">
                                  <Calendar size={10} className="text-primary-container" />
                                  {task.plannedDate}
                                </div>
                              )}
                              {isPro && task.deadline && (
                                <div className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${isDeadlineCritical ? 'text-error animate-pulse' : 'text-on-surface-variant'}`}>
                                  <AlertTriangle size={10} className={isDeadlineCritical ? 'text-error' : 'text-on-surface-variant'} />
                                  Deadline: {new Date(task.deadline).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                                  {isDeadlineCritical && " - CRITICAL GRAVITY"}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="lg:opacity-0 lg:group-hover:opacity-100 transition-all ml-auto">
                          <ActionMenu 
                            actions={[
                              { label: 'Edit', icon: Edit2, onClick: () => startEditingTask(task) },
                              { label: 'Extract', icon: Trash2, onClick: () => handleDelete(task.id), variant: 'error' }
                            ]} 
                          />
                        </div>
                      </div>
                    )}


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
          </motion.div>
        )}
      </AnimatePresence>

      <SyncGauge percentage={completionPercentage} />

      <ReflectionModal 
        isOpen={isReflectionOpen} 
        onClose={() => setIsReflectionOpen(false)} 
        type={reflectionType}
        title={reflectionType === 'daily-summary' ? 'Neural Debrief' : 'Trajectory Analysis'}
      />

      <ConfirmModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Eject Task from Orbit?"
        message="This mission parameter will be permanently removed from your current rotation. Proceed with extraction?"
        confirmText="Confirm Extraction"
      />

      {/* Transmission Preview Modal */}
      <AnimatePresence>
        {showTransmissionPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-surface-lowest/90 backdrop-blur-2xl overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: -20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-2xl glass-panel border border-secondary p-8 rounded-[2.5rem] relative overflow-hidden my-8 text-left"
            >
              {/* Glowing grids and decorations */}
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-secondary/10 blur-3xl rounded-full animate-pulse" />
              <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-primary/10 blur-3xl rounded-full animate-pulse" />
              
              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-outline-variant/30 pb-4">
                  <div>
                    <span className="text-[10px] px-3.5 py-1 bg-secondary/15 border border-secondary/20 rounded-full text-secondary font-mono tracking-widest uppercase">
                      Transmission Preview
                    </span>
                    <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight mt-3">
                      Telemetry Session Brief
                    </h2>
                  </div>
                  <div className="text-right font-mono text-[9px] text-on-surface-variant space-y-1">
                    <div>SECURE LINK STABLE</div>
                    <div className="text-secondary font-bold">TX-2026-DAILY-INIT</div>
                  </div>
                </div>

                {/* Report Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* PDA Narrative */}
                  <div className="bg-surface-low border border-outline-variant/20 p-5 rounded-2xl space-y-2 col-span-1 md:col-span-2">
                    <div className="text-[9px] font-black uppercase text-secondary tracking-widest">PDA Narrative Summary</div>
                    <p className="text-xs text-on-surface leading-relaxed font-mono">
                      "Orbit initialized successfully. Technical workspace synchronized on Chrome desktop. Core trajectories active: AWS Certified Specialist & Data Analyst path. Logging daily parameters with 100% resonance efficiency. Standing by for next rotation cycle."
                    </p>
                  </div>

                  {/* Accomplished Parameters */}
                  <div className="bg-surface-low border border-outline-variant/20 p-5 rounded-2xl space-y-3">
                    <div className="text-[9px] font-black uppercase text-primary-container tracking-widest">Accomplished Parameters</div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-white">
                        <ShieldCheck size={14} className="text-success shrink-0" />
                        <span className="truncate">Complete daily standup</span>
                        <span className="text-[9px] font-mono text-secondary-container bg-secondary-container/10 px-1.5 py-0.5 rounded ml-auto">10 XP</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-white">
                        <ShieldCheck size={14} className="text-success shrink-0" />
                        <span className="truncate">Launch Space Clocker</span>
                        <span className="text-[9px] font-mono text-secondary-container bg-secondary-container/10 px-1.5 py-0.5 rounded ml-auto">20 XP</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Delta Calibration */}
                  <div className="bg-surface-low border border-outline-variant/20 p-5 rounded-2xl space-y-3">
                    <div className="text-[9px] font-black uppercase text-secondary tracking-widest">Skills Calibration Delta</div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white font-mono">AWS Cloud Tech</span>
                        <span className="text-success font-black font-mono">+1%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-white font-mono">Momentum Velocity</span>
                        <span className="text-success font-black font-mono">+2%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer notes */}
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center gap-3">
                  <Info size={16} className="text-primary shrink-0" />
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wide leading-relaxed">
                    This structured readout is formatted and ready. Sharing this transmission with your mentor ensures continuous feedback and rapid alignment.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("https://space-clocker.net/transmission/share/TX-DEMO-PREVIEW");
                      setCopiedLink(true);
                      SoundManager.playPop();
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 border border-secondary text-secondary px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-secondary/15 transition-all cursor-pointer bg-transparent outline-none"
                  >
                    {copiedLink ? <Check size={16} className="text-success" /> : <Share2 size={16} />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Mentor Share Link'}</span>
                  </button>
                  <button
                    onClick={() => {
                      localStorage.setItem('hasSeenTransmissionPreview', 'true');
                      setShowTransmissionPreview(false);
                      SoundManager.playSyncSuccess();
                    }}
                    className="flex-1 flex items-center justify-center gap-2 bg-secondary text-on-secondary px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-secondary/80 transition-all cursor-pointer shadow-lg hover:shadow-secondary/20 border-none outline-none"
                  >
                    <Send size={16} />
                    <span>Establish Uplink & Finish</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(OrbitScheduler);
