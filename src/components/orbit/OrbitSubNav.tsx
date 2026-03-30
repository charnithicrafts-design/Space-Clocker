import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Layers, ShieldAlert } from 'lucide-react';

export type OrbitHorizon = 'daily' | 'weekly' | 'void';

interface OrbitSubNavProps {
  active: OrbitHorizon;
  onChange: (horizon: OrbitHorizon) => void;
}

const OrbitSubNav: React.FC<OrbitSubNavProps> = ({ active, onChange }) => {
  const tabs: { id: OrbitHorizon; label: string; icon: any; color: string }[] = [
    { id: 'daily', label: 'Daily Mission', icon: Clock, color: 'text-primary' },
    { id: 'weekly', label: 'Weekly Resonance', icon: Layers, color: 'text-secondary' },
    { id: 'void', label: 'Void Protocol', icon: ShieldAlert, color: 'text-error' },
  ];

  return (
    <div className="flex flex-wrap gap-2 p-1 bg-surface-high/50 rounded-2xl border border-outline-variant w-fit mb-8">
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        const Icon = tab.icon;
        
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all relative ${isActive ? 'text-white' : 'text-on-surface-variant hover:text-white'}`}
          >
            {isActive && (
              <motion.div
                layoutId="active-orbit-tab"
                className="absolute inset-0 bg-surface-low rounded-xl border border-outline-variant shadow-lg"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon size={16} className={`relative z-10 ${isActive ? tab.color : ''}`} />
            <span className="relative z-10">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default OrbitSubNav;
