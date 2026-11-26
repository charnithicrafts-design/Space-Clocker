import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { CURRENT_APP_VERSION } from '../../constants';
import { Rocket, ShieldCheck, Cpu, RefreshCcw, AlertCircle, Download, CheckCircle2, Radio } from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';
import releasesData from '../../data/releases.json';

const UpdateModal = () => {
  const { showUpdateModal, setShowUpdateModal, pendingVersion, performSystemUpgrade, exportData } = useTrackStore();
  const [step, setStep] = useState<'alert' | 'backup' | 'upgrading' | 'success' | 'error'>('alert');
  const [error, setError] = useState<string | null>(null);
  const [hasBackedUp, setHasBackedUp] = useState(false);

  const pendingRelease = releasesData.find(r => r.version === pendingVersion) || releasesData[0];

  if (!showUpdateModal) return null;

  const handleBackup = async () => {
    try {
      SoundManager.playPop();
      const data = await exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pre-update-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setHasBackedUp(true);
      setStep('backup');
    } catch (err) {
      console.error('Backup failed:', err);
      setError('Neural Link failed to capture trajectory data.');
      setStep('error');
    }
  };

  const handleUpgrade = async () => {
    try {
      setStep('upgrading');
      SoundManager.playSwell();
      await new Promise(r => setTimeout(r, 2000));
      await performSystemUpgrade();
      setStep('success');
      SoundManager.playSyncSuccess();
    } catch (err: any) {
      console.error('Upgrade failed:', err);
      setError(err.message || 'Chronos Core failed to re-align.');
      setStep('error');
    }
  };

  return (
    <AnimatePresence>
      <div className="modal-backdrop z-[100] bg-surface-lowest/85 backdrop-blur-xl">
        <div className="modal-center-frame">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="update-modal-title"
            className="modal-dialog glass-panel border border-outline-variant max-w-lg bg-surface-lowest shadow-2xl shadow-primary/20"
          >
            {/* Pinned Header */}
            <div className="bg-primary/10 p-4 sm:p-6 flex items-center gap-4 border-b border-primary/20 shrink-0">
              <div className="bg-primary/20 p-3 rounded-2xl text-primary animate-pulse shrink-0">
                <Rocket size={28} />
              </div>
              <div className="min-w-0">
                <h2 id="update-modal-title" className="text-primary font-display font-black text-xl sm:text-2xl tracking-tight">
                  System Leap
                </h2>
                <p className="text-on-surface-variant type-overline tracking-widest">v{pendingVersion} Incoming</p>
              </div>
            </div>

            {step === 'alert' ? (
              <>
                <div className="modal-body-scroll p-4 sm:p-6 space-y-4">
                  <p className="text-on-surface leading-relaxed type-body">
                    A new version of the <strong className="text-primary font-bold">Trajectory Engine</strong> is ready for deployment. To ensure your stellar data remains intact during the jump, we recommend a safety backup.
                  </p>

                  {/* Stellar Transmission Section */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 pointer-events-none" />
                    <div className="relative p-4 sm:p-6 rounded-2xl bg-surface-lowest border border-primary/20 space-y-3">
                      <div className="flex items-center gap-2 text-primary type-overline tracking-[0.2em]">
                        <Radio size={14} className="animate-pulse shrink-0" />
                        Incoming Stellar Transmission
                      </div>
                      <div>
                        <h4 className="font-bold text-on-surface type-body leading-snug">{pendingRelease.transmission}</h4>
                        <ul className="mt-3 space-y-2">
                          {pendingRelease.details.map((detail, idx) => (
                            <li key={idx} className="flex gap-2 type-body-sm text-on-surface-variant leading-relaxed">
                              <span className="text-primary shrink-0">•</span>
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pinned Footer CTA Actions */}
                <div className="p-4 sm:p-6 border-t border-outline-variant/20 bg-surface-lowest/70 grid grid-cols-1 gap-2 shrink-0">
                  <button
                    onClick={() => setStep('backup')}
                    className="w-full min-h-[48px] flex items-center justify-center gap-2 px-6 py-2 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-tighter hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 touch-target cursor-pointer"
                  >
                    <ShieldCheck size={20} />
                    <span>Initiate Safety Protocol</span>
                  </button>
                  <button
                    onClick={() => setShowUpdateModal(false)}
                    className="w-full min-h-[44px] px-4 py-2 text-on-surface-variant type-overline tracking-[0.2em] hover:text-on-surface transition-colors touch-target-compact cursor-pointer"
                  >
                    Postpone System Jump
                  </button>
                </div>
              </>
            ) : (
              <div className="modal-body-scroll p-4 sm:p-6 space-y-6">
                {step === 'backup' && (
                  <div className="space-y-4">
                    <div className="p-4 sm:p-6 rounded-2xl bg-surface-high border border-outline-variant space-y-4">
                      <div className="flex items-start gap-4">
                        <div className={`shrink-0 ${hasBackedUp ? 'text-success' : 'text-secondary'}`}>
                          {hasBackedUp ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-on-surface">Backup Status</h3>
                          <p className="type-body text-on-surface-variant mt-1">
                            {hasBackedUp
                              ? 'Trajectories secured. Your data is safe in your local storage.'
                              : 'Please download your current trajectory map before the system upgrade.'}
                          </p>
                        </div>
                      </div>
                      {!hasBackedUp && (
                        <button
                          onClick={handleBackup}
                          className="w-full min-h-[48px] flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary font-bold type-body touch-target cursor-pointer"
                        >
                          <Download size={18} />
                          <span>Download Trajectory Backup</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={handleUpgrade}
                        disabled={!hasBackedUp}
                        className="w-full min-h-[48px] flex items-center justify-center gap-2 px-6 py-2 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-tighter disabled:opacity-30 disabled:grayscale transition-all touch-target cursor-pointer"
                      >
                        <Cpu size={20} />
                        <span>Execute System Jump</span>
                      </button>
                    </div>
                  </div>
                )}

                {step === 'upgrading' && (
                  <div className="py-8 flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="relative">
                      <RefreshCcw size={64} className="text-primary animate-spin-slow" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Rocket size={24} className="text-secondary animate-pulse" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-on-surface">Recalibrating Chronos Core</h3>
                      <p className="text-on-surface-variant type-body mt-1 uppercase tracking-widest font-bold">Migrating trajectory vectors...</p>
                    </div>
                    <div className="w-full bg-surface-high h-2 rounded-full overflow-hidden max-w-xs border border-outline-variant">
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                        className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
                      />
                    </div>
                  </div>
                )}

                {step === 'success' && (
                  <div className="py-6 flex flex-col items-center justify-center space-y-6 text-center">
                    <div className="bg-success/20 p-6 rounded-full text-success">
                      <CheckCircle2 size={64} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-on-surface">Jump Successful</h3>
                      <p className="text-on-surface-variant type-body mt-2">
                        Trajectory Engine is now running on <strong className="text-primary font-bold">v{CURRENT_APP_VERSION}</strong>. All pilot data has been successfully re-aligned.
                      </p>
                    </div>
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full min-h-[48px] px-6 py-2 rounded-2xl bg-surface-high border border-outline-variant font-black uppercase tracking-tighter hover:bg-surface-low transition-all touch-target text-on-surface cursor-pointer"
                    >
                      Return to Mission Control
                    </button>
                  </div>
                )}

                {step === 'error' && (
                  <div className="space-y-6 py-2">
                    <div className="p-4 sm:p-6 rounded-2xl bg-error/10 border border-error/20 flex items-start gap-4">
                      <AlertCircle className="text-error shrink-0" size={24} />
                      <div>
                        <h3 className="text-error font-bold">Jump Failure</h3>
                        <p className="type-body-sm text-on-surface-variant mt-1">{error}</p>
                      </div>
                    </div>
                    <p className="type-body text-on-surface-variant">
                      The system jump encountered a catastrophic error. You can attempt to re-align or restore from your local backup.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <button
                        onClick={() => setStep('backup')}
                        className="flex-1 min-h-[48px] px-4 py-2 rounded-2xl bg-surface-high border border-outline-variant font-bold uppercase type-overline text-on-surface touch-target cursor-pointer"
                      >
                        Back to Safety
                      </button>
                      <button
                        onClick={handleUpgrade}
                        className="flex-1 min-h-[48px] px-4 py-2 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-tighter type-overline touch-target cursor-pointer"
                      >
                        Retry Jump
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};

export default UpdateModal;
