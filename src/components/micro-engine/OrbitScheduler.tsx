import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import { Check } from 'lucide-react';

const OrbitScheduler: React.FC = () => {
  const { tasks, toggleTask } = useTrackStore();

  const handleToggle = (taskId: string) => {
    SoundManager.playPop();
    toggleTask(taskId);
  };

  return (
    <div className="glass-panel border border-outline-variant rounded-2xl p-6">
      <h2 className="font-display text-xl mb-4 text-secondary">Orbit Scheduler</h2>
      <ul className="space-y-3">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.li
              key={task.id}
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                task.completed ? 'bg-surface-high border-tertiary-container' : 'bg-surface-low border-outline-variant'
              }`}
            >
              <button
                onClick={() => handleToggle(task.id)}
                className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                  task.completed ? 'bg-tertiary-container text-on-primary' : 'border border-primary-container'
                }`}
              >
                {task.completed && <Check size={16} />}
              </button>
              <span className={task.completed ? 'line-through text-on-surface-variant' : 'text-on-surface'}>
                {task.title}
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
};

export default OrbitScheduler;
