import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle } from 'lucide-react';
import { Void } from '../../store/useTrackStore';
import { soundManager } from '../../utils/SoundManager';
import { clsx } from 'clsx';

interface VoidTaskProps {
  voidItem: Void;
  onEngage: (id: string) => void;
}

const VoidTask: React.FC<VoidTaskProps> = ({ voidItem, onEngage }) => {
  const [isGlitching, setIsGlitching] = useState(false);

  const handleEngage = () => {
    soundManager.playThud();
    setIsGlitching(true);
    onEngage(voidItem.id);
    
    // Reset glitch state after animation
    setTimeout(() => setIsGlitching(false), 300);
  };

  const intensity = Math.min(voidItem.engagedCount / voidItem.maxAllowed, 1);
  const isCritical = voidItem.engagedCount >= voidItem.maxAllowed;

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02, x: 2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleEngage}
      className={clsx(
        "relative overflow-hidden p-4 mb-3 rounded-lg cursor-pointer border backdrop-blur-sm transition-colors group",
        isCritical 
          ? "border-red-500/80 bg-red-950/20 shadow-[0_0_15px_rgba(239,68,68,0.3)]" 
          : "border-red-500/20 bg-black/40 hover:border-red-500/50 hover:bg-red-950/10"
      )}
    >
      {/* Glitch Overlay */}
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-red-500/20 z-10 pointer-events-none mix-blend-overlay"
          />
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between relative z-20">
        <div className="flex items-center gap-3">
          <div className={clsx(
            "p-2 rounded-full transition-colors",
            isCritical ? "bg-red-500/20 text-red-400 animate-pulse" : "bg-red-900/20 text-red-700 group-hover:text-red-500"
          )}>
            {isCritical ? <XCircle size={20} /> : <AlertTriangle size={20} />}
          </div>
          
          <div>
            <h3 className={clsx(
              "font-mono text-sm tracking-wide transition-colors",
              isCritical ? "text-red-300 line-through decoration-red-500/50" : "text-gray-400 group-hover:text-red-300"
            )}>
              {voidItem.title}
            </h3>
            <div className="flex items-center gap-1 mt-1">
              {/* Count Indicator */}
              <span className="text-xs font-mono text-red-500/60">
                Engagements: {voidItem.engagedCount} / {voidItem.maxAllowed}
              </span>
            </div>
          </div>
        </div>

        {/* Progress/Danger Bar */}
        <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
          <motion.div 
            className={clsx(
              "h-full",
              isCritical ? "bg-red-500" : "bg-red-900"
            )}
            initial={{ width: 0 }}
            animate={{ width: `${intensity * 100}%` }}
            transition={{ type: 'spring', stiffness: 100 }}
          />
        </div>
      </div>

      {/* Shake Animation wrapper */}
      {isGlitching && (
        <motion.div
          className="absolute inset-0 border-2 border-red-500/0"
          animate={{ x: [-2, 2, -2, 2, 0], opacity: [0, 1, 0] }}
          transition={{ duration: 0.2 }}
        />
      )}
    </motion.div>
  );
};

export default VoidTask;
