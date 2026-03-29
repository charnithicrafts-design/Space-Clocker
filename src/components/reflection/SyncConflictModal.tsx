import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCcw, ArrowRight, X } from 'lucide-react';

interface SyncConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResolve: (strategy: 'local' | 'remote') => void;
  remoteDate?: string;
}

const SyncConflictModal: React.FC<SyncConflictModalProps> = ({ isOpen, onClose, onResolve, remoteDate }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-surface-lowest/80 backdrop-blur-xl"
            onClick={onClose}
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative glass-panel border border-warning/30 p-8 rounded-[3rem] max-w-lg w-full shadow-2xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-warning/20 blur-[100px] rounded-full" />
            
            <header className="relative flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-warning/10 rounded-2xl flex items-center justify-center text-warning border border-warning/20">
                <AlertTriangle size={32} />
              </div>
              <div>
                <h2 className="text-secondary text-xs font-bold tracking-widest uppercase">Temporal Divergence</h2>
                <h1 className="text-3xl font-display font-black text-white">Rift Detected</h1>
              </div>
              <button 
                onClick={onClose}
                className="ml-auto p-2 text-on-surface-variant hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </header>

            <div className="relative space-y-6">
              <p className="text-on-surface-variant leading-relaxed">
                A newer version of your trajectory was found in the Nebula. Continuing without resolution may cause a permanent split in your timeline.
              </p>

              <div className="p-6 rounded-3xl bg-surface-high border border-outline-variant space-y-4">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-on-surface-variant">Local Timeline</span>
                  <span className="text-secondary">Remote Timeline</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-white">Current Device</div>
                  <ArrowRight className="text-on-surface-variant" size={16} />
                  <div className="text-secondary font-mono">
                    {remoteDate ? new Date(remoteDate).toLocaleString() : 'Recent Uplink'}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-4">
                <button 
                  onClick={() => onResolve('remote')}
                  className="flex items-center justify-between p-4 rounded-2xl bg-secondary text-on-secondary font-black uppercase tracking-tighter hover:shadow-[0_0_20px_rgba(var(--color-secondary-rgb),0.3)] transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <RefreshCcw size={20} className="group-hover:rotate-180 transition-transform duration-500" />
                    <span>Adopt Remote Timeline</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => onResolve('local')}
                  className="flex items-center justify-between p-4 rounded-2xl border border-outline-variant text-on-surface-variant hover:text-white hover:border-white/30 transition-all font-bold uppercase text-xs tracking-widest"
                >
                  <span>Stay in Local Trajectory</span>
                </button>
              </div>
            </div>

            <footer className="mt-8 pt-6 border-t border-outline-variant flex items-center gap-2 text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
              <RefreshCcw size={12} className="animate-spin-slow" />
              Neural Link Status: Syncing telemetry...
            </footer>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default SyncConflictModal;
