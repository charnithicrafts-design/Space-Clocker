import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { curatedArchetypes, Archetype } from '../../data/archetypes';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import { ChevronRight, Sparkles, Search } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const { importDemoData, profile } = useTrackStore();
  const [isInjecting, setIsInjecting] = useState(false);
  const navigate = useNavigate();

  const filteredArchetypes = curatedArchetypes.filter(arch => {
    const term = searchQuery.toLowerCase();
    return arch.title.toLowerCase().includes(term) ||
           arch.subtitle.toLowerCase().includes(term) ||
           arch.vibe.toLowerCase().includes(term);
  });

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

      {/* Navigation Return */}
      {profile?.name && (
        <button 
          onClick={() => {
            SoundManager.playPop();
            navigate('/');
          }}
          className="absolute top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-high border border-outline-variant text-on-surface hover:text-primary hover:border-primary/50 transition-colors"
        >
          <ChevronRight size={16} className="rotate-180" />
          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Return to Command Center</span>
          <span className="text-xs font-bold uppercase tracking-widest sm:hidden">Return</span>
        </button>
      )}

      {isInjecting && (
        <div className="absolute inset-0 z-50 bg-surface-lowest/90 backdrop-blur-xl flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
          <h2 className="text-2xl font-display font-black text-white uppercase tracking-widest animate-pulse text-center px-4">Constructing Neural Pathways...</h2>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-24 space-y-12">
          
          <header className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
              <Sparkles size={14} />
              Identity Selection Matrix
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight">
              Choose your <br/><span className="text-primary">Trajectory.</span>
            </h1>
            <p className="text-base md:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
              Select a curated neuro-profile to instantly construct your dashboard with calibrated ambitions, daily actions, and void protocols.
            </p>
          </header>

          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-on-surface-variant" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-4 bg-surface-high border border-outline-variant rounded-2xl text-white placeholder-on-surface-variant focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
              placeholder="Search professions (e.g., Surgeon, Developer, Chef)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="relative">
            {/* Wrapping grid for desktop and mobile to make scanning easier */}
            <motion.div layout className="flex flex-wrap gap-4 md:gap-6 pb-8 md:pb-0 justify-center sm:justify-start">
              <AnimatePresence mode="popLayout">
                {filteredArchetypes.length > 0 ? (
                  filteredArchetypes.map((arch) => (
                    <motion.div 
                      key={arch.id} 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                    >
                      <ArchetypeCard 
                        archetype={arch} 
                        onSelect={() => handleSelect(arch)}
                      />
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full text-center py-12"
                  >
                    <p className="text-on-surface-variant text-lg">No trajectories found matching "{searchQuery}".</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default IdentitySelectionMatrix;
