import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import { AlertTriangle, Edit3, Trash2, Check, X, ShieldAlert } from 'lucide-react';

const VoidTask: React.FC<{ id: string }> = ({ id }) => {
  const v = useTrackStore((state) => state.voids.find((v) => v.id === id));
  const { engageVoid, updateVoidTask, deleteVoidTask, preferences } = useTrackStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(v?.text || '');
  const [editMax, setEditMax] = useState(v?.maxAllowed || 3);
  const [editImpact, setEditImpact] = useState(v?.impact || 'medium');

  if (!v) return null;

  const handleEngage = () => {
    if (isEditing) return;
    SoundManager.playThud();
    engageVoid(id);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateVoidTask(id, { 
      text: editText, 
      maxAllowed: editMax, 
      impact: editImpact as any 
    });
    SoundManager.playPop();
    setIsEditing(false);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (preferences.confirmDelete && !window.confirm('Exterminate this void anomaly?')) {
      return;
    }
    await deleteVoidTask(id);
    SoundManager.playThud();
  };

  return (
    <motion.div
      layout
      className={`relative group overflow-hidden rounded-2xl border transition-all ${
        v.engagedCount >= v.maxAllowed 
          ? 'bg-error-container/20 border-error shadow-[0_0_20px_rgba(var(--color-error-rgb),0.2)]' 
          : 'bg-surface-high border-outline-variant hover:border-error/40'
      }`}
    >
      <AnimatePresence mode="wait">
        {!isEditing ? (
          <motion.div
            key="view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 flex items-center justify-between gap-4"
          >
            <div 
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={handleEngage}
            >
              <div className={`p-2 rounded-lg ${v.engagedCount >= v.maxAllowed ? 'bg-error text-white' : 'bg-surface-low text-on-surface-variant'}`}>
                <ShieldAlert size={18} />
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-sm ${v.engagedCount >= v.maxAllowed ? 'text-error' : 'text-white'}`}>
                  {v.text}
                </span>
                <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant">
                  Impact: {v.impact}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className={`text-[10px] font-mono font-black ${v.engagedCount >= v.maxAllowed ? 'text-error' : 'text-on-surface-variant'}`}>
                {v.engagedCount} / {v.maxAllowed}
              </span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 hover:bg-surface-low rounded-lg text-on-surface-variant hover:text-primary transition-colors"
                >
                  <Edit3 size={14} />
                </button>
                <button 
                  onClick={handleDelete}
                  className="p-1.5 hover:bg-surface-low rounded-lg text-on-surface-variant hover:text-error transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="edit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSave}
            className="p-4 space-y-3 bg-surface-low"
          >
            <input 
              autoFocus
              className="w-full bg-surface-high px-3 py-2 rounded-xl border border-outline-variant focus:border-primary focus:outline-none text-xs text-white"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <div className="flex gap-2">
              <input 
                type="number"
                className="w-20 bg-surface-high px-3 py-2 rounded-xl border border-outline-variant text-xs"
                value={editMax}
                onChange={(e) => setEditMax(parseInt(e.target.value) || 1)}
              />
              <select 
                className="flex-1 bg-surface-high px-3 py-2 rounded-xl border border-outline-variant text-xs appearance-none"
                value={editImpact}
                onChange={(e) => setEditImpact(e.target.value as any)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button 
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-2 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-white"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="p-2 px-4 bg-primary text-on-primary rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
              >
                <Check size={12} />
                Confirm
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default VoidTask;
