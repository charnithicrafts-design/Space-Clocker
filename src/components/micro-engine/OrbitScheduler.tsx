import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { Task } from '../../store/useTrackStore';
import { soundManager } from '../../utils/SoundManager';

interface OrbitSchedulerProps {
  tasks: Task[];
  toggleTask: (id: string) => void;
  orbitProgress: number;
}

const OrbitScheduler: React.FC<OrbitSchedulerProps> = ({ tasks, toggleTask, orbitProgress }) => {
  const handleToggle = (task: Task) => {
    if (!task.completed) {
      soundManager.playPop();
    }
    toggleTask(task.id);
  };

  const orbitTasks = tasks.filter(t => t.category === 'orbit');

  return (
    <div className="lg:col-span-8 space-y-8">
      <section className="glass-panel rounded-3xl p-8 border border-outline-variant relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-primary-container tracking-tight">ORBIT SCHEDULER</h2>
            <p className="text-on-surface-variant text-sm font-medium uppercase tracking-widest mt-1">Daily Micro-Actions</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-display font-black text-tertiary-fixed">{Math.round(orbitProgress)}%</span>
            <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-tighter">Sync Level</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-surface-highest rounded-full overflow-hidden mb-12">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${orbitProgress}%` }}
            transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            className="h-full bg-gradient-to-r from-primary-container to-tertiary-container shadow-[0_0_12px_rgba(0,242,255,0.4)]"
          />
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {orbitTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                whileHover={{ scale: 1.01, backgroundColor: 'rgba(58, 73, 75, 0.4)' }}
                onClick={() => handleToggle(task)}
                className={`flex items-center gap-5 p-5 rounded-2xl cursor-pointer transition-colors border ${
                  task.completed ? 'border-primary-container/20 bg-primary-container/5' : 'border-outline-variant bg-surface-low/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  task.completed ? 'bg-primary-container border-primary-container shadow-[0_0_10px_rgba(0,242,255,0.5)]' : 'border-outline-variant'
                }`}>
                  {task.completed && <Check size={18} className="text-on-primary font-bold" />}
                </div>
                
                <span className={`flex-1 font-medium tracking-wide transition-all duration-300 ${
                  task.completed ? 'text-on-surface/50 line-through' : 'text-on-surface'
                }`}>
                  {task.title}
                </span>
                
                {!task.completed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-[10px] font-black tracking-widest text-primary-container/60 uppercase"
                  >
                    Pending
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
};

export default OrbitScheduler;
