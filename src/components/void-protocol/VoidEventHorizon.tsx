import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SoundManager } from '../../utils/SoundManager';
import { AlertTriangle, Zap } from 'lucide-react';
import { useTrackStore } from '../../store/useTrackStore';

export const VoidEventHorizon = () => {
  const { voids, updateVoidTask } = useTrackStore();
  const breachedVoids = voids.filter(v => v.engagedCount >= v.maxAllowed);
  const isBreached = breachedVoids.length > 0;

  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);

  useEffect(() => {
    if (isBreached) {
      const interval = setInterval(() => {
        SoundManager.playThud();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isBreached]);

  useEffect(() => {
    let interval: any;
    if (isHolding) {
      interval = setInterval(() => {
        setHoldProgress(prev => {
          if (prev >= 100) {
            // Success! Reset the breached voids
            breachedVoids.forEach(v => {
              updateVoidTask(v.id, { engagedCount: 0 });
            });
            SoundManager.playSwell();
            setIsHolding(false);
            return 0;
          }
          return prev + 2; // 50 ticks of 60ms = 3 seconds
        });
      }, 60);
    } else {
      setHoldProgress(0);
    }
    return () => clearInterval(interval);
  }, [isHolding, breachedVoids, updateVoidTask]);

  if (!isBreached) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden backdrop-blur-xl"
        style={{
          background: 'radial-gradient(circle at center, rgba(30,0,0,0.8) 0%, rgba(10,0,0,0.95) 100%)',
          boxShadow: 'inset 0 0 150px rgba(255,0,0,0.3)',
        }}
      >
        <motion.div 
          animate={{ x: [-5, 5, -5, 5, 0], y: [-2, 2, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 0.2, ease: "linear" }}
          className="relative max-w-xl w-full"
        >
          {/* Shattered glass effect overlay using CSS gradients instead of external image for reliability */}
          <div className="absolute inset-0 pointer-events-none opacity-20"
               style={{ background: 'linear-gradient(45deg, transparent 48%, rgba(255,255,255,0.8) 49%, rgba(255,255,255,0.8) 51%, transparent 52%), linear-gradient(-45deg, transparent 48%, rgba(255,255,255,0.8) 49%, rgba(255,255,255,0.8) 51%, transparent 52%)', backgroundSize: '100px 100px' }} />
          
          <div className="glass-panel bg-error/10 border-2 border-error/50 p-10 rounded-[3rem] text-center space-y-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-error/20 animate-pulse pointer-events-none" />
            
            <AlertTriangle size={64} className="text-error mx-auto animate-bounce" />
            
            <div className="space-y-2 relative z-10">
              <h2 className="text-4xl font-black text-error uppercase tracking-widest font-display">Event Horizon</h2>
              <p className="text-on-surface-variant text-sm uppercase tracking-[0.2em]">Structural integrity compromised. Critical distraction loop detected.</p>
            </div>

            <div className="space-y-4 relative z-10">
              {breachedVoids.map(v => (
                <div key={v.id} className="text-error/80 font-mono text-xs p-3 bg-error/5 rounded-xl border border-error/20">
                  Anomaly: {v.text} [{v.engagedCount}/{v.maxAllowed}]
                </div>
              ))}
            </div>

            <div className="pt-8 relative z-10">
              <button
                onMouseDown={() => setIsHolding(true)}
                onMouseUp={() => setIsHolding(false)}
                onMouseLeave={() => setIsHolding(false)}
                onTouchStart={() => setIsHolding(true)}
                onTouchEnd={() => setIsHolding(false)}
                className="relative group w-full py-6 rounded-2xl bg-error/20 border-2 border-error/50 overflow-hidden"
              >
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-error transition-all duration-75 ease-linear"
                  style={{ width: `${holdProgress}%` }}
                />
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <Zap className="text-white" size={24} />
                  <span className="text-white font-black uppercase tracking-widest text-lg group-hover:scale-105 transition-transform">
                    {holdProgress > 0 ? 'Charging Thrust...' : 'Hold to Override'}
                  </span>
                </div>
              </button>
              <p className="text-[10px] text-error/60 mt-4 uppercase tracking-widest">Hold for 3 seconds to recalibrate trajectory</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
