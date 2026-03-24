import React, { useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';

const SyncGauge = React.memo(({ percentage }: { percentage: number }) => (
  <div className="fixed bottom-24 right-8 w-24 h-24">
    <svg className="w-full h-full rotate-[-90deg]">
      <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="none" className="text-surface-high" />
      <motion.circle 
        cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="4" fill="none" className="text-primary-container"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: percentage / 100 }}
        transition={{ duration: 1 }}
      />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center font-black">{Math.round(percentage)}%</div>
  </div>
));

const OrbitScheduler = () => {
  const { tasks, toggleTask } = useTrackStore();

  const completionPercentage = useMemo(() => {
    if (tasks.length === 0) return 0;
    return (tasks.filter(t => t.completed).length / tasks.length) * 100;
  }, [tasks]);

  const handleToggle = useCallback((id: string) => {
    SoundManager.playPop();
    toggleTask(id);
  }, [toggleTask]);

  return (
    <div className="p-6 lg:pl-80 space-y-8">
      <h2 className="text-on-surface-variant text-sm tracking-widest uppercase font-medium">Orbit (Daily Protocol)</h2>

      <section className="space-y-4">
        {tasks.map((task) => (
          <motion.div 
            key={task.id}
            className={`glass-panel border p-4 rounded-xl flex items-center gap-6 ${task.isVoid ? 'border-error/30 hover:border-error' : 'border-outline-variant'}`}
            whileHover={task.isVoid ? { x: [0, -5, 5, -5, 0] } : {}}
            onClick={() => handleToggle(task.id)}
          >
            <span className="font-mono text-primary-container text-sm w-12">{task.time}</span>
            <span className={`flex-1 ${task.completed ? 'line-through opacity-50' : ''}`}>
              {task.title}
            </span>
          </motion.div>
        ))}
      </section>

      <SyncGauge percentage={completionPercentage} />
    </div>
  );
};

export default React.memo(OrbitScheduler);
