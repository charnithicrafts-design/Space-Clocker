import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';

interface ReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type?: Reflection['type'];
  title?: string;
}

const ReflectionModal: React.FC<ReflectionModalProps> = ({ isOpen, onClose, type = 'daily-summary', title = 'Neural Reflection' }) => {
  const [text, setText] = useState('');
  const addReflection = useTrackStore((state) => state.addReflection);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    SoundManager.playSwell();
    await addReflection(text, type);
    setText('');
    onClose();
  };

  const getPlaceholder = () => {
    if (type === 'missed-task') return "Analyze the trajectory deviation. Why was this parameter not reached?";
    if (type === 'void-engaged') return "The void beckons. What specific anomaly pulled you from your mission?";
    return "Log your daily progress. What corrections are needed for the next solar cycle?";
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-surface-lowest/80 backdrop-blur-sm flex items-center justify-center p-6 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel border border-outline-variant p-6 rounded-2xl w-full max-w-md"
          >
            <h2 className="font-display text-xl mb-4 text-primary">{title}</h2>
            <textarea
              className="w-full h-32 bg-surface-low border border-outline-variant rounded-xl p-4 text-on-surface mb-4"
              placeholder={getPlaceholder()}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={onClose} className="flex-1 p-3 rounded-lg bg-surface-high">Cancel</button>
              <button onClick={handleSubmit} className="flex-1 p-3 rounded-lg bg-primary-container text-on-primary font-bold uppercase tracking-widest text-[10px]">Log Entry</button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReflectionModal;
