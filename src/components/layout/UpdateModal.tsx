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
      setStep('backup'); // Just stay here until they click upgrade
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
      // Artificial delay for cinematic effect and to ensure the user feels the "jump"
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
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-surface-lowest/80 backdrop-blur-xl">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="glass-panel border border-outline-variant w-full max-w-lg overflow-hidden rounded-[2.5rem] bg-surface-lowest shadow-2xl shadow-primary/20"
        >
          {/* Header */}
          <div className="bg-primary/10 p-8 flex items-center gap-4 border-b border-primary/20">
            <div className="bg-primary/20 p-3 rounded-2xl text-primary animate-pulse">
              <Rocket size={32} />
            </div>
            <div>
              <h2 className="text-primary font-display font-black text-2xl tracking-tight">System Leap</h2>
              <p className="text-on-surface-variant text-xs font-bold uppercase tracking-widest">v{pendingVersion} Incoming</p>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {step === 'alert' && (
              <div className="space-y-6">
                <p className="text-on-surface leading-relaxed text-sm">
                  A new version of the **Trajectory Engine** is ready for deployment. To ensure your stellar data remains intact during the jump, we recommend a safety backup.
                </p>

                {/* Stellar Transmission Section */}
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative p-5 rounded-3xl bg-surface-lowest border border-primary/20 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                      <Radio size={14} className="animate-pulse" />
                      Incoming Stellar Transmission
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-sm leading-tight">{pendingRelease.transmission}</h4>
                      <ul className="mt-3 space-y-2">
                        {pendingRelease.details.map((detail, idx) => (
                          <li key={idx} className="flex gap-2 text-xs text-on-surface-variant leading-relaxed">
                            <span className="text-primary mt-1">•</span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 pt-2">
                  <button 
                    onClick={() => setStep('backup')}
                    className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-tighter hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                  >
                    <ShieldCheck size={20} />
                    Initiate Safety Protocol
                  </button>
                  <button 
                    onClick={() => setShowUpdateModal(false)}
                    className="w-full p-4 text-on-surface-variant text-[10px] font-bold uppercase tracking-[0.3em] hover:text-white transition-colors"
                  >
                    Postpone System Jump
                  </button>
                </div>
              </div>
            )}

            {step === 'backup' && (
              <div className="space-y-4">
                <div className="p-6 rounded-3xl bg-surface-high border border-outline-variant space-y-4">
                  <div className="flex items-start gap-4">
                    <div className={hasBackedUp ? 'text-success' : 'text-secondary'}>
                      {hasBackedUp ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">Backup Status</h3>
                      <p className="text-sm text-on-surface-variant">
                        {hasBackedUp 
                          ? 'Trajectories secured. Your data is safe in your local storage.' 
                          : 'Please download your current trajectory map before the system upgrade.'}
                      </p>
                    </div>
                  </div>
                  {!hasBackedUp && (
                    <button 
                      onClick={handleBackup}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary font-bold text-sm"
                    >
                      <Download size={18} />
                      Download Trajectory Backup
                    </button>
                  )}
                </div>

                <div className="pt-4">
                  <button 
                    onClick={handleUpgrade}
                    disabled={!hasBackedUp}
                    className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-tighter disabled:opacity-30 disabled:grayscale transition-all"
                  >
                    <Cpu size={20} />
                    Execute System Jump
                  </button>
                </div>
              </div>
            )}

            {step === 'upgrading' && (
              <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center">
                <div className="relative">
                  <RefreshCcw size={64} className="text-primary animate-spin-slow" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Rocket size={24} className="text-secondary animate-pulse" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Recalibrating Chronos Core</h3>
                  <p className="text-on-surface-variant text-sm mt-1 uppercase tracking-widest font-bold">Migrating trajectory vectors...</p>
                </div>
                <div className="w-full bg-surface-high h-1.5 rounded-full overflow-hidden max-w-xs border border-outline-variant">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                    className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent"
                  />
                </div>
              </div>
            )}

            {step === 'success' && (
              <div className="py-8 flex flex-col items-center justify-center space-y-6 text-center">
                <div className="bg-success/20 p-6 rounded-full text-success">
                  <CheckCircle2 size={64} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white">Jump Successful</h3>
                  <p className="text-on-surface-variant text-sm mt-2">
                    Trajectory Engine is now running on **v{CURRENT_APP_VERSION}**. All pilot data has been successfully re-aligned.
                  </p>
                </div>
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full p-4 rounded-2xl bg-surface-high border border-outline-variant font-black uppercase tracking-tighter hover:bg-surface-low transition-all"
                >
                  Return to Mission Control
                </button>
              </div>
            )}

            {step === 'error' && (
              <div className="space-y-6 py-4">
                <div className="p-6 rounded-3xl bg-error/10 border border-error/20 flex items-start gap-4">
                  <AlertCircle className="text-error shrink-0" size={24} />
                  <div>
                    <h3 className="text-error font-bold">Jump Failure</h3>
                    <p className="text-xs text-on-surface-variant mt-1">{error}</p>
                  </div>
                </div>
                <p className="text-sm">
                  The system jump encountered a catastrophic error. You can attempt to re-align or restore from your local backup.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setStep('backup')}
                    className="flex-1 p-4 rounded-2xl bg-surface-high border border-outline-variant font-bold uppercase text-xs"
                  >
                    Back to Safety
                  </button>
                  <button 
                    onClick={handleUpgrade}
                    className="flex-1 p-4 rounded-2xl bg-primary text-on-primary font-black uppercase tracking-tighter text-xs"
                  >
                    Retry Jump
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UpdateModal;
