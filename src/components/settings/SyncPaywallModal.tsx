import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ShieldCheck, CheckCircle2, Clock, CreditCard, Link } from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';
import { useTrackStore } from '../../store/useTrackStore';
import { syncService } from '../../services/SyncService';
import { signIn, useSession } from '../../lib/auth-client';

interface SyncPaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SyncPaywallModal: React.FC<SyncPaywallModalProps> = ({ isOpen, onClose }) => {
  const { oracleConfig, updateOracleConfig, profile, linkExistingConnection } = useTrackStore();
  const { data: session } = useSession();
  const [selectedTier, setSelectedTier] = useState<'one-time' | 'premium' | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [linkKeyInput, setLinkKeyInput] = useState('');
  const [linkError, setLinkError] = useState('');

  const [isSdkLoaded, setIsSdkLoaded] = useState(false);

  // Dynamically load Razorpay Standard Checkout SDK
  useEffect(() => {
    if (!isOpen) return;

    if (typeof (window as any).Razorpay === 'function') {
      setIsSdkLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      setIsSdkLoaded(typeof (window as any).Razorpay === 'function');
    };
    script.onerror = () => {
      setIsSdkLoaded(false);
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [isOpen]);

  const handleCheckout = async () => {
    if (!selectedTier) return;
    setIsProcessing(true);
    setError('');

    if (typeof (window as any).Razorpay !== 'function') {
      setError('Razorpay SDK could not be loaded. Please disable your ad-blocker or Brave Shield and try again.');
      setIsProcessing(false);
      return;
    }

    // Determine amount in paise (₹10 = 1000 paise, ₹100 = 10000 paise)
    const amountInPaise = selectedTier === 'one-time' ? 1000 : 10000;

    try {
      // 1. Create Order on Backend
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: amountInPaise,
          currency: 'INR',
          receipt: `rcpt_${Date.now()}`
        })
      });

      const text = await orderResponse.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error("Invalid response from /api/create-order:", text);
        throw new Error(`Backend API unavailable (Status ${orderResponse.status}). Are you running 'vercel dev'?`);
      }

      if (!orderResponse.ok) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      const orderData = data;

      // 2. Configure Razorpay Standard Checkout Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_TETxMjivOA8qJY',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Space-Clocker',
        description: selectedTier === 'one-time' ? 'Temporal Burst Sync' : 'Quantum Uplink Sync',
        order_id: orderData.order_id,
        handler: async function (response: any) {
          setIsProcessing(true);
          try {
            // 3. Verify Payment Signature on Backend
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const vText = await verifyResponse.text();
            let verifyData;
            try {
              verifyData = JSON.parse(vText);
            } catch (e) {
              throw new Error(`Invalid verify response (Status ${verifyResponse.status}). Backend API might be down.`);
            }

            if (verifyResponse.ok && verifyData.success) {
              handlePaymentSuccess();
            } else {
              throw new Error(verifyData.error || 'Signature verification failed');
            }
          } catch (err: any) {
            setError(err.message || 'Signature verification failed. Trajectory not updated.');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: profile.name || 'Charles Kumar',
          email: 'pilot@spaceclocker.io',
          contact: '9999999999'
        },
        theme: {
          color: '#7c3aed' // primary theme purple
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            setError('Payment checkout cancelled.');
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      
      rzp.on('payment.failed', function (resp: any) {
        setError(resp.error.description || 'Payment transaction failed.');
        setIsProcessing(false);
      });

      rzp.open();
    } catch (err: any) {
      setError(err.message || 'Failed to initiate checkout.');
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = () => {
    // Generate clientId if missing. If logged in, use the session user id.
    const newClientId = session?.user?.id || oracleConfig.clientId || `chr-${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;

    // Success!
    SoundManager.playSyncSuccess();
    setSuccess(true);
    setIsProcessing(false);
    
    // Authorize sync service in memory
    syncService.authorize(newClientId);
    
    if (selectedTier === 'one-time') {
      updateOracleConfig({ 
        clientId: newClientId,
        syncTier: 'one-time', 
        oneTimeSyncsAvailable: (oracleConfig.oneTimeSyncsAvailable || 0) + 1,
        syncEnabled: true 
      });
    } else {
      const expires = new Date();
      expires.setMonth(expires.getMonth() + 3);
      updateOracleConfig({
        clientId: newClientId,
        syncTier: 'premium',
        syncExpiresAt: expires.toISOString(),
        syncEnabled: true
      });
    }

    setTimeout(() => {
      setSuccess(false);
      setSelectedTier(null);
      onClose();
    }, 2000);
  };

  const handleGoogleLogin = async () => {
    setIsProcessing(true);
    setLinkError('');
    try {
      await signIn.social({
        provider: "google",
        callbackURL: window.location.origin
      });
      // The redirect will happen automatically to Google.
    } catch (err: any) {
      setLinkError(err.message || 'Failed to initialize Google Login.');
      setIsProcessing(false);
    }
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
            disabled={isProcessing}
            className="absolute top-6 right-6 w-10 h-10 bg-surface-high rounded-full flex items-center justify-center hover:bg-surface-highest transition-colors z-10 disabled:opacity-30"
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
                  onClick={() => !isProcessing && setSelectedTier('one-time')}
                  disabled={isProcessing}
                  className={`relative p-6 rounded-3xl border-2 transition-all text-left group ${selectedTier === 'one-time' ? 'bg-secondary/10 border-secondary' : 'bg-surface-high border-outline-variant hover:border-secondary/50'} disabled:opacity-50`}
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
                  onClick={() => !isProcessing && setSelectedTier('premium')}
                  disabled={isProcessing}
                  className={`relative p-6 rounded-3xl border-2 transition-all text-left group overflow-hidden ${selectedTier === 'premium' ? 'bg-primary/10 border-primary' : 'bg-surface-high border-outline-variant hover:border-primary/50'} disabled:opacity-50`}
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

              <div className="border-t border-outline-variant/60 pt-6 mt-2 space-y-4">
                {!session ? (
                  <>
                    <div className="text-center">
                      <h4 className="text-xs font-black uppercase tracking-widest text-on-surface-variant">Already have an Account?</h4>
                      <p className="text-[10px] text-on-surface-variant/80 mt-1">Sign in with Google to sync your existing trajectories.</p>
                    </div>
                    <div className="flex justify-center">
                      <button
                        onClick={handleGoogleLogin}
                        disabled={isProcessing}
                        className="w-full max-w-xs flex items-center justify-center gap-3 bg-surface-high hover:bg-surface-highest border border-outline-variant text-white transition-all font-bold text-sm px-6 py-3 rounded-xl disabled:opacity-50"
                      >
                        <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
                        Continue with Google
                      </button>
                    </div>
                    {linkError && (
                      <p className="text-[9px] text-error font-bold uppercase tracking-wider text-center bg-error/5 p-2 rounded-lg border border-error/10 max-w-md mx-auto">
                        {linkError}
                      </p>
                    )}
                  </>
                ) : (
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 bg-success/10 border border-success/30 px-4 py-2 rounded-xl">
                      <CheckCircle2 size={16} className="text-success" />
                      <span className="text-xs font-bold text-success">Linked as {session.user?.email || 'User'}</span>
                    </div>
                  </div>
                )}
              </div>

              <AnimatePresence mode="wait">
                {selectedTier && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }} 
                    animate={{ opacity: 1, height: 'auto' }} 
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-outline-variant pt-6"
                  >
                    <div className="flex flex-col gap-4 bg-surface-low p-6 rounded-3xl border border-outline-variant">
                      <div>
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-1">
                          Authorize Connection
                        </h4>
                        <p className="text-xs text-on-surface-variant">
                          Unlock secure cloud sync using Razorpay's Standard Checkout. Supports Card, Google Pay, UPI, and Wallet.
                        </p>
                      </div>
                      
                      {error && (
                        <p className="text-[10px] text-error font-bold uppercase tracking-wider bg-error/5 p-2 rounded-lg border border-error/10">
                          {error}
                        </p>
                      )}

                      <button 
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-on-primary font-black uppercase tracking-widest py-4 rounded-xl disabled:opacity-50 transition-colors shadow-lg shadow-primary/20 hover:bg-primary-container"
                      >
                        <CreditCard size={18} />
                        {isProcessing ? 'Processing Transaction...' : 'Pay with Razorpay'}
                      </button>
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
