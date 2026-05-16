import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import MomentumEngine from './components/dashboard/MomentumEngine';
import NebulaMap from './components/nebula/NebulaMap';
import OrbitScheduler from './components/orbit/OrbitScheduler';
import CalendarShell from './components/horizon/CalendarShell';
import EventHorizon from './components/horizon/EventHorizon';
import SkillsMatrix from './components/skills/SkillsMatrix';
import { OracleDashboard } from './components/oracle/OracleDashboard';
import SettingsDashboard from './components/settings/SettingsDashboard';
import TransmissionDashboard from './components/transmission/TransmissionDashboard';
import SharedTransmission from './components/transmission/SharedTransmission';
import SyncConflictModal from './components/reflection/SyncConflictModal';
import OnboardingTour from './components/layout/OnboardingTour';
import UpdateModal from './components/layout/UpdateModal';
import CriticalUpdateBanner from './components/layout/CriticalUpdateBanner';
import { useTrackStore } from './store/useTrackStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const App = () => {
  const { initialize, checkSync, performPull, oracleConfig, ambitions, updateAvailable } = useTrackStore();
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const startupInitiated = useRef(false);

  useEffect(() => {
    if (startupInitiated.current) return;
    startupInitiated.current = true;

    const startup = async () => {
      try {
        console.log('[App] Starting Momentum synchronization...');
        await initialize();
        console.log('[App] Store initialized.');

        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        console.log(`[App] Onboarding status: ${hasSeenOnboarding}`);
        
        // If store is initialized and empty, and onboarding not seen, show it
        if (!hasSeenOnboarding) {
          console.log('[App] Triggering onboarding sequence.');
          setShowOnboarding(true);
        }

        // Check for sync divergence if enabled
        if (oracleConfig.syncEnabled) {
          console.log('[App] Checking for Stellar Sync divergence...');
          const result = await checkSync();
          if (result === 'remote_newer') {
            setIsSyncModalOpen(true);
          }
        }
        console.log('[App] Initial sequence complete.');
      } catch (err) {
        console.error('[App] Startup failure:', err);
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

  const handleCompleteOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className={`min-h-screen bg-surface-lowest text-on-surface ${updateAvailable && !showOnboarding ? 'pt-10' : ''}`}>
          {!showOnboarding && <CriticalUpdateBanner />}
          <Navigation />

          {showOnboarding ? (
            <OnboardingTour onComplete={handleCompleteOnboarding} />
          ) : (
            <UpdateModal />
          )}

          <main className="pb-24 lg:pb-0">
            <Routes>
              <Route path="/" element={<MomentumEngine />} />
              <Route path="/nebula" element={<NebulaMap />} />
              <Route path="/orbit" element={<OrbitScheduler />} />
              <Route path="/timeline" element={<CalendarShell />} />
              <Route path="/horizon" element={<EventHorizon />} />
              <Route path="/skills" element={<SkillsMatrix />} />
              <Route path="/oracle" element={<OracleDashboard onClose={() => window.history.back()} />} />
              <Route path="/transmission" element={<TransmissionDashboard />} />
              <Route path="/transmission/share" element={<SharedTransmission />} />
              <Route path="/settings" element={<SettingsDashboard />} />
            </Routes>
          </main>

          <SyncConflictModal 
            isOpen={isSyncModalOpen}
            onClose={() => setIsSyncModalOpen(false)}
            onResolve={handleResolveConflict}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
