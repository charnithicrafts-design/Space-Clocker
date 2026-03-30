import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VoidTask from './VoidTask';
import { useTrackStore } from '../../store/useTrackStore';
import { Plus, ShieldAlert, Sparkles, X } from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';

const VoidList: React.FC = () => {
  const { voids, addVoidTask } = useTrackStore();
  const [isAdding, setIsHubOpen] = useState(false);
  const [newText, setNewText] = useState('');
  const [newMax, setNewMax] = useState(3);
  const [newImpact, setNewImpact] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    
    await addVoidTask(newText, newImpact, newMax);
    SoundManager.playPop();
    setNewText('');
    setIsHubOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center px-2">
        <div className="flex items-center gap-3">
          <ShieldAlert className="text-error" size={24} />
          <h2 className="font-display text-2xl font-black text-white uppercase tracking-tight">Void Protocol</h2>
        </div>
        <button 
          onClick={() => setIsHubOpen(!isAdding)}
          className="p-2 px-4 bg-error/10 border border-error/30 text-error rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-error/20 transition-all flex items-center gap-2"
        >
          {isAdding ? <X size={14} /> : <Plus size={14} />}
          {isAdding ? 'Cancel' : 'Initialize Void'}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="glass-panel border border-error/30 p-6 rounded-3xl space-y-4 mb-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Negative Trajectory Description</label>
                <input 
                  autoFocus
                  className="w-full bg-surface-high px-6 py-4 rounded-2xl border border-outline-variant focus:border-error focus:outline-none text-sm transition-all"
                  placeholder="e.g., Doomscrolling, Unscheduled Napping..."
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Max Containment</label>
                  <input 
                    type="number"
                    className="w-full bg-surface-high px-6 py-4 rounded-2xl border border-outline-variant focus:border-error focus:outline-none text-sm transition-all"
                    value={newMax}
                    onChange={(e) => setNewMax(parseInt(e.target.value) || 1)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest px-1">Anomaly Impact</label>
                  <select 
                    className="w-full bg-surface-high px-6 py-4 rounded-2xl border border-outline-variant focus:border-error focus:outline-none text-sm transition-all appearance-none"
                    value={newImpact}
                    onChange={(e) => setNewImpact(e.target.value as any)}
                  >
                    <option value="low">Low Impact</option>
                    <option value="medium">Medium Impact</option>
                    <option value="high">High Impact</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-error text-white rounded-2xl font-black uppercase tracking-widest hover:shadow-[0_0_25px_rgba(var(--color-error-rgb),0.4)] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={18} />
                Uplink to Void
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {voids.map((v) => (
          <VoidTask key={v.id} id={v.id} />
        ))}
      </div>

      {voids.length === 0 && !isAdding && (
        <div className="py-20 text-center glass-panel border border-outline-variant border-dashed rounded-3xl opacity-40">
          <div className="text-on-surface-variant font-display font-black text-2xl uppercase italic">No Void Anomalies Detected</div>
          <p className="text-on-surface-variant text-[10px] uppercase tracking-[0.3em] mt-2">Station integrity at 100%.</p>
        </div>
      )}
    </div>
  );
};

export default VoidList;
