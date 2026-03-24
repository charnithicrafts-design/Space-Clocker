import React from 'react';
import { motion } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';

const MomentumEngine = () => {
  const { profile, ambitions } = useTrackStore();

  return (
    <div className="p-6 lg:pl-80 space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-on-surface-variant text-sm tracking-widest uppercase font-medium">{profile.title}</h2>
          <h1 className="text-4xl font-display font-black text-primary">LVL {profile.level}</h1>
        </div>
        <div className="text-right">
          <p className="text-on-surface-variant text-xs uppercase tracking-wider mb-1">Resonance Progress</p>
          <div className="w-48 h-2 bg-surface-high rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary-container"
              initial={{ width: 0 }}
              animate={{ width: `${ambitions[0]?.progress || 0}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>
          <p className="text-[10px] text-primary mt-1">Next Resonance Shift: {ambitions[0]?.progress || 0}%</p>
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ambitions.map((ambition) => (
          <div key={ambition.id} className="glass-panel border border-outline-variant p-6 rounded-3xl nebula-shadow">
            <h3 className="font-display font-bold text-lg mb-4">{ambition.title}</h3>
            <div className="text-3xl font-display font-black text-primary-container">{ambition.progress}%</div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default MomentumEngine;
