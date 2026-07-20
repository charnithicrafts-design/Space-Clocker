import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { Award, Zap, ShieldCheck, Target, Clock, CalendarDays, Brain, Star } from 'lucide-react';
import { XP_PER_LEVEL } from '../../constants';

const ProfileDashboard = () => {
  const { profile, tasks, ambitions, stats, history, cognitiveState } = useTrackStore();

  // Calculate deep stats
  const statsData = useMemo(() => {
    // Milestones completed
    const allMilestones = ambitions.flatMap(a => a.milestones);
    const completedMilestones = allMilestones.filter(m => m.status === 'completed').length;
    const completedAmbitions = ambitions.filter(a => a.progress === 100).length;

    // Total tasks (standalone + milestone tasks)
    const allMilestoneTasks = allMilestones.flatMap(m => m.tasks);
    const totalCompletedTasks = tasks.filter(t => t.completed).length + allMilestoneTasks.filter(t => t.completed).length;
    
    // Total focus hours (can fallback to total tasks * 0.5 if not tracked accurately)
    const focusHours = stats.totalFocusHours || Math.round(totalCompletedTasks * 0.75);

    // Join date (fallback to first task or history event)
    let earliestDateStr = new Date().toISOString();
    const allDates = [
      ...tasks.map(t => t.plannedDate || t.time),
      ...history.map(h => h.date)
    ].filter(Boolean);
    
    if (allDates.length > 0) {
      allDates.sort();
      earliestDateStr = allDates[0];
    }
    const joinDate = new Date(earliestDateStr).toLocaleDateString([], { month: 'long', year: 'numeric' });

    return {
      completedMilestones,
      completedAmbitions,
      totalCompletedTasks,
      focusHours,
      joinDate
    };
  }, [tasks, ambitions, stats, history]);

  const xpProgress = (profile.xp / XP_PER_LEVEL) * 100;
  
  // Cognitive Aura Microcopy
  const auraMsg = useMemo(() => {
    if (!cognitiveState) return 'Establishing Neural Baseline...';
    switch (cognitiveState.auraState) {
      case 'Flow': return 'Neural pathways highly aligned. Flow state achieved.';
      case 'Clouded': return 'Momentum destabilized. Re-calibrate in the Nebula.';
      default: return 'Trajectory stable. Standard operations ongoing.';
    }
  }, [cognitiveState]);

  // Pulse animation variants based on sync score
  const pulseDuration = useMemo(() => {
    if (!cognitiveState) return 3;
    if (cognitiveState.auraState === 'Flow') return 1.5;
    if (cognitiveState.auraState === 'Clouded') return 0.5; // Erratic fast pulse
    return 3; // Slow stable pulse
  }, [cognitiveState]);

  return (
    <div className="p-6 lg:pl-80 space-y-8 min-h-screen bg-surface-lowest text-white pb-32">
      <header className="mb-10 relative">
        <h2 className="text-primary text-sm font-bold tracking-widest uppercase">Commander Profile</h2>
        <h1 className="text-4xl font-display font-black text-white uppercase mt-1">Service Record</h1>
        <p className="text-on-surface-variant max-w-lg mt-2">Track your total career trajectory, accomplishments, and neural resonance.</p>
      </header>

      {/* Main Identity Card */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel border-2 border-primary/20 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-10"
      >
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 blur-[100px] rounded-full pointer-events-none transition-colors duration-1000" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary-container/10 blur-[100px] rounded-full pointer-events-none transition-colors duration-1000" />

        <div className="relative z-10 shrink-0 flex items-center justify-center">
          {/* Pulsing Aura Rings */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: pulseDuration, repeat: Infinity, ease: "easeInOut" }}
            className="absolute w-56 h-56 rounded-full border border-primary/40 bg-primary/5"
          />
          <motion.div 
            animate={{ scale: [1, 1.4, 1], opacity: [0.05, 0.15, 0.05] }}
            transition={{ duration: pulseDuration * 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            className="absolute w-64 h-64 rounded-full border border-primary-container/30 bg-primary-container/5"
          />
          
          <div className="relative w-40 h-40 rounded-full bg-surface-high border-4 border-primary/30 flex items-center justify-center shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.2)] overflow-hidden z-10 transition-colors duration-1000">
            <Award size={64} className="text-primary transition-colors duration-1000" />
            
            {/* Sync Score Overlay */}
            {cognitiveState && (
              <div className="absolute inset-0 bg-surface-highest/80 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <span className="text-3xl font-black text-primary font-display">{cognitiveState.syncScore}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Sync Score</span>
              </div>
            )}
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap shadow-lg transition-colors duration-1000 z-20">
            Level {profile.level}
          </div>
        </div>

        <div className="relative z-10 flex-1 w-full text-center md:text-left space-y-4">
          <div>
            <h2 className="text-4xl font-display font-black text-white">{profile.name || 'Commander'}</h2>
            <div className="text-primary-container font-black uppercase tracking-[0.3em] text-sm mt-1 transition-colors duration-1000">{profile.title}</div>
            
            {/* Cognitive Sync Microcopy */}
            <div className="mt-4 inline-flex items-center gap-2 bg-surface-high/60 border border-primary/20 px-4 py-2 rounded-xl backdrop-blur-md transition-colors duration-1000">
              <Brain size={16} className="text-primary transition-colors duration-1000" />
              <span className="text-xs font-medium text-on-surface tracking-wide">{auraMsg}</span>
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto md:mx-0 pt-2">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
              <span>Resonance Energy</span>
              <span className="text-primary transition-colors duration-1000">{profile.xp} / {XP_PER_LEVEL} XP</span>
            </div>
            <div className="h-3 w-full bg-surface-high rounded-full overflow-hidden border border-outline-variant">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full bg-primary shadow-[0_0_10px_rgba(var(--color-primary-rgb),0.8)] transition-colors duration-1000"
              />
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant uppercase tracking-widest bg-surface-high/50 px-4 py-2 rounded-xl border border-outline-variant/30">
              <CalendarDays size={14} className="text-secondary transition-colors duration-1000" />
              Active since {statsData.joinDate}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel p-6 rounded-3xl border border-outline-variant space-y-4 hover:border-primary/50 transition-colors group">
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20 group-hover:bg-primary/20 transition-colors">
            <ShieldCheck size={24} className="text-primary" />
          </div>
          <div>
            <div className="text-4xl font-black text-white font-mono">{statsData.totalCompletedTasks}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mt-1">Parameters Executed</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel p-6 rounded-3xl border border-outline-variant space-y-4 hover:border-secondary/50 transition-colors group">
          <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center border border-secondary/20 group-hover:bg-secondary/20 transition-colors">
            <Target size={24} className="text-secondary" />
          </div>
          <div>
            <div className="text-4xl font-black text-white font-mono">{statsData.completedMilestones}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mt-1">Milestones Reached</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel p-6 rounded-3xl border border-outline-variant space-y-4 hover:border-tertiary/50 transition-colors group">
          <div className="w-12 h-12 bg-tertiary/10 rounded-2xl flex items-center justify-center border border-tertiary/20 group-hover:bg-tertiary/20 transition-colors">
            <Star size={24} className="text-tertiary" />
          </div>
          <div>
            <div className="text-4xl font-black text-white font-mono">{statsData.completedAmbitions}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mt-1">Trajectories Mastered</div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel p-6 rounded-3xl border border-outline-variant space-y-4 hover:border-primary-container/50 transition-colors group">
          <div className="w-12 h-12 bg-primary-container/10 rounded-2xl flex items-center justify-center border border-primary-container/20 group-hover:bg-primary-container/20 transition-colors">
            <Clock size={24} className="text-primary-container" />
          </div>
          <div>
            <div className="text-4xl font-black text-white font-mono">{statsData.focusHours}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mt-1">Total Focus Hours</div>
          </div>
        </motion.div>
      </div>
      
      {/* Customer Satisfaction / Dopamine Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-panel border border-outline-variant rounded-3xl p-8 bg-surface-low"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-lg font-black text-white uppercase tracking-widest">Commendation Log</h3>
            <p className="text-xs text-on-surface-variant max-w-xl">
              Your dedication to professional growth is exceptional. Keep engaging the Momentum Engine daily to maximize your neural resonance and conquer your ambitions.
            </p>
          </div>
          <div className="shrink-0 animate-pulse">
            <div className="px-6 py-3 bg-secondary/10 border border-secondary/30 rounded-2xl flex items-center gap-3">
              <Brain size={20} className="text-secondary" />
              <span className="text-xs font-black text-secondary uppercase tracking-widest">Synapses Optimized</span>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default ProfileDashboard;
