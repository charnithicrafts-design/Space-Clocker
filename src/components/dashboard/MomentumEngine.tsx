import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { Plus, Zap, Rocket, AlertTriangle, ChevronRight, CheckCircle2 } from 'lucide-react';
import CommandModal from '../layout/CommandModal';

const MomentumEngine = () => {
  const { profile, ambitions, addAmbition } = useTrackStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLaunchTrajectory = async (title: string) => {
    await addAmbition(title);
  };

  const totalMilestones = ambitions.reduce((acc, a) => acc + (a.milestones?.length || 0), 0);
  const completedMilestones = ambitions.reduce((acc, a) => acc + (a.milestones?.filter(m => m.status === 'completed').length || 0), 0);
  const completionRate = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div className="p-6 lg:pl-80 space-y-6 bg-surface-lowest min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-secondary text-sm font-bold tracking-widest uppercase">Space Science Level</h2>
          <h1 className="text-4xl font-display font-black text-primary uppercase tracking-tighter">
            Momentum Rank: LVL {profile.level}
          </h1>
        </div>
        <Zap className="text-primary-container" size={32} />
      </header>

      {/* Global Momentum Level Resonance */}
      <div className="space-y-1 mb-8">
        <div className="flex justify-between items-end">
          <div className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Global Momentum Resonance: {profile.xp} / 1000 XP</div>
          <div className="text-sm text-primary-container font-mono">+{Math.round((profile.xp / 1000) * 100)}%</div>
        </div>
        <div className="w-full h-2 bg-surface-high rounded-full overflow-hidden border border-outline-variant/30">
          <motion.div 
            className="h-full bg-gradient-to-r from-primary to-primary-container shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.5)]" 
            initial={{ width: 0 }} 
            animate={{ width: `${(profile.xp / 1000) * 100}%` }} 
            transition={{ duration: 1, ease: "easeOut" }} 
          />
        </div>
        <p className="text-xs text-on-surface-variant font-mono uppercase">Next Ranking Shift In {1000 - profile.xp} XP</p>
      </div>

      {/* Macro Ambitions */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Rocket size={20} className="text-secondary" />
            Macro Ambitions (Trajectories)
        </h2>
        <div className="text-[10px] font-black text-secondary uppercase tracking-[0.2em] bg-secondary/10 px-3 py-1 rounded-full border border-secondary/20">
            Resonance Tracking Active
        </div>
      </div>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ambitions.map((ambition) => {
          const completedInAmbition = ambition.milestones?.filter(m => m.status === 'completed').length || 0;
          const totalInAmbition = ambition.milestones?.length || 0;
          const isFullyCompleted = totalInAmbition > 0 && completedInAmbition === totalInAmbition;

          return (
            <div key={ambition.id} className={`glass-panel border-2 p-6 rounded-3xl nebula-shadow group transition-all duration-500 ${isFullyCompleted ? 'border-success/30 bg-success/5' : 'border-outline-variant hover:border-primary/30'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`font-bold text-lg transition-colors ${isFullyCompleted ? 'text-success' : 'text-white group-hover:text-primary'}`}>
                    {ambition.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest">Trajectory Resonance</p>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${isFullyCompleted ? 'bg-success/20 text-success' : 'bg-surface-high text-secondary-container'}`}>
                        {isFullyCompleted && <CheckCircle2 size={10} />}
                        {completedInAmbition}/{totalInAmbition} MILESTONES
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] font-black transition-all ${isFullyCompleted ? 'border-success text-success shadow-[0_0_10px_rgba(var(--color-success-rgb),0.3)]' : 'border-primary-container text-primary'}`}>
                    {ambition.progress}%
                  </div>
                </div>
              </div>

              {/* Individual Ambition Resonance Bar */}
              <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono uppercase">
                      <span className="text-on-surface-variant">Resonance Energy</span>
                      <span className={isFullyCompleted ? 'text-success' : 'text-primary-container'}>
                        {isFullyCompleted ? 'MAX CAPACITY' : `${ambition.xp % 500} / 500 XP`}
                      </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-high rounded-full overflow-hidden border border-outline-variant/20">
                      <motion.div 
                          className={`h-full ${isFullyCompleted ? 'bg-success shadow-[0_0_10px_rgba(var(--color-success-rgb),0.5)]' : 'bg-gradient-to-r from-primary to-secondary'}`}
                          initial={{ width: 0 }}
                          animate={{ width: isFullyCompleted ? '100%' : `${((ambition.xp % 500) / 500) * 100}%` }}
                      />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-[8px] text-on-surface-variant uppercase tracking-tighter">
                        Resonance Phase {Math.floor(ambition.xp / 500) + 1}
                    </div>
                    {isFullyCompleted && (
                        <div className="text-[8px] text-success font-black uppercase tracking-widest animate-pulse">
                            Stationary Orbit Achieved
                        </div>
                    )}
                  </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Widgets & Anomalies */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-outline-variant/30 hover:border-primary/20 transition-all">
            <Rocket className="text-primary-container" size={24} />
            <div>
                <div className="text-3xl font-black text-white leading-none">{ambitions.length < 10 ? `0${ambitions.length}` : ambitions.length}</div>
                <div className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest mt-1">Active Trajectories</div>
            </div>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between border border-outline-variant/30 hover:border-secondary/20 transition-all">
            <CheckCircle2 className="text-secondary" size={24} />
            <div>
                <div className="text-3xl font-black text-white leading-none">
                    {completedMilestones < 10 ? `0${completedMilestones}` : completedMilestones}
                </div>
                <div className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest mt-1">Milestones Cleared</div>
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-primary flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-primary">
                <Zap size={18} />
                <h3 className="font-bold uppercase text-xs tracking-widest">Mission Completion Index</h3>
            </div>
            <div className="text-xl font-black text-white font-mono">{completionRate}%</div>
          </div>
          <div className="w-full h-1.5 bg-surface-high rounded-full overflow-hidden mb-4">
            <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-[10px] text-on-surface-variant leading-relaxed uppercase font-medium">
            System analysis indicates {completionRate}% efficiency across all active orbital trajectories. Standing by for further mission updates.
          </p>
        </div>
      </section>

      {/* FAB */}
      <motion.button 
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-8 w-16 h-16 bg-primary-container text-on-primary rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.4)] z-50 border-4 border-surface-lowest"
      >
        <Plus size={32} />
      </motion.button>

      <CommandModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleLaunchTrajectory}
        title="Launch New Trajectory"
        placeholder="Define your macro ambition..."
        icon={Rocket}
      />
    </div>
  );
};

export default MomentumEngine;
