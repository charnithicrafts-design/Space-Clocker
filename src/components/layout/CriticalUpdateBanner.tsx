import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';

const CriticalUpdateBanner = () => {
  const { updateAvailable, pendingVersion, setShowUpdateModal } = useTrackStore();

  if (!updateAvailable) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[60] bg-primary text-on-primary p-2 flex items-center justify-center gap-4 shadow-xl border-b border-primary-container/30"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Trajectory Update Available: v{pendingVersion}</span>
        </div>
        
        <button 
          onClick={() => {
            SoundManager.playSwell();
            setShowUpdateModal(true);
          }}
          className="bg-on-primary text-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-white transition-colors flex items-center gap-1"
        >
          Re-align Systems <ArrowRight size={12} />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default CriticalUpdateBanner;
