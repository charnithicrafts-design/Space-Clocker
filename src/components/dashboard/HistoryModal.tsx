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
          onClick={onClose}
          className="modal-backdrop bg-surface-lowest/90 backdrop-blur-md z-[100]"
        >
          <div className="modal-center-frame">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="modal-dialog glass-panel border-2 border-primary/20 max-w-xl shadow-[0_0_50px_rgba(var(--color-primary-rgb),0.1)]"
            >
              <div className="flex justify-between items-start gap-4 p-4 sm:p-6 border-b border-outline-variant/20 shrink-0">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                    <Trophy size={24} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="type-title-2 font-black text-on-surface uppercase tracking-tighter">Log Mission Record</h2>
                    <p className="type-overline text-on-surface-variant font-black tracking-[0.2em]">Historical Data Archive</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close modal"
                  className="touch-target-compact p-2 text-on-surface-variant hover:text-on-surface hover:bg-surface-high rounded-full transition-all flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-body-scroll p-4 sm:p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="type-overline font-black text-on-surface-variant tracking-widest ml-1">Mission Title</label>
                    <input
                      autoFocus
                      className="w-full bg-surface-high/50 border-2 border-outline-variant rounded-2xl p-4 text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-all"
                      placeholder="e.g. Google Summer of Code"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="type-overline font-black text-on-surface-variant tracking-widest ml-1">Stellar Date</label>
                    <input
                      type="date"
                      className="w-full bg-surface-high/50 border-2 border-outline-variant rounded-2xl p-4 text-on-surface focus:border-primary focus:outline-none transition-all"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="type-overline font-black text-on-surface-variant tracking-widest ml-1">Mission Category</label>
                    <select
                      className="w-full bg-surface-high/50 border-2 border-outline-variant rounded-2xl p-4 text-on-surface focus:border-primary focus:outline-none transition-all appearance-none"
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
                    <label className="type-overline font-black text-on-surface-variant tracking-widest ml-1">Mission Outcome</label>
                    <div className="flex gap-2 p-1 bg-surface-high/50 border-2 border-outline-variant rounded-2xl">
                      {(['success', 'missed', 'failed'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setType(t)}
                          className={`flex-1 min-h-[40px] py-2 rounded-xl type-overline font-black tracking-widest transition-all cursor-pointer ${
                            type === t 
                              ? t === 'success' ? 'bg-success text-on-success shadow-lg shadow-success/20' : t === 'missed' ? 'bg-warning text-on-warning shadow-lg shadow-warning/20' : 'bg-error text-on-error shadow-lg shadow-error/20'
                              : 'text-on-surface-variant hover:text-on-surface'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="type-overline font-black text-on-surface-variant tracking-widest ml-1">Mission Log (Description)</label>
                  <textarea
                    className="w-full bg-surface-high/50 border-2 border-outline-variant rounded-2xl p-4 text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-all min-h-[96px]"
                    placeholder="Summarize the key events of this mission..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="type-overline font-black text-on-surface-variant tracking-widest ml-1">Linked Skills (Comma separated)</label>
                  <input
                    className="w-full bg-surface-high/50 border-2 border-outline-variant rounded-2xl p-4 text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none transition-all"
                    placeholder="React, TypeScript, Orbital Mechanics..."
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-4 pt-2">
                  <button type="button" onClick={onClose} className="flex-1 min-h-[48px] px-4 py-2 rounded-2xl bg-surface-high text-on-surface-variant font-bold uppercase tracking-widest type-overline hover:text-on-surface transition-all touch-target cursor-pointer">
                    Abort Logging
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting || !title}
                    className="flex-[2] min-h-[48px] px-6 py-2 rounded-2xl bg-primary-container text-on-primary font-black uppercase tracking-[0.2em] type-overline shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 touch-target cursor-pointer"
                  >
                    {isSubmitting ? <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin" /> : <><Save size={16} /> Archive Record</>}
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

export default HistoryModal;
