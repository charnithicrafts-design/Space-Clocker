import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
import { SCHEMA } from '../schema';
import { exportToJson } from '../sync-engine';
import {
  exportYjsUpdate,
  mergeRemotePayloadAndReconcile,
  isLegacyGzipPayload
} from '../yjs-sync';
import { XP_PER_LEVEL } from '../../constants';

async function createDeviceDb(deviceId: string): Promise<PGlite> {
  const db = new PGlite();
  await db.exec(SCHEMA);
  await db.query(`INSERT INTO profile (id, name, level, xp, title) VALUES (1, 'Commander', 1, 0, 'Voyager') ON CONFLICT (id) DO NOTHING`);
  await db.query(`INSERT INTO preferences (id, confirm_delete, ui_mode, is_simulation) VALUES (1, true, 'simple', false) ON CONFLICT (id) DO NOTHING`);
  await db.query(`INSERT INTO stats (id, streak, tasks_completed, total_focus_hours) VALUES (1, 0, 0, 0) ON CONFLICT (id) DO NOTHING`);
  await db.query(`INSERT INTO oracle_config (id, client_id, sync_enabled) VALUES (1, 'shared-client', true) ON CONFLICT (id) DO NOTHING`);
  await db.query(`INSERT INTO sync_metadata (id, device_id, last_synced_at) VALUES (1, $1, '2026-01-01T00:00:00.000Z') ON CONFLICT (id) DO NOTHING`, [deviceId]);
  return db;
}

describe('Y.js CRDT Sync Engine', () => {
  let dbA: PGlite;
  let dbB: PGlite;

  beforeEach(async () => {
    dbA = await createDeviceDb('device-A');
    dbB = await createDeviceDb('device-B');
  });

  afterEach(async () => {
    await dbA.close();
    await dbB.close();
  });

  it('merges concurrent non-conflicting additions from two offline devices without overwriting', async () => {
    // Device A adds Task A offline
    await dbA.query(
      `INSERT INTO tasks (id, title, completed, horizon) VALUES ('task-a', 'Design Warp Core', false, 'daily')`
    );
    // Device B adds Task B offline
    await dbB.query(
      `INSERT INTO tasks (id, title, completed, horizon) VALUES ('task-b', 'Calibrate Sensors', true, 'daily')`
    );

    // Device A exports update
    const updateA = await exportYjsUpdate(dbA, 'device-A');
    expect(isLegacyGzipPayload(updateA)).toBe(false);

    // Device B merges Device A's update and produces merged update
    const mergedFromB = await mergeRemotePayloadAndReconcile(dbB, updateA, 'device-B');

    // Device A merges B's update back
    await mergeRemotePayloadAndReconcile(dbA, mergedFromB, 'device-A');

    // Both devices must have BOTH tasks
    const tasksA = (await dbA.query<{ id: string; title: string }>(`SELECT id, title FROM tasks ORDER BY id`)).rows;
    const tasksB = (await dbB.query<{ id: string; title: string }>(`SELECT id, title FROM tasks ORDER BY id`)).rows;

    expect(tasksA).toEqual([
      { id: 'task-a', title: 'Design Warp Core' },
      { id: 'task-b', title: 'Calibrate Sensors' }
    ]);
    expect(tasksB).toEqual(tasksA);
  });

  it('merges concurrent field-level edits on the same task without clobbering', async () => {
    // Establish common baseline task on both devices
    await dbA.query(
      `INSERT INTO tasks (id, title, time, completed, horizon) VALUES ('t-shared', 'Draft Spec', '09:00', false, 'daily')`
    );
    const baseline = await exportYjsUpdate(dbA, 'device-A');
    await mergeRemotePayloadAndReconcile(dbB, baseline, 'device-B');

    // Now offline:
    // Device A edits the title
    await dbA.query(`UPDATE tasks SET title = 'Draft Final CRDT Spec' WHERE id = 't-shared'`);
    // Device B changes the time and marks completed
    await dbB.query(`UPDATE tasks SET time = '14:30', completed = true WHERE id = 't-shared'`);

    const updateA = await exportYjsUpdate(dbA, 'device-A');
    const mergedB = await mergeRemotePayloadAndReconcile(dbB, updateA, 'device-B');
    await mergeRemotePayloadAndReconcile(dbA, mergedB, 'device-A');

    const rowA = (await dbA.query<any>(`SELECT title, time, completed FROM tasks WHERE id = 't-shared'`)).rows[0];
    const rowB = (await dbB.query<any>(`SELECT title, time, completed FROM tasks WHERE id = 't-shared'`)).rows[0];

    expect(rowA).toEqual({
      title: 'Draft Final CRDT Spec',
      time: '14:30',
      completed: true
    });
    expect(rowB).toEqual(rowA);
  });

  it('propagates deletions cleanly without zombie resurrection', async () => {
    // Common baseline with 2 tasks
    await dbA.query(`INSERT INTO tasks (id, title) VALUES ('t1', 'Old Task'), ('t2', 'Keep Task')`);
    const baseline = await exportYjsUpdate(dbA, 'device-A');
    await mergeRemotePayloadAndReconcile(dbB, baseline, 'device-B');

    // Device A deletes t1, Device B adds t3 offline
    await dbA.query(`DELETE FROM tasks WHERE id = 't1'`);
    await dbB.query(`INSERT INTO tasks (id, title) VALUES ('t3', 'New Task on B')`);

    const updateA = await exportYjsUpdate(dbA, 'device-A');
    const mergedB = await mergeRemotePayloadAndReconcile(dbB, updateA, 'device-B');
    await mergeRemotePayloadAndReconcile(dbA, mergedB, 'device-A');

    const idsA = (await dbA.query<{ id: string }>(`SELECT id FROM tasks ORDER BY id`)).rows.map((r) => r.id);
    const idsB = (await dbB.query<{ id: string }>(`SELECT id FROM tasks ORDER BY id`)).rows.map((r) => r.id);

    expect(idsA).toEqual(['t2', 't3']);
    expect(idsB).toEqual(['t2', 't3']);
  });

  it('sums XP (with level-ups), stats, and void engagement counts across devices via CRDT PN-Counters', async () => {
    // Baseline: both devices at level 1, 200 XP, 2 tasks completed, 1 void task with 1 engagement
    await dbA.query(`UPDATE profile SET level = 1, xp = 200 WHERE id = 1`);
    await dbA.query(`UPDATE stats SET tasks_completed = 2, total_focus_hours = 3 WHERE id = 1`);
    await dbA.query(`INSERT INTO void_tasks (id, text, engaged_count) VALUES ('v1', 'Doomscrolling', 1)`);

    const baseline = await exportYjsUpdate(dbA, 'device-A');
    await mergeRemotePayloadAndReconcile(dbB, baseline, 'device-B');

    // Offline work on Device A: +900 XP (200 + 900 = 1100 => level 2, 100 xp), +3 tasks, +2 hours, +1 void engagement
    await dbA.query(`UPDATE profile SET level = 2, xp = ${1100 - XP_PER_LEVEL} WHERE id = 1`);
    await dbA.query(`UPDATE stats SET tasks_completed = 5, total_focus_hours = 5 WHERE id = 1`);
    await dbA.query(`UPDATE void_tasks SET engaged_count = 2 WHERE id = 'v1'`);

    // Offline work on Device B: +400 XP (200 + 400 = 600 => level 1, 600 xp), +2 tasks, +4 hours, +2 void engagements
    await dbB.query(`UPDATE profile SET level = 1, xp = 600 WHERE id = 1`);
    await dbB.query(`UPDATE stats SET tasks_completed = 4, total_focus_hours = 7 WHERE id = 1`);
    await dbB.query(`UPDATE void_tasks SET engaged_count = 3 WHERE id = 'v1'`);

    const updateA = await exportYjsUpdate(dbA, 'device-A');
    const mergedB = await mergeRemotePayloadAndReconcile(dbB, updateA, 'device-B');
    await mergeRemotePayloadAndReconcile(dbA, mergedB, 'device-A');

    // Total XP = 200 + 900 + 400 = 1500 => Level 2, 500 XP (assuming XP_PER_LEVEL = 1000)
    const expectedTotalXp = 200 + 900 + 400;
    const expectedLevel = Math.floor(expectedTotalXp / XP_PER_LEVEL) + 1;
    const expectedXp = expectedTotalXp % XP_PER_LEVEL;

    const profA = (await dbA.query<any>(`SELECT level, xp FROM profile WHERE id = 1`)).rows[0];
    const profB = (await dbB.query<any>(`SELECT level, xp FROM profile WHERE id = 1`)).rows[0];
    expect(profA).toEqual({ level: expectedLevel, xp: expectedXp });
    expect(profB).toEqual(profA);

    const statsA = (await dbA.query<any>(`SELECT tasks_completed, total_focus_hours FROM stats WHERE id = 1`)).rows[0];
    expect(statsA).toEqual({ tasks_completed: 2 + 3 + 2, total_focus_hours: 3 + 2 + 4 });

    const voidA = (await dbA.query<any>(`SELECT engaged_count FROM void_tasks WHERE id = 'v1'`)).rows[0];
    expect(voidA).toEqual({ engaged_count: 1 + 1 + 2 });
  });

  it('auto-migrates legacy GZIP JSON cloud backups into Y.Doc without losing local device tasks', async () => {
    // Device A creates a legacy gzip snapshot
    await dbA.query(`INSERT INTO tasks (id, title) VALUES ('legacy-t1', 'From Old Backup')`);
    const legacyGzip = await exportToJson(dbA);
    expect(isLegacyGzipPayload(legacyGzip)).toBe(true);

    // Device B has a brand new local task and pulls the legacy gzip backup
    await dbB.query(`INSERT INTO tasks (id, title) VALUES ('local-t2', 'Created Before First Sync')`);
    await mergeRemotePayloadAndReconcile(dbB, legacyGzip, 'device-B');

    const tasksB = (await dbB.query<{ id: string }>(`SELECT id FROM tasks ORDER BY id`)).rows.map((r) => r.id);
    expect(tasksB).toEqual(['legacy-t1', 'local-t2']);
  });

  it('keeps sync_metadata strictly device-local', async () => {
    await dbA.query(`INSERT INTO tasks (id, title) VALUES ('t1', 'Hello')`);
    const updateA = await exportYjsUpdate(dbA, 'device-A');

    await mergeRemotePayloadAndReconcile(dbB, updateA, 'device-B');

    const metaB = (await dbB.query<any>(`SELECT device_id, last_synced_at FROM sync_metadata WHERE id = 1`)).rows[0];
    expect(metaB.device_id).toBe('device-B');
    expect(metaB.last_synced_at).toBe('2026-01-01T00:00:00.000Z');
  });
});
