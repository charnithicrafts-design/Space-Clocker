import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, ShieldCheck } from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = "Confirm Extraction",
  cancelText = "Keep Mission",
  variant = 'danger'
}) => {
  const handleConfirm = () => {
    onConfirm();
    SoundManager.playSwell();
    onClose();
  };

  const handleCancel = () => {
    SoundManager.playThud();
    onClose();
  };

  const isDanger = variant === 'danger';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-surface-lowest/90 backdrop-blur-md flex items-center justify-center p-6 z-[110]"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`glass-panel border-2 ${isDanger ? 'border-error/20' : 'border-primary/20'} p-8 rounded-[2.5rem] w-full max-w-md shadow-[0_0_50px_rgba(var(--color-${isDanger ? 'error' : 'primary'}-rgb),0.1)]`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${isDanger ? 'bg-error/10 text-error border-error/20' : 'bg-primary/10 text-primary border-primary/20'} rounded-2xl flex items-center justify-center border`}>
                  {isDanger ? <AlertTriangle size={24} /> : <ShieldCheck size={24} />}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-black text-white uppercase tracking-tighter">{title}</h2>
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Priority Authorization Required</p>
                </div>
              </div>
              <button 
                onClick={handleCancel}
                className="p-2 text-on-surface-variant hover:text-white hover:bg-surface-high rounded-full transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-8">
              <p className="text-on-surface-variant leading-relaxed font-medium">
                {message}
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleCancel} 
                className="flex-1 p-4 rounded-2xl bg-surface-highest text-white font-bold uppercase tracking-widest text-xs hover:bg-surface-high transition-all border border-outline-variant/30"
              >
                {cancelText}
              </button>
              <button 
                onClick={handleConfirm}
                className={`flex-[1.5] p-4 rounded-2xl ${isDanger ? 'bg-error-container text-on-error' : 'bg-primary-container text-on-primary'} font-black uppercase tracking-[0.2em] text-xs shadow-lg ${isDanger ? 'shadow-error/20 hover:shadow-error/40' : 'shadow-primary/20 hover:shadow-primary/40'} hover:scale-[1.02] active:scale-95 transition-all`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
