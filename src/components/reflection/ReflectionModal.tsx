import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackStore, Reflection } from '../../store/useTrackStore';
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
    await addReflection(text, type as Reflection['type']);
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
          onClick={onClose}
          className="modal-backdrop bg-surface-lowest/80 backdrop-blur-sm z-[120]"
        >
          <div className="modal-center-frame">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-dialog-scroll glass-panel border border-outline-variant p-6 max-w-md"
            >
              <h2 className="type-title-2 mb-4 text-primary">{title}</h2>
              <textarea
                className="w-full h-32 bg-surface-low border border-outline-variant rounded-xl p-4 text-on-surface mb-4 focus:border-primary focus:outline-none"
                placeholder={getPlaceholder()}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="flex gap-4">
                <button onClick={onClose} className="flex-1 min-h-[48px] px-4 py-2 rounded-xl bg-surface-high text-on-surface type-overline touch-target cursor-pointer">Cancel</button>
                <button onClick={handleSubmit} className="flex-1 min-h-[48px] px-4 py-2 rounded-xl bg-primary-container text-on-primary font-bold type-overline touch-target cursor-pointer">Log Entry</button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReflectionModal;
