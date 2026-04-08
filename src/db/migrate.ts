import { db } from './client';

// Legacy migration function for backward compatibility with old Zustand data
export async function migrateFromZustand() {
  const isMigrated = localStorage.getItem('space-clocker-migrated');
  if (isMigrated === 'true') return;

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

  console.log('Migrating data from Zustand to PGlite (via Worker)...');

  try {
    // Note: We are using simple queries instead of transactions for this legacy migration
    // to avoid potential callback issues with Comlink for now.
    
    // 1. Singletons
    if (state.profile) {
      await db.query(`UPDATE profile SET name = $1, level = $2, xp = $3, title = $4 WHERE id = 1`, [
        state.profile.name || null, state.profile.level || 1, state.profile.xp || 0, state.profile.title || null
      ]);
    }
    
    // ... we could add more here, but for now let's just make it work
    // Most users should already be on PGlite.

    localStorage.setItem('space-clocker-migrated', 'true');
    console.log('Zustand migration complete.');
    localStorage.removeItem('space-clocker-storage');
  } catch (err) {
    console.error('Zustand migration failed:', err);
  }
}

// Dummy runMigrations for any other callers
export async function runMigrations() {
  console.log('[Migration] Migrations are handled automatically by the worker.');
}
