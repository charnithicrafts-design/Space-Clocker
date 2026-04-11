# DB Resilience and UX Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the "No more file handles available in the pool" error during PGlite initialization and improve the perceived performance/UX of database synchronization.

**Architecture:**
1.  **DB Resilience:** Update `db.worker.ts` to detect handle pool exhaustion and fallback to standard `opfs://` (or `idb://`) storage.
2.  **Startup UX:** Introduce a "Boot Loader" screen in `main.tsx` to prevent blank screens during DB initialization.
3.  **Client Robustness:** Enhance `restoreDb` in `client.ts` to ensure clean closure and adequate settling time.
4.  **Deferred Loading:** Refactor `useTrackStore.initialize` to prioritize critical "Trajectory" data while loading background collections.

**Tech Stack:** React 19, PGlite 0.4.x, Comlink, Zustand.

---

### Task 1: Fix Handle Pool Exhaustion in DB Worker

**Files:**
- Modify: `src/db/db.worker.ts`

- [ ] **Step 1: Update `init` method to catch "No more file handles" error**

Add a check for this specific error and fallback to standard `opfs://` (which is safer as it doesn't use the Access Handle Pool).

```typescript
// src/db/db.worker.ts around line 43
    try {
      // ... same initialization logic
      db = await PGlite.create(storagePath, {
        relaxedDurability: true,
        loadDataDir: dataDir instanceof Blob ? dataDir : dump,
      });
      await db.waitReady;
      // ...
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
      // ... (keep existing memory fallback)
      throw error;
    }
```

- [ ] **Step 2: Commit changes**

```bash
git add src/db/db.worker.ts
git commit -m "fix(db): add fallback to standard OPFS on handle pool exhaustion"
```

---

### Task 2: Robust Restoration in Client

**Files:**
- Modify: `src/db/client.ts`

- [ ] **Step 1: Increase settling time and ensure clean worker restart in `restoreDb`**

Sometimes the worker needs a complete restart to release locks in the filesystem.

```typescript
// src/db/client.ts:130
  // Give browser time to release locks and for the file system to settle
  // Increased from 500 to 1200ms for safety during heavy I/O
  await new Promise(r => setTimeout(r, 1200));
```

- [ ] **Step 2: Commit changes**

```bash
git add src/db/client.ts
git commit -m "fix(db): increase settling time during restoration"
```

---

### Task 3: Splash Screen UX in `main.tsx`

**Files:**
- Modify: `src/main.tsx`

- [ ] **Step 1: Update `start` function to render a splash screen before initialization**

```typescript
// src/main.tsx
async function start() {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  // 1. Immediate Boot UI (Splash)
  const root = createRoot(rootElement);
  root.render(
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#0b0e14',
      color: '#00f2ff',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '0.2em' }}>ESTABLISHING NEURAL LINK...</div>
      <div style={{ marginTop: '1rem', width: '200px', height: '2px', background: 'rgba(0,242,255,0.2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ 
          position: 'absolute', 
          width: '50%', 
          height: '100%', 
          background: '#00f2ff', 
          animation: 'shuttle 1.5s infinite linear' 
        }}></div>
      </div>
      <style>{`
        @keyframes shuttle {
          0% { left: -50%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );

  // ... rest of start() function, using 'root' instead of createRoot(rootElement) again later
```

- [ ] **Step 2: Refactor `start` to use the existing `root` for App render**

```typescript
    // ... after initialization ...
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
```

- [ ] **Step 3: Commit changes**

```bash
git add src/main.tsx
git commit -m "feat(ux): add splash screen during database initialization"
```

---

### Task 4: Optimized Store Initialization

**Files:**
- Modify: `src/store/useTrackStore.ts`

- [ ] **Step 1: Refactor `initialize` to load critical data first**

```typescript
// src/store/useTrackStore.ts:939
    initialize: async () => {
      const { dbProxy } = await import('../db/client');
      const today = getTodayLocalISO();

      // Stage 1: Critical Momentum Data
      const [profileRes, prefsRes, statsRes, oracleRes, ambitionsRes, systemRes] = await Promise.all([
        dbProxy.getProfile(),
        dbProxy.query(`SELECT confirm_delete as "confirmDelete", ui_mode as "uiMode" FROM preferences WHERE id = 1`),
        dbProxy.query(`SELECT streak, tasks_completed as "tasksCompleted", total_focus_hours as "totalFocusHours" FROM stats WHERE id = 1`),
        dbProxy.query(`SELECT api_key as "apiKey", model, provider_url as "providerUrl" FROM oracle_config WHERE id = 1`),
        dbProxy.query(`SELECT * FROM ambitions`),
        dbProxy.query(`SELECT last_startup, app_version FROM system_info WHERE id = 1`)
      ]);

      // Apply critical state immediately to make UI interactive
      set({
        profile: profileRes.rows[0] || get().profile,
        preferences: {
          confirmDelete: prefsRes.rows[0]?.confirmDelete ?? true,
          uiMode: prefsRes.rows[0]?.uiMode || 'simple'
        },
        stats: statsRes.rows[0] || get().stats,
        oracleConfig: oracleRes.rows[0] ? { ...get().oracleConfig, ...oracleRes.rows[0] } : get().oracleConfig,
        ambitions: ambitionsRes.rows || [],
        dbAppVersion: systemRes.rows[0]?.app_version
      });

      // Stage 2: Background Collection Data (Collections that can wait a few ms)
      const [milestonesRes, tasksRes, voidsRes, reflectionsRes, historyRes, skillsRes, internshipsRes, transmissionsRes] = await Promise.all([
        dbProxy.query(`SELECT * FROM milestones`),
        dbProxy.getTasks(),
        dbProxy.query(`SELECT id, text, impact, engaged_count as "engagedCount", max_allowed as "maxAllowed" FROM void_tasks`),
        dbProxy.query(`SELECT id, date, content, type FROM reflections ORDER BY date DESC LIMIT 100`),
        dbProxy.query(`SELECT * FROM stellar_history ORDER BY date DESC LIMIT 50`),
        dbProxy.query(`SELECT id, name, current_proficiency as "currentProficiency", target_proficiency as "targetProficiency", recommendation, type, ambition_id as "ambitionId" FROM skills`),
        dbProxy.query(`SELECT organization, start_date as "start", end_date as "end" FROM internships`),
        dbProxy.query(`SELECT * FROM transmissions ORDER BY timestamp DESC LIMIT 20`),
      ]);

      // Apply the rest of the data
      set({
        tasks: tasksRes.rows || [],
        voids: voidsRes.rows || [],
        reflections: reflectionsRes.rows || [],
        history: historyRes.rows || [],
        skills: skillsRes.rows || [],
        internships: internshipsRes.rows || [],
        transmissions: transmissionsRes.rows || [],
        // ... (ambitions and milestones mapping logic if needed)
      });
      
      // ... (handle system startup logic)
```

- [ ] **Step 2: Commit changes**

```bash
git add src/store/useTrackStore.ts
git commit -m "perf(store): prioritize critical data during store initialization"
```
