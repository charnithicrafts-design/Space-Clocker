-- Space-Clocker Schema Definition

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
  ui_mode TEXT DEFAULT 'simple', -- 'simple' | 'professional'
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
  CONSTRAINT single_oracle CHECK (id = 1)
);

-- Ambitions & Milestones
CREATE TABLE IF NOT EXISTS ambitions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  progress INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0, -- Resonance Energy for this specific trajectory
  horizon TEXT DEFAULT 'yearly'
);

CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  ambition_id TEXT REFERENCES ambitions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'pending' -- 'pending' | 'active' | 'completed'
);

-- Unified Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  milestone_id TEXT REFERENCES milestones(id) ON DELETE CASCADE,
  ambition_id TEXT REFERENCES ambitions(id) ON DELETE CASCADE, -- Optional direct link for non-milestone tasks
  time TEXT,
  end_time TEXT, -- 'Descent Completion' (space-themed)
  deadline TIMESTAMP,
  weightage INTEGER DEFAULT 10, -- XP points for completion
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT false,
  horizon TEXT DEFAULT 'daily',
  planned_date TIMESTAMP,
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
  date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
  organization TEXT NOT NULL, -- 'ISRO' | 'NASA'
  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS transmissions (
  id TEXT PRIMARY KEY,
  timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
  tier TEXT NOT NULL, -- 'daily' | 'weekly' | 'quarterly' | 'yearly' | 'milestone'
  title TEXT NOT NULL,
  pda_narrative TEXT,
  pda_reflections TEXT, -- JSON string
  void_analysis TEXT, -- JSON string
  skills_reconciliation TEXT, -- JSON string
  raw_logs TEXT, -- JSON string
  metadata TEXT -- JSON string (target_org, etc.)
);
