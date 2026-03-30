import React from 'react';
import { motion } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { Plus, Zap, Rocket, AlertTriangle, ChevronRight } from 'lucide-react';

const MomentumEngine = () => {
  const { profile, ambitions } = useTrackStore();

  return (
    <div className="p-6 lg:pl-80 space-y-6 bg-surface-lowest min-h-screen">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-secondary text-sm font-bold tracking-widest uppercase">Orbit Level {profile.level}</h2>
          <h1 className="text-4xl font-display font-black text-primary">MOMENTUM ENGINE: LVL {profile.level}</h1>
        </div>
        <Zap className="text-primary-container" size={32} />
      </header>

      {/* Resonance Progress */}
      <div className="space-y-1 mb-8">
        <div className="flex justify-between items-end">
          <div className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">Resonance Energy: {profile.xp} / 1000 XP</div>
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
        <p className="text-xs text-on-surface-variant font-mono">NEXT RESONANCE SHIFT IN {1000 - profile.xp}XP</p>
      </div>

      {/* Macro Ambitions */}
      <h2 className="text-lg font-bold text-white mb-4">Macro Ambitions</h2>
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ambitions.map((ambition) => (
          <div key={ambition.id} className="glass-panel border border-outline-variant p-6 rounded-3xl nebula-shadow">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-white text-lg">{ambition.title}</h3>
                <p className="text-xs text-on-surface-variant uppercase">Project: Deep Core</p>
              </div>
              <div className="w-12 h-12 rounded-full border border-primary-container flex items-center justify-center text-primary text-sm font-bold">
                {ambition.progress}%
              </div>
            </div>
            <div className="w-full h-2 bg-surface-high rounded-full overflow-hidden">
              <div className="h-full bg-primary-container" style={{ width: `${ambition.progress}%` }} />
            </div>
          </div>
        ))}
      </section>

      {/* Widgets & Anomalies */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <Rocket className="text-primary-container" />
            <div className="text-3xl font-bold text-white">04</div>
            <div className="text-xs text-on-surface-variant uppercase">Active Missions</div>
          </div>
          <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
            <Zap className="text-primary-container" />
            <div className="text-3xl font-bold text-white">1.2k</div>
            <div className="text-xs text-on-surface-variant uppercase">Energy Output</div>
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
      <button className="fixed bottom-24 right-8 w-14 h-14 bg-primary-container rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
        <Plus size={32} className="text-on-primary" />
      </button>
    </div>
  );
};

export default MomentumEngine;
