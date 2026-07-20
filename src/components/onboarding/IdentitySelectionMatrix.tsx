import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { curatedArchetypes, Archetype } from '../../data/archetypes';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import { ChevronRight, Sparkles } from 'lucide-react';

interface IdentitySelectionMatrixProps {
  onComplete: () => void;
}

const ArchetypeCard = ({ archetype, onSelect }: { archetype: Archetype, onSelect: () => void }) => {
  return (
    <motion.div
      layout
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        SoundManager.playPop();
        onSelect();
      }}
      className="group relative flex-shrink-0 w-72 h-80 rounded-[2rem] p-6 glass-panel border border-outline-variant cursor-pointer overflow-hidden flex flex-col justify-between"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-surface-high border border-primary/20 flex items-center justify-center text-3xl shadow-lg mb-4">
          {archetype.icon}
        </div>
        <h3 className="text-xl font-display font-black text-white leading-tight mb-1">{archetype.title}</h3>
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4">{archetype.subtitle}</p>
        
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {archetype.vibe}
        </p>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-outline-variant pt-4">
        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Assume Identity</span>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
          <ChevronRight size={16} />
        </div>
      </div>
    </motion.div>
  );
};

import { useNavigate } from 'react-router-dom';

const IdentitySelectionMatrix: React.FC = () => {
  const [showAll, setShowAll] = useState(false);
  const { importDemoData } = useTrackStore();
  const [isInjecting, setIsInjecting] = useState(false);
  const navigate = useNavigate();

  const displayedArchetypes = showAll ? curatedArchetypes : curatedArchetypes.slice(0, 5);

  const handleSelect = async (archetype: Archetype) => {
    if (window.confirm(`Are you sure you want to initialize the [${archetype.title}] trajectory? This will overwrite your current state.`)) {
      setIsInjecting(true);
      SoundManager.playSwell();
      try {
        await importDemoData(archetype.data);
        SoundManager.playSyncSuccess();
        setTimeout(() => {
          navigate('/');
        }, 800);
      } catch (err) {
        console.error('Failed to assume identity:', err);
        alert('Failed to construct trajectory.');
        SoundManager.playThud();
        setIsInjecting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface-lowest text-white flex flex-col relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 -left-32 w-96 h-96 bg-secondary/10 blur-[120px] rounded-full pointer-events-none" />

      {isInjecting && (
        <div className="absolute inset-0 z-50 bg-surface-lowest/90 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest animate-pulse">Constructing Neural Pathways...</h2>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 space-y-16">
          
          <header className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              Identity Selection Matrix
            </div>
            <h1 className="text-5xl md:text-6xl font-display font-black text-white leading-tight">
              Choose your <br/><span className="text-primary">Trajectory.</span>
            </h1>
            <p className="text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Select a curated neuro-profile to instantly construct your dashboard with calibrated ambitions, daily actions, and void protocols.
            </p>
          </header>

          <div className="relative">
            {/* Horizontal scrolling on mobile, wrapping grid on desktop */}
            <motion.div layout className="flex flex-nowrap md:flex-wrap gap-6 overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory">
              <AnimatePresence mode="popLayout">
                {displayedArchetypes.map((arch) => (
                  <div key={arch.id} className="snap-center">
                    <ArchetypeCard 
                      archetype={arch} 
                      onSelect={() => handleSelect(arch)}
                    />
                  </div>
                ))}
              </AnimatePresence>

              {!showAll && (
                <motion.div
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="snap-center flex-shrink-0 w-72 h-80 rounded-[2rem] border-2 border-dashed border-outline-variant flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all group"
                  onClick={() => {
                    SoundManager.playPop();
                    setShowAll(true);
                  }}
                >
                  <div className="w-12 h-12 rounded-full bg-surface-high flex items-center justify-center text-on-surface-variant group-hover:text-primary group-hover:bg-primary/10 transition-colors mb-4">
                    <ChevronRight size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors">
                    Initialize Extended Profiles
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default IdentitySelectionMatrix;
