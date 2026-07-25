import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star } from 'lucide-react';
import { SoundManager } from '../../utils/SoundManager';
import { useTrackStore } from '../../store/useTrackStore';

export const SupernovaEffect = () => {
  const { showSupernova, setShowSupernova } = useTrackStore();
  
  useEffect(() => {
    if (showSupernova) {
      SoundManager.playSwell(); // or a dedicated supernova sound
      
      // Auto-dismiss after 8 seconds
      const timer = setTimeout(() => {
        setShowSupernova(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [showSupernova, setShowSupernova]);

  if (!showSupernova) return null;

  // Generate random stardust particles
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * window.innerWidth,
    y: (Math.random() - 0.5) * window.innerHeight,
    scale: Math.random() * 2 + 0.5,
    delay: Math.random() * 0.5,
  }));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 1.5 } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(circle at center, rgba(30,10,60,0.95) 0%, rgba(5,0,20,0.98) 100%)',
        }}
      >
        {/* Core Explosion */}
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: [0, 5, 20], opacity: [1, 0.8, 0] }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute w-32 h-32 rounded-full bg-amber-200 blur-2xl pointer-events-none"
        />
        
        {/* Shockwave */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0, borderWidth: '10px' }}
          animate={{ scale: [0.5, 4, 15], opacity: [0, 1, 0], borderWidth: ['10px', '2px', '0px'] }}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.2 }}
          className="absolute w-64 h-64 rounded-full border-amber-300 pointer-events-none"
        />

        {/* Stardust Particles */}
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{ 
              x: p.x, 
              y: p.y, 
              opacity: [0, 1, 0.8, 0], 
              scale: p.scale 
            }}
            transition={{ 
              duration: 4 + Math.random() * 2, 
              ease: "easeOut", 
              delay: p.delay 
            }}
            className="absolute w-1 h-1 bg-amber-100 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.8)] pointer-events-none"
          />
        ))}

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="relative z-10 flex flex-col items-center text-center max-w-md px-6"
        >
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="mb-8"
          >
            <Star size={64} className="text-amber-300 fill-amber-300/20" />
          </motion.div>
          
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-orange-400 uppercase tracking-widest font-display mb-4">
            Supernova
          </h2>
          
          <p className="text-amber-100/80 text-sm uppercase tracking-[0.2em] leading-relaxed mb-10">
            A beautiful end to a long run. Your broken streak isn't a failure—it's the stardust needed to birth a new galaxy.
          </p>

          <button
            onClick={() => setShowSupernova(false)}
            className="px-8 py-4 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-3 hover:bg-amber-500 hover:text-black transition-all text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:scale-105"
          >
            <Sparkles size={16} />
            Harness Stardust
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
