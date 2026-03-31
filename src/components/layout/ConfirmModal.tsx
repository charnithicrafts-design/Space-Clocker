import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

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

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-surface-lowest/95 backdrop-blur-md flex items-center justify-center p-6 z-[9999]"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`glass-panel border-2 ${isDanger ? 'border-error/30' : 'border-primary/30'} p-8 rounded-[2.5rem] w-full max-w-md shadow-[0_0_80px_rgba(0,0,0,0.5)]`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${isDanger ? 'bg-error/20 text-error border-error/30' : 'bg-primary/20 text-primary border-primary/30'} rounded-2xl flex items-center justify-center border shadow-inner`}>
                  {isDanger ? <AlertTriangle size={24} /> : <ShieldCheck size={24} />}
                </div>
                <div>
                  <h2 className="font-display text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">{title}</h2>
                  <p className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em]">Priority Authorization Required</p>
                </div>
              </div>
              <button 
                onClick={handleCancel}
                className="p-2 text-on-surface-variant hover:text-white hover:bg-surface-high rounded-full transition-all"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="mb-8">
              <p className="text-on-surface font-medium leading-relaxed">
                {message}
              </p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleCancel} 
                className="flex-1 p-4 rounded-2xl bg-surface-high text-white font-bold uppercase tracking-widest text-xs hover:bg-surface-highest transition-all border border-outline/30 hover:border-outline/60"
              >
                {cancelText}
              </button>
              <button 
                onClick={handleConfirm}
                className={`flex-[1.5] p-4 rounded-2xl ${isDanger ? 'bg-error text-surface-lowest' : 'bg-primary-container text-surface-lowest'} font-black uppercase tracking-[0.2em] text-xs shadow-lg ${isDanger ? 'shadow-error/20 hover:shadow-error/40' : 'shadow-primary/20 hover:shadow-primary/40'} hover:scale-[1.02] active:scale-95 transition-all`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default ConfirmModal;
