import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EventHorizon = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour countdown

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

  return (
    <div className="min-h-screen bg-[#050508] p-6 lg:pl-80 flex flex-col items-center justify-center space-y-8">
      {/* Drift State Overlay */}
      <div className="text-center space-y-6 max-w-lg">
        <h2 className="text-error font-display text-2xl uppercase tracking-widest">Gravity Well Detected</h2>
        <div className="text-7xl font-mono font-black text-white tracking-widest">
          {formatTime(timeLeft)}
        </div>
        <p className="text-on-surface-variant">Time until next Momentum Save</p>
      </div>

      {/* Reflection Input */}
      <div className="w-full max-w-lg glass-panel border border-outline-variant p-6 rounded-3xl">
        <textarea 
          className="w-full h-32 bg-surface-lowest border border-outline-variant rounded-2xl p-4 text-on-surface mb-6 resize-none focus:outline-none focus:border-primary"
          placeholder="Why did this task slip through the gravity well?"
        />
        <button className="w-full py-4 rounded-xl bg-primary-container text-on-primary font-bold shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:shadow-[0_0_30px_rgba(0,242,255,0.5)] transition-shadow">
          Recalibrate Trajectory
        </button>
      </div>
    </div>
  );
};

export default EventHorizon;
