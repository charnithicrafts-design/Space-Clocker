import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initDb } from './db/init';
import { migrateFromZustand } from './db/migrate';
import { purgeDatabase } from './db/client';

async function start() {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  const root = createRoot(rootElement);

  // 1. Immediate Boot UI (Splash)
  root.render(
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

  // Check for secure context - critical for ServiceWorker and PGlite/IndexedDB in some environments
  const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const isSecure = window.isSecureContext;
  
  if (!isSecure && !isLocal) {
    console.warn('[System] Warning: Not running in a secure context. Neural link might be unstable.');
  }

  try {
    console.log('[System] Initiating neural link...');
    console.log(`[Diagnostics] Host: ${window.location.hostname}, Secure: ${isSecure}, Local: ${isLocal}`);
    
    // Attempt to initialize database
    await initDb();
    console.log('[System] Stellar database online.');
    
    // Attempt migration
    await migrateFromZustand();
    console.log('[System] Neural pathways synchronized.');
    
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error: any) {
    console.error('[Critical] Neural Link Failure:', error);
    
    // Render a fallback error UI if the main app fails to mount
    root.render(
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
        
        <div style={{ width: '100%', maxWidth: '600px', spaceY: '1rem' }}>
          {/* Secure Context Warning */}
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
            <code style={{ wordBreak: 'break-word', color: '#ffb4ab' }}>{error.toString()}</code>
            
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #3a494b' }}>
              <div style={{ color: '#00f2ff', fontWeight: 'bold', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.7rem' }}>System Diagnostics</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', opacity: 0.7 }}>
                <div>Host: {window.location.hostname}</div>
                <div>Secure: {isSecure ? 'YES' : 'NO'}</div>
                <div>Platform: {navigator.platform}</div>
                <div>User Agent: {navigator.userAgent.split(' ')[0]}</div>
              </div>
            </div>

            {error.stack && (
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
                }}>{error.stack}</pre>
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
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Retry Neural Link
          </button>
          <button 
            onClick={() => {
              const data = {
                error: error.toString(),
                stack: error.stack,
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
}

// Application initialization is handled by the start() function.
// PWA ServiceWorker registration is handled automatically by vite-plugin-pwa (injectRegister: 'auto').

start();
