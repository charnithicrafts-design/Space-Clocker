import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Layers, ShieldAlert, Archive } from 'lucide-react';
import { useVocabulary } from '../../utils/vocabulary';

export type OrbitHorizon = 'daily' | 'weekly' | 'backlog' | 'void';

interface OrbitSubNavProps {
  active: OrbitHorizon;
  onChange: (horizon: OrbitHorizon) => void;
}

const OrbitSubNav: React.FC<OrbitSubNavProps> = ({ active, onChange }) => {
  const { isPeopleMode } = useVocabulary();

  const tabs: { id: OrbitHorizon; label: string; icon: any; color: string }[] = [
    { id: 'daily', label: isPeopleMode ? 'Daily Tasks' : 'Daily Mission', icon: Clock, color: 'text-primary' },
    { id: 'weekly', label: isPeopleMode ? 'Weekly Goals' : 'Weekly Resonance', icon: Layers, color: 'text-secondary' },
    { id: 'backlog', label: isPeopleMode ? 'Backlog' : 'Stasis Backlog', icon: Archive, color: 'text-tertiary' },
    { id: 'void', label: isPeopleMode ? 'Habits to Avoid' : 'Void Protocol', icon: ShieldAlert, color: 'text-error' },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-1.5 bg-surface-high/50 rounded-2xl border border-outline-variant w-fit max-w-full mb-6 sm:mb-8">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 h-9 sm:h-10 px-3 sm:px-4 rounded-xl type-overline transition-all relative ${isActive ? 'text-white' : 'text-on-surface-variant hover:text-white'}`}
          >
            {isActive && (
              <motion.div
                layoutId="active-orbit-tab"
                className="absolute inset-0 bg-surface-low rounded-xl border border-outline-variant shadow-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={14} className={`relative z-10 sm:w-4 sm:h-4 ${isActive ? tab.color : ''}`} />
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default OrbitSubNav;
