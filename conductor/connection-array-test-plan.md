# Plan: Connection Array Testing Strategy

## Objective
Implement a robust testing suite for the "Connection Array" (Sync Manifest & Temporal Backup) features, ensuring reliability of data portability and cloud synchronization.

## Scope & Impact
- **Temporal Backup:** PGlite binary dump/restore logic.
- **Sync Manifest:** Google Drive API interactions and state synchronization.
- **Conflict Resolution:** Divergence Manifest UI and logic.
- **State Management:** Integration with `useTrackStore`.

## Implementation Plan

### 1. Unit Tests (Logic & Services)
- **`src/db/client.test.ts`**:
    - Mock `PGlite` to verify `dumpDb` calls `dumpDataDir`.
    - Verify `restoreDb` closes the existing instance and re-initializes with the provided blob.
- **`src/services/SyncService.test.ts`**:
    - Mock `fetch` to simulate Google Drive REST API.
    - Test `GoogleDriveProvider`:
        - `uploadFile`: Ensure correct multipart/form-data for PATCH/POST.
        - `downloadFile`: Ensure `alt=media` parameter is sent.
        - `getFileMetadata`: Verify query parameters for appDataFolder.
    - Test `SyncService`:
        - `pushUpdate`: Orchestrate dump -> upload -> metadata update.
        - `pullUpdate`: Orchestrate download -> restore -> metadata update.
        - `checkDivergence`: Compare local `last_synced_at` with remote `modifiedTime`.

### 2. Integration Tests (State & Store)
- **`src/store/useTrackStore.test.ts`**:
    - Mock `SyncService` and `DbClient`.
    - Test `checkSync`: Ensure it correctly bridges service results to store state.
    - Test `performPull`: Ensure it triggers a full re-initialization of the store after restoration.

### 3. UI Component Tests (Interactions)
- **`src/components/settings/SettingsDashboard.test.tsx`**:
    - Test "Create Snapshot": Verify it triggers a download of the `.pgdump` file.
    - Test "Restore Snapshot": Verify it triggers the `restoreDb` flow.
    - Test "Sync Now": Verify the loading states and sound feedback.
- **`src/components/reflection/SyncConflictModal.test.tsx`**:
    - Verify the "Divergence Manifest" modal displays correctly when `isOpen` is true.
    - Test resolution strategies ("Adopt Remote Manifest" vs "Stay Local Trajectory").

### 4. High-Fidelity "E2E" Test
- A specialized test file `src/tests/ConnectionArray.e2e.test.ts` that uses a real `PGlite` instance (in-memory) and a mocked `fetch` to simulate a full sync cycle:
    - Initial state -> Push -> Remote updated.
    - Remote updated -> Divergence detected -> Pull -> State restored.

## Verification
- Run `npm test` to execute all Vitest suites.
- Ensure 100% pass rate for new tests.
- Verify sound triggers are called correctly in all flows.

## Migration & Rollback
- No database migrations required (schema already updated).
- Tests are non-destructive to the codebase.
