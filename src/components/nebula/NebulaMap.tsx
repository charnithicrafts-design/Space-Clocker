import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Zap, ChevronDown, MoreHorizontal } from 'lucide-react';
import { useTrackStore } from '../../store/useTrackStore';

const NebulaMap = () => {
  const { ambitions } = useTrackStore();

  return (
    <div className="p-6 lg:pl-80 space-y-8 bg-surface-lowest min-h-screen text-white">
      <header className="mb-8">
        <h2 className="text-secondary text-sm font-bold tracking-widest uppercase">Architect Mode</h2>
        <h1 className="text-4xl font-display font-black text-white">The Nebula Map</h1>
        <p className="text-on-surface-variant">Deconstruct your ambitions into stellar milestones.</p>
      </header>
      
      {ambitions.slice(0, 1).map((goal) => (
        <motion.div 
          key={goal.id}
          className="glass-panel border-2 border-primary-container p-8 rounded-3xl relative overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-primary-container text-xs font-bold uppercase tracking-widest">Priority Zero</span>
              <h1 className="text-2xl font-display font-bold text-white mt-1">{goal.title}</h1>
            </div>
            <div className="w-16 h-16 rounded-full border-2 border-primary-container flex items-center justify-center font-bold text-primary text-xl">
              {goal.progress}%
            </div>
          </div>
          
          <div className="space-y-3">
             <div className="flex items-center gap-3 p-4 bg-surface-high rounded-xl border border-outline-variant">
              <div className="grid grid-cols-3 gap-1">
                {[...Array(6)].map((_, i) => <div key={i} className="w-1 h-1 bg-white rounded-full" />)}
              </div>
              <span className="text-white flex-1">Life Support Calibration</span>
              <CheckCircle className="text-primary-container" size={20} />
            </div>
            <div className="flex items-center gap-3 p-4 bg-surface-high rounded-xl border border-primary-container">
              <span className="text-primary-container">=</span>
              <span className="text-white flex-1">Biometric Dome Shielding</span>
              <MoreHorizontal size={20} className="text-on-surface-variant" />
            </div>
          </div>
        </motion.div>
      ))}

      <section className="space-y-4">
        {ambitions.slice(1).map((sg) => (
          <div key={sg.id} className="glass-panel border border-outline-variant p-6 rounded-2xl flex justify-between items-center hover:border-primary-container transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-surface-high rounded-xl flex items-center justify-center text-primary-container">
                <Zap size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white">{sg.title}</h3>
                <p className="text-xs text-on-surface-variant">12 Sub-goals • 4 Pending</p>
              </div>
            </div>
            <ChevronDown className="text-on-surface-variant" />
          </div>
        ))}
      </section>
    </div>
  );
};

export default NebulaMap;
