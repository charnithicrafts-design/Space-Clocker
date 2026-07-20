import React, { useEffect, useState, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navigation from './components/layout/Navigation';
import MomentumEngine from './components/dashboard/MomentumEngine';
import NebulaMap from './components/nebula/NebulaMap';
import OrbitScheduler from './components/orbit/OrbitScheduler';
import CalendarShell from './components/horizon/CalendarShell';
import EventHorizon from './components/horizon/EventHorizon';
import SkillsMatrix from './components/skills/SkillsMatrix';
import { OracleDashboard } from './components/oracle/OracleDashboard';
import SettingsDashboard from './components/settings/SettingsDashboard';
import AboutPage from './components/about/AboutPage';
import ProfileDashboard from './components/profile/ProfileDashboard';
import TransmissionDashboard from './components/transmission/TransmissionDashboard';
import SharedTransmission from './components/transmission/SharedTransmission';
import SyncConflictModal from './components/reflection/SyncConflictModal';
import OnboardingTour from './components/layout/OnboardingTour';
import IdentitySelectionMatrix from './components/onboarding/IdentitySelectionMatrix';
import LandingPage from './components/marketing/LandingPage';
import UpdateModal from './components/layout/UpdateModal';
import CriticalUpdateBanner from './components/layout/CriticalUpdateBanner';
import { useTrackStore } from './store/useTrackStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Award } from 'lucide-react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initDb } from './db/init';
import { migrateFromZustand } from './db/migrate';
import { purgeDatabase } from './db/client';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

const AppContent = () => {
  const { pathname } = useLocation();
  const { initialize, checkSync, performPull, oracleConfig, updateAvailable, profile, showSyncModal, setShowSyncModal, cognitiveState } = useTrackStore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dbStatus, setDbStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [prevLevel, setPrevLevel] = useState<number | null>(null);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [dbError, setDbError] = useState<any>(null);
  const startupInitiated = useRef(false);

  useEffect(() => {
    if (startupInitiated.current) return;
    startupInitiated.current = true;

    const startup = async () => {
      try {
        console.log('[System] Initiating neural link...');
        await initDb();
        console.log('[System] Database online.');
        await migrateFromZustand();
        console.log('[System] Neural pathways synchronized.');
        await initialize();
        console.log('[App] Store initialized.');

        const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
        if (!hasSeenOnboarding) {
          setShowOnboarding(true);
        }

        if (oracleConfig.syncEnabled) {
          const result = await checkSync();
          if (result === 'remote_newer') {
            setShowSyncModal(true);
          }
        }
        setDbStatus('ready');
      } catch (err) {
        console.error('[Critical] Neural Link Failure:', err);
        setDbError(err);
        setDbStatus('error');
      }
    };
    startup();
  }, [initialize, checkSync, oracleConfig.syncEnabled]);

  useEffect(() => {
    if (dbStatus !== 'ready' || profile?.level === undefined) return;

    if (prevLevel === null) {
      setPrevLevel(profile.level);
    } else if (profile.level > prevLevel) {
      setShowLevelUp(true);
      import('./utils/SoundManager').then(({ SoundManager }) => {
        SoundManager.playSyncSuccess();
      });
      setPrevLevel(profile.level);
    } else if (profile.level < prevLevel) {
      setPrevLevel(profile.level);
    }
  }, [profile?.level, prevLevel, dbStatus]);

  // Sync Aura State to CSS Theme
  useEffect(() => {
    if (cognitiveState?.auraState) {
      document.body.dataset.aura = cognitiveState.auraState;
    } else {
      delete document.body.dataset.aura;
    }
  }, [cognitiveState?.auraState]);

  const handleResolveConflict = async (strategy: 'local' | 'remote') => {
    if (strategy === 'remote') {
      await performPull();
    }
    setShowSyncModal(false);
  };

  const handleCompleteOnboarding = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const isMarketingDomain = window.location.hostname === 'spaceclocker.com' || window.location.hostname === 'www.spaceclocker.com';

  if (isMarketingDomain) {
    return (
      <main className="min-h-screen bg-surface-lowest text-on-surface">
        <LandingPage />
      </main>
    );
  }

  // If the path is exactly /about, load the About page immediately with no delays or sidebar
  if (pathname === '/about') {
    return (
      <main className="min-h-screen bg-surface-lowest text-on-surface">
        <Routes>
          <Route path="/about" element={<LandingPage />} />
        </Routes>
      </main>
    );
  }

  // Diagnostics for loading / error UI
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isSecure = window.isSecureContext;

  if (dbStatus === 'loading') {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#0b0e14',
        color: '#00f2ff',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '0.2em' }}>ESTABLISHING NEURAL LINK...</div>
        <div style={{ marginTop: '1rem', width: '200px', height: '2px', background: 'rgba(0,242,255,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ 
            position: 'absolute', 
            width: '50%', 
            height: '100%', 
            background: '#00f2ff', 
            animation: 'shuttle 1.5s infinite linear' 
          }}></div>
        </div>
        <style>{`
          @keyframes shuttle {
            0% { left: -50%; }
            100% { left: 100%; }
          }
        `}</style>
      </div>
    );
  }

  if (dbStatus === 'error') {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '2rem',
        backgroundColor: '#0b0e14',
        color: '#ffb4ab',
        fontFamily: 'sans-serif',
        textAlign: 'center',
        overflowY: 'auto'
      }}>
        <h1 style={{ color: '#00f2ff', marginBottom: '0.5rem', fontSize: '2.5rem', fontWeight: '900', letterSpacing: '-0.05em' }}>NEURAL LINK FAILURE</h1>
        <p style={{ marginBottom: '2rem', opacity: 0.8, maxWidth: '500px' }}>The Chronos Core encountered a temporal anomaly during synchronization.</p>
        
        <div style={{ width: '100%', maxWidth: '600px' }}>
          {!isSecure && !isLocal && (
            <div style={{ 
              backgroundColor: 'rgba(255, 84, 77, 0.1)', 
              padding: '1.25rem', 
              borderRadius: '16px', 
              fontSize: '0.9rem',
              marginBottom: '1rem',
              border: '1px solid #ffb4ab',
              color: '#ffdad6',
              textAlign: 'left'
            }}>
              <b style={{ display: 'block', marginBottom: '0.25rem' }}>SECURE CONTEXT ERROR</b>
              Your browser has blocked the neural link. Local-first storage (PGlite) requires <b>HTTPS</b> or <i>localhost</i>. 
              If you are on Vercel, ensure you are using the <b>https://</b> protocol.
            </div>
          )}

          <div style={{ 
            backgroundColor: '#1d2026', 
            padding: '1.25rem', 
            borderRadius: '16px', 
            fontSize: '0.85rem',
            textAlign: 'left',
            border: '1px solid #3a494b',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{ color: '#00f2ff', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}>Error Log</div>
            <code style={{ wordBreak: 'break-word', color: '#ffb4ab' }}>{dbError?.toString() || 'Unknown anomaly'}</code>
            
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #3a494b' }}>
              <div style={{ color: '#00f2ff', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}>System Diagnostics</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', opacity: 0.7 }}>
                <div>Host: {window.location.hostname}</div>
                <div>Secure: {isSecure ? 'YES' : 'NO'}</div>
                <div>Platform: {navigator.platform}</div>
                <div>User Agent: {navigator.userAgent.split(' ')[0]}</div>
              </div>
            </div>

            {dbError?.stack && (
              <details style={{ marginTop: '1rem', cursor: 'pointer' }}>
                <summary style={{ fontSize: '0.75rem', opacity: 0.5, outline: 'none' }}>View Trace Stack</summary>
                <pre style={{ 
                  marginTop: '0.5rem', 
                  fontSize: '0.7rem', 
                  backgroundColor: '#0b0e14', 
                  padding: '1rem', 
                  borderRadius: '8px',
                  overflowX: 'auto',
                  opacity: 0.6
                }}>{dbError.stack}</pre>
              </details>
            )}
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              padding: '1rem 2rem', 
              backgroundColor: '#00f2ff', 
              color: '#00373a', 
              border: 'none', 
              borderRadius: '12px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer'
            }}
          >
            Retry Neural Link
          </button>
          <button 
            onClick={() => {
              const data = {
                error: dbError?.toString(),
                stack: dbError?.stack,
                diagnostics: {
                  host: window.location.hostname,
                  secure: isSecure,
                  ua: navigator.userAgent
                }
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `neural-link-failure-${Date.now()}.json`;
              a.click();
            }} 
            style={{ 
              padding: '1rem 1.5rem', 
              backgroundColor: 'transparent', 
              color: '#00f2ff', 
              border: '2px solid #00f2ff', 
              borderRadius: '12px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer'
            }}
          >
            Dump Logs
          </button>
          <button 
            onClick={async () => {
              if (confirm('CRITICAL: This will permanently delete all local trajectory data and reset the Chronos Core. Proceed with Temporal Purge?')) {
                await purgeDatabase();
                window.location.reload();
              }
            }} 
            style={{ 
              padding: '1rem 1.5rem', 
              backgroundColor: 'rgba(255, 84, 77, 0.1)', 
              color: '#ffb4ab', 
              border: '2px solid #ffb4ab', 
              borderRadius: '12px',
              fontWeight: '900',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              cursor: 'pointer'
            }}
          >
            Temporal Purge
          </button>
        </div>
      </div>
    );
  }

  return (
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
          <Route path="/profile" element={<ProfileDashboard />} />
          <Route path="/identity" element={<IdentitySelectionMatrix />} />
          <Route path="/about" element={<LandingPage />} />
          <Route path="/landing" element={<LandingPage />} />
        </Routes>
      </main>

      <SyncConflictModal 
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        onResolve={handleResolveConflict}
      />

      {/* Level Up Celebration Modal */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-surface-lowest/90 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: -20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md glass-panel border-2 border-primary p-8 rounded-[2.5rem] text-center space-y-6 relative overflow-hidden"
            >
              {/* Decorative radial glows */}
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-secondary/20 blur-3xl rounded-full" />
              
              <div className="relative z-10 flex flex-col items-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 shadow-[0_0_30px_rgba(var(--color-primary-rgb),0.3)]">
                  <Award size={40} className="animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xs font-black uppercase tracking-[0.4em] text-secondary">
                    Momentum Shift Achieved
                  </h2>
                  <h1 className="text-4xl font-display font-black text-white uppercase tracking-tighter">
                    Rank Ascended!
                  </h1>
                  <div className="text-6xl font-black text-primary font-mono tracking-tighter my-4 drop-shadow-[0_0_20px_rgba(var(--color-primary-rgb),0.4)]">
                    LVL {profile?.level}
                  </div>
                  <p className="text-on-surface-variant text-xs leading-relaxed max-w-xs mx-auto">
                    Your neural trajectory efficiency has unlocked a new rank. The Momentum Engine is now calibrated for high-level operations.
                  </p>
                </div>

                <button
                  onClick={async () => {
                    const { SoundManager } = await import('./utils/SoundManager');
                    SoundManager.playPop();
                    setShowLevelUp(false);
                  }}
                  className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black uppercase tracking-widest hover:bg-primary-container transition-colors shadow-lg hover:shadow-primary/20 cursor-pointer border-none outline-none"
                >
                  Continue Mission
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppContent />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
