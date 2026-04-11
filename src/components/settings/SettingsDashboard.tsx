import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTrackStore } from '../../store/useTrackStore';
import { CURRENT_APP_VERSION } from '../../constants';
import { Save, Download, Upload, User, Cpu, Shield, Trash2, RefreshCcw, Database, Globe, Cloud, Link, AlertCircle, Check } from 'lucide-react';
import { dumpDb, restoreDb } from '../../db/client';
import { syncService } from '../../services/SyncService';
import { SoundManager } from '../../utils/SoundManager';
import { getTodayLocalISO } from '../../utils/DateTimeUtils';

const SettingsDashboard = () => {
  const store = useTrackStore();
  const { profile, oracleConfig, preferences, syncStatus, updateProfile, updateOracleConfig, updatePreferences, importData, initialize, setSyncStatus } = store;

  const [localProfile, setLocalProfile] = useState(profile);
  const [localOracle, setLocalOracle] = useState(oracleConfig);
  const [localPrefs, setLocalPrefs] = useState(preferences);
  const [isSaved, setIsSaved] = useState(false);
  const [isDumping, setIsDumping] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showUpToDate, setShowUpToDate] = useState(false);

  const handleSave = () => {
    updateProfile(localProfile);
    updateOracleConfig(localOracle);
    updatePreferences(localPrefs);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleSyncNow = async () => {
    try {
      setSyncStatus({ isSyncing: true, error: undefined });
      SoundManager.playUplink();
      const { syncedAt } = await syncService.pushUpdate();
      setSyncStatus({ isSyncing: false, lastSyncedAt: syncedAt });
      SoundManager.playSyncSuccess();
    } catch (err) {
      console.error('Sync failed:', err);
      setSyncStatus({ isSyncing: false, error: 'Telemetry Uplink Failed' });
      SoundManager.playThud();
    }
  };

  const handleEstablishLink = async () => {
    try {
      if (!localOracle.clientId) {
        alert('Please provide a Google Client ID first.');
        return;
      }
      setSyncStatus({ isSyncing: true, error: undefined });
      await syncService.authorize(localOracle.clientId);
      updateOracleConfig({ syncEnabled: true });
      setSyncStatus({ isSyncing: false });
      SoundManager.playSyncSuccess();
    } catch (err) {
      console.error('Auth failed:', err);
      setSyncStatus({ isSyncing: false, error: 'Neural Link Authorization Failed' });
      SoundManager.playThud();
    }
  };

  const handleSeverLink = () => {
    updateOracleConfig({ syncEnabled: false });
    SoundManager.playPop();
  };

  const handleExportJSON = async () => {
    try {
      const data = await store.exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `space-clocker-trajectory-${getTodayLocalISO()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      SoundManager.playSyncSuccess();
    } catch (err) {
      console.error('Export failed:', err);
      alert('Trajectory export failed.');
      SoundManager.playThud();
    }
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (window.confirm('This will overwrite your current trajectories with the imported data. Proceed?')) {
          await importData(data);
          SoundManager.playSyncSuccess();
          // Give PGlite a small window to flush to IndexedDB before reload
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
      } catch (err: any) {
        console.error('Import failure:', err);
        alert(`Import failed: ${err.message || 'Invalid trajectory file structure.'}`);
        SoundManager.playThud();
      }
    };
    reader.readAsText(file);
  };

  const handleCreateSnapshot = async () => {
    try {
      setIsDumping(true);
      SoundManager.playPop();
      const blob = await dumpDb();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chronos-snapshot-${getTodayLocalISO()}.pgdump`;
      a.click();
      URL.revokeObjectURL(url);
      SoundManager.playSyncSuccess();
    } catch (err) {
      console.error('Snapshot failed:', err);
      alert('Failed to create system snapshot.');
      SoundManager.playThud();
    } finally {
      setIsDumping(false);
    }
  };

  const handleRestoreSnapshot = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (window.confirm('CRITICAL: This will replace your entire local database with the snapshot. Proceed?')) {
      try {
        setIsRestoring(true);
        SoundManager.playSwell();
        await restoreDb(file);
        SoundManager.playSyncSuccess();
        // Give PGlite a small window to flush to IndexedDB before reload
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } catch (err: any) {
        console.error('Restore failure:', err);
        const errorMsg = err.message || '';
        if (errorMsg.includes('NoModificationAllowedError') || errorMsg.includes('ENOTEMPTY') || errorMsg.includes('ErrnoError')) {
          alert(`Storage Collision Detected (Errno ${err.errno || 'N/A'}).\n\nThe system cannot overwrite the existing database link because it is currently locked or corrupted.\n\nACTION: Click "Temporal Purge" to clear all database fragments, then try the restore again.`);
        } else {
          alert(`Restore failed: ${errorMsg || 'Ensure it is a valid .pgdump file.'}`);
        }
        SoundManager.playThud();
      } finally {
        setIsRestoring(false);
      }
    }
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
        <h1 className="text-4xl font-display font-black text-primary">Settings</h1>
        <p className="text-on-surface-variant">Configure your trajectory and neural link.</p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
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
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">Google Client ID (Sync)</label>
              <input 
                className="w-full bg-surface-high p-4 rounded-xl border border-outline-variant focus:border-secondary focus:outline-none transition-colors"
                placeholder="Neural Link Client ID"
                value={localOracle.clientId || ''}
                onChange={(e) => setLocalOracle({ ...localOracle, clientId: e.target.value })}
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

        <section className="glass-panel border border-outline-variant p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4 mb-4">
            <Globe className="text-primary-container" />
            <h3 className="font-display font-bold text-xl">Communication Array</h3>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
              <Cloud size={14} className="text-secondary" />
              Stellar Sync (Cloud)
            </h4>
            <div className="p-4 rounded-2xl bg-surface-high border border-outline-variant space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-sm">Neural Link Status</h5>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
                    {syncStatus.lastSyncedAt ? `Last Uplink: ${new Date(syncStatus.lastSyncedAt).toLocaleString()}` : 'Array Disconnected'}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${oracleConfig.syncEnabled ? 'bg-success/20 text-success border border-success/30' : 'bg-surface-low text-on-surface-variant border border-outline-variant'}`}>
                  {oracleConfig.syncEnabled ? 'Active' : 'Offline'}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={oracleConfig.syncEnabled ? handleSeverLink : handleEstablishLink}
                  className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all font-bold text-[10px] uppercase tracking-widest ${oracleConfig.syncEnabled ? 'bg-error/10 border-error/20 text-error hover:bg-error/20' : 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'}`}
                >
                  <Link size={14} />
                  {oracleConfig.syncEnabled ? 'Sever Link' : 'Establish Link'}
                </button>
                <button 
                  onClick={handleSyncNow}
                  disabled={!oracleConfig.syncEnabled || syncStatus.isSyncing}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary hover:bg-secondary/20 transition-all font-bold text-[10px] uppercase tracking-widest disabled:opacity-30"
                >
                  <RefreshCcw size={14} className={syncStatus.isSyncing ? 'animate-spin' : ''} />
                  {syncStatus.isSyncing ? 'Uplinking...' : 'Sync Now'}
                </button>
              </div>
              {syncStatus.error && (
                <div className="flex items-center gap-2 text-error text-[10px] font-bold bg-error/5 p-2 rounded-lg border border-error/10">
                  <AlertCircle size={12} />
                  {syncStatus.error}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-outline-variant">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
              <Database size={14} className="text-primary" />
              Chronos Backup (Binary)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={handleCreateSnapshot}
                disabled={isDumping}
                className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-high border border-outline-variant hover:border-primary hover:text-primary transition-all group disabled:opacity-50"
              >
                <Database size={20} className={isDumping ? 'animate-pulse' : 'group-hover:-translate-y-1 transition-transform'} />
                <span className="font-bold uppercase text-xs tracking-widest">{isDumping ? 'Dumping...' : 'Create Snapshot'}</span>
              </button>
              <label className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-high border border-outline-variant hover:border-secondary hover:text-secondary transition-all group cursor-pointer">
                <RefreshCcw size={20} className={isRestoring ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} />
                <span className="font-bold uppercase text-xs tracking-widest">Restore Snapshot</span>
                <input type="file" className="hidden" accept=".pgdump" onChange={handleRestoreSnapshot} />
              </label>
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-outline-variant">
            <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-widest flex items-center gap-2">
              <RefreshCcw size={14} className="text-secondary" />
              Trajectory Portability (JSON)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={handleExportJSON}
                className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-high border border-outline-variant hover:border-primary hover:text-primary transition-all group"
              >
                <Download size={20} className="group-hover:-translate-y-1 transition-transform" />
                <span className="font-bold uppercase text-xs tracking-widest">Export JSON</span>
              </button>
              <label className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-surface-high border border-outline-variant hover:border-secondary hover:text-secondary transition-all group cursor-pointer">
                <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
                <span className="font-bold uppercase text-xs tracking-widest">Import JSON</span>
                <input type="file" className="hidden" accept=".json" onChange={handleImportJSON} />
              </label>
            </div>
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

        <section className="glass-panel border border-outline-variant p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4 mb-4">
            <RefreshCcw className="text-secondary" />
            <h3 className="font-display font-bold text-xl">System Preferences</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-high border border-outline-variant">
              <div>
                <h4 className="font-bold text-sm">UI Strategy</h4>
                <p className="text-xs text-on-surface-variant">Switch between Simple and Professional modes.</p>
              </div>
              <div className="flex bg-surface-low p-1 rounded-xl border border-outline-variant">
                <button 
                  onClick={() => { setLocalPrefs({ ...localPrefs, uiMode: 'simple' }); SoundManager.playPop(); }}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${localPrefs.uiMode === 'simple' ? 'bg-primary text-on-primary shadow-lg' : 'text-on-surface-variant hover:text-white'}`}
                >
                  Simple
                </button>
                <button 
                  onClick={() => { setLocalPrefs({ ...localPrefs, uiMode: 'professional' }); SoundManager.playPop(); }}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${localPrefs.uiMode === 'professional' ? 'bg-secondary text-on-secondary shadow-lg' : 'text-on-surface-variant hover:text-white'}`}
                >
                  Pro
                </button>
              </div>
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
          </div>
        </section>

        <section className="glass-panel border border-outline-variant p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-3 border-b border-outline-variant pb-4 mb-4">
            <Cpu className="text-primary" />
            <h3 className="font-display font-bold text-xl">System Manifest</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-surface-high border border-outline-variant">
              <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Current Codebase</h4>
              <p className="text-xl font-display font-black text-white">v{CURRENT_APP_VERSION}</p>
            </div>
            <div className="p-4 rounded-2xl bg-surface-high border border-outline-variant">
              <h4 className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1">Database Schema</h4>
              <p className="text-xl font-display font-black text-secondary">v{store.dbAppVersion || 'Unknown'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {showUpToDate ? (
                <motion.div
                  key="up-to-date"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-success-container/10 border border-success/30 text-success"
                >
                  <Check size={18} className="shrink-0" />
                  <div className="flex flex-col">
                    <p className="text-[10px] font-black uppercase tracking-widest leading-tight">System Manifest Synchronized</p>
                    <p className="text-[9px] font-medium opacity-90">Current trajectory is optimal. Proceed with your ambitions, Architect.</p>
                  </div>
                </motion.div>
              ) : (
                <button 
                  key="check-btn"
                  onClick={async () => {
                    SoundManager.playPop();
                    await store.checkForUpdates();
                    if (!store.updateAvailable) {
                      setShowUpToDate(true);
                      setTimeout(() => setShowUpToDate(false), 5000);
                    }
                  }}
                  disabled={store.isCheckingUpdates}
                  className={`w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-surface-low border border-outline-variant hover:border-primary transition-all font-bold text-xs uppercase tracking-[0.2em] ${store.isCheckingUpdates ? 'opacity-70 cursor-wait' : ''}`}
                >
                  <RefreshCcw size={16} className={store.isCheckingUpdates ? 'animate-spin' : ''} />
                  {store.isCheckingUpdates ? 'Syncing Manifest...' : 'Check for Trajectory Updates'}
                </button>
              )}
            </AnimatePresence>
            
            {store.updateAvailable && (
              <button 
                onClick={() => {
                  SoundManager.playSwell();
                  store.setShowUpdateModal(true);
                }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-primary text-on-primary font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
              >
                <RefreshCcw size={16} />
                Deploy System Upgrade (v{store.pendingVersion})
              </button>
            )}
          </div>
          
          <p className="text-[10px] text-on-surface-variant text-center italic">
            Neural link established via Chronos Core.
          </p>
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
