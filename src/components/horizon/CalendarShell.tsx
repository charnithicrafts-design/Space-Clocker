import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Horizon = 'daily' | 'weekly' | 'yearly';

const TimeHorizonPicker = ({ active, onChange }: { active: Horizon; onChange: (h: Horizon) => void }) => (
  <div className="flex bg-surface-high p-1 rounded-xl">
    {(['daily', 'weekly', 'yearly'] as Horizon[]).map((h) => (
      <button 
        key={h}
        onClick={() => onChange(h)}
        className={`px-4 py-2 rounded-lg capitalize text-sm font-medium transition-all ${active === h ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:text-primary'}`}
      >
        {h}
      </button>
    ))}
  </div>
);

const CalendarShell = () => {
  const [horizon, setHorizon] = useState<Horizon>('daily');

  return (
    <div className="p-6 lg:pl-80 space-y-8">
      <header className="flex justify-between items-center">
        <h2 className="text-on-surface-variant text-sm tracking-widest uppercase font-medium">Stellar Timeline</h2>
        <TimeHorizonPicker active={horizon} onChange={setHorizon} />
      </header>

      <div className="glass-panel border border-outline-variant p-8 rounded-3xl min-h-[400px] flex items-center justify-center">
        <div className="text-on-surface-variant">
          {horizon === 'daily' && "Daily Focus Protocol active."}
          {horizon === 'weekly' && "Resonance Matrix visualization (Coming Soon)"}
          {horizon === 'yearly' && "Stellar Path timeline (Coming Soon)"}
        </div>
      </div>
    </div>
  );
};

export default CalendarShell;
