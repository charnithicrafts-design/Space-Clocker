# Implementation Plan: Pglite WASM Durable Storage Migration

Migrate the application's ephemeral state (Zustand `persist`) to a durable local Postgres database using Pglite WASM.

## Objective
- **Durable Storage:** Replace `localStorage` (via Zustand persist) with a robust relational database.
- **Relational Integrity:** Unify tasks, milestones, and ambitions with foreign keys.
- **Performance:** Enable efficient querying for large datasets (e.g., historical reflections).

## Key Files & Context
- `package.json`: Add `@electric-sql/pglite`.
- `src/db/`: New directory for database initialization, schema, and migrations.
- `src/store/useTrackStore.ts`: Update to sync with or query from Pglite.

## Implementation Steps

### Phase 1: Dependency & Initialization
1. **Add Dependency:** Install `@electric-sql/pglite`.
2. **Initialize Pglite:** Create `src/db/client.ts` to export a singleton Pglite instance.
3. **Define Schema:** Create `src/db/schema.sql` with tables for Profile, Preferences, Stats, OracleConfig, Ambitions, Milestones, Tasks, VoidTasks, Reflections, Skills, and Internships.
4. **Initialize DB:** Create `src/db/init.ts` to run the schema on startup if tables don't exist.

### Phase 2: Migration Utility
1. **Zustand to Pglite:** Create `src/db/migrate.ts` to check `localStorage` for `space-clocker-storage`.
2. **Bulk Insert:** If data exists, map the JSON structure to SQL inserts and execute them.
3. **Decommission Persist:** Remove the `persist` middleware from `useTrackStore.ts` once migration is verified.

### Phase 3: Store/DB Integration
1. **Sync Actions:** Update `useTrackStore` actions (e.g., `addAmbition`, `addTask`) to execute SQL commands in Pglite alongside (or instead of) updating the Zustand state.
2. **Load Initial State:** On app boot, fetch all records from Pglite and populate the Zustand store.
3. **Unified Tasks:** Update Daily Scheduler and Architect Mode queries to use the same `tasks` table with a `milestone_id` filter.

### Phase 4: Verification & Polish
1. **Data Integrity:** Verify all relationships are preserved after migration.
2. **Performance:** Test search/filtering on Reflections.
3. **Rollback Strategy:** Keep `localStorage` data until migration is manually confirmed.

## Verification & Testing
- **New User:** Start app, verify Pglite DB is created with empty tables.
- **Migrating User:** Start app with existing `localStorage` data, verify Pglite is populated and Zustand matches.
- **Durability Test:** Add a task, refresh page, verify task persists (without Zustand persist middleware).
