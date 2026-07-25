import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SoundManager } from '../../utils/SoundManager';
import { Sparkles, Moon } from 'lucide-react';
import { useTrackStore } from '../../store/useTrackStore';

export const VoidEventHorizon = () => {
  const { voids, dismissedVoidKeys, setDismissedVoidKeys } = useTrackStore();

  const breachedVoids = voids.filter(v => 
    v.engagedCount > 0 && 
    v.engagedCount >= v.maxAllowed && 
    !dismissedVoidKeys.includes(`${v.id}-${v.engagedCount}`)
  );
  const isBreached = breachedVoids.length > 0;

  const [holdProgress, setHoldProgress] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const holdStartTime = useRef<number | null>(null);
  const HOLD_DURATION_MS = 3000;

  useEffect(() => {
    if (isBreached) {
      // Gentle, grounding hum instead of harsh sirens
      const interval = setInterval(() => {
        SoundManager.playSwell();
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isBreached]);

  useEffect(() => {
    let animationFrame: number;
    
    const updateProgress = () => {
      if (!isHolding || !holdStartTime.current) {
        setHoldProgress(0);
        return;
      }

      const elapsed = Date.now() - holdStartTime.current;
      const progress = Math.min((elapsed / HOLD_DURATION_MS) * 100, 100);
      
      if (progress >= 100) {
        // Success! Acknowledge the breach globally
        setDismissedVoidKeys(current => {
          const next = new Set(current);
          breachedVoids.forEach(v => next.add(`${v.id}-${v.engagedCount}`));
          return Array.from(next);
        });
        SoundManager.playSyncSuccess();
        setIsHolding(false);
        setHoldProgress(0);
      } else {
        setHoldProgress(progress);
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };

    if (isHolding) {
      holdStartTime.current = Date.now();
      animationFrame = requestAnimationFrame(updateProgress);
    } else {
      setHoldProgress(0);
      holdStartTime.current = null;
    }

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isHolding, breachedVoids, setDismissedVoidKeys]);

  if (!isBreached) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 1 } }}
        className="fixed inset-0 z-50 flex items-center justify-center p-6 overflow-hidden backdrop-blur-xl"
        style={{
          background: 'radial-gradient(circle at center, rgba(40,10,70,0.85) 0%, rgba(10,5,25,0.98) 100%)',
          boxShadow: 'inset 0 0 150px rgba(139,92,246,0.15)',
        }}
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="relative max-w-xl w-full"
        >
          {/* Subtle floating dust */}
          <div className="absolute inset-0 pointer-events-none opacity-30"
               style={{ background: 'radial-gradient(circle 2px at 20% 30%, rgba(251,191,36,0.3) 1px, transparent 1px), radial-gradient(circle 2px at 70% 60%, rgba(251,191,36,0.3) 1px, transparent 1px)', backgroundSize: '150px 150px', animation: 'float 20s infinite linear' }} />
          
          <div className="glass-panel bg-violet-900/10 border border-violet-500/20 p-12 rounded-[3rem] text-center space-y-10 relative overflow-hidden shadow-[0_0_50px_rgba(139,92,246,0.1)]">
            <div className="absolute inset-0 bg-violet-500/5 animate-pulse pointer-events-none" style={{ animationDuration: '4s' }} />
            
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Moon size={56} className="text-amber-200/80 mx-auto" strokeWidth={1.5} />
            </motion.div>
            
            <div className="space-y-4 relative z-10">
              <h2 className="text-3xl font-black text-amber-100 uppercase tracking-widest font-display">Event Horizon</h2>
              <p className="text-violet-200/70 text-sm uppercase tracking-[0.2em] leading-relaxed">
                Gravitational pull detected. Take a moment to breathe and realign your trajectory.
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              {breachedVoids.map(v => (
                <div key={v.id} className="text-amber-200/90 font-mono text-xs p-4 bg-violet-950/40 rounded-2xl border border-violet-500/20 flex items-center justify-between">
                  <span>{v.text}</span>
                  <span className="opacity-50">[{v.engagedCount}/{v.maxAllowed}]</span>
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
                onTouchCancel={() => setIsHolding(false)}
                onContextMenu={(e) => e.preventDefault()}
                className="select-none relative group w-full py-6 rounded-3xl bg-violet-900/20 border border-violet-400/30 overflow-hidden transition-all hover:bg-violet-800/30 hover:border-violet-400/50"
              >
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-violet-600/40 to-amber-500/40 transition-all duration-75 ease-linear"
                  style={{ width: `${holdProgress}%` }}
                />
                <div className="relative z-10 flex items-center justify-center gap-3">
                  <Sparkles className="text-amber-200 group-hover:scale-110 transition-transform" size={20} />
                  <span className="text-amber-100 font-black uppercase tracking-[0.2em] text-sm group-hover:scale-105 transition-transform">
                    {holdProgress > 0 ? 'Breathe...' : 'Hold to Recalibrate'}
                  </span>
                </div>
              </button>
              <p className="text-[10px] text-violet-300/50 mt-6 uppercase tracking-[0.3em]">Hold for 3 seconds to clear</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
