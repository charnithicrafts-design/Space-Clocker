import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReactToPrint } from 'react-to-print';
import { 
  Signal, 
  Plus, 
  History, 
  FileText, 
  Trash2,
  Download,
  Share2,
  Radar,
  Activity,
  AlertTriangle,
  Clock,
  Target
} from 'lucide-react';
import { useTrackStore, Transmission } from '../../store/useTrackStore';
import { generateShareLink } from '../../utils/TransmissionExporter';

const TransmissionDashboard = () => {
  const { transmissions, generateTransmission, deleteTransmission } = useTrackStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTx, setSelectedTx] = useState<Transmission | null>(null);
  const [viewMode, setViewMode] = useState<'glossy' | 'raw'>('glossy');
  const [shareStatus, setShareStatus] = useState<'idle' | 'copied'>('idle');

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: selectedTx ? `${selectedTx.id}_BRIEFING` : 'TRANSMISSION',
  });

  const handleShare = () => {
    if (selectedTx) {
      const link = generateShareLink(selectedTx);
      navigator.clipboard.writeText(link);
      setShareStatus('copied');
      setTimeout(() => setShareStatus('idle'), 2000);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' });
    } catch (e) {
      return dateStr;
    }
  };

  const formatFullDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString(undefined, { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Form state for generation
  const [newTxTitle, setNewTxTitle] = useState('');
  const [newTxTier, setNewTxTier] = useState<Transmission['tier']>('daily');
  const [newTxNarrative, setNewTxNarrative] = useState('');
  const [newTxTarget, setNewTxTarget] = useState<'NASA' | 'ISRO' | undefined>();
  const [newTxStartDate, setNewTxStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newTxEndDate, setNewTxEndDate] = useState(new Date().toISOString().split('T')[0]);

  const handleGenerate = async () => {
    await generateTransmission(
      newTxTier, 
      newTxTitle || `${newTxTier.toUpperCase()} Briefing`, 
      newTxNarrative, 
      newTxTarget,
      { start: newTxStartDate, end: newTxEndDate }
    );
    setIsGenerating(false);
    setNewTxTitle('');
    setNewTxNarrative('');
  };

  return (
    <div className="p-6 lg:pl-80 min-h-screen bg-surface-lowest transition-all duration-500 pb-24 lg:pb-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-4xl font-bold text-primary flex items-center gap-3">
            <Signal className="text-secondary" size={36} />
            The Transmission
          </h1>
          <p className="text-on-surface-variant mt-2">Self-reporting & Mission Readiness Briefings</p>
        </div>
        
        <button 
          onClick={() => setIsGenerating(true)}
          aria-label="Initiate new mission briefing"
          className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-2xl font-bold shadow-lg hover:shadow-primary/20 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-lowest outline-none"
        >
          <Plus size={20} aria-hidden="true" />
          Initiate Briefing
        </button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Previous Transmissions List */}
        <nav className="xl:col-span-1 space-y-6" aria-label="Recent transmissions">
          <div className="glass-panel p-6 rounded-3xl border border-outline-variant/30">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <History size={20} className="text-secondary" aria-hidden="true" />
              Recent Uplinks
            </h2>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar" role="list">
              {transmissions.length === 0 ? (
                <div className="text-center py-12 text-on-surface-variant italic">
                  No transmissions archived.
                </div>
              ) : (
                transmissions.map(tx => (
                  <motion.div
                    key={tx.id}
                    role="listitem"
                    tabIndex={0}
                    layoutId={tx.id}
                    onClick={() => setSelectedTx(tx)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedTx(tx)}
                    aria-selected={selectedTx?.id === tx.id}
                    aria-label={`View transmission: ${tx.title} from ${formatDate(tx.timestamp)}`}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group focus-visible:ring-2 focus-visible:ring-secondary outline-none ${
                      selectedTx?.id === tx.id 
                        ? 'bg-secondary/10 border-secondary' 
                        : 'bg-surface-low border-outline-variant/30 hover:border-secondary/50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest ${
                        tx.tier === 'yearly' ? 'bg-primary text-on-primary' : 
                        tx.tier === 'quarterly' ? 'bg-secondary text-on-secondary' : 
                        'bg-surface-high text-on-surface'
                      }`}>
                        {tx.tier}
                      </span>
                      <span className="text-[10px] text-on-surface-variant font-mono">
                        {formatDate(tx.timestamp)}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm truncate group-hover:text-secondary transition-colors">{tx.title}</h3>
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-on-surface-variant">
                      <span className="flex items-center gap-1"><Activity size={10}/> {tx.rawLogs.tasksCompleted}/{tx.rawLogs.totalTasks}</span>
                      {tx.metadata.targetOrg && (
                        <span className="flex items-center gap-1 text-primary"><Radar size={10}/> {tx.metadata.targetOrg}</span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* The Holo-Viewer (Report Content) */}
        <div className="xl:col-span-2">
          <AnimatePresence mode="wait">
            {selectedTx ? (
              <motion.div
                key={selectedTx.id}
                ref={contentRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-panel p-8 rounded-[2.5rem] border border-outline-variant/30 min-h-[70vh] flex flex-col"
              >
                <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                       <h2 className="text-3xl font-bold">{selectedTx.title}</h2>
                       <div className="px-3 py-1 bg-surface-high rounded-full text-[10px] font-mono border border-outline-variant/30">
                         {selectedTx.id}
                       </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-on-surface-variant font-medium">Transmission Date: {formatFullDate(selectedTx.timestamp)}</p>
                      {selectedTx.startDate && selectedTx.endDate && (
                        <p className="text-primary text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                          <Clock size={12} />
                          Mission Chronometer: {formatDate(selectedTx.startDate)} — {formatDate(selectedTx.endDate)}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 bg-surface-low p-1.5 rounded-2xl border border-outline-variant/30 no-print">
                    <button 
                      onClick={() => setViewMode('glossy')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'glossy' ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                      Glossy
                    </button>
                    <button 
                      onClick={() => setViewMode('raw')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === 'raw' ? 'bg-surface-high text-primary' : 'text-on-surface-variant hover:text-primary'}`}
                    >
                      Raw Data
                    </button>
                  </div>
                </div>

                <div className="flex-1">
                  {viewMode === 'glossy' ? (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      {/* PD&A */}
                      <section className="bg-surface-low/50 p-6 rounded-3xl border border-outline-variant/20">
                        <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-primary">
                          <FileText size={18} />
                          Pilot's Discussion & Analysis
                        </h3>
                        <p className="text-on-surface leading-relaxed italic">
                          "{selectedTx.pdaNarrative || 'No narrative provided for this transmission.'}"
                        </p>
                        <div className="mt-4 space-y-2">
                          {selectedTx.pdaReflections.map((ref, i) => (
                            <div key={i} className="text-xs text-on-surface-variant pl-4 border-l-2 border-secondary/30 py-1">
                              {ref}
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Mission Metrics: Accomplished vs Missed */}
                      {selectedTx.missionMetrics && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <section className="bg-primary/5 p-6 rounded-3xl border border-primary/20">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-primary flex items-center gap-2">
                              <Target size={16} />
                              Mission Accomplished
                            </h3>
                            <div className="space-y-2">
                              {selectedTx.missionMetrics.accomplished.length > 0 ? (
                                selectedTx.missionMetrics.accomplished.map(m => (
                                  <div key={m.id} className="flex justify-between items-center text-xs p-2 bg-surface-lowest/50 rounded-lg">
                                    <span className="font-medium">{m.title}</span>
                                    <span className="text-primary font-bold">+{m.weightage} XP</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-[10px] text-on-surface-variant italic">No objectives secured in this range.</p>
                              )}
                            </div>
                          </section>
                          <section className="bg-error/5 p-6 rounded-3xl border border-error/20">
                            <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-error flex items-center gap-2">
                              <AlertTriangle size={16} />
                              Mission Missed
                            </h3>
                            <div className="space-y-2">
                              {selectedTx.missionMetrics.missed.length > 0 ? (
                                selectedTx.missionMetrics.missed.map(m => (
                                  <div key={m.id} className="flex justify-between items-center text-xs p-2 bg-surface-lowest/50 rounded-lg opacity-70">
                                    <span className="font-medium">{m.title}</span>
                                    <span className="text-error font-bold">-{m.weightage} XP</span>
                                  </div>
                                ))
                              ) : (
                                <p className="text-[10px] text-on-surface-variant italic">Zero deviations recorded.</p>
                              )}
                            </div>
                          </section>
                        </div>
                      )}

                      {/* Analysis Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Void Analysis */}
                        <section className="bg-surface-low/50 p-6 rounded-3xl border border-outline-variant/20">
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-error">
                            <AlertTriangle size={18} />
                            The Void Analysis
                          </h3>
                          <div className="space-y-4">
                            {selectedTx.voidAnalysis.map((v, i) => (
                              <div key={i} className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm font-medium">{v.text}</p>
                                  <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{v.impact} Risk</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-display font-bold text-error">{v.count}</p>
                                  <p className="text-[8px] text-on-surface-variant uppercase">Engagements</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>

                        {/* Skills Reconciliation */}
                        <section className="bg-surface-low/50 p-6 rounded-3xl border border-outline-variant/20">
                          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-success">
                            <Radar size={18} />
                            Skills Reconciliation
                          </h3>
                          <div className="space-y-4">
                            {selectedTx.skillsReconciliation.map((s, i) => (
                              <div key={i} className="space-y-1">
                                <div className="flex justify-between text-xs">
                                  <span className="font-medium">{s.name}</span>
                                  <span className="text-success font-bold">+{s.delta}%</span>
                                </div>
                                <div className="h-1.5 bg-surface-high rounded-full overflow-hidden">
                                  <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${s.current}%` }}
                                    className="h-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>

                      {/* Metadata / Clearances */}
                      <div className="flex flex-wrap gap-4 mt-8">
                         <div className="flex items-center gap-3 px-5 py-3 bg-primary/5 border border-primary/20 rounded-2xl">
                           <Radar size={20} className="text-primary" />
                           <div>
                             <p className="text-[10px] uppercase font-black text-primary/70">Target Agency</p>
                             <p className="font-bold">{selectedTx.metadata.targetOrg || 'General Mission'}</p>
                           </div>
                         </div>
                         <div className="flex items-center gap-3 px-5 py-3 bg-secondary/5 border border-secondary/20 rounded-2xl">
                           <Activity size={20} className="text-secondary" />
                           <div>
                             <p className="text-[10px] uppercase font-black text-secondary/70">Reliability Index</p>
                             <p className="font-bold">{selectedTx.rawLogs.totalTasks > 0 ? Math.round((selectedTx.rawLogs.tasksCompleted / selectedTx.rawLogs.totalTasks) * 100) : 0}%</p>
                           </div>
                         </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-surface-lowest p-6 rounded-3xl border border-outline-variant/30 font-mono text-xs overflow-auto max-h-[50vh] custom-scrollbar">
                      <div className="text-primary mb-4 flex items-center gap-2">
                        <Activity size={14} />
                        SYSTEM_AUDIT_LOG v4.2
                      </div>
                      <pre className="text-on-surface-variant">
                        {JSON.stringify(selectedTx, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="mt-12 flex justify-between items-center pt-8 border-t border-outline-variant/20 no-print">
                  <button 
                    onClick={() => {
                      if (confirm('Declassify and delete this transmission permanently?')) {
                        deleteTransmission(selectedTx.id);
                        setSelectedTx(null);
                      }
                    }}
                    title="Declassify and delete transmission"
                    aria-label="Declassify and delete this transmission"
                    className="p-3 text-on-surface-variant hover:text-error hover:bg-error/10 rounded-xl transition-all focus-visible:ring-2 focus-visible:ring-error outline-none"
                  >
                    <Trash2 size={20} aria-hidden="true" />
                  </button>
                  
                  <div className="flex gap-4">
                     <button 
                      onClick={handleShare}
                      aria-label="Copy shareable signal link to clipboard"
                      className="flex items-center gap-2 px-5 py-2.5 bg-surface-high rounded-xl text-sm font-bold hover:text-primary transition-all focus-visible:ring-2 focus-visible:ring-primary outline-none"
                     >
                       <Share2 size={18} aria-hidden="true" />
                       {shareStatus === 'copied' ? 'Signal Copied' : 'Share Signal'}
                     </button>
                     <button 
                      onClick={() => handlePrint()}
                      aria-label="Export briefing as PDF for offline viewing"
                      className="flex items-center gap-2 px-6 py-2.5 bg-secondary text-on-secondary rounded-xl text-sm font-bold shadow-lg shadow-secondary/20 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-secondary outline-none"
                     >
                       <Download size={18} aria-hidden="true" />
                       Export PDF
                     </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[70vh] glass-panel rounded-[2.5rem] border border-outline-variant/10 text-on-surface-variant">
                <div className="relative mb-6">
                  <Signal size={64} className="opacity-10" />
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-primary rounded-full blur-2xl"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">Holo-Viewer Standby</h3>
                <p>Select a transmission to decrypt and view briefing data.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Generation Modal */}
      <AnimatePresence>
        {isGenerating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsGenerating(false)}
              className="absolute inset-0 bg-surface-lowest/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl glass-panel p-8 rounded-[2.5rem] border border-outline-variant/30 shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Plus className="text-primary" />
                Initiate New Transmission
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="tx-tier" className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Transmission Tier</label>
                    <select 
                      id="tx-tier"
                      value={newTxTier}
                      onChange={(e) => setNewTxTier(e.target.value as any)}
                      className="w-full bg-surface-low border border-outline-variant/30 rounded-2xl p-3 outline-none focus:border-primary transition-all"
                    >
                      <option value="daily">Daily Mission Log</option>
                      <option value="weekly">Weekly Orbit Review</option>
                      <option value="quarterly">Quarterly Sector Update</option>
                      <option value="yearly">Stellar Annual Report</option>
                      <option value="milestone">Achievement Packet</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tx-target" className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Target Agency</label>
                    <select 
                      id="tx-target"
                      value={newTxTarget || ''}
                      onChange={(e) => setNewTxTarget(e.target.value as any || undefined)}
                      className="w-full bg-surface-low border border-outline-variant/30 rounded-2xl p-3 outline-none focus:border-primary transition-all"
                    >
                      <option value="">None (Standard)</option>
                      <option value="NASA">NASA</option>
                      <option value="ISRO">ISRO</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="tx-start" className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Mission Start</label>
                    <input 
                      id="tx-start"
                      type="date"
                      value={newTxStartDate}
                      onChange={(e) => setNewTxStartDate(e.target.value)}
                      className="w-full bg-surface-low border border-outline-variant/30 rounded-2xl p-3 outline-none focus:border-primary transition-all text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="tx-end" className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Mission End</label>
                    <input 
                      id="tx-end"
                      type="date"
                      value={newTxEndDate}
                      onChange={(e) => setNewTxEndDate(e.target.value)}
                      className="w-full bg-surface-low border border-outline-variant/30 rounded-2xl p-3 outline-none focus:border-primary transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="tx-title" className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Briefing Title</label>
                  <input 
                    id="tx-title"
                    type="text"
                    value={newTxTitle}
                    onChange={(e) => setNewTxTitle(e.target.value)}
                    placeholder="e.g., Q1 Trajectory Analysis"
                    className="w-full bg-surface-low border border-outline-variant/30 rounded-2xl p-3 outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="tx-narrative" className="text-xs font-black uppercase tracking-widest text-on-surface-variant">PD&A Narrative</label>
                  <textarea 
                    id="tx-narrative"
                    value={newTxNarrative}
                    onChange={(e) => setNewTxNarrative(e.target.value)}
                    placeholder="Reflect on your performance, challenges, and mission realignment..."
                    rows={4}
                    className="w-full bg-surface-low border border-outline-variant/30 rounded-2xl p-3 outline-none focus:border-primary transition-all resize-none"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button 
                  onClick={() => setIsGenerating(false)}
                  className="px-6 py-3 rounded-2xl font-bold hover:bg-surface-high transition-all"
                >
                  Abort
                </button>
                <button 
                  onClick={handleGenerate}
                  className="px-8 py-3 bg-primary text-on-primary rounded-2xl font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                >
                  Uplink Transmission
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransmissionDashboard;
