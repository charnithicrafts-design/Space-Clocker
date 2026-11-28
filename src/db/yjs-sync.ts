import * as Y from 'yjs';
import type { PGlite } from '@electric-sql/pglite';
import { XP_PER_LEVEL } from '../constants';

export const SYNCED_SINGLETON_TABLES = ['profile', 'preferences', 'stats', 'oracle_config'] as const;

export const SYNCED_ENTITY_TABLES = [
  'ambitions',
  'milestones',
  'tasks',
  'void_tasks',
  'reflections',
  'skills',
  'devices'
] as const;

export type SyncedSingletonTable = typeof SYNCED_SINGLETON_TABLES[number];
export type SyncedEntityTable = typeof SYNCED_ENTITY_TABLES[number];

const COUNTER_KEYS = {
  PROFILE_TOTAL_XP: 'profile:total_xp',
  STATS_TASKS_COMPLETED: 'stats:tasks_completed',
  STATS_FOCUS_HOURS: 'stats:total_focus_hours'
} as const;

const KEY_SEP = '::';

function voidCounterKey(voidId: string): string {
  return `void_tasks:${voidId}:engaged_count`;
}

/**
 * Sums all device contributions for a given counter key in the flat `counters` Y.Map.
 */
export function sumCounter(countersMap: Y.Map<number>, counterKey: string): number {
  const prefix = `${counterKey}${KEY_SEP}`;
  let total = 0;
  let hasAny = false;
  countersMap.forEach((val, fullKey) => {
    if (fullKey.startsWith(prefix) && typeof val === 'number' && Number.isFinite(val)) {
      total += val;
      hasAny = true;
    }
  });
  return hasAny ? Math.max(0, total) : 0;
}

function hasCounter(countersMap: Y.Map<number>, counterKey: string): boolean {
  const prefix = `${counterKey}${KEY_SEP}`;
  let found = false;
  countersMap.forEach((_, fullKey) => {
    if (fullKey.startsWith(prefix)) found = true;
  });
  return found;
}

/**
 * Updates the local device's contribution in the flat `counters` Y.Map
 * so that the global sum for `counterKey` equals `targetTotal`.
 */
function setCounterTarget(
  countersMap: Y.Map<number>,
  counterKey: string,
  deviceId: string,
  targetTotal: number
): void {
  const fullKey = `${counterKey}${KEY_SEP}${deviceId}`;
  const currentTotal = sumCounter(countersMap, counterKey);
  const delta = targetTotal - currentTotal;
  if (delta !== 0 || !hasCounter(countersMap, counterKey)) {
    const prevDeviceVal = countersMap.get(fullKey) ?? 0;
    countersMap.set(fullKey, prevDeviceVal + delta);
  }
}

/**
 * Converts a Uint8Array to a base64 string (isomorphic browser + Node).
 */
export function uint8ToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts a base64 string back to a Uint8Array (isomorphic browser + Node).
 */
export function base64ToUint8(base64: string): Uint8Array {
  if (typeof Buffer !== 'undefined') {
    return new Uint8Array(Buffer.from(base64, 'base64'));
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Loads the persisted Y.Doc from `sync_metadata.yjs_state` in PGlite.
 * Returns a fresh Y.Doc if none has been persisted yet.
 */
export async function loadPersistedYDoc(db: PGlite): Promise<Y.Doc> {
  const doc = new Y.Doc();
  try {
    const res = await db.query<{ yjs_state: string | null }>(
      `SELECT yjs_state FROM sync_metadata WHERE id = 1`
    );
    const stateB64 = res.rows[0]?.yjs_state;
    if (stateB64 && stateB64.length > 0) {
      Y.applyUpdate(doc, base64ToUint8(stateB64), 'persistence');
    }
  } catch {
    // Column or row may not exist yet in freshly initialized DBs
  }
  return doc;
}

/**
 * Persists the current Y.Doc state into `sync_metadata.yjs_state` in PGlite.
 */
export async function savePersistedYDoc(db: PGlite, doc: Y.Doc): Promise<void> {
  const encoded = uint8ToBase64(Y.encodeStateAsUpdate(doc));
  await db.query(
    `INSERT INTO sync_metadata (id, yjs_state) VALUES (1, $1)
     ON CONFLICT (id) DO UPDATE SET yjs_state = $1`,
    [encoded]
  );
}

/**
 * Synchronizes current PGlite table rows into the given Y.Doc inside a single Yjs transaction.
 * - Uses deterministic top-level Y.Maps (`singleton:<table>`, `rows:<table>`, `fields:<table>`, `counters`)
 *   to avoid nested Y.Map creation races across offline devices.
 */
export async function syncPGliteToYDoc(
  db: PGlite,
  doc: Y.Doc,
  deviceId: string = 'local-device'
): Promise<void> {
  const snapshot: Record<string, any[]> = {};

  for (const table of [...SYNCED_SINGLETON_TABLES, ...SYNCED_ENTITY_TABLES]) {
    const res = await db.query(`SELECT * FROM ${table}`);
    snapshot[table] = res.rows;
  }

  applySnapshotToYDoc(doc, snapshot, deviceId, { removeMissing: true });
}

/**
 * Applies a plain JSON table snapshot (from PGlite or legacy gzip export) into a Y.Doc.
 */
export function applySnapshotToYDoc(
  doc: Y.Doc,
  snapshot: Record<string, any[]>,
  deviceId: string = 'local-device',
  options: { removeMissing?: boolean } = {}
): void {
  const { removeMissing = false } = options;

  doc.transact(() => {
    const countersMap = doc.getMap<number>('counters');

    // 1. Singletons (field-level LWW + CRDT PN-Counters for XP/stats)
    for (const table of SYNCED_SINGLETON_TABLES) {
      const rows = snapshot[table];
      if (!rows || rows.length === 0) continue;
      const row = rows[0];
      const singletonMap = doc.getMap<any>(`singleton:${table}`);

      if (table === 'profile') {
        const level = Number(row.level ?? 1);
        const xp = Number(row.xp ?? 0);
        const totalXp = Math.max(0, (level - 1) * XP_PER_LEVEL + xp);
        setCounterTarget(countersMap, COUNTER_KEYS.PROFILE_TOTAL_XP, deviceId, totalXp);
      } else if (table === 'stats') {
        setCounterTarget(
          countersMap,
          COUNTER_KEYS.STATS_TASKS_COMPLETED,
          deviceId,
          Number(row.tasks_completed ?? 0)
        );
        setCounterTarget(
          countersMap,
          COUNTER_KEYS.STATS_FOCUS_HOURS,
          deviceId,
          Number(row.total_focus_hours ?? 0)
        );
      }

      for (const [col, val] of Object.entries(row)) {
        if (col === 'id') continue;
        if (table === 'profile' && (col === 'xp' || col === 'level')) continue;
        if (table === 'stats' && (col === 'tasks_completed' || col === 'total_focus_hours')) continue;

        const normalizedVal = val === undefined ? null : val;
        if (singletonMap.get(col) !== normalizedVal) {
          singletonMap.set(col, normalizedVal);
        }
      }
    }

    // 2. Entity Collections (flat presence map + field-level map)
    for (const table of SYNCED_ENTITY_TABLES) {
      const rows = snapshot[table] || [];
      const rowsMap = doc.getMap<boolean>(`rows:${table}`);
      const fieldsMap = doc.getMap<any>(`fields:${table}`);
      const presentIds = new Set<string>();

      for (const row of rows) {
        const id = String(row.id);
        presentIds.add(id);

        if (rowsMap.get(id) !== true) {
          rowsMap.set(id, true);
        }

        if (table === 'void_tasks') {
          setCounterTarget(
            countersMap,
            voidCounterKey(id),
            deviceId,
            Number(row.engaged_count ?? 0)
          );
        }

        for (const [col, val] of Object.entries(row)) {
          if (col === 'id') continue;
          if (table === 'void_tasks' && col === 'engaged_count') continue;
          const fieldKey = `${id}${KEY_SEP}${col}`;
          const normalizedVal = val === undefined ? null : val;
          if (fieldsMap.get(fieldKey) !== normalizedVal) {
            fieldsMap.set(fieldKey, normalizedVal);
          }
        }
      }

      // Propagate local deletions
      if (removeMissing) {
        const existingIds = Array.from(rowsMap.keys());
        for (const id of existingIds) {
          if (!presentIds.has(id)) {
            rowsMap.delete(id);
            const prefix = `${id}${KEY_SEP}`;
            for (const fKey of Array.from(fieldsMap.keys())) {
              if (fKey.startsWith(prefix)) {
                fieldsMap.delete(fKey);
              }
            }
            if (table === 'void_tasks') {
              const vPrefix = `${voidCounterKey(id)}${KEY_SEP}`;
              for (const cKey of Array.from(countersMap.keys())) {
                if (cKey.startsWith(vPrefix)) {
                  countersMap.delete(cKey);
                }
              }
            }
          }
        }
      }
    }
  }, deviceId);
}

/**
 * Reconciles a merged Y.Doc back into PGlite inside a single SQL transaction:
 * - Upserts all rows from Y.Doc (in foreign-key topological order).
 * - Deletes rows from PGlite that were deleted in Y.Doc.
 * - Reconstructs summed CRDT PN-Counter totals for XP, level, stats, and void engagements.
 */
export async function reconcileYDocToDb(db: PGlite, doc: Y.Doc): Promise<void> {
  const countersMap = doc.getMap<number>('counters');

  await db.query('BEGIN');

  try {
    // 1. Reconcile Singletons
    for (const table of SYNCED_SINGLETON_TABLES) {
      const singletonMap = doc.getMap<any>(`singleton:${table}`);
      if (singletonMap.size === 0 && table !== 'profile' && table !== 'stats') continue;

      const rowObj: Record<string, any> = { id: 1 };
      singletonMap.forEach((val, key) => {
        rowObj[key] = val;
      });

      if (table === 'profile' && hasCounter(countersMap, COUNTER_KEYS.PROFILE_TOTAL_XP)) {
        const totalXp = sumCounter(countersMap, COUNTER_KEYS.PROFILE_TOTAL_XP);
        rowObj.level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
        rowObj.xp = totalXp % XP_PER_LEVEL;
      }

      if (table === 'stats') {
        if (hasCounter(countersMap, COUNTER_KEYS.STATS_TASKS_COMPLETED)) {
          rowObj.tasks_completed = sumCounter(countersMap, COUNTER_KEYS.STATS_TASKS_COMPLETED);
        }
        if (hasCounter(countersMap, COUNTER_KEYS.STATS_FOCUS_HOURS)) {
          rowObj.total_focus_hours = sumCounter(countersMap, COUNTER_KEYS.STATS_FOCUS_HOURS);
        }
      }

      const columns = Object.keys(rowObj);
      if (columns.length <= 1) continue;

      const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
      const updateCols = columns.filter((c) => c !== 'id');
      const updateSet = updateCols.map((col) => `${col} = EXCLUDED.${col}`).join(', ');
      const values = columns.map((col) => rowObj[col]);

      await db.query(
        `INSERT INTO ${table} (${columns.join(', ')})
         VALUES (${placeholders})
         ON CONFLICT (id) DO UPDATE SET ${updateSet}`,
        values
      );
    }

    // 2. Delete rows removed via CRDT (reverse FK order: tasks -> milestones -> ambitions)
    const deleteOrder: SyncedEntityTable[] = [
      'tasks',
      'milestones',
      'skills',
      'ambitions',
      'void_tasks',
      'reflections',
      'devices'
    ];

    for (const table of deleteOrder) {
      const rowsMap = doc.getMap<boolean>(`rows:${table}`);
      const existing = await db.query<{ id: string }>(`SELECT id FROM ${table}`);

      for (const row of existing.rows) {
        if (rowsMap.get(String(row.id)) !== true) {
          await db.query(`DELETE FROM ${table} WHERE id = $1`, [row.id]);
        }
      }
    }

    // 3. Upsert entities in FK order (ambitions -> milestones -> tasks)
    for (const table of SYNCED_ENTITY_TABLES) {
      const rowsMap = doc.getMap<boolean>(`rows:${table}`);
      const fieldsMap = doc.getMap<any>(`fields:${table}`);

      // Group fields by row id
      const grouped = new Map<string, Record<string, any>>();
      rowsMap.forEach((present, id) => {
        if (present === true) {
          grouped.set(id, { id });
        }
      });

      fieldsMap.forEach((val, fullKey) => {
        const sepIdx = fullKey.indexOf(KEY_SEP);
        if (sepIdx === -1) return;
        const id = fullKey.slice(0, sepIdx);
        const col = fullKey.slice(sepIdx + KEY_SEP.length);
        const rowObj = grouped.get(id);
        if (rowObj) {
          rowObj[col] = val;
        }
      });

      for (const [id, rowObj] of grouped.entries()) {
        if (table === 'void_tasks' && hasCounter(countersMap, voidCounterKey(id))) {
          rowObj.engaged_count = sumCounter(countersMap, voidCounterKey(id));
        }

        const columns = Object.keys(rowObj);
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const updateCols = columns.filter((c) => c !== 'id');
        const updateSet =
          updateCols.length > 0
            ? updateCols.map((col) => `${col} = EXCLUDED.${col}`).join(', ')
            : 'id = EXCLUDED.id';
        const values = columns.map((col) => rowObj[col]);

        await db.query(
          `INSERT INTO ${table} (${columns.join(', ')})
           VALUES (${placeholders})
           ON CONFLICT (id) DO UPDATE SET ${updateSet}`,
          values
        );
      }
    }

    await db.query('COMMIT');
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}

/**
 * Checks whether a binary payload is a legacy GZIP-compressed JSON snapshot
 * (magic bytes 0x1F 0x8B).
 */
export function isLegacyGzipPayload(bytes: Uint8Array): boolean {
  return bytes.length >= 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;
}

/**
 * Converts either a modern Y.js binary update OR a legacy GZIP JSON snapshot
 * into a standard Y.js binary update (`Uint8Array`).
 */
export async function decodeRemotePayloadToYUpdate(bytes: Uint8Array): Promise<Uint8Array> {
  if (!isLegacyGzipPayload(bytes)) {
    return bytes;
  }

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(bytes);
      controller.close();
    }
  }).pipeThrough(new DecompressionStream('gzip'));

  const jsonText = await new Response(stream).text();
  const payload = JSON.parse(jsonText) as Record<string, any[]>;

  const legacyDoc = new Y.Doc();
  applySnapshotToYDoc(legacyDoc, payload, 'legacy-migration', { removeMissing: false });
  return Y.encodeStateAsUpdate(legacyDoc);
}

/**
 * Exports the current PGlite database as a Y.js state update,
 * persisting the updated Y.Doc locally first.
 */
export async function exportYjsUpdate(
  db: PGlite,
  deviceId: string = 'local-device'
): Promise<Uint8Array> {
  const doc = await loadPersistedYDoc(db);
  await syncPGliteToYDoc(db, doc, deviceId);
  await savePersistedYDoc(db, doc);
  return Y.encodeStateAsUpdate(doc);
}

/**
 * Merges a remote payload (Y.js update or legacy GZIP snapshot) with the local
 * PGlite + Y.Doc state, reconciles PGlite, and returns the merged Y.js update
 * ready to push back to the cloud.
 */
export async function mergeRemotePayloadAndReconcile(
  db: PGlite,
  remoteBytes: Uint8Array,
  deviceId: string = 'local-device'
): Promise<Uint8Array> {
  const doc = await loadPersistedYDoc(db);
  // First capture any uncommitted local edits/deletions from PGlite into doc
  await syncPGliteToYDoc(db, doc, deviceId);

  // Decode remote (supports both Yjs binary & legacy gzip JSON) and apply CRDT merge
  const remoteUpdate = await decodeRemotePayloadToYUpdate(remoteBytes);
  Y.applyUpdate(doc, remoteUpdate, 'remote');

  // Reconcile merged CRDT truth back into PGlite & persist Y.Doc state
  await reconcileYDocToDb(db, doc);
  await savePersistedYDoc(db, doc);

  return Y.encodeStateAsUpdate(doc);
}
