import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';
import { Calendar, Briefcase } from 'lucide-react';

const InternshipScheduler = () => {
  const { addInternship, internships } = useTrackStore();
  const [org, setOrg] = useState<'ISRO' | 'NASA'>('ISRO');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!start || !end) return;
    addInternship({ organization: org, start, end });
    SoundManager.playPop();
    setStart('');
    setEnd('');
  };

  return (
    <div className="p-6 lg:pl-80 space-y-8">
      <h2 className="text-on-surface-variant text-sm tracking-widest uppercase font-medium">Internship Scheduler</h2>

      <form onSubmit={handleAdd} className="glass-panel border border-outline-variant p-6 rounded-2xl space-y-4">
        <select value={org} onChange={(e) => setOrg(e.target.value as 'ISRO' | 'NASA')} className="w-full bg-surface-high p-3 rounded-xl border border-outline-variant">
          <option value="ISRO">ISRO</option>
          <option value="NASA">NASA</option>
        </select>
        <div className="grid grid-cols-2 gap-4">
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="bg-surface-high p-3 rounded-xl border border-outline-variant" />
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="bg-surface-high p-3 rounded-xl border border-outline-variant" />
        </div>
        <button className="w-full py-3 bg-primary-container text-on-primary rounded-xl font-bold">Schedule Period</button>
      </form>

      <section className="space-y-4">
        {internships.map((i, idx) => (
          <motion.div key={idx} className="glass-panel border border-outline-variant p-4 rounded-xl flex items-center gap-4">
            <Briefcase className="text-secondary" />
            <div>
              <div className="font-bold">{i.organization} Internship</div>
              <div className="text-xs text-on-surface-variant">{i.start} to {i.end}</div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default InternshipScheduler;
