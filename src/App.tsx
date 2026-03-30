import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import MomentumEngine from './components/dashboard/MomentumEngine';
import NebulaMap from './components/nebula/NebulaMap';
import OrbitScheduler from './components/orbit/OrbitScheduler';
import CalendarShell from './components/horizon/CalendarShell';
import EventHorizon from './components/horizon/EventHorizon';
import SkillsMatrix from './components/skills/SkillsMatrix';
import SettingsDashboard from './components/settings/SettingsDashboard';
import TransmissionDashboard from './components/transmission/TransmissionDashboard';
import SharedTransmission from './components/transmission/SharedTransmission';
import SyncConflictModal from './components/reflection/SyncConflictModal';
import { useTrackStore } from './store/useTrackStore';

const App = () => {
  const { initialize, checkSync, performPull, oracleConfig } = useTrackStore();
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  useEffect(() => {
    const startup = async () => {
      await initialize();
      
      // Check for sync divergence if enabled
      if (oracleConfig.syncEnabled) {
        const result = await checkSync();
        if (result === 'remote_newer') {
          setIsSyncModalOpen(true);
        }
      }
    };
    startup();
  }, [initialize, checkSync, oracleConfig.syncEnabled]);

  const handleResolveConflict = async (strategy: 'local' | 'remote') => {
    if (strategy === 'remote') {
      await performPull();
    }
    setIsSyncModalOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-surface-lowest text-on-surface">
        <Navigation />
        <Routes>
          <Route path="/" element={<MomentumEngine />} />
          <Route path="/nebula" element={<NebulaMap />} />
          <Route path="/orbit" element={<OrbitScheduler />} />
          <Route path="/timeline" element={<CalendarShell />} />
          <Route path="/horizon" element={<EventHorizon />} />
          <Route path="/skills" element={<SkillsMatrix />} />
          <Route path="/transmission" element={<TransmissionDashboard />} />
          <Route path="/transmission/share" element={<SharedTransmission />} />
          <Route path="/settings" element={<SettingsDashboard />} />
        </Routes>

        <SyncConflictModal 
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
          onResolve={handleResolveConflict}
        />
      </div>
    </Router>
  );
};

export default App;
