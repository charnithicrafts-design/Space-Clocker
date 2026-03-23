import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { Void } from '../../store/useTrackStore';
import VoidTask from './VoidTask';

interface VoidListProps {
  voids: Void[];
  onEngage: (id: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const VoidList: React.FC<VoidListProps> = ({ voids, onEngage }) => {
  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-950/20 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 p-4 opacity-20 pointer-events-none animate-pulse">
        <ShieldAlert size={100} className="text-red-900" />
      </div>

      {/* Header */}
      <div className="relative z-10 mb-6 border-b border-red-900/30 pb-4">
        <h2 className="text-xl font-bold font-mono tracking-widest text-red-500/80 flex items-center gap-2">
          <ShieldAlert size={20} />
          VOID PROTOCOL
        </h2>
        <p className="text-xs text-red-400/50 uppercase tracking-[0.2em] mt-1 ml-1">
          Detecting Anomaly Patterns
        </p>
      </div>

      {/* List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 overflow-y-auto pr-2 custom-scrollbar"
      >
        {voids.map((voidItem) => (
          <VoidTask 
            key={voidItem.id} 
            voidItem={voidItem} 
            onEngage={onEngage} 
          />
        ))}
      </motion.div>

      {/* Footer / Status */}
      <div className="mt-4 pt-4 border-t border-red-900/30">
        <div className="flex justify-between items-center text-[10px] text-red-500/40 uppercase tracking-widest">
          <span>System Integrity</span>
          <span className="animate-pulse">Monitoring...</span>
        </div>
      </div>
    </div>
  );
};

export default VoidList;
