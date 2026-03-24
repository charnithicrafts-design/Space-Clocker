import React from 'react';
import { motion } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import { AlertTriangle } from 'lucide-react';

const VoidTask: React.FC<{ id: string }> = ({ id }) => {
  const v = useTrackStore((state) => state.voids.find((v) => v.id === id)!);
  const engageVoid = useTrackStore((state) => state.engageVoid);

  const handleClick = () => {
    SoundManager.playThud();
    engageVoid(id);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ x: [-5, 5, -5, 5, 0] }}
      onClick={handleClick}
      className={`w-full p-4 rounded-xl border flex items-center justify-between gap-4 transition-colors ${
        v.engagedCount >= v.maxAllowed 
          ? 'bg-error-container/20 border-error' 
          : 'bg-surface-high border-outline-variant'
      }`}
    >
      <div className="flex items-center gap-3">
        <AlertTriangle className={v.engagedCount >= v.maxAllowed ? 'text-error' : 'text-secondary'} />
        <span className="font-medium">{v.text}</span>
      </div>
      <span className="text-sm opacity-60">{v.engagedCount} / {v.maxAllowed}</span>
    </motion.button>
  );
};

export default VoidTask;
