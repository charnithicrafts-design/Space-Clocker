import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';
import { useTrackStore } from '../../store/useTrackStore';

interface SyncPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SyncPaywallModal: React.FC<SyncPaywallModalProps> = ({ isOpen, onClose }) => {
  const { oracleConfig, updateOracleConfig } = useTrackStore();
  const [selectedTier, setSelectedTier] = useState<'one-time' | 'premium' | null>(null);
  const [utr, setUtr] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Hardcoded UPI for demo
  const VPA = 'spaceclocker@upi';
  const getUpiUrl = (amount: number) => `upi://pay?pa=${VPA}&pn=SpaceClocker&am=${amount}&cu=INR`;
  const getQrUrl = (amount: number) => `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getUpiUrl(amount))}`;

  const handleVerify = () => {
    if (!selectedTier) return;
    
    // Mock Verification: Must be exactly 12 digits for UPI UTR
    if (!/^\d{12}$/.test(utr)) {
      SoundManager.playThud();
      setError('Invalid UTR. It must be exactly 12 digits.');
      return;
    }

    // Success!
    SoundManager.playSyncSuccess();
    setSuccess(true);
    
    if (selectedTier === 'one-time') {
      updateOracleConfig({ 
        syncTier: 'one-time', 
        oneTimeSyncsAvailable: (oracleConfig.oneTimeSyncsAvailable || 0) + 1,
        syncEnabled: true 
      });
    } else {
      const expires = new Date();
      expires.setMonth(expires.getMonth() + 3);
      updateOracleConfig({
        syncTier: 'premium',
        syncExpiresAt: expires.toISOString(),
        syncEnabled: true
      });
    }

    setTimeout(() => {
      setSuccess(false);
      setSelectedTier(null);
      setUtr('');
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-surface-lowest/90 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl glass-panel border border-outline-variant rounded-[2.5rem] p-6 lg:p-10 relative overflow-hidden flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-10 h-10 bg-surface-high rounded-full flex items-center justify-center hover:bg-surface-highest transition-colors z-10"
          >
            <X size={20} />
          </button>

          {!success ? (
            <>
              <div className="text-center space-y-2 mb-8">
                <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border border-primary/30 mb-4 shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)]">
                  <ShieldCheck size={32} className="text-primary" />
                </div>
                <h2 className="text-3xl font-display font-black text-white uppercase tracking-tighter">Establish Uplink</h2>
                <p className="text-on-surface-variant text-sm max-w-md mx-auto">
                  Deploy your trajectory data to the Chronos Cloud for cross-device synchronization.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-8">
                {/* Tier 1 */}
                <button
                  onClick={() => setSelectedTier('one-time')}
                  className={`relative p-6 rounded-3xl border-2 transition-all text-left group ${selectedTier === 'one-time' ? 'bg-secondary/10 border-secondary' : 'bg-surface-high border-outline-variant hover:border-secondary/50'}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-secondary/20 rounded-xl">
                      <Zap size={24} className="text-secondary" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">₹10</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-widest mb-1">Temporal Burst</h3>
                  <p className="text-xs text-on-surface-variant mb-4">One-time sync deployment.</p>
                  <ul className="text-[10px] uppercase font-bold text-on-surface-variant space-y-2">
                    <li className="flex gap-2 items-center"><CheckCircle2 size={12} className="text-secondary" /> Instant cloud push</li>
                    <li className="flex gap-2 items-center"><CheckCircle2 size={12} className="text-secondary" /> Lifetime pull access</li>
                  </ul>
                </button>

                {/* Tier 2 */}
                <button
                  onClick={() => setSelectedTier('premium')}
                  className={`relative p-6 rounded-3xl border-2 transition-all text-left group overflow-hidden ${selectedTier === 'premium' ? 'bg-primary/10 border-primary' : 'bg-surface-high border-outline-variant hover:border-primary/50'}`}
                >
                  <div className="absolute top-0 right-0 bg-primary text-on-primary text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl z-10">Best Value</div>
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 blur-2xl rounded-full" />
                  
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <div className="p-3 bg-primary/20 rounded-xl">
                      <Clock size={24} className="text-primary" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-white">₹100</div>
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-widest mb-1 relative z-10">Quantum Uplink</h3>
                  <p className="text-xs text-on-surface-variant mb-4 relative z-10">Unlimited sync for 3 Months.</p>
                  <ul className="text-[10px] uppercase font-bold text-on-surface-variant space-y-2 relative z-10">
                    <li className="flex gap-2 items-center"><CheckCircle2 size={12} className="text-primary" /> Automated continuous sync</li>
                    <li className="flex gap-2 items-center"><CheckCircle2 size={12} className="text-primary" /> Multi-device real-time</li>
                  </ul>
                </button>
              </div>

              <AnimatePresence mode="wait">
                {selectedTier && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-outline-variant pt-6"
                  >
                    <div className="flex flex-col md:flex-row gap-6 items-center bg-surface-low p-6 rounded-3xl border border-outline-variant">
                      <div className="shrink-0 bg-white p-2 rounded-xl">
                        <img 
                          src={getQrUrl(selectedTier === 'one-time' ? 10 : 100)} 
                          alt="UPI QR Code" 
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                      <div className="flex-1 w-full space-y-4">
                        <div>
                          <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">Scan to authorize</h4>
                          <p className="text-xs text-on-surface-variant">Use GPay, PhonePe, or Paytm to scan the QR. Then enter the 12-digit UTR (Transaction ID) below to unlock.</p>
                        </div>
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            placeholder="Enter 12-digit UTR / Ref Number"
                            value={utr}
                            onChange={(e) => {
                                setUtr(e.target.value.replace(/\D/g, '').slice(0, 12));
                                setError('');
                            }}
                            className="w-full bg-surface-high border border-outline-variant rounded-xl p-3 text-sm focus:border-primary focus:outline-none transition-colors"
                          />
                          {error && <p className="text-[10px] text-error font-bold uppercase tracking-wider">{error}</p>}
                        </div>
                        <button 
                          onClick={handleVerify}
                          disabled={utr.length !== 12}
                          className="w-full bg-primary text-on-primary font-black uppercase tracking-widest py-3 rounded-xl disabled:opacity-50 transition-colors shadow-lg shadow-primary/20 hover:bg-primary-container"
                        >
                          Verify Payment
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="py-12 flex flex-col items-center text-center space-y-4"
            >
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(var(--color-success-rgb),0.4)]">
                <CheckCircle2 size={40} className="text-success" />
              </div>
              <h2 className="text-2xl font-black uppercase tracking-widest text-white mt-4">Uplink Authorized</h2>
              <p className="text-sm text-on-surface-variant max-w-sm">
                Your neural link is now synchronized with the Chronos Network. 
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SyncPaywallModal;
