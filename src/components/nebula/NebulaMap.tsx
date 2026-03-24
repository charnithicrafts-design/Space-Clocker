import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle } from 'lucide-react';

const NebulaMap = () => {
  const goal = { title: "Interstellar Colony Alpha", completed: 8, total: 12 };
  const subGoals = [
    { title: "Atmospheric Stabilizers", ratio: "08/12", active: true },
    { title: "Hydroponic Arrays", ratio: "00/05", active: false },
    { title: "Power Core Initiation", ratio: "00/03", active: false },
  ];

  return (
    <div className="p-6 lg:pl-80 space-y-8">
      <h2 className="text-on-surface-variant text-sm tracking-widest uppercase font-medium">Nebula Map</h2>
      
      {/* Priority Zero Card */}
      <motion.div 
        className="glass-panel border border-primary-container p-8 rounded-3xl nebula-shadow relative overflow-hidden"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-3xl font-display font-bold text-primary mb-6">{goal.title}</h1>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 text-primary-container">
              <CheckCircle size={20} />
              <span className="text-on-surface">Sub-step alpha-0{i} initialized</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Sub-Goal List */}
      <section className="space-y-4">
        <h3 className="text-on-surface-variant text-xs uppercase tracking-wider">Secondary Projects</h3>
        {subGoals.map((sg, i) => (
          <div key={i} className="glass-panel border border-outline-variant p-4 rounded-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${sg.active ? 'bg-primary-container' : 'bg-surface-high'}`} />
              <span className="font-medium">{sg.title}</span>
            </div>
            <span className="font-mono text-secondary">{sg.ratio}</span>
          </div>
        ))}
      </section>
    </div>
  );
};

export default NebulaMap;
