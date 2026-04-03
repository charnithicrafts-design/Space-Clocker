import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initDb } from './db/init';
import { migrateFromZustand } from './db/migrate';

async function start() {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  // Check for secure context - critical for ServiceWorker and PGlite/IndexedDB in some environments
  if (typeof window !== 'undefined' && !window.isSecureContext && window.location.hostname !== 'localhost') {
    console.warn('[System] Warning: Not running in a secure context. Neural link might be unstable.');
    
    // Optional: show a small warning banner or log it to the DOM if we hit an error later
  }

  try {
    console.log('[System] Initiating neural link...');
    
    // Attempt to initialize database
    await initDb();
    console.log('[System] Stellar database online.');
    
    // Attempt migration
    await migrateFromZustand();
    console.log('[System] Neural pathways synchronized.');
    
    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  } catch (error: any) {
    console.error('[Critical] Neural Link Failure:', error);
    
    // Render a fallback error UI if the main app fails to mount
    createRoot(rootElement).render(
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
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#00f2ff', marginBottom: '1rem' }}>NEURAL LINK FAILURE</h1>
        <p style={{ marginBottom: '1.5rem' }}>A critical error occurred while synchronizing your trajectory.</p>
        
        {/* Secure Context Warning */}
        {!window.isSecureContext && window.location.hostname !== 'localhost' && (
          <div style={{ 
            backgroundColor: '#2d0001', 
            padding: '1rem', 
            borderRadius: '8px', 
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            border: '1px solid #ffb4ab',
            color: '#ffdad6'
          }}>
            <b>SECURE CONTEXT ERROR:</b> Your browser has blocked the neural link. 
            Mobile PWA features and Database storage require <b>HTTPS</b>. 
            Use <i>localhost</i> or an <b>HTTPS Tunnel</b> to proceed.
          </div>
        )}

        <div style={{ 
          backgroundColor: '#1d2026', 
          padding: '1rem', 
          borderRadius: '8px', 
          fontSize: '0.8rem',
          maxWidth: '100%',
          overflow: 'auto',
          textAlign: 'left',
          border: '1px solid #3a494b'
        }}>
          <code>{error.toString()}</code>
          {error.stack && (
            <details style={{ marginTop: '0.5rem', cursor: 'pointer' }}>
              <summary>Technical Details</summary>
              <pre style={{ marginTop: '0.5rem', fontSize: '0.7rem' }}>{error.stack}</pre>
            </details>
          )}
        </div>
        <button 
          onClick={() => window.location.reload()} 
          style={{ 
            marginTop: '2rem', 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#00f2ff', 
            color: '#00373a', 
            border: 'none', 
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          RETRY LINK
        </button>
      </div>
    );
  }
}

// Application initialization is handled by the start() function.
// PWA ServiceWorker registration is handled automatically by vite-plugin-pwa (injectRegister: 'auto').

start();
