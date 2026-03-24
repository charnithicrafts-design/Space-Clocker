import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { SoundManager } from '../../utils/SoundManager';

const MomentumEngine = () => {
  const { profile, ambitions, addAmbition } = useTrackStore();
  const [newAmbition, setNewAmbition] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAmbition.trim()) return;
    addAmbition(newAmbition);
    SoundManager.playPop();
    setNewAmbition('');
  };

  return (
    <div className="p-6 lg:pl-80 space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-on-surface-variant text-sm tracking-widest uppercase font-medium">{profile.title}</h2>
          <h1 className="text-4xl font-display font-black text-primary">LVL {profile.level}</h1>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input 
          className="flex-1 bg-surface-high p-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none"
          placeholder="Define new ambition..."
          value={newAmbition}
          onChange={(e) => setNewAmbition(e.target.value)}
        />
        <button className="px-6 py-3 bg-primary-container text-on-primary rounded-xl font-bold">Add</button>
      </form>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ambitions.map((ambition) => (
          <div key={ambition.id} className="glass-panel border border-outline-variant p-6 rounded-3xl nebula-shadow">
            <h3 className="font-display font-bold text-lg mb-4">{ambition.title}</h3>
            <div className="text-3xl font-display font-black text-primary-container">{ambition.progress}%</div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default MomentumEngine;
