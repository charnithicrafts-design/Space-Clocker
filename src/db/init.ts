import { db } from './client';
import { runMigrations } from './migrate';

const SCHEMA = `
-- Singletons/Globals
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT DEFAULT 'Valentina',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  title TEXT DEFAULT 'Galactic Voyager',
  CONSTRAINT single_profile CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS preferences (
  id INTEGER PRIMARY KEY DEFAULT 1,
  confirm_delete BOOLEAN DEFAULT true,
  ui_mode TEXT DEFAULT 'simple',
  CONSTRAINT single_prefs CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS stats (
  id INTEGER PRIMARY KEY DEFAULT 1,
  streak INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  total_focus_hours INTEGER DEFAULT 0,
  CONSTRAINT single_stats CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS oracle_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  api_key TEXT DEFAULT '',
  model TEXT DEFAULT 'gemini-1.5-pro',
  provider_url TEXT DEFAULT 'https://generativelanguage.googleapis.com/v1beta/openai',
  client_id TEXT DEFAULT '',
  sync_enabled BOOLEAN DEFAULT false,
  CONSTRAINT single_oracle CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS sync_metadata (
  id INTEGER PRIMARY KEY DEFAULT 1,
  last_synced_at TEXT,
  device_id TEXT,
  remote_file_id TEXT,
  CONSTRAINT single_sync CHECK (id = 1)
);

-- Ambitions & Milestones
CREATE TABLE IF NOT EXISTS ambitions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  horizon TEXT DEFAULT 'yearly'
);

CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  ambition_id TEXT REFERENCES ambitions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending'
);

-- Unified Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  milestone_id TEXT REFERENCES milestones(id) ON DELETE CASCADE,
  ambition_id TEXT REFERENCES ambitions(id) ON DELETE CASCADE,
  time TEXT,
  end_time TEXT,
  deadline TEXT,
  weightage INTEGER DEFAULT 10,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  horizon TEXT DEFAULT 'daily',
  planned_date TEXT,
  is_void BOOLEAN DEFAULT false,
  completed_at TEXT
);

-- Support Collections
CREATE TABLE IF NOT EXISTS void_tasks (
  id TEXT PRIMARY KEY,
  text TEXT NOT NULL,
  impact TEXT DEFAULT 'low',
  engaged_count INTEGER DEFAULT 0,
  max_allowed INTEGER DEFAULT 3
);

CREATE TABLE IF NOT EXISTS reflections (
  id TEXT PRIMARY KEY,
  date TEXT DEFAULT CURRENT_TIMESTAMP,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'daily-summary'
);

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  current_proficiency INTEGER DEFAULT 0,
  target_proficiency INTEGER DEFAULT 100,
  recommendation TEXT,
  ambition_id TEXT,
  type TEXT DEFAULT 'personal'
);

CREATE TABLE IF NOT EXISTS internships (
  id TEXT PRIMARY KEY,
  organization TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transmissions (
  id TEXT PRIMARY KEY,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
  tier TEXT NOT NULL,
  title TEXT NOT NULL,
  start_date TEXT,
  end_date TEXT,
  pda_narrative TEXT,
  pda_reflections TEXT,
  void_analysis TEXT,
  skills_reconciliation TEXT,
  mission_metrics TEXT,
  raw_logs TEXT,
  metadata TEXT
);
`;

export async function initDb() {
  await db.waitReady;

  try {
    await db.transaction(async (tx) => {
      // Create initial schema (idempotent)
      await tx.exec(SCHEMA);

      // Ensure singletons exist
      await tx.query(`INSERT INTO profile (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);
      await tx.query(`INSERT INTO preferences (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);
      await tx.query(`INSERT INTO stats (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);
      await tx.query(`INSERT INTO oracle_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);
    });

    // Run incremental migrations
    await runMigrations();

    console.log('[System] Stellar database schema synchronized.');
  } catch (e) {
    console.error('[Critical] Database initialization failure:', e);
    throw e;
  }
}
