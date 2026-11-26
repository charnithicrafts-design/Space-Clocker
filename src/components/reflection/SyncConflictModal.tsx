import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCcw, ArrowRight, X } from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';

interface SyncConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (strategy: 'local' | 'remote') => void;
  remoteDate?: string;
}

const SyncConflictModal: React.FC<SyncConflictModalProps> = ({ isOpen, onClose, onResolve, remoteDate }) => {
  React.useEffect(() => {
    if (isOpen) {
      SoundManager.playSwell();
    }
  }, [isOpen]);

  const handleResolve = (strategy: 'local' | 'remote') => {
    if (strategy === 'remote') {
      SoundManager.playUplink();
    } else {
      SoundManager.playPop();
    }
    onResolve(strategy);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="modal-backdrop z-[100] bg-surface-lowest/85 backdrop-blur-xl"
          onClick={onClose}
        >
          <div className="modal-center-frame">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-dialog-scroll relative glass-panel border border-warning/30 p-6 sm:p-8 max-w-lg shadow-2xl"
            >
              {/* Background Glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-warning/20 blur-[100px] rounded-full pointer-events-none" />
              
              <header className="relative flex items-center gap-4 mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 shrink-0 bg-warning/10 rounded-2xl flex items-center justify-center text-warning border border-warning/20">
                  <AlertTriangle size={28} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-secondary type-overline font-bold tracking-widest">Temporal Divergence</h2>
                  <h1 className="type-title-1 font-black text-on-surface">Rift Detected</h1>
                </div>
                <button 
                  onClick={onClose}
                  aria-label="Close"
                  className="touch-target-compact ml-auto p-2 text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center rounded-full shrink-0 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </header>

              <div className="relative space-y-6">
                <p className="text-on-surface-variant leading-relaxed">
                  A newer version of your trajectory was found in the Nebula. Continuing without resolution may cause a permanent split in your timeline.
                </p>

                <div className="p-4 sm:p-6 rounded-2xl bg-surface-high border border-outline-variant space-y-4">
                  <div className="flex items-center justify-between type-overline font-bold tracking-widest">
                    <span className="text-on-surface-variant">Local Timeline</span>
                    <span className="text-secondary">Remote Timeline</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="text-on-surface">Current Device</div>
                    <ArrowRight className="text-on-surface-variant" size={16} />
                    <div className="text-secondary font-mono type-body-sm">
                      {remoteDate ? new Date(remoteDate).toLocaleString() : 'Recent Uplink'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <button 
                    onClick={() => handleResolve('remote')}
                    className="touch-target min-h-[48px] flex items-center justify-between px-4 py-3 rounded-2xl bg-secondary text-on-secondary font-black uppercase tracking-tighter hover:shadow-[0_0_20px_rgba(var(--color-secondary-rgb),0.3)] transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                      <span>Adopt Remote Timeline</span>
                    </div>
                  </button>
                  
                  <button 
                    onClick={() => handleResolve('local')}
                    className="touch-target min-h-[48px] flex items-center justify-between px-4 py-3 rounded-2xl border border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-on-surface/30 transition-all font-bold uppercase type-overline tracking-widest cursor-pointer"
                  >
                    <span>Stay in Local Trajectory</span>
                  </button>
                </div>
              </div>

              <footer className="mt-6 pt-6 border-t border-outline-variant flex items-center gap-2 type-overline text-on-surface-variant tracking-widest font-bold">
                <RefreshCcw size={12} className="animate-spin-slow shrink-0" />
                Neural Link Status: Syncing telemetry...
              </footer>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SyncConflictModal;
