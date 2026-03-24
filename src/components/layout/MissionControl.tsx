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
      className="min-h-screen bg-surface-lowest text-on-surface font-sans p-6"
    >
      <header className="glass-panel border border-outline-variant p-4 rounded-2xl nebula-shadow mb-6 flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-primary">Space-Clocker</h1>
        <div className="text-on-surface-variant font-medium">Mission Control</div>
      </header>
      
      <main className="space-y-6">
        {children}
      </main>

      <footer className="mt-12 pt-6 border-t border-outline-variant text-center text-sm text-on-surface-variant">
        Galactic Voyage | Level 42
      </footer>
    </motion.div>
  );
};

export default MissionControl;
