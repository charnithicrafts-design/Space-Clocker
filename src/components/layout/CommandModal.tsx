import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Rocket } from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';

interface CommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (value: string) => Promise<void>;
  title: string;
  placeholder: string;
  icon?: React.ElementType;
}

const CommandModal: React.FC<CommandModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  placeholder,
  icon: Icon = Rocket 
}) => {
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValue('');
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit(value);
      SoundManager.playSwell();
      onClose();
    } catch (error) {
      console.error('Command execution failed:', error);
      SoundManager.playThud();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="modal-backdrop bg-surface-lowest/90 backdrop-blur-md z-[100]"
        >
          <div className="modal-center-frame">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-dialog-scroll glass-panel border-2 border-primary/20 p-6 sm:p-8 max-w-lg shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.1)]"
            >
              <div className="flex justify-between items-start gap-4 mb-6">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                    <Icon size={24} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="type-title-2 font-black text-on-surface uppercase tracking-tighter">{title}</h2>
                    <p className="type-overline text-on-surface-variant font-black tracking-[0.2em]">Input Required</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  aria-label="Close modal"
                  className="touch-target-compact shrink-0 p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-high rounded-full transition-all flex items-center justify-center cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative group">
                  <input
                    autoFocus
                    className="w-full bg-surface-high/50 border-2 border-outline-variant rounded-2xl p-4 text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-all pr-16"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    disabled={isSubmitting}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                     <div className={`type-telemetry-micro ${value.length > 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
                       {value.length}/50
                     </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-4 pt-2">
                  <button 
                    type="button"
                    onClick={onClose} 
                    className="flex-1 min-h-[48px] px-4 py-2 rounded-2xl bg-surface-high text-on-surface-variant font-bold uppercase tracking-widest type-overline hover:text-on-surface transition-all touch-target cursor-pointer"
                  >
                    Abort Mission Now
                  </button>
                  <button 
                    type="submit"
                    disabled={!value.trim() || isSubmitting}
                    className="flex-[2] min-h-[48px] px-6 py-2 rounded-2xl bg-primary-container text-on-primary font-black uppercase tracking-[0.2em] type-overline shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2 touch-target cursor-pointer"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={16} />
                        Execute Uplink
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandModal;
