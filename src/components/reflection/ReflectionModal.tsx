import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, MessageSquare } from 'lucide-react';
import { soundManager } from '../../utils/SoundManager';
import { Reflection } from '../../store/useTrackStore';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (content: string, type: Reflection['type']) => void;
}

const ReflectionModal: React.FC<ReflectionModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [content, setContent] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      soundManager.playSwell();
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!content.trim()) return;
    soundManager.playLevelUp(); // Reward for reflecting
    onSubmit(content, 'daily-summary'); // Default to daily summary for manual trigger
    setContent('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div 
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-surface-low border border-outline-variant rounded-3xl p-8 shadow-2xl overflow-hidden z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
              <Sparkles size={120} className="text-tertiary-fixed" />
            </div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-highest rounded-full transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-3 text-tertiary-fixed">
                <Sparkles size={24} />
                <h2 className="text-2xl font-display font-bold tracking-tight text-on-surface">REFLECTION LOOP</h2>
              </div>

              <p className="text-on-surface-variant text-sm">
                Pause the momentum. Analyze the trajectory. What observations have you made today?
              </p>

              <div className="space-y-4">
                <div className="relative group">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Log your thoughts here... (e.g., 'Missed orbit due to unexpected void anomaly...')"
                    className="w-full h-32 bg-surface-lowest/50 border border-outline-variant rounded-xl p-4 text-on-surface placeholder:text-on-surface-variant/30 focus:outline-none focus:border-tertiary-fixed focus:ring-1 focus:ring-tertiary-fixed transition-all resize-none font-mono text-sm"
                    autoFocus
                  />
                  <div className="absolute bottom-3 right-3 text-[10px] text-on-surface-variant/40 uppercase tracking-widest pointer-events-none">
                    System Logging Active
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    DISMISS
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!content.trim()}
                    className="px-6 py-2 bg-tertiary-fixed text-on-tertiary-fixed text-sm font-bold tracking-wide uppercase rounded-lg hover:bg-tertiary-fixed-dim transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <MessageSquare size={16} />
                    Log Entry
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReflectionModal;
