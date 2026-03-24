import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useTrackStore } from '../../store/useTrackStore';

const NebulaMap = () => {
  const { ambitions } = useTrackStore();

  return (
    <div className="p-6 lg:pl-80 space-y-8">
      <h2 className="text-on-surface-variant text-sm tracking-widest uppercase font-medium">Nebula Map</h2>
      
      {ambitions.map((goal) => (
        <motion.div 
          key={goal.id}
          className="glass-panel border border-primary-container p-8 rounded-3xl nebula-shadow relative overflow-hidden"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <h1 className="text-3xl font-display font-bold text-primary mb-6">{goal.title}</h1>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-primary-container">
              <CheckCircle size={20} />
              <span className="text-on-surface">Target Resonance: {goal.progress}%</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default NebulaMap;
