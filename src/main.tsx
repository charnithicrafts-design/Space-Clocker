import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initDb } from './db/init';
import { migrateFromZustand } from './db/migrate';

async function start() {
  await initDb();
  await migrateFromZustand();
  
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

start();
