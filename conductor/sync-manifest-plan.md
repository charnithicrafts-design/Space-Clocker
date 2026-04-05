# Implementation Plan: Sync Manifest & Temporal Backup

Implement a professional-grade backup and sync system for Space-Clocker, enabling professionals to maintain their career trajectories across multiple devices with automated reliability.

## Objective
- **Temporal Backup:** Provide robust local and file-based backups using PGlite physical dumps.
- **Sync Manifest:** Enable multi-device synchronization via cloud storage (Google Drive) with automated "Data Manifest Syncs."
- **Immersive UX:** Maintain the professional theme with "Connection Array" status indicators and "Optimal Sync" animations.

## Key Files & Context
- `src/db/client.ts`: Expose PGlite instance and add `dump`/`restore` helpers.
- `src/services/StorageManager.ts`: New service for handling PGlite binary operations.
- `src/services/SyncService.ts`: New service for cloud provider integration and sync logic.
- `src/store/useTrackStore.ts`: Integrate sync status and trigger automated backups.
- `src/components/settings/SettingsDashboard.tsx`: Add "Connection Array" section.
- `src/components/layout/Navigation.tsx`: Add sync status indicator to Career Hub.

## Implementation Steps

### Phase 1: Temporal Backup (Local Persistence)
1. **Physical Dump Helper:** Update `src/db/client.ts` to provide a `dump()` method using `db.dumpDataDir()`.
2. **Restore Helper:** Update `src/db/init.ts` to support `loadDataDir` if a backup blob is provided.
3. **Backup UI:** Add "Create System Snapshot" to Settings, triggering a download of the `.pgdump` (binary tarball).
4. **Auto-Snapshot:** Implement a basic local history in IndexedDB (separate from PGlite) to store the last 5 snapshots for quick "System Restore."

### Phase 2: Cloud Transport (Sync Manifest)
1. **Google Drive Integration:**
    - Use `@google-apps/drive` or basic REST API.
    - Implement OAuth2 flow for the "Secure Link" authorization.
    - Target `appDataFolder` for private, hidden sync data.
2. **Data Manifest Sync (Push):**
    - Debounced function to upload the latest `dumpDataDir` to Google Drive.
    - Triggered after major state changes (e.g., adding an ambition).
3. **Optimal Sync (Pull):**
    - On app initialization, check the remote file timestamp.
    - If remote is newer, prompt the user: "Divergence Detected. Initiate Optimal Sync?"

### Phase 3: Conflict & Divergence Handling
1. **Metadata Tracking:** Store a `sync_metadata` table in PGlite with `last_synced_at` and `device_id`.
2. **Timestamp-Based Resolution:** 
    - Use "Latest Write Wins" as the default.
    - For "simultaneous" updates, detect if the remote base version differs from the local base version (indicating a split).
3. **Conflict Modal:** Create a "Divergence Manifest" UI to let users choose between "Keep Local Trajectory" or "Adopt Remote Manifest."

### Phase 4: UI/UX & Feedback
1. **Career Hub Status:** Add a small "Connection Array" icon in the navigation bar that pulses during sync.
2. **Sound Integration:** 
    - `sync_start.mp3` when starting sync.
    - `sync_success.mp3` on completion.
    - `alert_divergence.mp3` on conflict.
3. **Settings Polish:** Group all data portability features under a "Connection Array" heading with glassmorphism styling.

## Verification & Testing
1. **Manual Backup:** Export `.pgdump`, clear local storage, import `.pgdump`, verify all data (including relational links) is restored.
2. **Sync Test:** 
    - Open app on two browser profiles (Profile A and Profile B).
    - Edit Ambition on A, wait for sync.
    - Refresh B, verify change appears.
3. **Conflict Test:**
    - Disconnect A from network, make change.
    - Make different change on B.
    - Reconnect A, verify "Divergence Manifest" modal appears.
4. **Binary Integrity:** Verify PGlite 0.4.x `dumpDataDir` blobs are successfully loaded via `loadDataDir`.

## Migration & Rollback
- Keep the existing JSON-based import/export as a "Legacy Portability" option.
- Ensure the `profile` table is updated *after* a successful sync to reflect the latest sync timestamp.
