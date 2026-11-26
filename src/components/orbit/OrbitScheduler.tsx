import React, { useMemo, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { endOfWeek, parseISO, format } from 'date-fns';
import { useTrackStore, Task } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import { analyzeSchedule, ScheduleAnomaly } from '../../utils/StellarScheduler';
import { getTodayLocalISO, getLocalTimeHHmm } from '../../utils/DateTimeUtils';
import { Plus, Trash2, Edit2, Clock, AlertTriangle, ShieldCheck, Zap, BrainCircuit, Calendar, Timer, Signal, Share2, Send, Check, ExternalLink, Info, Archive, Search, ChevronLeft, ChevronRight, ArrowRightCircle } from 'lucide-react';
import ReflectionModal from '../reflection/ReflectionModal';
import OrbitSubNav, { OrbitHorizon } from './OrbitSubNav';
import VoidList from '../void-protocol/VoidList';
import ConfirmModal from '../layout/ConfirmModal';
import { ActionMenu } from '../layout/ActionMenu';
import { useVocabulary } from '../../utils/vocabulary';


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
      <div className="type-telemetry-lg text-on-surface">{Math.round(percentage)}%</div>
      <div className="type-overline text-on-surface-variant">Sync</div>
    </div>
    <div className="absolute -top-4 -right-4 bg-primary text-on-primary type-overline px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
      Orbital Lock
    </div>
  </div>
));

const OrbitScheduler = () => {
  const { tasks, toggleTask, toggleMilestoneTask, addTask, updateTask, updateTaskDate, deleteTask, updateMilestoneTask, deleteMilestoneTask, preferences, profile, ambitions, skills } = useTrackStore();
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

  const [backlogSearch, setBacklogSearch] = useState('');
  const [backlogPage, setBacklogPage] = useState(1);
  const BACKLOG_ITEMS_PER_PAGE = 5;

  const isPro = preferences.uiMode === 'professional';
  const { t, isPeopleMode } = useVocabulary();

  // Consolidate all tasks (standalone + milestone tasks)
  const allTasks = useMemo(() => {
    const milestoneTasks = ambitions.flatMap(a => a.milestones.flatMap(m => m.tasks.map(t => ({ ...t, ambitionId: a.id, milestoneId: m.id }))));
    return [...tasks, ...milestoneTasks];
  }, [tasks, ambitions]);

  // Compute backlog tasks
  const backlogTasks = useMemo(() => {
    let bTasks = allTasks.filter(t => !t.completed && t.plannedDate && t.plannedDate < getTodayLocalISO());
    if (backlogSearch.trim()) {
      const q = backlogSearch.toLowerCase();
      bTasks = bTasks.filter(t => t.title.toLowerCase().includes(q));
    }
    return bTasks.sort((a, b) => (a.plannedDate! > b.plannedDate! ? 1 : -1));
  }, [allTasks, backlogSearch]);

  const totalBacklogPages = Math.ceil(backlogTasks.length / BACKLOG_ITEMS_PER_PAGE);

  // Filter tasks based on selected date and active horizon
  const filteredTasks = useMemo(() => {
    if (activeHorizon === 'void') return [];
    
    if (activeHorizon === 'backlog') {
      const startIndex = (backlogPage - 1) * BACKLOG_ITEMS_PER_PAGE;
      return backlogTasks.slice(startIndex, startIndex + BACKLOG_ITEMS_PER_PAGE);
    }
    
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
        // 3. Weekly tasks should be shown if selected date falls in their active week window
        if (t.horizon === 'weekly' && t.plannedDate) {
          const weekEnd = format(endOfWeek(parseISO(t.plannedDate), { weekStartsOn: 0 }), 'yyyy-MM-dd');
          return selectedDate >= t.plannedDate && selectedDate <= weekEnd;
        }
        return false;
      }

      return false;
    });
  }, [allTasks, activeHorizon, selectedDate, backlogTasks, backlogPage]);

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

  // Helper to lookup milestone task with proper ambitionId and milestoneId
  const getMilestoneTask = useCallback((id: string) => {
    return ambitions
      .flatMap(a => a.milestones.flatMap(m => m.tasks.map(t => ({ ...t, ambitionId: a.id, milestoneId: m.id }))))
      .find(t => t.id === id);
  }, [ambitions]);

  const handleToggle = async (id: string) => {
    const milestoneTask = getMilestoneTask(id);
    
    if (milestoneTask) {
      await toggleMilestoneTask(milestoneTask.ambitionId, milestoneTask.milestoneId, id);
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

  const handleCarryForward = async (id: string) => {
    const today = getTodayLocalISO();
    const milestoneTask = getMilestoneTask(id);
    
    const task = allTasks.find(t => t.id === id);
    if (!task) return;
    const newCount = (task.recalibratedCount || 0) + 1;
    const newRecalibrationDates = [...(task.recalibrationDates || []), today];
    
    let newDeadline = task.deadline;
    if (task.deadline) {
      const dt = new Date(task.deadline);
      if (dt.getTime() < Date.now()) {
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        newDeadline = format(todayEnd, "yyyy-MM-dd'T'HH:mm");
      }
    }
    
    if (milestoneTask) {
      await updateMilestoneTask(milestoneTask.ambitionId, milestoneTask.milestoneId, id, { 
        plannedDate: today, 
        deadline: newDeadline,
        recalibratedCount: newCount,
        recalibrationDates: newRecalibrationDates 
      });
    } else {
      await updateTask(id, { 
        plannedDate: today, 
        deadline: newDeadline,
        recalibratedCount: newCount,
        recalibrationDates: newRecalibrationDates 
      });
    }
    SoundManager.playPop();
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

    const milestoneTask = getMilestoneTask(editingTaskId);

    if (milestoneTask) {
      await updateMilestoneTask(milestoneTask.ambitionId, milestoneTask.milestoneId, editingTaskId, updates);
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
    const milestoneTask = getMilestoneTask(id);
    if (milestoneTask) {
      deleteMilestoneTask(milestoneTask.ambitionId, milestoneTask.milestoneId, id);
    } else {
      deleteTask(id);
    }
  }, [deleteTask, deleteMilestoneTask, getMilestoneTask, preferences.confirmDelete]);

  const handleDeleteConfirm = async () => {
    if (deleteTaskId) {
      SoundManager.playThud();
      const milestoneTask = getMilestoneTask(deleteTaskId);
      if (milestoneTask) {
        await deleteMilestoneTask(milestoneTask.ambitionId, milestoneTask.milestoneId, deleteTaskId);
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
    <div className="p-6 lg:pl-80 space-y-8 min-h-screen bg-surface-lowest text-on-surface pb-32">
      <header className="mb-8 relative">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h2 className="text-secondary type-overline">{isPeopleMode ? 'Daily Tasks' : 'Orbit Protocol'} {isPro ? '(Professional)' : '(Standard)'}</h2>
            <h1 className="type-display text-primary uppercase">{isPeopleMode ? "Today's Tasks" : 'Mission Control'}</h1>
            <p className="type-body text-on-surface-variant max-w-lg mt-1">
              {isPeopleMode ? 'Organize and complete your tasks for today.' : 'Synchronize your planetary rotation with stellar objectives.'}
            </p>
          </div>
          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
            <div className="bg-surface-high border border-outline-variant px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-lg">
              <Zap className="text-primary-container" size={20} />
              <div className="text-right">
                <div className="type-overline text-on-surface-variant">Resonance</div>
                <div className="type-telemetry-base text-primary">{profile.xp} XP</div>
              </div>
            </div>
            {isPro && (
              <button 
                onClick={() => { setReflectionType('daily-summary'); setIsReflectionOpen(true); }}
                className="flex items-center gap-2 h-10 px-4 rounded-xl border border-secondary/30 text-secondary hover:bg-secondary/10 transition-colors type-overline glass-panel touch-target-compact"
              >
                <BrainCircuit size={14} />
                Neural Reflection
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <OrbitSubNav active={activeHorizon} onChange={(h) => { setActiveHorizon(h); setBacklogPage(1); }} />
        
        {activeHorizon !== 'void' && activeHorizon !== 'backlog' && (
          <div className="flex items-center gap-3 glass-panel h-10 px-4 rounded-2xl border border-outline-variant mb-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <Calendar size={16} className="text-primary" />
            <input 
              type="date"
              className="bg-transparent text-sm type-telemetry-base focus:outline-none uppercase"
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
            {activeHorizon === 'backlog' ? (
              <section className="glass-panel card-standard border border-outline-variant space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <h3 className="type-overline text-on-surface-variant flex items-center gap-2">
                    <Archive size={14} className="text-tertiary" />
                    Stasis Backlog
                  </h3>
                  <div className="flex items-center gap-2 bg-surface-high border border-outline-variant h-10 px-4 rounded-xl w-full sm:w-auto">
                    <Search size={14} className="text-on-surface-variant" />
                    <input 
                      placeholder="Search backlog..."
                      className="bg-transparent type-body text-xs focus:outline-none w-full"
                      value={backlogSearch}
                      onChange={(e) => { setBacklogSearch(e.target.value); setBacklogPage(1); }}
                    />
                  </div>
                </div>
              </section>
            ) : (
              <section className="glass-panel card-standard border border-outline-variant space-y-4">
                <h3 className="type-overline text-on-surface-variant flex items-center gap-2">
                  <Plus size={14} className="text-primary" />
                  Initialize New {activeHorizon === 'weekly' ? 'Weekly Milestone' : 'Daily Parameter'}
                </h3>
                <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
                  <input 
                    className="w-full md:flex-1 min-w-0 h-10 sm:h-12 bg-surface-high px-4 rounded-xl sm:rounded-2xl border border-outline-variant focus:border-primary focus:outline-none type-body text-on-surface transition-all"
                    placeholder={activeHorizon === 'weekly' ? "Define a weekly resonance milestone..." : "Define the next mission parameter..."}
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                  />
                  <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="h-10 bg-surface-high border border-outline-variant px-3 rounded-xl flex items-center gap-2" title="Mission Entry Time">
                        <Clock size={13} className="text-on-surface-variant shrink-0" />
                        <input 
                          type="time"
                          aria-label="Mission Entry Time"
                          className="bg-transparent type-telemetry-base text-xs focus:outline-none text-on-surface cursor-pointer"
                          value={newTime}
                          onChange={(e) => setNewTime(e.target.value)}
                        />
                      </div>
                      
                      <div className="h-10 bg-surface-high border border-outline-variant px-3 rounded-xl flex items-center gap-2" title="Mission Descent Time">
                        <Timer size={13} className="text-on-surface-variant shrink-0" />
                        <input 
                          type="time"
                          aria-label="Mission Descent Time"
                          className="bg-transparent type-telemetry-base text-xs focus:outline-none text-on-surface cursor-pointer"
                          value={newEndTime}
                          onChange={(e) => setNewEndTime(e.target.value)}
                        />
                      </div>
                      <div className="h-10 bg-surface-high border border-outline-variant px-3 rounded-xl flex items-center gap-2" title="Mission Deadline">
                        <AlertTriangle size={13} className="text-error shrink-0" />
                        <input 
                          type="datetime-local"
                          aria-label="Mission Deadline"
                          className="bg-transparent type-telemetry-base text-xs focus:outline-none text-on-surface cursor-pointer w-28 sm:w-32"
                          value={newDeadline}
                          onChange={(e) => setNewDeadline(e.target.value)}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      aria-label="Add task" 
                      className="h-10 sm:h-12 px-6 bg-primary-container text-on-primary-container rounded-xl sm:rounded-2xl type-overline hover:shadow-[0_0_20px_rgba(0,242,255,0.4)] transition-all flex items-center justify-center gap-2 shrink-0 ml-auto sm:ml-0 touch-target-compact"
                    >
                      <Plus size={16} />
                      <span>{isPeopleMode ? 'Add Task' : 'Uplink'}</span>
                    </button>
                  </div>
                </form>
              </section>
            )}

            <section className="space-y-4 max-w-4xl">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black text-on-surface-variant uppercase tracking-[0.2em] flex items-center gap-2">
                  {activeHorizon === 'backlog' ? (
                    <><Archive size={14} className="text-tertiary" /> Total Backlogged: {backlogTasks.length}</>
                  ) : (
                    <><Clock size={14} className="text-secondary" /> Mission Rotation: {new Date(selectedDate).toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</>
                  )}
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
                <div className="py-24 text-center glass-panel rounded-3xl relative overflow-hidden group border-0 bg-surface-highest/20 shadow-inner">
                  {/* Floating dust particles effect via CSS gradients */}
                  <div className="absolute inset-0 opacity-30 group-hover:opacity-60 transition-opacity duration-1000"
                       style={{ background: 'radial-gradient(circle 2px at 10% 20%, rgba(255,255,255,0.4) 1px, transparent 1px), radial-gradient(circle 2px at 80% 40%, rgba(255,255,255,0.4) 1px, transparent 1px), radial-gradient(circle 2px at 30% 70%, rgba(255,255,255,0.4) 1px, transparent 1px), radial-gradient(circle 2px at 60% 90%, rgba(255,255,255,0.4) 1px, transparent 1px)', backgroundSize: '200px 200px', animation: 'float 20s infinite linear' }} />
                  <style>{`
                    @keyframes float {
                      0% { transform: translateY(0); }
                      100% { transform: translateY(-200px); }
                    }
                  `}</style>
                  
                  {/* Core pulsing star */}
                  <motion.div 
                    animate={{ scale: [0.95, 1.05, 0.95], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="w-16 h-16 rounded-full mx-auto mb-6 bg-gradient-to-br from-indigo-500/30 to-purple-500/10 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
                  />
                  
                  <div className="text-on-surface-variant font-display font-black text-2xl uppercase opacity-60 relative z-10">The sector is quiet.</div>
                  <p className="text-on-surface-variant text-xs uppercase tracking-[0.2em] mt-3 relative z-10 opacity-80">Chart your first trajectory.</p>
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
                    <h4 className="text-sm font-black text-on-surface uppercase tracking-widest">📡 Mission Telemetry Ready</h4>
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
                const deadlineTime = task.deadline ? new Date(task.deadline).getTime() : NaN;
                const isDeadlineCritical = task.deadline && !task.completed && !isNaN(deadlineTime) && (deadlineTime - Date.now() < 86400000);
                
                const plannedDateTime = task.plannedDate ? new Date(task.plannedDate).getTime() : NaN;
                const todayTime = new Date(getTodayLocalISO()).getTime();
                const isMissedHabit = !task.completed && task.plannedDate && !isNaN(plannedDateTime) && (plannedDateTime < todayTime);
                const isMissedDeadline = !task.completed && task.deadline && !isNaN(deadlineTime) && (deadlineTime < Date.now());
                const isOrbitalDecay = isMissedHabit || isMissedDeadline;

                return (
                  <motion.div 
                    key={task.id}
                    layout="position"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`glass-panel card-standard border flex flex-col gap-4 transition-all duration-300 group relative hover:z-30 focus-within:z-30 ${task.completed ? 'opacity-50 grayscale-[0.8]' : 'hover:border-primary/50'} ${task.isVoid ? 'border-error/30 bg-error/5' : 'border-outline-variant'} ${hasError ? 'border-error/50 ring-1 ring-error/20 shadow-[0_0_15px_rgba(var(--color-error-rgb),0.1)]' : ''} ${isDeadlineCritical && !isOrbitalDecay ? 'border-error shadow-[0_0_15px_rgba(var(--color-error-rgb),0.2)]' : ''} ${isOrbitalDecay ? 'grayscale-[0.6] opacity-80 border-outline-variant/30 bg-surface-highest/10 translate-x-2 -rotate-1' : 'translate-x-0 rotate-0'}`}
                  >
                    {editingTaskId === task.id ? (
                      <form 
                        onSubmit={handleSaveTaskEdit} 
                        className="w-full flex flex-col gap-4 p-4 bg-surface-high/20 rounded-2xl" 
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="flex flex-col gap-1.5">
                          <label className="type-overline text-on-surface-variant">Parameter Title</label>
                          <input 
                            autoFocus
                            className="w-full h-10 bg-surface-low px-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none type-body text-xs text-white"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Escape' && setEditingTaskId(null)}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="type-overline text-on-surface-variant">Entry</label>
                            <div className="h-10 flex items-center gap-2 bg-surface-low px-3 rounded-xl border border-outline-variant">
                              <Clock size={12} className="text-primary" />
                              <input 
                                type="time" 
                                className="bg-transparent text-xs type-telemetry-base text-on-surface focus:outline-none w-full" 
                                value={editTime} 
                                onChange={e => setEditTime(e.target.value)} 
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="type-overline text-on-surface-variant">Descent</label>
                            <div className="h-10 flex items-center gap-2 bg-surface-low px-3 rounded-xl border border-outline-variant">
                              <Timer size={12} className="text-secondary" />
                              <input 
                                type="time" 
                                className="bg-transparent text-xs type-telemetry-base text-on-surface focus:outline-none w-full" 
                                value={editEndTime} 
                                onChange={e => setEditEndTime(e.target.value)} 
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-2">
                            <label className="type-overline text-on-surface-variant">Mission Date</label>
                            <div className="h-10 flex items-center gap-2 bg-surface-low px-3 rounded-xl border border-outline-variant">
                              <Calendar size={12} className="text-primary-container" />
                              <input 
                                type="date" 
                                className="bg-transparent text-xs type-telemetry-base text-on-surface focus:outline-none w-full uppercase" 
                                value={editDate} 
                                onChange={e => setEditDate(e.target.value)} 
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label className="type-overline text-error">Deadline Lock</label>
                            <div className="h-10 flex items-center gap-2 bg-surface-low px-3 rounded-xl border border-error/30">
                              <AlertTriangle size={12} className="text-error" />
                              <input 
                                type="datetime-local" 
                                className="bg-transparent text-xs type-telemetry-base text-on-surface focus:outline-none w-full" 
                                value={editDeadline} 
                                onChange={e => setEditDeadline(e.target.value)} 
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-1">
                          <button 
                            type="button" 
                            onClick={() => setEditingTaskId(null)} 
                            className="h-9 px-4 rounded-xl type-overline text-on-surface-variant hover:text-white touch-target-compact"
                          >
                            Cancel
                          </button>
                          <button 
                            type="submit" 
                            className="h-9 px-4 bg-primary text-on-primary rounded-xl type-overline flex items-center gap-2 touch-target-compact"
                          >
                            <Check size={12} />
                            Save
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                        <div className="flex flex-col items-center gap-1">
                          <div className="type-overline text-on-surface-variant">Entry</div>
                          <div className="type-telemetry-base text-xs text-primary-container bg-surface-high w-20 h-9 flex items-center justify-center rounded-xl border border-outline-variant/30">
                            {task.time}
                          </div>
                        </div>

                        {isPro && task.endTime && (
                          <div className="flex flex-col items-center gap-1">
                            <div className="type-overline text-on-surface-variant">Descent</div>
                            <div className="type-telemetry-base text-xs text-secondary bg-surface-high w-20 h-9 flex items-center justify-center rounded-xl border border-outline-variant/30">
                              {task.endTime}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <div 
                              className={`type-headline text-base break-words whitespace-normal cursor-pointer transition-all flex-1 ${task.completed ? 'line-through text-on-surface-variant italic' : 'text-white hover:text-primary'}`}
                              onClick={() => handleToggle(task.id)}
                              onDoubleClick={() => startEditingTask(task)}
                            >
                              {task.title}
                            </div>
                            {task.completed && <ShieldCheck className="text-success shrink-0" size={18} />}
                          </div>
                          
                          {(task.recalibratedCount || (activeHorizon === 'backlog' && task.horizon === 'weekly')) && (
                            <div className="flex flex-wrap items-center gap-2 mt-1.5 mb-1.5">
                              {activeHorizon === 'backlog' && task.horizon === 'weekly' && (
                                <span className="type-overline bg-secondary/20 text-secondary border border-secondary/30 px-2 py-0.5 rounded-md">
                                  WEEKLY
                                </span>
                              )}
                              {task.recalibratedCount ? (
                                <span className="type-overline inline-flex items-center gap-1 bg-amber-500/20 text-amber-500 border border-amber-500/30 px-2 py-0.5 rounded-md">
                                  <Zap size={8} /> x{task.recalibratedCount}
                                </span>
                              ) : null}
                            </div>
                          )}
                          
                          {(task.plannedDate || (isPro && task.deadline)) && (
                            <div className="flex flex-wrap items-center gap-3 mt-1.5">
                              {task.plannedDate && (
                                <div className="type-telemetry-micro flex items-center gap-1 text-on-surface-variant">
                                  <Calendar size={10} className="text-primary-container" />
                                  {task.plannedDate}
                                </div>
                              )}
                              {isPro && task.deadline && (
                                <div className={`type-telemetry-micro flex items-center gap-1 ${isDeadlineCritical ? 'text-error animate-pulse' : 'text-on-surface-variant'}`}>
                                  <AlertTriangle size={10} className={isDeadlineCritical ? 'text-error' : 'text-on-surface-variant'} />
                                  Deadline: {new Date(task.deadline).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                                  {isDeadlineCritical && " - CRITICAL GRAVITY"}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="lg:opacity-0 lg:group-hover:opacity-100 transition-all ml-auto flex items-center gap-2">
                          {isOrbitalDecay && (
                            <button
                              onClick={() => {
                                SoundManager.playSyncSuccess();
                                handleCarryForward(task.id);
                              }}
                              className="h-9 px-3.5 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/30 flex items-center gap-2 hover:bg-amber-500 hover:text-black transition-all type-overline shadow-[0_0_15px_rgba(245,158,11,0.2)] touch-target-compact"
                            >
                              <Zap size={12} />
                              Recalibrate
                            </button>
                          )}
                          {!isOrbitalDecay && activeHorizon === 'backlog' && (
                            <button
                              title="Carry Forward to Today"
                              onClick={() => handleCarryForward(task.id)}
                              className="touch-target-compact w-9 h-9 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center hover:bg-tertiary hover:text-on-tertiary transition-colors"
                            >
                              <ArrowRightCircle size={16} />
                            </button>
                          )}
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
              
              {activeHorizon === 'backlog' && totalBacklogPages > 1 && (
                <div className="flex items-center justify-between glass-panel border border-outline-variant p-4 rounded-3xl mt-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant pl-2">
                    Page {backlogPage} of {totalBacklogPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={backlogPage === 1}
                      onClick={() => setBacklogPage(p => Math.max(1, p - 1))}
                      className="p-3 bg-surface-high rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-highest transition-colors"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      disabled={backlogPage === totalBacklogPages}
                      onClick={() => setBacklogPage(p => Math.min(totalBacklogPages, p + 1))}
                      className="p-3 bg-surface-high rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-surface-highest transition-colors"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
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
            onClick={() => setShowTransmissionPreview(false)}
            className="modal-backdrop z-[250] bg-surface-lowest/90 backdrop-blur-2xl"
          >
            <div className="modal-center-frame">
              <motion.div
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: -20, opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                onClick={(e) => e.stopPropagation()}
                className="modal-dialog max-w-2xl glass-panel border border-secondary relative text-left"
              >
                {/* Glowing grids and decorations */}
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-secondary/10 blur-3xl rounded-full animate-pulse pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-primary/10 blur-3xl rounded-full animate-pulse pointer-events-none" />
                
                {/* Pinned Header */}
                <div className="relative z-10 p-4 sm:p-6 flex flex-wrap justify-between items-start gap-4 border-b border-outline-variant/30 shrink-0">
                  <div>
                    <span className="type-overline px-3 py-1 bg-secondary/15 border border-secondary/20 rounded-full text-secondary inline-block">
                      Transmission Preview (Alpha)
                    </span>
                    <h2 className="type-title-2 text-on-surface uppercase mt-2">
                      Telemetry Session Brief
                    </h2>
                  </div>
                  <div className="text-left sm:text-right type-telemetry-micro text-on-surface-variant space-y-1">
                    <div>SECURE LINK STABLE</div>
                    <div className="text-secondary font-bold">TX-2026-DAILY-INIT</div>
                  </div>
                </div>

                {/* Scrollable Body */}
                <div className="modal-body-scroll relative z-10 p-4 sm:p-6 space-y-6">
                  {/* Report Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* PDA Narrative */}
                    <div className="bg-surface-low border border-outline-variant/20 p-4 sm:p-6 rounded-2xl space-y-2 col-span-1 md:col-span-2">
                      <div className="type-overline text-secondary">PDA Narrative Summary</div>
                      <p className="type-body-sm text-on-surface leading-relaxed font-mono">
                        {`"Orbit initialized successfully. Technical workspace synchronized on Chrome desktop. Core trajectories active: ${ambitions.filter(a => a.progress < 100).slice(0, 2).map(a => a.title).join(' & ') || 'General Path'}. Logging daily parameters with ${allTasks.filter(t => t.completed && t.plannedDate === getTodayLocalISO()).length > 0 ? 'optimal' : 'baseline'} resonance efficiency. Standing by for next rotation cycle."`}
                      </p>
                    </div>

                    {/* Accomplished Parameters */}
                    <div className="bg-surface-low border border-outline-variant/20 p-4 sm:p-6 rounded-2xl space-y-3">
                      <div className="type-overline text-primary-container">Accomplished Parameters</div>
                      <div className="space-y-2">
                        {(() => {
                          const completedToday = allTasks.filter(t => t.completed && t.plannedDate === getTodayLocalISO());
                          if (completedToday.length === 0) {
                            return <div className="type-body-sm text-on-surface-variant font-mono">No parameters executed today.</div>;
                          }
                          return completedToday.map(task => (
                            <div key={task.id} className="flex items-center gap-2 type-body-sm text-on-surface">
                              <ShieldCheck size={14} className="text-success shrink-0" />
                              <span className="truncate">{task.title}</span>
                              <span className="type-telemetry-micro text-secondary-container bg-secondary-container/10 px-2 py-0.5 rounded ml-auto shrink-0">{(task as any).weightage || 10} XP</span>
                            </div>
                          ));
                        })()}
                      </div>
                    </div>

                    {/* Skills Calibration Delta */}
                    <div className="bg-surface-low border border-outline-variant/20 p-4 sm:p-6 rounded-2xl space-y-3">
                      <div className="type-overline text-secondary">Skills Calibration Delta</div>
                      <div className="space-y-2">
                        {(() => {
                          if (skills && skills.length > 0) {
                            return skills.slice(0, 2).map(skill => (
                              <div key={skill.id} className="flex justify-between items-center type-body-sm">
                                <span className="text-on-surface font-mono truncate max-w-[150px]">{skill.name}</span>
                                <span className="text-success font-black font-mono">+{Math.max(1, Math.round(skill.currentProficiency / 10))}%</span>
                              </div>
                            ));
                          }
                          if (ambitions && ambitions.length > 0) {
                            return ambitions.slice(0, 2).map(ambition => (
                              <div key={ambition.id} className="flex justify-between items-center type-body-sm">
                                <span className="text-on-surface font-mono truncate max-w-[150px]">{ambition.title}</span>
                                <span className="text-success font-black font-mono">+{Math.max(1, Math.round(ambition.progress / 10))}%</span>
                              </div>
                            ));
                          }
                          return <div className="type-body-sm text-on-surface-variant font-mono">No calibration data available.</div>;
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Footer notes */}
                  <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl flex items-center gap-3">
                    <Info size={16} className="text-primary shrink-0" />
                    <p className="type-overline text-on-surface-variant normal-case leading-relaxed">
                      This structured readout is formatted and ready. Sharing this transmission with your mentor ensures continuous feedback and rapid alignment.
                    </p>
                  </div>
                </div>

                {/* Pinned Actions Footer */}
                <div className="relative z-10 p-4 sm:p-6 border-t border-outline-variant/20 bg-surface-lowest/50 flex flex-col sm:flex-row gap-3 shrink-0">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("https://space-clocker.net/transmission/share/TX-DEMO-PREVIEW");
                      setCopiedLink(true);
                      SoundManager.playPop();
                      setTimeout(() => setCopiedLink(false), 2000);
                    }}
                    className="flex-1 h-12 flex items-center justify-center gap-2 border border-secondary text-secondary px-6 rounded-2xl type-overline hover:bg-secondary/15 transition-all cursor-pointer bg-transparent outline-none touch-target"
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
                    className="flex-1 h-12 flex items-center justify-center gap-2 bg-secondary text-on-secondary px-6 rounded-2xl type-overline hover:bg-secondary/80 transition-all cursor-pointer shadow-lg hover:shadow-secondary/20 border-none outline-none touch-target"
                  >
                    <Send size={16} />
                    <span>Establish Uplink & Finish</span>
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default React.memo(OrbitScheduler);
