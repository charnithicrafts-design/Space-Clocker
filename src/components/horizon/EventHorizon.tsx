import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ShieldAlert } from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';

const EventHorizon = () => {
  const [timeLeft, setTimeLeft] = useState(53528); // 14:52:08 in seconds
  const [reflection, setReflection] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const handleRecalibrate = () => {
    SoundManager.playSwell();
    // Logic for recalibration would go here
  };

  return (
    <div className="min-h-screen bg-[#050508] p-6 lg:pl-80 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-radial-at-c from-primary/5 to-transparent pointer-events-none" />

      {/* Header Actions */}
      <button className="absolute top-8 right-8 flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors">
        <span className="text-sm font-medium">Bypass Horizon</span>
        <X size={20} />
      </button>

      <div className="w-full max-w-xl flex flex-col items-center text-center space-y-12 z-10">
        {/* Critical Intercept Badge */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-error/10 border border-error/30 px-6 py-2 rounded-full flex items-center gap-2"
        >
          <ShieldAlert className="text-error" size={16} />
          <span className="text-error text-xs font-black tracking-[0.2em] uppercase">Critical Intercept</span>
        </motion.div>

        {/* Title & Description */}
        <div className="space-y-4">
          <h1 className="text-5xl lg:text-6xl font-display font-black text-white tracking-tight">Event Horizon</h1>
          <p className="text-on-surface-variant leading-relaxed max-w-md mx-auto">
            You've drifted from your trajectory. To realign, you must acknowledge the void and recalibrate your momentum.
          </p>
        </div>

        {/* Level-Up Countdown Circle */}
        <div className="relative w-72 h-72 flex items-center justify-center">
            {/* Outer Ring */}
            <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                <circle cx="144" cy="144" r="120" stroke="currentColor" strokeWidth="2" fill="none" className="text-surface-high" />
                <motion.circle 
                    cx="144" cy="144" r="120" stroke="currentColor" strokeWidth="4" fill="none" className="text-primary"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 0.75 }}
                    transition={{ duration: 2, ease: "easeOut" }}
                />
            </svg>
            
            <div className="text-center space-y-2">
                <span className="text-on-surface-variant text-[10px] font-black tracking-[0.2em] uppercase">Level-up In</span>
                <div className="text-5xl font-mono font-black text-white tracking-widest">
                    {formatTime(timeLeft)}
                </div>
                <div className="bg-primary/20 border border-primary/40 px-4 py-1 rounded-full inline-block">
                    <span className="text-primary text-[10px] font-black tracking-widest uppercase">Momentum Saved</span>
                </div>
            </div>
        </div>

        {/* Reflection Log Area */}
        <div className="w-full space-y-4">
            <div className="flex flex-col items-start gap-1">
                <h3 className="text-xs font-black text-on-surface-variant tracking-[0.1em] uppercase">Reflection Log</h3>
            </div>
            <textarea 
                className="w-full h-40 bg-surface-high/30 border border-outline-variant rounded-3xl p-6 text-on-surface placeholder:text-on-surface-variant/40 resize-none focus:outline-none focus:border-primary/50 transition-colors"
                placeholder="Why did this task slip through the gravity well? What prevents it from happening again?"
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
            />
        </div>

        {/* Action Button */}
        <button 
            onClick={handleRecalibrate}
            className="w-full py-6 rounded-2xl bg-primary text-on-primary font-black tracking-widest uppercase shadow-[0_0_40px_rgba(var(--color-primary-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-all"
        >
            Recalibrate Trajectory
        </button>
      </div>
    </div>
  );
};

export default EventHorizon;
