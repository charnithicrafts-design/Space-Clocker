# PGlite Web Worker Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transition the PGlite database from the main thread to a dedicated Web Worker, mediated by a Comlink proxy, to ensure UI responsiveness and eliminate main-thread blocking.

**Architecture:** 
- Database logic encapsulated in `src/workers/db.worker.ts`.
- `src/db/client.ts` refactored as a Comlink proxy exposing an asynchronous API.
- All database operations are wrapped in transaction batches (`BEGIN`/`COMMIT`/`ROLLBACK`) for atomicity.

**Tech Stack:** React 19, PGlite (^0.4.2), Comlink, TypeScript.

---

### Task 1: Setup Worker Infrastructure

**Files:**
- Create: `src/workers/db.worker.ts`
- Create: `src/workers/db.worker.types.ts`

- [ ] **Step 1: Create type definition for the DB worker**

```typescript
// src/workers/db.worker.types.ts
export interface DatabaseWorkerAPI {
  executeBatch(queries: { sql: string, params?: any[] }[]): Promise<boolean>;
  query<T>(sql: string, params?: any[]): Promise<T[]>;
}
```

- [ ] **Step 2: Initialize Web Worker**

```typescript
// src/workers/db.worker.ts
import { PGlite } from '@electric-sql/pglite';
import * as Comlink from 'comlink';

const db = new PGlite('idb://space-clocker-db', {
  relaxedDurability: true,
});

const api = {
  async executeBatch(queries: { sql: string, params?: any[] }[]): Promise<boolean> {
    try {
      await db.transaction(async (tx) => {
        for (const q of queries) {
          await tx.query(q.sql, q.params);
        }
      });
      return true;
    } catch (e) {
      console.error('Batch transaction failed:', e);
      return false;
    }
  },
  async query<T>(sql: string, params?: any[]): Promise<T[]> {
    const res = await db.query<T>(sql, params);
    return res.rows;
  }
};

Comlink.expose(api);
```

### Task 2: Refactor `src/db/client.ts` as Comlink Proxy

**Files:**
- Modify: `src/db/client.ts`

- [ ] **Step 1: Update client to use Comlink**

```typescript
// src/db/client.ts
import * as Comlink from 'comlink';
import { DatabaseWorkerAPI } from '../workers/db.worker.types';

const worker = new Worker(new URL('../workers/db.worker.ts', import.meta.url), {
  type: 'module',
});

export const db = Comlink.wrap<DatabaseWorkerAPI>(worker);
```

### Task 3: Verify and Commit

**Files:**
- Verify: `src/db/client.ts`
- Test: `src/db/db.test.ts` (Update existing tests to await new async API)

- [ ] **Step 1: Update test file `src/db/db.test.ts`**

Update `src/db/db.test.ts` to `await` the new async `db` proxy methods.

- [ ] **Step 2: Commit changes**

```bash
git add src/workers/db.worker.ts src/workers/db.worker.types.ts src/db/client.ts src/db/db.test.ts
git commit -m "refactor: migrate PGlite to web worker with comlink proxy"
```
