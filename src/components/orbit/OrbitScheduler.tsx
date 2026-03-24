import React from 'react';
import { motion } from 'framer-motion';

const OrbitScheduler = () => {
  const tasks = [
    { time: "08:00", name: "Deep Focus: Quantum Gates", completed: true },
    { time: "10:30", name: "Orbital Mechanics Study", completed: false },
    { time: "13:00", name: "Reactive Comms", completed: false, isVoid: true },
  ];

  return (
    <div className="p-6 lg:pl-80 space-y-8">
      <h2 className="text-on-surface-variant text-sm tracking-widest uppercase font-medium">Orbit (Daily Protocol)</h2>

      {/* Focus Protocol */}
      <section className="space-y-4">
        {tasks.map((task, i) => (
          <motion.div 
            key={i}
            className={`glass-panel border p-4 rounded-xl flex items-center gap-6 ${task.isVoid ? 'border-error/30 hover:border-error' : 'border-outline-variant'}`}
            whileHover={task.isVoid ? { x: [0, -5, 5, -5, 0] } : {}}
          >
            <span className="font-mono text-primary-container text-sm w-12">{task.time}</span>
            <span className={`flex-1 ${task.completed ? 'line-through opacity-50' : ''}`}>
              {task.name}
            </span>
          </motion.div>
        ))}
      </section>

      {/* Sync Gauge */}
      <div className="fixed bottom-24 right-8 w-24 h-24">
        <svg className="w-full h-full rotate-[-90deg]">
          <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="none" className="text-surface-high" />
          <motion.circle 
            cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="none" className="text-primary-container"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 0.65 }}
            transition={{ duration: 1 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-black">65%</div>
      </div>
    </div>
  );
};

export default OrbitScheduler;
