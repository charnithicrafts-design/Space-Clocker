import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { Save, Download, Upload, User, Cpu, Shield, Trash2, RefreshCcw } from 'lucide-react';

const SettingsDashboard = () => {
  const store = useTrackStore();
  const { profile, oracleConfig, preferences, updateProfile, updateOracleConfig, updatePreferences, importData } = store;

  const [localProfile, setLocalProfile] = useState(profile);
  const [localOracle, setLocalOracle] = useState(oracleConfig);
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    updateProfile(localProfile);
    updateOracleConfig(localOracle);
    updatePreferences(localPrefs);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleExport = () => {
    const data = JSON.stringify(store, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `space-clocker-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (window.confirm('This will overwrite your current progress. Proceed?')) {
          importData(data);
          window.location.reload();
        }
      } catch (err) {
        alert('Invalid data file.');
      }
    };
    reader.readAsText(file);
  };

  const handleReset = () => {
    if (window.confirm('CRITICAL: This will wipe all local data. Are you sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 lg:pl-80 space-y-8 min-h-screen bg-surface-lowest text-white pb-32">
      <header className="mb-8">
        <h2 className="text-secondary text-sm font-bold tracking-widest uppercase">System Protocol</h2>
        <h1 className="text-4xl font-display font-black text-white">Settings</h1>
        <p className="text-on-surface-variant">Configure your trajectory and neural link.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Profile Section */}
        <section className="glass-panel border border-outline-variant p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4 mb-4">
            <User className="text-primary" />
            <h3 className="font-display font-bold text-xl">Pilot Profile</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Pilot Name</label>
              <input 
                className="w-full bg-surface-high p-4 rounded-xl border border-outline-variant focus:border-primary focus:outline-none transition-colors"
                value={localProfile.name}
                onChange={(e) => setLocalProfile({ ...localProfile, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Rank / Title</label>
              <input 
                className="w-full bg-surface-high p-4 rounded-xl border border-outline-variant focus:border-primary focus:outline-none transition-colors"
                value={localProfile.title}
                onChange={(e) => setLocalProfile({ ...localProfile, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Momentum Level</label>
              <input 
                type="number"
                className="w-full bg-surface-high p-4 rounded-xl border border-outline-variant focus:border-primary focus:outline-none transition-colors"
                value={localProfile.level}
                onChange={(e) => setLocalProfile({ ...localProfile, level: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
        </section>

        {/* Oracle Section */}
        <section className="glass-panel border border-outline-variant p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4 mb-4">
            <Cpu className="text-secondary" />
            <h3 className="font-display font-bold text-xl">AI Oracle (Neural Link)</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">API Key</label>
              <input 
                type="password"
                className="w-full bg-surface-high p-4 rounded-xl border border-outline-variant focus:border-secondary focus:outline-none transition-colors"
                placeholder="sk-..."
                value={localOracle.apiKey}
                onChange={(e) => setLocalOracle({ ...localOracle, apiKey: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Model</label>
              <input 
                className="w-full bg-surface-high p-4 rounded-xl border border-outline-variant focus:border-secondary focus:outline-none transition-colors"
                value={localOracle.model}
                onChange={(e) => setLocalOracle({ ...localOracle, model: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Provider URL</label>
              <input 
                className="w-full bg-surface-high p-4 rounded-xl border border-outline-variant focus:border-secondary focus:outline-none transition-colors"
                value={localOracle.providerUrl}
                onChange={(e) => setLocalOracle({ ...localOracle, providerUrl: e.target.value })}
              />
            </div>
          </div>
        </section>

        {/* Portability Section */}
        <section className="glass-panel border border-outline-variant p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4 mb-4">
            <Shield className="text-primary-container" />
            <h3 className="font-display font-bold text-xl">Data Portability</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              onClick={handleExport}
              className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-high border border-outline-variant hover:border-primary hover:text-primary transition-all group"
            >
              <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
              <span className="font-bold uppercase text-xs tracking-widest">Export JSON</span>
            </button>
            
            <label className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-high border border-outline-variant hover:border-secondary hover:text-secondary transition-all group cursor-pointer">
              <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
              <span className="font-bold uppercase text-xs tracking-widest">Import JSON</span>
              <input type="file" className="hidden" accept=".json" onChange={handleImport} />
            </label>
          </div>
          
          <div className="pt-4 border-t border-outline-variant">
            <button 
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl border border-error/30 text-error hover:bg-error/10 transition-colors"
            >
              <Trash2 size={20} />
              <span className="font-bold uppercase text-xs tracking-widest">Wipe Local Memory</span>
            </button>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="glass-panel border border-outline-variant p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4 mb-4">
            <RefreshCcw className="text-secondary" />
            <h3 className="font-display font-bold text-xl">System Preferences</h3>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-high border border-outline-variant">
            <div>
              <h4 className="font-bold text-sm">Confirm Deletion</h4>
              <p className="text-xs text-on-surface-variant">Ask for confirmation before removing tasks or milestones.</p>
            </div>
            <button 
              onClick={() => setLocalPrefs({ ...localPrefs, confirmDelete: !localPrefs.confirmDelete })}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${localPrefs.confirmDelete ? 'bg-primary' : 'bg-surface-low'}`}
            >
              <motion.div 
                animate={{ x: localPrefs.confirmDelete ? 24 : 0 }}
                className="w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </button>
          </div>
        </section>

        {/* Info Section */}
        <section className="glass-panel border border-outline-variant p-8 rounded-3xl flex flex-col justify-center items-center text-center space-y-4">
          <RefreshCcw className="text-on-surface-variant animate-spin-slow" size={48} />
          <div>
            <h3 className="font-display font-bold text-xl">System Version 1.2.0</h3>
            <p className="text-on-surface-variant text-sm mt-2 max-w-xs">
              Your trajectory data is stored locally in your browser's neural buffer. Back up often to prevent data loss during deep space transitions.
            </p>
          </div>
        </section>
      </div>

      <div className="fixed bottom-12 right-12 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          className={`flex items-center gap-3 p-4 px-8 rounded-2xl font-black uppercase tracking-tighter shadow-2xl transition-colors ${isSaved ? 'bg-success text-on-success' : 'bg-primary-container text-on-primary'}`}
        >
          <Save size={24} />
          <span>{isSaved ? 'Sync Successful' : 'Sync Changes'}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default SettingsDashboard;
