import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Signal, FileText, AlertTriangle, Radar, Activity, Download } from 'lucide-react';
import { Transmission } from '../../store/useTrackStore';
import { parseShareLink } from '../../utils/TransmissionExporter';
import { useReactToPrint } from 'react-to-print';

const SharedTransmission = () => {
  const location = useLocation();
  const [transmission, setTransmission] = useState<Transmission | null>(null);
  const [error, setError] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: transmission ? `SHARED_${transmission.id}` : 'TRANSMISSION',
  });

  useEffect(() => {
    const hash = location.hash.replace('#', '');
    if (hash) {
      try {
        const data = parseShareLink(hash);
        setTransmission(data);
      } catch (e: any) {
        setError(e.message || 'Corrupt Signal');
      }
    } else {
      setError('NO_SIGNAL: No transmission data found in uplink.');
    }
  }, [location]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface-lowest text-error">
        <AlertTriangle size={64} className="mb-4" />
        <h1 className="text-2xl font-bold mb-2">Transmission Error</h1>
        <p className="text-on-surface-variant">{error}</p>
        <a href="/" className="mt-8 px-6 py-3 bg-surface-high rounded-2xl text-primary font-bold">Return to Base</a>
      </div>
    );
  }

  if (!transmission) return null;

  return (
    <div className="min-h-screen bg-surface-lowest p-6 lg:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-12 no-print">
          <div className="flex items-center gap-3">
             <Signal className="text-primary" size={32} aria-hidden="true" />
             <span className="font-display text-xl font-bold tracking-tight">Space-Clocker <span className="text-secondary">Uplink</span></span>
          </div>
          <button 
            onClick={() => handlePrint()}
            title="Save briefing as PDF"
            aria-label="Save this briefing as a PDF document"
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-on-secondary rounded-2xl font-bold shadow-lg shadow-secondary/20 focus-visible:ring-2 focus-visible:ring-secondary outline-none transition-all active:scale-95"
          >
            <Download size={20} aria-hidden="true" />
            Save Briefing
          </button>
        </header>

        <motion.div 
          ref={contentRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 lg:p-12 rounded-[3rem] border border-outline-variant/30 shadow-2xl bg-surface-lowest"
        >
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-12 border-b border-outline-variant/20 pb-8">
            <div role="presentation">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-primary text-on-primary rounded-lg text-[10px] font-black uppercase tracking-widest">
                  {transmission.tier}
                </span>
                <span className="text-xs font-mono text-on-surface-variant" aria-label={`Transmission ID: ${transmission.id}`}>{transmission.id}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-on-surface">{transmission.title}</h1>
              <p className="text-on-surface-variant mt-2 font-medium">
                <time dateTime={transmission.timestamp}>
                  {new Date(transmission.timestamp).toLocaleString(undefined, { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                  })}
                </time>
              </p>
            </div>

            <div className="flex items-center gap-4">
               <div className="text-center px-6 py-3 bg-surface-low rounded-2xl border border-outline-variant/30">
                 <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Clearance</p>
                 <p className="font-mono text-xs font-bold text-primary">{transmission.metadata.securityClearance}</p>
               </div>
            </div>
          </div>

          <div className="space-y-12">
            {/* PD&A */}
            <section>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                <FileText size={20} />
                Pilot's Discussion & Analysis
              </h2>
              <div className="bg-surface-low/30 p-8 rounded-[2rem] border border-outline-variant/10">
                <p className="text-lg leading-relaxed italic text-on-surface">
                  "{transmission.pdaNarrative}"
                </p>
                {transmission.pdaReflections.length > 0 && (
                  <div className="mt-6 space-y-3">
                    {transmission.pdaReflections.map((ref, i) => (
                      <div key={i} className="text-sm text-on-surface-variant pl-4 border-l-2 border-secondary/30">
                        {ref}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Nebula Achievements */}
            {(transmission.missionMetrics?.milestones || []).length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-secondary">
                  <Radar size={20} />
                  Nebula Accomplishments
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(transmission.missionMetrics.milestones || []).map(m => (
                    <div key={m.id} className="p-4 bg-surface-low/30 rounded-2xl border border-secondary/20">
                      <p className="text-[10px] text-secondary font-black uppercase tracking-widest mb-1">{m.ambitionTitle}</p>
                      <p className="text-lg font-bold">{m.title}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills Reconciliation */}
            {(transmission.skillsReconciliation || []).length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-secondary">
                  <Radar size={20} />
                  Skills & Mastery Shifts
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {transmission.skillsReconciliation.map(s => (
                    <div key={s.skillId} className="p-4 bg-surface-low/30 rounded-2xl border border-outline-variant/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-white">{s.name}</span>
                        <span className={`text-[10px] font-black ${s.delta >= 0 ? 'text-success' : 'text-error'}`}>
                          {s.delta >= 0 ? '+' : ''}{s.delta}%
                        </span>
                      </div>
                      <div className="w-full h-1 bg-surface-high rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-secondary" 
                          style={{ width: `${s.current}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Accomplished Grouped */}
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                  <Activity size={20} />
                  Objectives Secured
                </h2>
                <div className="bg-surface-low/30 p-8 rounded-[2rem] border border-outline-variant/10 space-y-6">
                  {['daily', 'weekly', 'yearly'].map(horizon => {
                    const items = (transmission.missionMetrics?.accomplished || []).filter(t => t.horizon === horizon);
                    if (items.length === 0) return null;
                    return (
                      <div key={horizon} className="space-y-3">
                        <p className="text-xs font-black text-primary/70 uppercase tracking-widest">{horizon} Horizon</p>
                        {items.map(m => (
                          <div key={m.id} className="flex justify-between items-center p-3 bg-surface-lowest/50 rounded-xl border border-primary/10">
                            <span className="font-medium">{m.title}</span>
                            <span className="text-primary font-bold">+{m.weightage} XP</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                  {(transmission.missionMetrics?.accomplished || []).length === 0 && (
                    <p className="text-on-surface-variant italic text-sm">No objectives secured.</p>
                  )}
                </div>
              </section>

              {/* Missed Grouped */}
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-error">
                  <AlertTriangle size={20} />
                  Mission Deviations
                </h2>
                <div className="bg-surface-low/30 p-8 rounded-[2rem] border border-outline-variant/10 space-y-6">
                  {/* Void Analysis */}
                  {(transmission.voidAnalysis || []).length > 0 && (
                    <div className="space-y-3 mb-6">
                      <p className="text-xs font-black text-error/70 uppercase tracking-widest">Void Protocol Engagements</p>
                      {transmission.voidAnalysis.map(v => (
                        <div key={v.voidId} className="flex justify-between items-center p-3 bg-surface-lowest/50 rounded-xl border border-error/10 opacity-70">
                          <span className="font-medium">{v.text}</span>
                          <span className="text-error font-bold">{v.count}x</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {['daily', 'weekly', 'yearly'].map(horizon => {
                    const items = (transmission.missionMetrics?.missed || []).filter(t => t.horizon === horizon);
                    if (items.length === 0) return null;
                    return (
                      <div key={horizon} className="space-y-3">
                        <p className="text-xs font-black text-error/70 uppercase tracking-widest">{horizon} Horizon</p>
                        {items.map(m => (
                          <div key={m.id} className="flex justify-between items-center p-3 bg-surface-lowest/50 rounded-xl border border-error/10 opacity-70">
                            <span className="font-medium">{m.title}</span>
                            <span className="text-error font-bold">-{m.weightage} XP</span>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                  {(transmission.missionMetrics?.missed || []).length === 0 && (
                    <p className="text-on-surface-variant italic text-sm">Zero deviations recorded.</p>
                  )}
                </div>
              </section>
            </div>

            {/* Final Metrics */}
            <footer className="mt-12 pt-8 border-t border-outline-variant/20 flex flex-wrap gap-8">
               <div className="flex items-center gap-4">
                 <Activity size={32} className="text-primary" />
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Mission Reliability</p>
                   <p className="text-2xl font-bold">{transmission.rawLogs.totalTasks > 0 ? Math.round((transmission.rawLogs.tasksCompleted / transmission.rawLogs.totalTasks) * 100) : 0}%</p>
                 </div>
               </div>
               <div className="flex items-center gap-4">
                 <Radar size={32} className="text-secondary" />
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Focus Volume</p>
                   <p className="text-2xl font-bold">{transmission.rawLogs.focusHours} Hours</p>
                 </div>
               </div>
               {transmission.metadata.targetOrg && (
                 <div className="flex items-center gap-4 ml-auto px-6 py-3 bg-primary/10 rounded-2xl border border-primary/20">
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-primary text-right">Target Agency</p>
                     <p className="text-xl font-display font-bold text-primary">{transmission.metadata.targetOrg}</p>
                   </div>
                 </div>
               )}
            </footer>
          </div>
        </motion.div>
        
        <p className="mt-12 text-center text-[10px] text-on-surface-variant font-mono uppercase tracking-[0.2em] opacity-40">
          End of Transmission // Space-Clocker High Fidelity Network
        </p>
      </div>
    </div>
  );
};

export default SharedTransmission;
