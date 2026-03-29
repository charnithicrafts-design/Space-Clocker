import { db } from './client';

const SCHEMA = `
-- Singletons/Globals
CREATE TABLE IF NOT EXISTS profile (
  id INTEGER PRIMARY KEY DEFAULT 1,
  name TEXT DEFAULT 'Valentina',
  level INTEGER DEFAULT 1,
  title TEXT DEFAULT 'Galactic Voyager',
  CONSTRAINT single_profile CHECK (id = 1)
);

CREATE TABLE IF NOT EXISTS preferences (
  id INTEGER PRIMARY KEY DEFAULT 1,
  confirm_delete BOOLEAN DEFAULT true,
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
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  horizon TEXT DEFAULT 'daily',
  planned_date TEXT,
  is_void BOOLEAN DEFAULT false
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
  recommendation TEXT
);

CREATE TABLE IF NOT EXISTS internships (
  id TEXT PRIMARY KEY,
  organization TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT NOT NULL
);
`;

export async function initDb() {
  await db.waitReady;
  await db.exec(SCHEMA);
  
  // Ensure singletons exist
  await db.query(`INSERT INTO profile (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);
  await db.query(`INSERT INTO preferences (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);
  await db.query(`INSERT INTO stats (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);
  await db.query(`INSERT INTO oracle_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);
}
