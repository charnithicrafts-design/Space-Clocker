import React from 'react';
import { motion } from 'framer-motion';
import { Target, Rocket, Calendar } from 'lucide-react';
import { Goal } from '../../store/useTrackStore';

interface MacroDashboardProps {
  goals: Goal[];
}

const MacroDashboard: React.FC<MacroDashboardProps> = ({ goals }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black tracking-[0.2em] text-on-surface-variant uppercase ml-1">Ambition Tracker</h3>
      </div>
      
      {goals.map((goal) => (
        <motion.div
          key={goal.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-panel border border-outline-variant p-6 rounded-3xl space-y-6 relative overflow-hidden group"
        >
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl group-hover:bg-secondary/20 transition-all duration-700" />
          
          <div className="flex items-start justify-between relative z-10">
            <div className="p-3 bg-secondary/10 rounded-2xl border border-secondary/20">
              <Rocket size={24} className="text-secondary" />
            </div>
            <div className="text-right">
              <span className="text-[10px] font-black tracking-widest text-on-surface-variant uppercase">Trajectory</span>
              <div className="flex items-center gap-1.5 mt-1">
                <Calendar size={12} className="text-secondary" />
                <span className="text-xs font-bold text-secondary">{goal.targetDate}</span>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <h4 className="text-xl font-display font-black tracking-tight leading-tight text-on-surface">
              {goal.title}
            </h4>
          </div>

          <div className="space-y-3 relative z-10">
            <div className="flex justify-between text-[10px] font-black tracking-tighter uppercase">
              <span className="text-on-surface-variant">Momentum</span>
              <span className="text-secondary">{goal.progress}%</span>
            </div>
            <div className="h-2 w-full bg-surface-highest rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goal.progress}%` }}
                transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
                className="h-full bg-secondary shadow-[0_0_12px_rgba(218,185,255,0.4)]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-outline-variant flex items-center gap-2 relative z-10">
            <Target size={14} className="text-tertiary-fixed" />
            <span className="text-[10px] font-bold tracking-widest text-tertiary-fixed uppercase">Stabilizing Orbit</span>
          </div>
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="glass-panel border border-dashed border-outline-variant p-6 rounded-3xl flex flex-col items-center justify-center gap-3 text-on-surface-variant/40 hover:text-on-surface-variant/70 transition-colors cursor-not-allowed"
      >
        <div className="w-10 h-10 rounded-full border border-dashed border-current flex items-center justify-center">
          <span className="text-xl font-light">+</span>
        </div>
        <span className="text-[10px] font-black tracking-[0.2em] uppercase">Initialize New Goal</span>
      </motion.div>
    </div>
  );
};

export default MacroDashboard;
