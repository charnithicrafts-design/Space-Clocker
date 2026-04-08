import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock getDb to return our test DB
vi.mock('../db/client', async () => {
  const { PGlite } = await import('@electric-sql/pglite');
  const mockDb = new PGlite();
  
  // Basic domain method mocks for integration tests
  const dbProxy = {
    query: (sql: string, params?: any[]) => mockDb.query(sql, params),
    exec: (sql: string) => mockDb.exec(sql),
    init: () => mockDb.waitReady,
    transaction: (callback: any) => mockDb.transaction(callback),
    getProfile: () => mockDb.query('SELECT name, level, xp, title FROM profile WHERE id = 1'),
    getTasks: () => mockDb.query('SELECT * FROM tasks'),
    bulkImport: async (payload: any) => {
      // Minimal bulkImport implementation for tests
      await mockDb.transaction(async (tx) => {
        await tx.query('DELETE FROM tasks');
        await tx.query('DELETE FROM milestones');
        await tx.query('DELETE FROM ambitions');
        await tx.query('DELETE FROM void_tasks');
        await tx.query('DELETE FROM skills');
        await tx.query('DELETE FROM internships');
        await tx.query('DELETE FROM reflections');
        await tx.query('DELETE FROM transmissions');
        await tx.query('DELETE FROM stellar_history');
        
        if (payload.profile) {
          await tx.query(`UPDATE profile SET name = $1, level = $2, xp = $3, title = $4 WHERE id = 1`, [
            payload.profile.name || null, payload.profile.level || 1, payload.profile.xp || 0, payload.profile.title || null
          ]);
        }
        if (payload.ambitions) {
          for (const a of payload.ambitions) {
            await tx.query(`INSERT INTO ambitions (id, title, progress, xp, horizon) VALUES ($1, $2, $3, $4, $5)`, [
              a.id, a.title, a.progress || 0, a.xp || 0, a.horizon || 'yearly'
            ]);
          }
        }
        if (payload.tasks) {
          for (const t of payload.tasks) {
            await tx.query(`INSERT INTO tasks (id, milestone_id, ambition_id, time, end_time, deadline, weightage, title, completed, horizon, planned_date, completed_at, is_void) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`, [
              t.id, t.milestoneId || null, t.ambitionId || null, t.time || null, null, null, 10, t.title, t.completed || false, t.horizon || 'daily', t.plannedDate || null, null, t.isVoid || false
            ]);
          }
        }
        if (payload.skills) {
          for (const s of payload.skills) {
            await tx.query(`INSERT INTO skills (id, name, current_proficiency, target_proficiency, recommendation, type, ambition_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
              s.id, s.name, s.currentProficiency || 0, s.targetProficiency || 100, s.recommendation || '', s.type || 'personal', s.ambitionId || null
            ]);
          }
        }
        if (payload.history) {
          for (const h of payload.history) {
            await tx.query(`INSERT INTO stellar_history (id, title, date, type, category, description, skills) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
              h.id, h.title, h.date, h.type, h.category, h.description || '', JSON.stringify(h.skills || [])
            ]);
          }
        }
      });
      return true;
    }
  };

  return {
    getDb: () => mockDb,
    db: mockDb,
    dbProxy
  };
});

// Now we can import the mocked db and the store
import { db as mockDb } from '../db/client';
import { useTrackStore } from './useTrackStore';
import { CURRENT_APP_VERSION } from '../constants';
import demoData from '../data/demo-data.json';

describe('useTrackStore - Demo Data Integration', () => {
  beforeEach(async () => {
    await (mockDb as any).waitReady;
    
    // Clear and Initialize schema
    await (mockDb as any).exec(`
      DROP TABLE IF EXISTS tasks;
      DROP TABLE IF EXISTS milestones;
      DROP TABLE IF EXISTS ambitions;
      DROP TABLE IF EXISTS void_tasks;
      DROP TABLE IF EXISTS skills;
      DROP TABLE IF EXISTS internships;
      DROP TABLE IF EXISTS reflections;
      DROP TABLE IF EXISTS transmissions;
      DROP TABLE IF EXISTS stellar_history;
      DROP TABLE IF EXISTS profile;
      DROP TABLE IF EXISTS preferences;
      DROP TABLE IF EXISTS stats;
      DROP TABLE IF EXISTS oracle_config;
      DROP TABLE IF EXISTS sync_metadata;
      DROP TABLE IF EXISTS system_info;

      CREATE TABLE IF NOT EXISTS profile (id INTEGER PRIMARY KEY DEFAULT 1, name TEXT, level INTEGER, xp INTEGER, title TEXT);
      CREATE TABLE IF NOT EXISTS preferences (id INTEGER PRIMARY KEY DEFAULT 1, confirm_delete BOOLEAN, ui_mode TEXT);
      CREATE TABLE IF NOT EXISTS stats (id INTEGER PRIMARY KEY DEFAULT 1, streak INTEGER, tasks_completed INTEGER, total_focus_hours INTEGER);
      CREATE TABLE IF NOT EXISTS oracle_config (id INTEGER PRIMARY KEY DEFAULT 1, api_key TEXT, model TEXT, provider_url TEXT, client_id TEXT, sync_enabled BOOLEAN);
      CREATE TABLE IF NOT EXISTS sync_metadata (id INTEGER PRIMARY KEY DEFAULT 1, last_synced_at TEXT, device_id TEXT, remote_file_id TEXT);
      CREATE TABLE IF NOT EXISTS system_info (id INTEGER PRIMARY KEY DEFAULT 1, app_version TEXT DEFAULT '${CURRENT_APP_VERSION}', last_startup TEXT, CONSTRAINT single_system CHECK (id = 1));
      CREATE TABLE IF NOT EXISTS ambitions (id TEXT PRIMARY KEY, title TEXT NOT NULL, progress INTEGER, xp INTEGER, horizon TEXT);
      CREATE TABLE IF NOT EXISTS milestones (id TEXT PRIMARY KEY, ambition_id TEXT REFERENCES ambitions(id) ON DELETE CASCADE, title TEXT NOT NULL, status TEXT);
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        milestone_id TEXT REFERENCES milestones(id) ON DELETE CASCADE,
        ambition_id TEXT REFERENCES ambitions(id) ON DELETE CASCADE,
        time TEXT,
        end_time TEXT,
        deadline TEXT,
        weightage INTEGER,
        title TEXT NOT NULL,
        completed BOOLEAN,
        horizon TEXT,
        planned_date TEXT,
        is_void BOOLEAN DEFAULT false,
        completed_at TEXT
      );
      CREATE TABLE IF NOT EXISTS void_tasks (id TEXT PRIMARY KEY, text TEXT, impact TEXT, engaged_count INTEGER, max_allowed INTEGER);
      CREATE TABLE IF NOT EXISTS reflections (id TEXT PRIMARY KEY, date TEXT, content TEXT, type TEXT);
      CREATE TABLE IF NOT EXISTS skills (id TEXT PRIMARY KEY, name TEXT, current_proficiency INTEGER, target_proficiency INTEGER, recommendation TEXT, type TEXT, ambition_id TEXT);
      CREATE TABLE IF NOT EXISTS internships (id TEXT PRIMARY KEY, organization TEXT, start_date TEXT, end_date TEXT);
      CREATE TABLE IF NOT EXISTS transmissions (id TEXT PRIMARY KEY, timestamp TEXT, tier TEXT, title TEXT, start_date TEXT, end_date TEXT, pda_narrative TEXT, pda_reflections TEXT, void_analysis TEXT, skills_reconciliation TEXT, mission_metrics TEXT, raw_logs TEXT, metadata TEXT);
      CREATE TABLE IF NOT EXISTS stellar_history (id TEXT PRIMARY KEY, title TEXT, date TEXT, type TEXT, category TEXT, description TEXT, skills TEXT);
      
      INSERT INTO profile (id) VALUES (1) ON CONFLICT DO NOTHING;
      INSERT INTO preferences (id) VALUES (1) ON CONFLICT DO NOTHING;
      INSERT INTO stats (id) VALUES (1) ON CONFLICT DO NOTHING;
      INSERT INTO oracle_config (id) VALUES (1) ON CONFLICT DO NOTHING;
      INSERT INTO system_info (id, app_version) VALUES (1, '${CURRENT_APP_VERSION}') ON CONFLICT DO NOTHING;
    `);
  }, 30000);

  it('should successfully import demo data without foreign key violations', async () => {
    // Act & Assert
    await expect(useTrackStore.getState().importDemoData(demoData)).resolves.not.toThrow();
    
    // Verify some data was imported
    const state = useTrackStore.getState();
    expect(state.profile.name).toBe(demoData.profile.name);
    expect(state.ambitions.length).toBe(demoData.ambitions.length);
    expect(state.tasks.length).toBe(demoData.tasks.length);
    expect(state.history.length).toBe(demoData.history.length);
    
    // Verify skills are imported with ambition_id and type
    expect(state.skills.length).toBe(demoData.skills.length);
    const skillWithAmbition = state.skills.find(s => s.ambitionId === 'amb-2');
    expect(skillWithAmbition).toBeDefined();
    expect(skillWithAmbition?.type).toBe('ambition');
  });

  it('should clear existing data before importing demo data', async () => {
    // Arrange: Add some existing data
    await (mockDb as any).query("INSERT INTO ambitions (id, title) VALUES ('old-amb', 'Old Ambition')");
    
    // Act
    await useTrackStore.getState().importDemoData(demoData);
    
    // Assert
    const result = await (mockDb as any).query("SELECT * FROM ambitions WHERE id = 'old-amb'");
    expect(result.rows.length).toBe(0);
  });
});
