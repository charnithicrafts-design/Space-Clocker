import React from 'react';
import { motion } from 'framer-motion';

interface MissionControlProps {
  children: React.ReactNode;
}

const MissionControl: React.FC<MissionControlProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-surface-lowest text-on-surface p-6 md:p-12 font-sans selection:bg-primary-container selection:text-on-primary"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-outline-variant pb-8">
          <div>
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-4xl md:text-6xl font-display font-black tracking-tighter text-primary-container"
            >
              SPACE-CLOCKER
            </motion.h1>
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-on-surface-variant font-medium tracking-wide uppercase text-sm mt-2"
            >
              Beyond Rocket Science | Trajectory: ISRO/NASA 2027
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="glass-panel px-4 py-2 rounded-full border border-outline-variant flex items-center gap-3"
          >
            <div className="w-2 h-2 rounded-full bg-tertiary-fixed animate-pulse" />
            <span className="text-xs font-bold tracking-widest uppercase">System: Resonance Active</span>
          </motion.div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {children}
        </main>
      </div>
      
      {/* Decorative Nebula Elements */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-container/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
    </motion.div>
  );
};

export default MissionControl;
