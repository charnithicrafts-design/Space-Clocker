import { PGlite } from '@electric-sql/pglite';
import * as Comlink from 'comlink';
import { SCHEMA } from './schema';
import { MIGRATIONS } from './migrations';

let db: PGlite | null = null;

const api = {
  async init(dataDir?: string | Blob): Promise<void> {
    if (db) return;
    
    console.log('[Worker] Initiating neural link initialization...');
    
    // 1. Determine Storage Strategy
    const isOpfsSupported = typeof navigator !== 'undefined' && 'storage' in navigator && typeof navigator.storage.getDirectory === 'function';
    
    let storagePath: string;
    if (typeof dataDir === 'string') {
      storagePath = dataDir;
    } else {
      // Use persistent storage by default if no path is provided
      // This is critical for restoration (which passes a Blob, not a path)
      storagePath = isOpfsSupported ? 'opfs-ahp://space-clocker-db' : 'idb://space-clocker-db';
    }

    console.log(`[Worker] Storage strategy: ${storagePath} (OPFS Supported: ${isOpfsSupported})`);

    let dump: Blob | undefined = undefined;
    try {
      // 2. Check for migration if using OPFS and no data exists yet
      if (isOpfsSupported && !dataDir) {
        dump = await this.handleMigrationIfNecessary();
      }

      // 3. Initialize PGlite
      console.log(`[Worker] Creating PGlite instance at ${storagePath}...`);
      db = await PGlite.create(storagePath, {
        relaxedDurability: true,
        loadDataDir: dataDir instanceof Blob ? dataDir : dump,
      });
      await db.waitReady;

      // Auto-run schema and migrations on init
      await this.setup();

      console.log('[Worker] PGlite ready and synchronized.');
    } catch (error: any) {
      console.error('[Worker] PGlite initialization failure:', error);

      const isHandleError = error.message?.includes('No more file handles available in the pool');
      
      if (isHandleError && storagePath.startsWith('opfs-ahp://')) {
        console.warn('[Worker] OPFS Access Handle Pool exhausted. Falling back to standard OPFS...');
        try {
          const fallbackPath = storagePath.replace('opfs-ahp://', 'opfs://');
          db = await PGlite.create(fallbackPath, { 
            relaxedDurability: true,
            loadDataDir: dataDir instanceof Blob ? dataDir : dump,
          });
          await db.waitReady;
          await this.setup();
          console.log('[Worker] Fallback to standard OPFS successful.');
          return;
        } catch (fallbackError) {
          console.error('[Worker] OPFS Fallback failed:', fallbackError);
        }
      }

      // Memory Fallback: If IDB failed due to memory, try starting a fresh OPFS instance
      if (error instanceof RangeError || error.message?.includes('allocation failed')) {
        console.warn('[Worker] Memory allocation failed. Attempting emergency fallback to OPFS-only mode...');
        if (isOpfsSupported && storagePath.startsWith('idb://')) {
          try {
            db = await PGlite.create('opfs-ahp://space-clocker-db', { relaxedDurability: true });
            await db.waitReady;
            await this.setup();
            console.log('[Worker] Emergency fallback successful. Note: IDB data is temporarily inaccessible.');
            return;
          } catch (fallbackError) {
            console.error('[Worker] Emergency fallback failed:', fallbackError);
          }
        }
      }
      throw error;
    }
  },

  async handleMigrationIfNecessary(): Promise<Blob | undefined> {
    // We only migrate if we detect an old IDB database but NO OPFS database yet
    // This is complex to check perfectly, so we'll look for the IDB database in the global indexedDB object
    try {
      const dbName = 'pglite-idb://space-clocker-db';
      
      // We check if OPFS already has data by checking if the directory exists
      // If it exists, we don't migrate
      const opfsRoot = await navigator.storage.getDirectory();
      try {
        await opfsRoot.getDirectoryHandle('space-clocker-db');
        console.log('[Worker] OPFS already exists. Skipping migration check.');
        return undefined;
      } catch (e) {
        // Directory doesn't exist, proceed to check IDB
      }

      const idbExists = await new Promise<boolean>((resolve) => {
        const request = indexedDB.open(dbName);
        request.onsuccess = (e: any) => {
          const db = e.target.result;
          const exists = db.objectStoreNames.length > 0;
          db.close();
          resolve(exists);
        };
        request.onerror = () => resolve(false);
      });

      if (!idbExists) return undefined;

      console.log('[Worker] Legacy IndexedDB detected. Attempting atomic migration to OPFS...');
      
      // To avoid memory double-up, we open, dump, and close IDB BEFORE opening OPFS
      const legacyDb = await PGlite.create('idb://space-clocker-db', { relaxedDurability: true });
      await legacyDb.waitReady;
      const dump = await legacyDb.dumpDataDir();
      await legacyDb.close();
      
      console.log('[Worker] Migration dump successful. Purging legacy IDB to prevent future collisions.');
      indexedDB.deleteDatabase(dbName);
      return dump;
    } catch (err) {
      console.warn('[Worker] Migration skipped or failed (likely memory limits):', err);
      return undefined;
    }
  },

  async setup(): Promise<void> {
    if (!db) throw new Error('Database not initialized');

    await db.transaction(async (tx) => {
      // 1. Run Baseline Schema
      await tx.exec(SCHEMA);

      // 2. Ensure singletons
      await tx.query(`INSERT INTO profile (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);
      await tx.query(`INSERT INTO preferences (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);
      await tx.query(`INSERT INTO stats (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);
      await tx.query(`INSERT INTO oracle_config (id) VALUES (1) ON CONFLICT (id) DO NOTHING;`);
      
      // 3. Ensure migrations table
      await tx.exec(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          version INTEGER PRIMARY KEY,
          name TEXT NOT NULL,
          applied_at TEXT DEFAULT CURRENT_TIMESTAMP
        );
      `);
    });

    // 4. Run Migrations
    const result = await db.query<{ current: number }>('SELECT MAX(version) as current FROM schema_migrations');
    const currentVersion = result.rows[0]?.current || 0;
    const pending = MIGRATIONS.filter(m => m.version > currentVersion).sort((a, b) => a.version - b.version);

    for (const migration of pending) {
      console.log(`[Worker] Applying migration ${migration.version}: ${migration.name}`);
      await db.transaction(async (tx) => {
        await migration.run(tx);
        await tx.query('INSERT INTO schema_migrations (version, name) VALUES ($1, $2)', [migration.version, migration.name]);
      });
    }
  },

  async query(sql: string, params?: any[]): Promise<{ rows: any[] }> {
    if (!db) throw new Error('Database not initialized');
    const res = await db.query(sql, params);
    return { rows: res.rows };
  },

  async exec(sql: string): Promise<void> {
    if (!db) throw new Error('Database not initialized');
    await db.exec(sql);
  },

  async transaction<T>(callback: (tx: any) => Promise<T>): Promise<T> {
    if (!db) throw new Error('Database not initialized');
    // NOTE: This might still have issues if the callback is passed from main thread.
    // We prefer using domain methods instead.
    return await db.transaction(callback);
  },

  async close(): Promise<void> {
    if (db) {
      await db.close();
      db = null;
    }
  },

  async dumpDataDir(): Promise<Blob> {
    if (!db) throw new Error('Database not initialized');
    return await db.dumpDataDir();
  },

  // Domain Methods
  async getProfile() {
    return this.query('SELECT name, level, xp, title FROM profile WHERE id = 1');
  },

  async updateProfile(name: string, level: number, xp: number, title: string) {
    return this.query('UPDATE profile SET name = $1, level = $2, xp = $3, title = $4 WHERE id = 1', [name, level, xp, title]);
  },

  async getTasks(plannedDate?: string) {
    if (plannedDate) {
      return this.query('SELECT * FROM tasks WHERE planned_date = $1', [plannedDate]);
    }
    return this.query('SELECT * FROM tasks');
  },

  async addTask(task: any) {
    const { id, time, end_time, deadline, weightage, title, completed, horizon, planned_date, ambition_id, milestone_id } = task;
    return this.query(
      `INSERT INTO tasks (id, time, end_time, deadline, weightage, title, completed, horizon, planned_date, ambition_id, milestone_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [id, time, end_time, deadline, weightage, title, completed, horizon, planned_date, ambition_id, milestone_id]
    );
  },

  async updateTask(id: string, updates: any) {
    const keys = Object.keys(updates);
    const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
    const params = [id, ...Object.values(updates)];
    return this.query(`UPDATE tasks SET ${setClause} WHERE id = $1`, params);
  },

  async deleteTask(id: string) {
    return this.query('DELETE FROM tasks WHERE id = $1', [id]);
  },

  async toggleTask(id: string, xpPerLevel: number) {
    if (!db) throw new Error('Database not initialized');
    
    return await db.transaction(async (tx) => {
      const taskRes = await tx.query<any>('SELECT * FROM tasks WHERE id = $1', [id]);
      const task = taskRes.rows[0];
      if (!task) throw new Error('Task not found');

      const newCompleted = !task.completed;
      const completedAt = newCompleted ? new Date().toISOString() : null;
      const xpGain = newCompleted ? (task.weightage || 10) : -(task.weightage || 10);

      const profileRes = await tx.query<any>('SELECT level, xp FROM profile WHERE id = 1');
      const profile = profileRes.rows[0];
      
      let newXp = profile.xp + xpGain;
      let newLevel = profile.level;
      
      if (newXp >= xpPerLevel) {
        newLevel += 1;
        newXp -= xpPerLevel;
      } else if (newXp < 0 && newLevel > 1) {
        newLevel -= 1;
        newXp += xpPerLevel;
      } else if (newXp < 0) {
        newXp = 0;
      }

      await tx.query('UPDATE tasks SET completed = $1, completed_at = $2 WHERE id = $3', [newCompleted, completedAt, id]);
      await tx.query('UPDATE profile SET xp = $1, level = $2 WHERE id = 1', [newXp, newLevel]);

      return { newCompleted, completedAt, newXp, newLevel };
    });
  },

  async bulkImport(payload: any) {
    if (!db) throw new Error('Database not initialized');
    
    const stringifyIfObject = (val: any) => {
      if (val === null || val === undefined) return null;
      return typeof val === 'string' ? val : JSON.stringify(val);
    };

    return await db.transaction(async (tx) => {
      // Clear current tables
      await tx.query('DELETE FROM tasks');
      await tx.query('DELETE FROM milestones');
      await tx.query('DELETE FROM ambitions');
      await tx.query('DELETE FROM void_tasks');
      await tx.query('DELETE FROM skills');
      await tx.query('DELETE FROM internships');
      await tx.query('DELETE FROM reflections');
      await tx.query('DELETE FROM transmissions');
      await tx.query('DELETE FROM stellar_history');
      await tx.query('DELETE FROM sync_metadata');

      // 1. Singletons
      if (payload.profile) {
        await tx.query(`UPDATE profile SET name = $1, level = $2, xp = $3, title = $4 WHERE id = 1`, [
          payload.profile.name || null, payload.profile.level || 1, payload.profile.xp || 0, payload.profile.title || null
        ]);
      }
      const p = payload.preferences || payload.preferences;
      if (p) {
        await tx.query(`UPDATE preferences SET confirm_delete = $1, ui_mode = $2 WHERE id = 1`, [
          p.confirmDelete ?? p.confirm_delete ?? true, 
          p.uiMode || p.ui_mode || 'simple'
        ]);
      }
      if (payload.stats) {
        await tx.query(`UPDATE stats SET streak = $1, tasks_completed = $2, total_focus_hours = $3 WHERE id = 1`, [
          payload.stats.streak || 0, 
          payload.stats.tasksCompleted ?? payload.stats.tasks_completed ?? 0, 
          payload.stats.totalFocusHours ?? payload.stats.total_focus_hours ?? 0
        ]);
      }
      const o = payload.oracleConfig || payload.oracle_config;
      if (o) {
        await tx.query(`UPDATE oracle_config SET api_key = $1, model = $2, provider_url = $3 WHERE id = 1`, [
          o.apiKey || o.api_key || '', 
          o.model || 'gemini-1.5-pro', 
          o.providerUrl || o.provider_url || 'https://generativelanguage.googleapis.com/v1beta/openai'
        ]);
      }

      // 2. Ambitions & Milestones
      if (payload.ambitions) {
        for (const a of payload.ambitions) {
          await tx.query(`INSERT INTO ambitions (id, title, progress, xp, horizon) VALUES ($1, $2, $3, $4, $5)`, [
            a.id, a.title, a.progress || 0, a.xp || 0, a.horizon || 'yearly'
          ]);
          if (a.milestones) {
            for (const m of a.milestones) {
              await tx.query(`INSERT INTO milestones (id, ambition_id, title, status) VALUES ($1, $2, $3, $4)`, [
                m.id, a.id, m.title, m.status || 'pending'
              ]);
              if (m.tasks) {
                for (const t of m.tasks) {
                  await tx.query(`INSERT INTO tasks (id, milestone_id, ambition_id, time, end_time, deadline, weightage, title, completed, horizon, planned_date, completed_at, is_void) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`, [
                    t.id, m.id, a.id, 
                    t.time || null, 
                    t.endTime || t.end_time || null, 
                    t.deadline || null, 
                    t.weightage ?? 10, 
                    t.title, 
                    t.completed ?? false, 
                    t.horizon || 'daily', 
                    t.plannedDate || t.planned_date || null, 
                    t.completedAt || t.completed_at || null, 
                    t.isVoid || t.is_void || false
                  ]);
                }
              }
            }
          }
        }
      }

      // 3. Standalone Tasks
      if (payload.tasks) {
        for (const t of payload.tasks) {
          await tx.query(`INSERT INTO tasks (id, milestone_id, ambition_id, time, end_time, deadline, weightage, title, completed, horizon, planned_date, completed_at, is_void) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) ON CONFLICT (id) DO NOTHING`, [
            t.id, 
            t.milestoneId || t.milestone_id || null, 
            t.ambitionId || t.ambition_id || null, 
            t.time || null, 
            t.endTime || t.end_time || null, 
            t.deadline || null, 
            t.weightage ?? 10, 
            t.title, 
            t.completed ?? false, 
            t.horizon || 'daily', 
            t.plannedDate || t.planned_date || null, 
            t.completedAt || t.completed_at || null, 
            t.isVoid || t.is_void || false
          ]);
        }
      }

      // 4. Other Collections
      if (payload.voids) {
        for (const v of payload.voids) {
          await tx.query(`INSERT INTO void_tasks (id, text, impact, engaged_count, max_allowed) VALUES ($1, $2, $3, $4, $5)`, [
            v.id, v.text, v.impact || 'low', v.engagedCount ?? v.engaged_count ?? 0, v.maxAllowed ?? v.max_allowed ?? 3
          ]);
        }
      }
      if (payload.reflections) {
        for (const r of payload.reflections) {
          await tx.query(`INSERT INTO reflections (id, date, content, type) VALUES ($1, $2, $3, $4)`, [
            r.id, r.date || null, r.content, r.type || 'daily-summary'
          ]);
        }
      }
      if (payload.skills) {
        for (const s of payload.skills) {
          await tx.query(`INSERT INTO skills (id, name, current_proficiency, target_proficiency, recommendation, type, ambition_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
            s.id, s.name, 
            s.currentProficiency ?? s.current_proficiency ?? 0, 
            s.targetProficiency ?? s.target_proficiency ?? 100, 
            s.recommendation || null, 
            s.type || 'personal', 
            s.ambitionId || s.ambition_id || null
          ]);
        }
      }
      if (payload.internships) {
        for (const i of payload.internships) {
          const id = i.id || `int-${Date.now()}-${Math.random()}`;
          await tx.query(`INSERT INTO internships (id, organization, start_date, end_date) VALUES ($1, $2, $3, $4)`, [
            id, i.organization, i.start_date || i.start || null, i.end_date || i.end || null
          ]);
        }
      }
      if (payload.transmissions) {
        for (const t of payload.transmissions) {
          await tx.query(`INSERT INTO transmissions (id, timestamp, tier, title, start_date, end_date, pda_narrative, pda_reflections, void_analysis, skills_reconciliation, mission_metrics, raw_logs, metadata) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`, [
            t.id, t.timestamp || null, t.tier, t.title, 
            t.startDate || t.start_date || null, 
            t.endDate || t.end_date || null, 
            t.pdaNarrative || t.pda_narrative || null,
            stringifyIfObject(t.pdaReflections ?? t.pda_reflections ?? []),
            stringifyIfObject(t.voidAnalysis ?? t.void_analysis ?? []),
            stringifyIfObject(t.skillsReconciliation ?? t.skills_reconciliation ?? []),
            stringifyIfObject(t.missionMetrics ?? t.mission_metrics ?? { accomplished: [], missed: [], milestones: [] }),
            stringifyIfObject(t.rawLogs ?? t.raw_logs ?? { tasksCompleted: 0, totalTasks: 0, focusHours: 0 }),
            stringifyIfObject(t.metadata ?? {})
          ]);
        }
      }
      if (payload.history) {
        for (const h of payload.history) {
          await tx.query(`INSERT INTO stellar_history (id, title, date, type, category, description, skills) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
            h.id, h.title, h.date, h.type, h.category, h.description || null, stringifyIfObject(h.skills || [])
          ]);
        }
      }
      
      return true;
    });
  },

  async clearAllData() {
    if (!db) throw new Error('Database not initialized');
    
    return await db.transaction(async (tx) => {
      await tx.query('DELETE FROM tasks');
      await tx.query('DELETE FROM milestones');
      await tx.query('DELETE FROM ambitions');
      await tx.query('DELETE FROM void_tasks');
      await tx.query('DELETE FROM skills');
      await tx.query('DELETE FROM internships');
      await tx.query('DELETE FROM reflections');
      await tx.query('DELETE FROM transmissions');
      await tx.query('DELETE FROM stellar_history');
      await tx.query(`UPDATE profile SET name = $1, level = $2, xp = $3, title = $4 WHERE id = 1`, ['Valentina', 1, 0, 'Galactic Voyager']);
      await tx.query(`UPDATE preferences SET confirm_delete = $1, ui_mode = $2 WHERE id = 1`, [true, 'simple']);
      await tx.query(`UPDATE stats SET streak = $1, tasks_completed = $2, total_focus_hours = $3 WHERE id = 1`, [0, 0, 0]);
      return true;
    });
  }
};

export type DatabaseWorkerAPI = typeof api;

Comlink.expose(api);
