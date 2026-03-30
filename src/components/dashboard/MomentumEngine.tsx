import React from 'react';
import { motion } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { Plus, Zap, Rocket, AlertTriangle, ChevronRight } from 'lucide-react';

const MomentumEngine = () => {
  const { profile, ambitions, addAmbition } = useTrackStore();

  const handleLaunchTrajectory = async () => {
    const title = prompt("Enter the title for your new Launch Trajectory:");
    if (title) {
      await addAmbition(title);
    }
  };

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
        <div className="w-full h-2 bg-surface-high rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary-container" 
            initial={{ width: 0 }} 
            animate={{ width: `${(profile.xp / 1000) * 100}%` }} 
            transition={{ duration: 1, ease: "easeOut" }} 
          />
        </div>
        <p className="text-xs text-on-surface-variant font-mono uppercase">Next Ranking Shift In {1000 - profile.xp} XP</p>
      </div>

      {/* Macro Ambitions */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">Macro Ambitions (Trajectories)</h2>
        <div className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Resonance Tracking Active</div>
      </div>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ambitions.map((ambition) => {
          const completedMilestones = ambition.milestones.filter(m => m.status === 'completed').length;
          const totalMilestones = ambition.milestones.length;

          return (
            <div key={ambition.id} className="glass-panel border border-outline-variant p-6 rounded-3xl nebula-shadow group hover:border-primary/30 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-white text-lg group-hover:text-primary transition-colors">{ambition.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-widest">Trajectory Resonance</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-surface-high text-secondary-container font-bold">
                        {completedMilestones}/{totalMilestones} MILESTONES
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="w-10 h-10 rounded-full border border-primary-container flex items-center justify-center text-primary text-[10px] font-black">
                    {ambition.progress}%
                  </div>
                </div>
              </div>

              {/* Individual Ambition Resonance Bar */}
              <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-mono uppercase">
                      <span className="text-on-surface-variant">Resonance Energy</span>
                      <span className="text-primary-container">{ambition.xp % 500} / 500 XP</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-high rounded-full overflow-hidden">
                      <motion.div 
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                          initial={{ width: 0 }}
                          animate={{ width: `${((ambition.xp % 500) / 500) * 100}%` }}
                      />
                  </div>
                  <div className="text-[8px] text-right text-on-surface-variant uppercase tracking-tighter">
                      Resonance Phase {Math.floor(ambition.xp / 500) + 1}
                  </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Widgets & Anomalies */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <Rocket className="text-primary-container" />
            <div className="text-3xl font-bold text-white">{ambitions.length < 10 ? `0${ambitions.length}` : ambitions.length}</div>
            <div className="text-xs text-on-surface-variant uppercase">Active Trajectories</div>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <Zap className="text-primary-container" />
            <div className="text-3xl font-bold text-white">{ambitions.reduce((acc, a) => acc + a.milestones.filter(m => m.status === 'completed').length, 0)}</div>
            <div className="text-xs text-on-surface-variant uppercase">Milestones Cleared</div>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border-l-4 border-l-error">
          <div className="flex items-center gap-2 mb-2 text-error">
            <AlertTriangle size={18} />
            <h3 className="font-bold">System Anomaly</h3>
          </div>
          <p className="text-sm text-on-surface-variant mb-4">Quadrant 7 reported a slight drop in oxygen stabilization. Automated drones dispatched.</p>
          <a href="#" className="text-primary-container flex items-center gap-1 text-sm font-bold">
            VIEW DIAGNOSTICS <ChevronRight size={16} />
          </a>
        </div>
      </section>

      {/* FAB */}
      <button 
        onClick={handleLaunchTrajectory}
        className="fixed bottom-24 right-8 w-14 h-14 bg-primary-container rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform z-50"
      >
        <Plus size={32} className="text-on-primary" />
      </button>
    </div>
  );
};

export default MomentumEngine;
