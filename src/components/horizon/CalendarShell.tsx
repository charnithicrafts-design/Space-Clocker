import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackStore, Task } from '../../store/useTrackStore';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  isBefore,
  isAfter,
  parseISO,
  startOfDay
} from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  Target, 
  Briefcase, 
  Zap, 
  AlertCircle, 
  CheckCircle2, 
  CircleDashed,
  Play,
  Trophy,
  Award
} from 'lucide-react';
import InternshipScheduler from './InternshipScheduler';

type Horizon = 'daily' | 'weekly' | 'yearly';

/**
 * Helper to parse YYYY-MM-DD into a local Date object without UTC shifts
 */
const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const CalendarShell = () => {
  const { tasks, ambitions, internships, history } = useTrackStore();
  const [horizon, setHorizon] = useState<Horizon>('daily');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Consolidate all tasks (standalone + milestone tasks)
  const allTasks = useMemo(() => {
    const milestoneTasks = ambitions.flatMap(a => a.milestones.flatMap(m => m.tasks));
    return [...tasks, ...milestoneTasks];
  }, [tasks, ambitions]);

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(currentDate));
    const end = endOfWeek(endOfMonth(currentDate));
    return eachDayOfInterval({ start, end });
  }, [currentDate]);

  const selectedDayTasks = useMemo(() => {
    return allTasks.filter(t => t.plannedDate && isSameDay(parseLocalDate(t.plannedDate), selectedDate));
  }, [allTasks, selectedDate]);

  const selectedDayHistory = useMemo(() => {
    return history.filter(h => isSameDay(parseISO(h.date), selectedDate));
  }, [history, selectedDate]);

  const weeklyData = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = endOfMonth(currentDate);
    const monthWeeks = [];
    let currentWeekStart = startOfWeek(start);
    
    // Cover all weeks that touch this month (usually 4-6)
    while (currentWeekStart <= end) {
      const weekEnd = endOfWeek(currentWeekStart);
      monthWeeks.push({
        start: currentWeekStart,
        end: weekEnd,
        tasks: allTasks.filter(t => {
          if (!t.plannedDate) return false;
          const taskDate = parseLocalDate(t.plannedDate);
          return taskDate >= currentWeekStart && taskDate <= weekEnd;
        }),
        history: history.filter(h => {
          const eventDate = parseISO(h.date);
          return eventDate >= currentWeekStart && eventDate <= weekEnd;
        })
      });
      currentWeekStart = addDays(currentWeekStart, 7);
    }
    return monthWeeks;
  }, [allTasks, history, currentDate]);

  const trajectoryYears = useMemo(() => {
    const currentYear = currentDate.getFullYear();
    return [currentYear - 1, currentYear, currentYear + 1];
  }, [currentDate]);

  const getTaskStatus = (task: Task) => {
    const now = new Date();
    const today = startOfDay(now);
    const taskDate = task.plannedDate ? parseLocalDate(task.plannedDate) : today;
    
    if (task.completed) {
      if (task.deadline && task.completedAt) {
        const completion = new Date(task.completedAt);
        const deadlineDate = parseISO(task.deadline);
        return isAfter(completion, deadlineDate) ? 'completed-late' : 'completed-on-time';
      }
      return 'completed-on-time';
    }

    if (isBefore(taskDate, today)) {
      return 'backlog';
    }

    if (isSameDay(taskDate, today)) {
      const currentTimeStr = format(now, 'HH:mm');
      if (task.time && task.endTime) {
        if (currentTimeStr >= task.time && currentTimeStr <= task.endTime) return 'live';
      }
      if (task.time && task.time > currentTimeStr) return 'next';
    }

    return 'pending';
  };

  const renderStatusIndicator = (status: string) => {
    switch (status) {
      case 'completed-on-time':
        return <div className="flex items-center gap-1 text-[9px] font-black uppercase text-success tracking-tighter"><CheckCircle2 size={10} /> On Time</div>;
      case 'completed-late':
        return <div className="flex items-center gap-1 text-[9px] font-black uppercase text-warning tracking-tighter"><AlertCircle size={10} /> Delayed</div>;
      case 'live':
        return (
          <div className="flex items-center gap-1 text-[9px] font-black uppercase text-primary tracking-tighter animate-pulse">
            <Play size={10} fill="currentColor" /> Live Mission
          </div>
        );
      case 'next':
        return <div className="flex items-center gap-1 text-[9px] font-black uppercase text-primary/60 tracking-tighter"><CircleDashed size={10} /> Next Objective</div>;
      case 'backlog':
        return <div className="flex items-center gap-1 text-[9px] font-black uppercase text-error tracking-tighter"><AlertCircle size={10} /> Backlog</div>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:pl-80 space-y-8 min-h-screen bg-surface-lowest text-white pb-32">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-secondary text-sm font-bold tracking-widest uppercase">Stellar Chronometer</h2>
          <h1 className="text-4xl font-display font-black text-primary uppercase">Temporal Timeline</h1>
        </div>
        
        <div className="flex bg-surface-high/50 p-1 rounded-2xl border border-outline-variant glass-panel">
          {(['daily', 'weekly', 'yearly'] as Horizon[]).map((h) => (
            <button 
              key={h}
              onClick={() => setHorizon(h)}
              className={`px-6 py-2 rounded-xl capitalize text-xs font-black tracking-widest transition-all relative ${horizon === h ? 'text-white' : 'text-on-surface-variant hover:text-primary'}`}
            >
              {horizon === h && (
                <motion.div layoutId="active-horizon" className="absolute inset-0 bg-surface-low rounded-xl border border-outline-variant shadow-lg" />
              )}
              <span className="relative z-10">{h}</span>
            </button>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {horizon === 'daily' && (
          <motion.div 
            key="daily-view"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Calendar Grid */}
            <div className="lg:col-span-8 space-y-6">
              <div className="glass-panel border border-outline-variant rounded-3xl p-6">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-display font-black uppercase tracking-tight">
                    {format(currentDate, 'MMMM yyyy')}
                  </h3>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-surface-high rounded-xl transition-colors">
                      <ChevronLeft size={20} />
                    </button>
                    <button onClick={nextMonth} className="p-2 hover:bg-surface-high rounded-xl transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-[10px] font-black text-on-surface-variant uppercase tracking-widest pb-4">
                      {d}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {days.map((day, idx) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const dayTasks = allTasks.filter(t => t.plannedDate && isSameDay(parseLocalDate(t.plannedDate), day));
                    const dayHistory = history.filter(h => isSameDay(parseISO(h.date), day));
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedDate(day)}
                        className={`aspect-square rounded-2xl border transition-all flex flex-col items-center justify-center gap-1 group relative ${
                          isSelected 
                            ? 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.2)]' 
                            : 'border-outline-variant hover:border-primary/50'
                        } ${!isCurrentMonth ? 'opacity-20' : ''}`}
                      >
                        <span className={`text-sm font-bold ${isSelected ? 'text-primary' : 'text-white'}`}>
                          {format(day, 'd')}
                        </span>
                        <div className="flex gap-0.5 mt-1">
                          {dayTasks.slice(0, 2).map((t, i) => (
                            <div key={`t-${i}`} className={`w-1 h-1 rounded-full ${t.completed ? 'bg-success' : 'bg-primary'}`} />
                          ))}
                          {dayHistory.slice(0, 2).map((h, i) => (
                            <div key={`h-${i}`} className={`w-1 h-1 rounded-full ${h.type === 'success' ? 'bg-success' : 'bg-error'}`} />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Selected Day Details */}
            <div className="lg:col-span-4 space-y-6">
              <div className="glass-panel border border-outline-variant rounded-3xl p-6 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <CalendarIcon className="text-primary" size={20} />
                  <div>
                    <h3 className="font-display font-black uppercase text-sm tracking-tight">Mission Parameters</h3>
                    <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-widest">{format(selectedDate, 'EEEE, MMM do')}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {selectedDayHistory.length > 0 && (
                    <div className="space-y-3 mb-6">
                      <div className="text-[9px] font-black uppercase text-secondary tracking-widest px-1">Historical Archive</div>
                      {selectedDayHistory.map(event => (
                        <div key={event.id} className="p-3 rounded-2xl bg-secondary/5 border border-secondary/20 flex gap-3 items-start">
                          <Trophy size={14} className="text-secondary mt-0.5 shrink-0" />
                          <div className="min-w-0">
                            <div className="text-[10px] font-black text-white uppercase truncate">{event.title}</div>
                            <div className={`text-[8px] font-black uppercase tracking-tighter mt-0.5 ${event.type === 'success' ? 'text-success' : 'text-error'}`}>
                              {event.type === 'success' ? 'Achievement Unlocked' : 'Mission Record'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedDayTasks.length === 0 && selectedDayHistory.length === 0 ? (
                    <div className="py-12 text-center border border-dashed border-outline-variant rounded-2xl opacity-40">
                      <Clock size={32} className="mx-auto mb-2 text-on-surface-variant" />
                      <p className="text-[10px] font-black uppercase tracking-widest">No Orbital Activity</p>
                    </div>
                  ) : (
                    selectedDayTasks.sort((a,b) => (a.time || '').localeCompare(b.time || '')).map(task => {
                      const status = getTaskStatus(task);
                      return (
                        <div key={task.id} className="p-4 rounded-2xl bg-surface-high border border-outline-variant flex gap-4 items-start group hover:border-primary/30 transition-colors">
                          <div className="text-[10px] font-mono text-primary font-bold pt-0.5">{task.time || '00:00'}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <div className={`text-xs font-bold truncate ${task.completed ? 'line-through text-on-surface-variant' : 'text-white'}`}>
                                {task.title}
                              </div>
                              {renderStatusIndicator(status)}
                            </div>
                            {task.deadline && (
                              <div className="text-[9px] text-error font-black uppercase tracking-tighter mt-1 flex items-center gap-1">
                                <Zap size={10} />
                                Deadline Lock: {format(parseISO(task.deadline), 'MMM d, HH:mm')}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {horizon === 'weekly' && (
          <motion.div 
            key="weekly-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
              {weeklyData.map((week, idx) => (
                <div key={idx} className="glass-panel border border-outline-variant rounded-3xl p-6 space-y-4 min-h-[400px]">
                  <div className="text-center pb-4 border-b border-outline-variant/30">
                    <div className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">Week {idx + 1}</div>
                    <div className="text-xs font-bold text-primary">
                      {format(week.start, 'MMM d')} — {format(week.end, 'MMM d')}
                    </div>
                  </div>
                  
                  <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                    {/* Render History in Weekly */}
                    {week.history.map(event => (
                      <div key={event.id} className="p-3 rounded-xl text-[9px] font-black uppercase bg-secondary/10 border border-secondary/30 text-secondary flex items-center gap-2">
                        <Trophy size={12} />
                        <span className="truncate">{event.title}</span>
                      </div>
                    ))}

                    {week.tasks.map(task => {
                      const status = getTaskStatus(task);
                      return (
                        <div key={task.id} className={`p-3 rounded-xl text-[10px] font-bold border flex flex-col gap-2 ${task.completed ? 'bg-success/10 border-success/20 text-success/70' : 'bg-surface-high border-outline-variant text-white'}`}>
                          <div className="truncate">{task.title}</div>
                          <div className="flex justify-between items-center opacity-80">
                            <span>{task.time || '00:00'}</span>
                            {renderStatusIndicator(status)}
                          </div>
                        </div>
                      );
                    })}
                    {week.tasks.length === 0 && week.history.length === 0 && (
                      <div className="text-[10px] text-center py-12 text-on-surface-variant uppercase tracking-widest font-bold italic opacity-30">
                        No Objectives
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {horizon === 'yearly' && (
          <motion.div 
            key="yearly-view"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 gap-8">
              {trajectoryYears.map(year => (
                <div key={year} className="glass-panel border border-outline-variant rounded-3xl p-8 relative overflow-hidden">
                  {year === 2027 && (
                    <div className="absolute top-0 right-0 p-4">
                      <div className="bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                        Target Year: NASA Space Scientist
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mb-12">
                    <h3 className="text-3xl font-display font-black uppercase tracking-tighter text-white">Stellar Cycle {year}</h3>
                  </div>

                  <div className="space-y-12">
                    {/* Historical Events for this year */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-4">
                        <Award size={16} className="text-secondary" />
                        <span className="text-xs font-black uppercase tracking-widest text-secondary">Chronicle Achievements</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {history.filter(h => new Date(h.date).getFullYear() === year).map(event => (
                          <div key={event.id} className="glass-panel p-3 px-5 rounded-2xl border border-secondary/30 bg-secondary/5 flex items-center gap-3 group hover:border-secondary transition-all">
                            <div className={`w-2 h-2 rounded-full ${event.type === 'success' ? 'bg-success shadow-[0_0_10px_rgba(var(--color-success-rgb),0.5)]' : 'bg-error shadow-[0_0_10px_rgba(var(--color-error-rgb),0.5)]'}`} />
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-white uppercase tracking-tight">{event.title}</span>
                              <span className="text-[8px] font-bold text-on-surface-variant uppercase">{format(parseISO(event.date), 'MMMM do')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Ambitions Roadmap for this year */}
                    <div className="space-y-8">
                      {ambitions.map(ambition => {
                        const yearMilestones = ambition.milestones; // Simplified: in real app, filter by year
                        return (
                          <div key={ambition.id} className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-3">
                                <Target size={16} className="text-primary" />
                                <span className="text-xs font-black uppercase tracking-widest">{ambition.title}</span>
                              </div>
                              <span className="text-[10px] font-mono text-on-surface-variant">{ambition.progress}% Cycle Completion</span>
                            </div>
                            <div className="relative h-1 bg-surface-high rounded-full">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${ambition.progress}%` }}
                                className="absolute inset-y-0 left-0 bg-primary shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.5)]"
                              />
                              <div className="absolute inset-0 flex justify-between px-4 -top-2">
                                {yearMilestones.map(m => (
                                  <div key={m.id} className="relative group">
                                    <div className={`w-4 h-4 rounded-full border-4 border-surface-lowest shadow-lg transition-transform group-hover:scale-150 ${m.status === 'completed' ? 'bg-success' : 'bg-surface-high'}`} />
                                    <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] font-bold uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity bg-surface-low p-2 rounded-lg border border-outline-variant z-10">
                                      {m.title}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Internships for this year */}
                    <div className="pt-8 border-t border-outline-variant/20">
                      <div className="flex items-center gap-3 mb-6">
                        <Briefcase size={16} className="text-secondary" />
                        <span className="text-xs font-black uppercase tracking-widest">Orbital Deployments</span>
                      </div>
                      <div className="grid grid-cols-12 gap-1 h-10">
                        {eachMonthOfInterval({ start: startOfYear(new Date(year, 0)), end: endOfYear(new Date(year, 0)) }).map((month, i) => {
                          const activeInternships = internships.filter(int => {
                            const start = new Date(int.start);
                            const end = new Date(int.end);
                            return month >= startOfMonth(start) && month <= endOfMonth(end);
                          });

                          return (
                            <div key={i} className="relative group">
                              <div className={`h-full rounded-md border border-transparent transition-colors ${activeInternships.length > 0 ? 'bg-secondary/20 border-secondary/30 shadow-[0_0_10px_rgba(var(--color-secondary-rgb),0.2)]' : 'bg-surface-high/10'}`} />
                              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[7px] font-black text-on-surface-variant uppercase opacity-50">
                                {format(month, 'MMM')}
                              </div>
                              {activeInternships.length > 0 && (
                                 <div className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold uppercase bg-surface-lowest p-2 rounded-lg border border-secondary/30 opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-2xl">
                                   {activeInternships.map(int => int.organization).join(', ')}
                                 </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <InternshipScheduler />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalendarShell;
