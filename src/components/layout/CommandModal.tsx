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
          className="fixed inset-0 bg-surface-lowest/90 backdrop-blur-md flex items-center justify-center p-6 z-[100]"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-panel border-2 border-primary/20 p-8 rounded-[2.5rem] w-full max-w-lg shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.1)]"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                  <Icon size={24} />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-black text-white uppercase tracking-tighter">{title}</h2>
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Input Required</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-on-surface-variant hover:text-white hover:bg-surface-high rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative group">
                <input
                  autoFocus
                  className="w-full bg-surface-high/50 border-2 border-outline-variant rounded-2xl p-5 text-white placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-all pr-16"
                  placeholder={placeholder}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  disabled={isSubmitting}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                   <div className={`text-[10px] font-mono ${value.length > 0 ? 'text-primary' : 'text-on-surface-variant'}`}>
                     {value.length}/50
                   </div>
                </div>
              </div>

              <div className="flex gap-4 pt-2">
                <button 
                  type="button"
                  onClick={onClose} 
                  className="flex-1 p-4 rounded-2xl bg-surface-high text-on-surface-variant font-bold uppercase tracking-widest text-xs hover:text-white transition-all"
                >
                  Abord Mission Now
                </button>
                <button 
                  type="submit"
                  disabled={!value.trim() || isSubmitting}
                  className="flex-[2] p-4 rounded-2xl bg-primary-container text-on-primary font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:grayscale transition-all flex items-center justify-center gap-2"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandModal;
