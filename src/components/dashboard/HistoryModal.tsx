import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Save, Star, AlertCircle } from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';
import { getTodayLocalISO } from '../../utils/DateTimeUtils';
import { HistoricalEvent } from '../../store/useTrackStore';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Omit<HistoricalEvent, 'id'>) => Promise<void>;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(getTodayLocalISO());
  const [type, setType] = useState<HistoricalEvent['type']>('success');
  const [category, setCategory] = useState<HistoricalEvent['category']>('project');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        title,
        date,
        type,
        category,
        description,
        skills: skills.split(',').map(s => s.trim()).filter(Boolean)
      });
      SoundManager.playSwell();
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
      setSkills('');
    } catch (error) {
      console.error('History logging failed:', error);
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
            className="glass-panel border-2 border-primary/20 p-8 rounded-[2.5rem] w-full max-w-xl shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.1)] overflow-y-auto max-h-[90vh]"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                  <Trophy size={24} />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-black text-white uppercase tracking-tighter">Log Mission Record</h2>
                  <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-[0.2em]">Historical Data Archive</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-white hover:bg-surface-high rounded-full transition-all">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Mission Title</label>
                  <input
                    autoFocus
                    className="w-full bg-surface-high/50 border-2 border-outline-variant rounded-2xl p-4 text-white placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-all"
                    placeholder="e.g. Google Summer of Code"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Stellar Date</label>
                  <input
                    type="date"
                    className="w-full bg-surface-high/50 border-2 border-outline-variant rounded-2xl p-4 text-white focus:border-primary focus:outline-none transition-all"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Mission Category</label>
                  <select
                    className="w-full bg-surface-high/50 border-2 border-outline-variant rounded-2xl p-4 text-white focus:border-primary focus:outline-none transition-all appearance-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                  >
                    <option value="internship">Internship</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="certification">Certification</option>
                    <option value="academic">Academic Achievement</option>
                    <option value="project">Stellar Project</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Mission Outcome</label>
                  <div className="flex gap-2 p-1 bg-surface-high/50 border-2 border-outline-variant rounded-2xl">
                    {(['success', 'missed', 'failed'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          type === t 
                            ? t === 'success' ? 'bg-success text-on-success shadow-lg shadow-success/20' : t === 'missed' ? 'bg-warning text-on-warning shadow-lg shadow-warning/20' : 'bg-error text-on-error shadow-lg shadow-error/20'
                            : 'text-on-surface-variant hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Mission Log (Description)</label>
                <textarea
                  className="w-full bg-surface-high/50 border-2 border-outline-variant rounded-2xl p-4 text-white placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-all min-h-[100px]"
                  placeholder="Summarize the key events of this mission..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1">Linked Skills (Comma separated)</label>
                <input
                  className="w-full bg-surface-high/50 border-2 border-outline-variant rounded-2xl p-4 text-white placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-all"
                  placeholder="React, TypeScript, Orbital Mechanics..."
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={onClose} className="flex-1 p-4 rounded-2xl bg-surface-high text-on-surface-variant font-bold uppercase tracking-widest text-xs hover:text-white transition-all">
                  Abort Logging
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting || !title}
                  className="flex-[2] p-4 rounded-2xl bg-primary-container text-on-primary font-black uppercase tracking-[0.2em] text-xs shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" /> : <><Save size={16} /> Archive Record</>}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HistoryModal;
