import { CURRENT_APP_VERSION } from '../constants';

export interface Migration {
  version: number;
  name: string;
  run: (tx: any) => Promise<void>;
}

export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    name: 'initial_schema_and_baseline_fixes',
    run: async (tx) => {
      await tx.exec(`
        ALTER TABLE profile ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
        ALTER TABLE preferences ADD COLUMN IF NOT EXISTS ui_mode TEXT DEFAULT 'simple';
        ALTER TABLE ambitions ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0;
        ALTER TABLE tasks ADD COLUMN IF NOT EXISTS end_time TEXT;
        ALTER TABLE tasks ADD COLUMN IF NOT EXISTS deadline TEXT;
        ALTER TABLE tasks ADD COLUMN IF NOT EXISTS weightage INTEGER DEFAULT 10;
        ALTER TABLE tasks ADD COLUMN IF NOT EXISTS completed_at TEXT;
        ALTER TABLE skills ADD COLUMN IF NOT EXISTS ambition_id TEXT;
        ALTER TABLE skills ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'personal';
        ALTER TABLE transmissions ADD COLUMN IF NOT EXISTS start_date TEXT;
        ALTER TABLE transmissions ADD COLUMN IF NOT EXISTS end_date TEXT;
        ALTER TABLE transmissions ADD COLUMN IF NOT EXISTS mission_metrics TEXT;
        CREATE TABLE IF NOT EXISTS stellar_history (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          date TEXT NOT NULL,
          type TEXT NOT NULL,
          category TEXT NOT NULL,
          description TEXT,
          skills TEXT
        );
      `);
    }
  },
  {
    version: 2,
    name: 'system_info_and_last_startup',
    run: async (tx) => {
      await tx.exec(`
        CREATE TABLE IF NOT EXISTS system_info (
          id INTEGER PRIMARY KEY DEFAULT 1,
          app_version TEXT DEFAULT '${CURRENT_APP_VERSION}',
          last_startup TEXT,
          CONSTRAINT single_system CHECK (id = 1)
        );
        INSERT INTO system_info (id, app_version) VALUES (1, '${CURRENT_APP_VERSION}') ON CONFLICT DO NOTHING;
      `);
    }
  },
  {
    version: 3,
    name: 'recovery_protocol_stabilization',
    run: async (tx) => {
      await tx.exec(`UPDATE system_info SET app_version = '${CURRENT_APP_VERSION}' WHERE id = 1;`);
    }
  }
];
