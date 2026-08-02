import React from 'react';
import { motion } from 'framer-motion';
import { Compass, Home, ArrowLeft, Rocket } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { SoundManager } from '../../utils/SoundManager';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-surface-lowest text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-lg w-full glass-panel border border-outline-variant/40 p-8 lg:p-12 rounded-[2.5rem] text-center space-y-6 relative z-10 shadow-2xl shadow-primary/10"
      >
        <div className="w-20 h-20 mx-auto rounded-3xl bg-surface-high border border-primary/30 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.2)]">
          <Compass size={40} className="animate-spin" style={{ animationDuration: '20s' }} />
        </div>

        <div className="space-y-3">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
            Coordinates Unmapped
          </span>
          <h1 className="text-4xl font-display font-black uppercase tracking-tight text-white">
            Lost in Deep Space?
          </h1>
          <p className="text-xs text-on-surface-variant font-mono bg-surface-lowest p-2.5 rounded-xl border border-outline-variant/20 truncate">
            {pathname}
          </p>
          <p className="text-xs text-on-surface-variant leading-relaxed max-w-sm mx-auto">
            The vector you entered does not exist in our navigation matrix. Let us realign your flight plan back to safety.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={() => {
              SoundManager.playPop();
              navigate(-1);
            }}
            className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-surface-high text-white font-bold text-xs uppercase tracking-wider hover:bg-surface-high/80 border border-outline-variant/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Go Back</span>
          </button>

          <button
            onClick={() => {
              SoundManager.playPop();
              navigate('/');
            }}
            className="w-full sm:flex-1 py-3.5 px-5 rounded-2xl bg-primary text-on-primary font-black text-xs uppercase tracking-widest hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,242,255,0.3)] hover:scale-105 cursor-pointer border-none"
          >
            <Rocket size={16} />
            <span>Return to Home</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
