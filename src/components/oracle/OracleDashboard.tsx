import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { OracleService } from '../../services/OracleService';
import { SoundManager } from '../../utils/SoundManager';
import { Sparkles, Brain, X, Send, Cpu, Zap, History, Target } from 'lucide-react';

interface OracleDashboardProps {
  onClose: () => void;
}

export const OracleDashboard = ({ onClose }: OracleDashboardProps) => {
  const { oracleConfig, addOracleLog, reflections, tasks, stats } = useTrackStore();
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'consult' | 'history'>('consult');

  const handleQuery = async () => {
    if (!prompt.trim() || !oracleConfig.apiKey) return;
    setLoading(true);
    SoundManager.playSwell();
    try {
      const response = await OracleService.query(oracleConfig, prompt, JSON.stringify({ reflections, tasks }));
      await addOracleLog(prompt, response);
      setPrompt('');
      SoundManager.playSyncSuccess();
    } catch (error) {
      console.error(error);
      SoundManager.playThud();
    } finally {
      setLoading(false);
    }
  };

  const handleDebrief = async () => {
    if (!oracleConfig.apiKey) return;
    setLoading(true);
    SoundManager.playSwell();
    try {
      const response = await OracleService.getDailyDebrief(oracleConfig, tasks, reflections, stats);
      await addOracleLog('Daily Debrief', response);
      SoundManager.playSyncSuccess();
    } catch (error) {
      console.error(error);
      SoundManager.playThud();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[#050508]/90 backdrop-blur-xl"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 glass-panel border border-primary/30 rounded-[2.5rem] flex flex-col"
      >
        <div className="p-8 border-b border-outline-variant flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center text-primary border border-primary/30 shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.3)]">
              <Sparkles size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-tight">The Oracle</h2>
              <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Neural Resonance Matrix Active</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-3 rounded-full hover:bg-surface-high border border-outline-variant text-on-surface-variant hover:text-error transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
          {!oracleConfig.apiKey ? (
            <div className="py-12 text-center space-y-4">
              <div className="inline-flex p-4 rounded-3xl bg-error/10 text-error border border-error/20 mb-4">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-display font-black text-white uppercase tracking-tight">Neural Link Severed</h3>
              <p className="text-on-surface-variant text-sm max-w-sm mx-auto">
                No Oracle API key detected. Please initialize your credentials in the System Config sector to enable neural resonance.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain size={16} className="text-secondary" />
                  <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Consultation Parameter</h4>
                </div>
                <div className="relative">
                  <textarea
                    className="w-full h-32 bg-surface-high px-6 py-4 rounded-3xl border border-outline-variant focus:border-primary focus:outline-none text-sm text-white transition-all placeholder:text-on-surface-variant/50 no-scrollbar"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask the Oracle for wisdom regarding your trajectory, skill gaps, or mission alignment..."
                  />
                  <div className="absolute bottom-4 right-4 text-[10px] font-mono text-on-surface-variant/30">
                    Neural Ready
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleQuery}
                  disabled={loading || !prompt.trim()}
                  className="flex items-center justify-center gap-3 py-4 bg-primary text-on-primary rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30"
                >
                  <Send size={18} className={loading ? 'animate-pulse' : ''} />
                  <span>{loading ? 'Consulting...' : 'Initiate Query'}</span>
                </button>
                <button
                  onClick={handleDebrief}
                  disabled={loading}
                  className="flex items-center justify-center gap-3 py-4 bg-surface-high border border-outline-variant text-white rounded-2xl font-black uppercase tracking-widest hover:border-secondary hover:text-secondary transition-all disabled:opacity-30"
                >
                  <History size={18} className={loading ? 'animate-pulse' : ''} />
                  <span>{loading ? 'Consulting...' : 'Daily Debrief'}</span>
                </button>
              </div>

              <div className="pt-6 border-t border-outline-variant">
                <div className="flex items-center gap-2 mb-4">
                  <Target size={16} className="text-magenta" />
                  <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Neural Resonance Logs</h4>
                </div>
                {/* Add Oracle Logs mapping here once added to store */}
                <div className="p-6 rounded-3xl bg-surface-low border border-outline-variant border-dashed text-center">
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] italic font-medium">
                    Select a consultation parameter to view results.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-6 bg-surface-high/30 border-t border-outline-variant flex justify-center">
          <div className="flex items-center gap-3 text-on-surface-variant">
            <Cpu size={14} className="text-secondary" />
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">Neural Connection Secured via Chronos Core</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
