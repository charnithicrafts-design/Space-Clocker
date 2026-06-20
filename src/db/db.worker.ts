import { PGlite } from '@electric-sql/pglite';
import { OpfsAhpFS } from '@electric-sql/pglite/opfs-ahp';
import * as Comlink from 'comlink';
import { SCHEMA } from './schema';
import { MIGRATIONS } from './migrations';

// Patch recursive mkdir bug in PGlite v0.4.2's OpfsAhpFS VFS
if (typeof OpfsAhpFS !== 'undefined' && OpfsAhpFS.prototype) {
  OpfsAhpFS.prototype._mkdirState = function (path: string, options?: { recursive?: boolean; mode?: number; }) {
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 0) return;

    const dirName = parts.pop()!;
    const parentParts: string[] = [];
    let currentNode = this.state.root;

    for (const part of parts) {
      parentParts.push(part);
      if (!Object.prototype.hasOwnProperty.call(currentNode.children, part)) {
        if (options?.recursive) {
          this.mkdir('/' + parentParts.join('/'), options);
        } else {
          const err = new Error('No such file or directory');
          err.name = 'ErrnoError';
          (err as any).code = 'ENOENT';
          (err as any).errno = 2;
          throw err;
        }
      }
      
      const child = currentNode.children[part];
      if (!child) {
        const err = new Error('No such file or directory');
        err.name = 'ErrnoError';
        (err as any).code = 'ENOENT';
        (err as any).errno = 2;
        throw err;
      }
      if (child.type !== 'directory') {
        const err = new Error('Not a directory');
        err.name = 'ErrnoError';
        (err as any).code = 'ENOTDIR';
        (err as any).errno = 20;
        throw err;
      }
      currentNode = child as any;
    }

    if (Object.prototype.hasOwnProperty.call(currentNode.children, dirName)) {
      if (options?.recursive && currentNode.children[dirName].type === 'directory') {
        return; // No-op if recursive and directory already exists
      }
      const err = new Error('File exists');
      err.name = 'ErrnoError';
      (err as any).code = 'EEXIST';
      (err as any).errno = 17;
      throw err;
    }

    currentNode.children[dirName] = {
      type: 'directory',
      lastModified: Date.now(),
      mode: options?.mode || 16384, // T.DIR is 16384
      children: {}
    };
  };
}

let db: PGlite | null = null;
let initializing: Promise<void> | null = null;
let activeStorageStrategy: string | null = null;

export const api = {
  async init(dataDir?: string | Blob): Promise<void> {
    if (db) return;
    if (initializing) return initializing;

    initializing = (async () => {
      let storagePath: string = '';
      let isOpfsSupported = false;
      let dump: Blob | undefined = undefined;
      let forceIdbFallback = false;

      try {
        console.log('[Worker] Initiating neural link initialization...', { 
          hasDataDir: !!dataDir, 
          isBlob: dataDir instanceof Blob,
          isString: typeof dataDir === 'string',
          activeStorageStrategy
        });
        
        // 1. Determine Storage Strategy
        isOpfsSupported = typeof navigator !== 'undefined' && 'storage' in navigator && typeof navigator.storage.getDirectory === 'function';
        
        // Allow environment to force strategy (useful for E2E tests)
        let forcedStrategy: string | null = activeStorageStrategy;
        
        // If dataDir is a string, it might be a forced strategy (e.g. idb://...) or a path
        if (typeof dataDir === 'string' && (dataDir.includes('://') || dataDir.startsWith('opfs'))) {
          forcedStrategy = dataDir;
          activeStorageStrategy = forcedStrategy; // Persist for future re-inits (like after restoration)
        }

        if (forcedStrategy) {
          console.log(`[Worker] Forced storage strategy detected: ${forcedStrategy}`);
          storagePath = forcedStrategy;
          if (forcedStrategy.startsWith('idb')) forceIdbFallback = true;
        } else if (typeof dataDir === 'string') {
          storagePath = dataDir;
        } else {
          // Use persistent storage by default if no path is provided
          // We check if OPFS actually works by trying to get the directory
          if (isOpfsSupported) {
            try {
              await navigator.storage.getDirectory();
              storagePath = 'opfs-ahp://space-clocker-db';
            } catch (e: any) {
              console.warn('[Worker] OPFS detected but failed to initialize directory access:', e);
              if (e.name === 'AbortError' || e.message?.includes('Abort')) {
                console.warn('[Worker] AbortError detected. Forcing IndexedDB fallback.');
                storagePath = 'idb://space-clocker-db';
                forceIdbFallback = true;
              } else {
                storagePath = 'idb://space-clocker-db';
              }
            }
          } else {
            storagePath = 'idb://space-clocker-db';
          }
        }

        console.log(`[Worker] Storage strategy: ${storagePath} (OPFS Supported: ${isOpfsSupported})`);

        // 2. Check for migration if using OPFS and no data exists yet
        if (isOpfsSupported && !dataDir && !forceIdbFallback) {
          dump = await this.handleMigrationIfNecessary();
        }

        // 3. Initialize PGlite with fallback candidates
        const candidates: string[] = [storagePath];
        if (storagePath.startsWith('opfs-ahp://')) {
          candidates.push('idb://space-clocker-db');
          candidates.push('memory://space-clocker-volatile');
        } else if (storagePath.startsWith('idb://')) {
          if (isOpfsSupported) {
            candidates.push('opfs-ahp://space-clocker-db');
          }
          candidates.push('memory://space-clocker-volatile');
        } else if (storagePath.startsWith('memory://')) {
          // No viable fallbacks for memory-only mode failures
        } else {
          if (!candidates.includes('memory://space-clocker-volatile')) {
            candidates.push('memory://space-clocker-volatile');
          }
        }

        let lastError: any = null;
        let initSuccess = false;

        for (const candidatePath of candidates) {
          console.log(`[Worker] Attempting PGlite initialization at candidate: ${candidatePath}...`);
          
          let retryCount = 0;
          const maxRetries = candidatePath.startsWith('opfs-ahp') ? 6 : 0;
          const baseDelay = 200;
          let existsRetryCount = 0;
          let candidateSuccess = false;

          while (retryCount <= maxRetries) {
            try {
              if (db) {
                try { await db.close(); } catch {}
                db = null;
              }

              // Use new PGlite constructor directly so we can assign to db before waitReady,
              // ensuring we can close and release locks/handles in the catch block if setup fails.
              const pg = new PGlite(candidatePath, {
                relaxedDurability: true,
                loadDataDir: dataDir instanceof Blob ? dataDir : dump,
              });
              db = pg;
              await pg.waitReady;
              candidateSuccess = true;
              break; // Success for this candidate
            } catch (e: any) {
              if (db) {
                try { await db.close(); } catch {}
                db = null;
              }

              lastError = e;
              const isLockError = e.name === 'NoModificationAllowedError' || e.message?.includes('Access Handles') || e.message?.includes('database is locked');
              const isExistsError = e.message?.includes('Database already exists');
              const isAbortedError = e.name === 'RuntimeError' && e.message?.includes('Aborted');
              const isStructuralError = e.errno === 20 || (e.name === 'ErrnoError' && e.errno === 20) || e.message?.includes('ENOTDIR') || isAbortedError;

              if (isLockError && retryCount < maxRetries) {
                retryCount++;
                const delay = Math.min(baseDelay * Math.pow(2, retryCount), 5000);
                console.warn(`[Worker] Lock error at ${candidatePath} (attempt ${retryCount}/${maxRetries}). Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
              } else if ((isExistsError || isStructuralError) && (dataDir instanceof Blob || dump || isStructuralError) && existsRetryCount < 2) {
                existsRetryCount++;
                console.warn(`[Worker] ${isStructuralError ? 'Structural corruption (Errno 20)' : 'Database exists'} detected at ${candidatePath}. Purging for recovery...`);
                try {
                  await new Promise(resolve => setTimeout(resolve, 500));
                  
                  if (candidatePath.startsWith('opfs')) {
                    const root = await navigator.storage.getDirectory();
                    const folderName = candidatePath.includes('://') ? candidatePath.split('://')[1] : candidatePath;
                    const potentialNames = [folderName, `pglite-${folderName}`];
                    for (const name of potentialNames) {
                      let purgeRetry = 0;
                      let purgeSuccess = false;
                      while (purgeRetry < 3) {
                        try {
                          await root.removeEntry(name, { recursive: true });
                          console.log(`[Worker] Purged OPFS folder: ${name}`);
                          purgeSuccess = true;
                          break;
                        } catch (pe: any) {
                          if (pe.name === 'NotFoundError') {
                            purgeSuccess = true;
                            break;
                          }
                          purgeRetry++;
                          console.warn(`[Worker] Purge attempt ${purgeRetry} failed for folder ${name}:`, pe);
                          await new Promise(resolve => setTimeout(resolve, 500 * purgeRetry));
                        }
                      }
                      if (!purgeSuccess) {
                        throw new Error(`Failed to delete OPFS folder: ${name} (possibly locked)`);
                      }
                    }
                  } else if (candidatePath.startsWith('idb://')) {
                    const dbName = candidatePath.includes('://') ? `pglite-${candidatePath.split('://')[1]}` : `pglite-${candidatePath}`;
                    await new Promise<void>((resolve, reject) => {
                      const req = indexedDB.deleteDatabase(dbName);
                      req.onsuccess = () => resolve();
                      req.onerror = () => reject(req.error);
                    });
                    console.log(`[Worker] Purged IDB database: ${dbName}`);
                  }
                  
                  console.log('[Worker] Purge complete, retrying candidate initialization...');
                  continue; // Retry the current candidate
                } catch (purgeError) {
                  console.error('[Worker] Purge failed:', purgeError);
                  break; // Proceed to next candidate
                }
              } else {
                console.warn(`[Worker] Non-retryable initialization error at ${candidatePath}:`, e);
                break; // Break the while loop to try next candidate
              }
            }
          }

          if (candidateSuccess && db) {
            try {
              await this.setup();
              console.log(`[Worker] PGlite initialization and setup successful at: ${candidatePath}`);
              storagePath = candidatePath;
              initSuccess = true;
              break;
            } catch (setupError) {
              console.error(`[Worker] Setup failed on candidate ${candidatePath}:`, setupError);
              lastError = setupError;
              if (db) {
                try { await db.close(); } catch {}
                db = null;
              }
              // Proceed to next candidate
            }
          }
        }

        if (!initSuccess || !db) {
          console.error('[Worker] All database initialization candidates failed.');
          throw lastError || new Error('All PGlite initialization candidates failed');
        }
      } catch (error: any) {
        console.error('[Worker] PGlite initialization failure:', error);
        initializing = null;
        throw error;
      }
    })();

    return initializing;
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
      const legacyDb = await PGlite.create('idb://space-clocker-db', { 
        relaxedDurability: true,
      });
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
      // 1. Run Baseline Schema - Split to avoid parser stack issues in some environments
      const statements = SCHEMA.split(';').map(s => s.trim()).filter(s => s.length > 0);
      for (const statement of statements) {
        await tx.exec(statement);
      }

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
    if (initializing) await initializing;
    if (!db) throw new Error('Database not initialized');
    await db.waitReady;
    try {
      console.log(`[Worker] Executing query: ${sql.substring(0, 100)}...`);
      const res = await db.query(sql, params);
      // Small cooling delay to prevent PGlite internal lock contention in rapid successions
      await new Promise(r => setTimeout(r, 10));
      return { rows: res.rows };
    } catch (e) {
      console.error(`[Worker] Query failure: ${sql.substring(0, 100)}...`, e);
      throw e;
    }
  },

  async exec(sql: string): Promise<void> {
    if (initializing) await initializing;
    if (!db) throw new Error('Database not initialized');
    await db.waitReady;
    try {
      console.log(`[Worker] Executing SQL: ${sql.substring(0, 100)}...`);
      await db.exec(sql);
      await new Promise(r => setTimeout(r, 10));
    } catch (e) {
      console.error(`[Worker] Exec failure: ${sql.substring(0, 100)}...`, e);
      throw e;
    }
  },

  async transaction<T>(callback: (tx: any) => Promise<T>): Promise<T> {
    if (initializing) await initializing;
    if (!db) throw new Error('Database not initialized');
    await db.waitReady;
    
    return await db.transaction(async (tx) => {
      return await callback(tx);
    });
  },

  async close(): Promise<void> {
    if (db) {
      try {
        await db.close();
      } catch (e) {
        console.warn('[Worker] Error during PGlite close:', e);
      }
      db = null;
    }
    initializing = null;
  },

  async dumpDataDir(): Promise<Blob> {
    if (initializing) await initializing;
    if (!db) throw new Error('Database not initialized');
    return await db.dumpDataDir();
  },

  // Domain Methods
  async getProfile() {
    if (initializing) await initializing;
    return this.query('SELECT name, level, xp, title FROM profile WHERE id = 1');
  },

  async updateProfile(name: string, level: number, xp: number, title: string) {
    if (initializing) await initializing;
    return this.query('UPDATE profile SET name = $1, level = $2, xp = $3, title = $4 WHERE id = 1', [name, level, xp, title]);
  },

  async getTasks(plannedDate?: string) {
    if (initializing) await initializing;
    if (plannedDate) {
      return this.query('SELECT * FROM tasks WHERE planned_date = $1', [plannedDate]);
    }
    return this.query('SELECT * FROM tasks');
  },

  async addTask(task: any) {
    if (initializing) await initializing;
    const { id, time, end_time, deadline, weightage, title, completed, horizon, planned_date, ambition_id, milestone_id } = task;
    return this.query(
      `INSERT INTO tasks (id, time, end_time, deadline, weightage, title, completed, horizon, planned_date, ambition_id, milestone_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [id, time, end_time, deadline, weightage, title, completed, horizon, planned_date, ambition_id, milestone_id]
    );
  },

  async updateTask(id: string, updates: any) {
    if (initializing) await initializing;
    const keys = Object.keys(updates);
    const setClause = keys.map((k, i) => `${k} = $${i + 2}`).join(', ');
    const params = [id, ...Object.values(updates)];
    return this.query(`UPDATE tasks SET ${setClause} WHERE id = $1`, params);
  },

  async deleteTask(id: string) {
    if (initializing) await initializing;
    return this.query('DELETE FROM tasks WHERE id = $1', [id]);
  },

  async toggleTask(id: string, xpPerLevel: number) {
    if (initializing) await initializing;
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
    if (initializing) await initializing;
    if (!db) throw new Error('Database not initialized');
    
    const stringifyIfObject = (val: any) => {
      if (val === null || val === undefined) return null;
      return typeof val === 'string' ? val : JSON.stringify(val);
    };

    try {
      console.log('[Worker] Initiating chunked trajectory restoration...');
      
      // 1. Wipe Phase
      await db.transaction(async (tx) => {
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
      });

      // 2. Singletons Phase
      await db.transaction(async (tx) => {
        if (payload.profile) {
          await tx.query(`UPDATE profile SET name = $1, level = $2, xp = $3, title = $4 WHERE id = 1`, [
            payload.profile.name || null, payload.profile.level || 1, payload.profile.xp || 0, payload.profile.title || null
          ]);
        }
        const p = payload.preferences;
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
      });

      // 3. Ambitions & Milestones Phase (One ambition per transaction to keep stack small)
      if (payload.ambitions) {
        for (const a of payload.ambitions) {
          await db.transaction(async (tx) => {
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
          });
        }
      }

      // 4. Standalone Tasks (Chunked by 50)
      if (payload.tasks) {
        const chunkSize = 50;
        for (let i = 0; i < payload.tasks.length; i += chunkSize) {
          const chunk = payload.tasks.slice(i, i + chunkSize);
          await db.transaction(async (tx) => {
            for (const t of chunk) {
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
          });
        }
      }

      // 5. Other Collections (Chunked by 50)
      const collections = [
        { key: 'voids', table: 'void_tasks', query: 'INSERT INTO void_tasks (id, text, impact, engaged_count, max_allowed) VALUES ($1, $2, $3, $4, $5)', map: (v: any) => [v.id, v.text, v.impact || 'low', v.engagedCount ?? v.engaged_count ?? 0, v.maxAllowed ?? v.max_allowed ?? 3] },
        { key: 'reflections', table: 'reflections', query: 'INSERT INTO reflections (id, date, content, type) VALUES ($1, $2, $3, $4)', map: (r: any) => [r.id, r.date || null, r.content, r.type || 'daily-summary'] },
        { key: 'skills', table: 'skills', query: 'INSERT INTO skills (id, name, current_proficiency, target_proficiency, recommendation, type, ambition_id) VALUES ($1, $2, $3, $4, $5, $6, $7)', map: (s: any) => [s.id, s.name, s.currentProficiency ?? s.current_proficiency ?? 0, s.targetProficiency ?? s.target_proficiency ?? 100, s.recommendation || null, s.type || 'personal', s.ambitionId || s.ambition_id || null] },
        { key: 'internships', table: 'internships', query: 'INSERT INTO internships (id, organization, start_date, end_date) VALUES ($1, $2, $3, $4)', map: (i: any) => [i.id || `int-${Date.now()}-${Math.random()}`, i.organization, i.start_date || i.start || null, i.end_date || i.end || null] },
        { key: 'history', table: 'stellar_history', query: 'INSERT INTO stellar_history (id, title, date, type, category, description, skills) VALUES ($1, $2, $3, $4, $5, $6, $7)', map: (h: any) => [h.id, h.title, h.date, h.type, h.category, h.description || null, stringifyIfObject(h.skills || [])] }
      ];

      for (const col of collections) {
        if (payload[col.key]) {
          const chunk = payload[col.key];
          for (let i = 0; i < chunk.length; i += 50) {
            const subChunk = chunk.slice(i, i + 50);
            await db.transaction(async (tx) => {
              for (const item of subChunk) {
                await tx.query(col.query, col.map(item));
              }
            });
          }
        }
      }

      // 6. Transmissions (Chunked by 5) - Large JSON objects, keep chunks small
      if (payload.transmissions) {
        for (let i = 0; i < payload.transmissions.length; i += 5) {
          const chunk = payload.transmissions.slice(i, i + 5);
          await db.transaction(async (tx) => {
            for (const t of chunk) {
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
          });
        }
      }

      return true;
    } catch (err: any) {
      console.error('[Worker] Chunked restoration failure:', err);
      throw err;
    }
  },

  async clearAllData() {
    if (initializing) await initializing;
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
