import { db } from './client';

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
      // These are the fixes that were previously in initDb's manual migration block
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
          app_version TEXT DEFAULT '1.3.0',
          last_startup TEXT,
          CONSTRAINT single_system CHECK (id = 1)
        );
        INSERT INTO system_info (id, app_version) VALUES (1, '1.3.0') ON CONFLICT DO NOTHING;
      `);
    }
  }
];

export async function runMigrations() {
  await db.waitReady;
  console.log('[Migration] Checking for trajectory upgrades...');

  try {
    // 1. Ensure migrations table exists
    await db.exec(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Get current version
    const result = await db.query('SELECT MAX(version) as current FROM schema_migrations');
    const currentVersion = result.rows[0]?.current || 0;

    // 3. Filter and run pending migrations
    const pending = MIGRATIONS.filter(m => m.version > currentVersion).sort((a, b) => a.version - b.version);

    if (pending.length === 0) {
      console.log('[Migration] Trajectory is up to date.');
      return;
    }

    console.log(`[Migration] Applying ${pending.length} upgrades...`);

    for (const migration of pending) {
      console.log(`[Migration] Applying version ${migration.version}: ${migration.name}`);
      await db.transaction(async (tx) => {
        await migration.run(tx);
        await tx.query('INSERT INTO schema_migrations (version, name) VALUES ($1, $2)', [migration.version, migration.name]);
      });
    }

    console.log('[Migration] All upgrades applied successfully.');
  } catch (err) {
    console.error('[Migration] Critical failure during upgrade:', err);
    throw err;
  }
}

// Keeping the legacy migration function for backward compatibility with old Zustand data
export async function migrateFromZustand() {
  const stored = localStorage.getItem('space-clocker-storage');
  if (!stored) return;

  let parsed: any = null;
  try {
    parsed = JSON.parse(stored);
  } catch (e) {
    console.error('Failed to parse migration data:', e);
    return;
  }

  const { state } = parsed;
  if (!state) return;

  // Check if migration has already happened (this is a one-time thing)
  const isMigrated = localStorage.getItem('space-clocker-migrated');
  if (isMigrated === 'true') return;

  console.log('Migrating data from Zustand to PGlite...');

  try {
    await db.transaction(async (tx) => {
      // 1. Singletons
      if (state.profile) {
        await tx.query(`UPDATE profile SET name = $1, level = $2, xp = $3, title = $4 WHERE id = 1`, [
          state.profile.name, state.profile.level, state.profile.xp || 0, state.profile.title
        ]);
      }
      if (state.preferences) {
        await tx.query(`UPDATE preferences SET confirm_delete = $1 WHERE id = 1`, [
          state.preferences.confirmDelete
        ]);
      }
      if (state.stats) {
        await tx.query(`UPDATE stats SET streak = $1, tasks_completed = $2, total_focus_hours = $3 WHERE id = 1`, [
          state.stats.streak, state.stats.tasksCompleted, state.stats.totalFocusHours
        ]);
      }
      if (state.oracleConfig) {
        await tx.query(`UPDATE oracle_config SET api_key = $1, model = $2, provider_url = $3 WHERE id = 1`, [
          state.oracleConfig.apiKey, state.oracleConfig.model, state.oracleConfig.providerUrl
        ]);
      }

      // 2. Ambitions & Milestones
      if (state.ambitions) {
        for (const ambition of state.ambitions) {
          await tx.query(`INSERT INTO ambitions (id, title, progress, xp, horizon) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, [
            ambition.id, ambition.title, ambition.progress, ambition.xp || 0, ambition.horizon
          ]);

          if (ambition.milestones) {
            for (const milestone of ambition.milestones) {
              await tx.query(`INSERT INTO milestones (id, ambition_id, title, status) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`, [
                milestone.id, ambition.id, milestone.title, milestone.status
              ]);

              if (milestone.tasks) {
                for (const task of milestone.tasks) {
                  await tx.query(`INSERT INTO tasks (id, milestone_id, time, title, completed, horizon, planned_date, is_void) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT DO NOTHING`, [
                    task.id, milestone.id, task.time, task.title, task.completed, task.horizon, task.plannedDate, task.isVoid
                  ]);
                }
              }
            }
          }
        }
      }

      // 3. Standalone Tasks (Orbit)
      if (state.tasks) {
        for (const task of state.tasks) {
          await tx.query(`INSERT INTO tasks (id, time, title, completed, horizon, planned_date, is_void) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT DO NOTHING`, [
            task.id, task.time, task.title, task.completed, task.horizon, task.plannedDate, task.isVoid
          ]);
        }
      }

      // 4. Void Tasks
      if (state.voids) {
        for (const v of state.voids) {
          await tx.query(`INSERT INTO void_tasks (id, text, impact, engaged_count, max_allowed) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, [
            v.id, v.text, v.impact, v.engagedCount, v.maxAllowed
          ]);
        }
      }

      // 5. Reflections
      if (state.reflections) {
        for (const r of state.reflections) {
          await tx.query(`INSERT INTO reflections (id, date, content, type) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING`, [
            r.id, r.date, r.content, r.type
          ]);
        }
      }

      // 6. Skills
      if (state.skills) {
        for (const s of state.skills) {
          await tx.query(`INSERT INTO skills (id, name, current_proficiency, target_proficiency, recommendation) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`, [
            s.id, s.name, s.currentProficiency, s.targetProficiency, s.recommendation
          ]);
        }
      }
    });

    localStorage.setItem('space-clocker-migrated', 'true');
    console.log('Zustand migration complete.');
    localStorage.removeItem('space-clocker-storage');
  } catch (err) {
    console.error('Zustand migration failed:', err);
  }
}
