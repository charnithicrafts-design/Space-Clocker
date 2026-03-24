import React from 'react';
import { motion } from 'framer-motion';

const MomentumEngine = () => {
  return (
    <div className="p-6 lg:pl-80 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-on-surface-variant text-sm tracking-widest uppercase font-medium">Momentum Engine</h2>
          <h1 className="text-4xl font-display font-black text-primary">LVL 42</h1>
        </div>
        <div className="text-right">
          <p className="text-on-surface-variant text-xs uppercase tracking-wider mb-1">Resonance Progress</p>
          <div className="w-48 h-2 bg-surface-high rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary-container"
              initial={{ width: 0 }}
              animate={{ width: '72%' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[10px] text-primary mt-1">2,400 XP to next Resonance Shift</p>
        </div>
      </header>

      {/* Macro Ambitions */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: "Lead Scientist at ISRO", progress: 72, phase: "Synaptic Bridge" },
          { title: "Quantum-ML Mastery", progress: 45, phase: "Orbital Mechanics" }
        ].map((ambition, i) => (
          <div key={i} className="glass-panel border border-outline-variant p-6 rounded-3xl nebula-shadow">
            <h3 className="font-display font-bold text-lg mb-1">{ambition.title}</h3>
            <p className="text-secondary text-xs uppercase tracking-wider mb-4">{ambition.phase}</p>
            <div className="text-3xl font-display font-black text-primary-container">{ambition.progress}%</div>
          </div>
        ))}
      </section>

      {/* Micro-Stats */}
      <section className="grid grid-cols-2 gap-6">
        <div className="glass-panel border border-outline-variant p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-primary">🚀</div>
          <div>
            <div className="text-xl font-bold">12</div>
            <div className="text-[10px] text-on-surface-variant uppercase">Active Missions</div>
          </div>
        </div>
        <div className="glass-panel border border-outline-variant p-4 rounded-2xl flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-surface-high flex items-center justify-center text-secondary">⚡</div>
          <div>
            <div className="text-xl font-bold">88%</div>
            <div className="text-[10px] text-on-surface-variant uppercase">Energy Output</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MomentumEngine;
