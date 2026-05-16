---
stepsCompleted:
  - 'step-01-preflight-and-context'
  - 'step-02-generation-mode'
  - 'step-03-test-strategy'
  - 'step-04c-aggregate'
  - 'step-05-validate-and-complete'
lastStep: 'step-05-validate-and-complete'
lastSaved: '2026-04-23'
inputDocuments:
  - 'package.json'
  - '_bmad-output/test-artifacts/test-design-pglite-restoration.md'
  - 'src/db/db.worker.ts'
  - 'src/tests/db-restoration.test.ts'
---

# ATDD Checklist: Epic 105 - PGlite Restoration Stability

## Prerequisites Verification
- [x] Story/Design approved: `_bmad-output/test-artifacts/test-design-pglite-restoration.md`
- [x] Test framework configured: Playwright & Vitest
- [x] Dev environment available

## Stack Detection
- **Detected Stack**: frontend (React + Vitest)
- **Primary Tooling**: Vitest for Worker Unit/Integration, Playwright for E2E Stress

## Generation Mode
- **Selected Mode**: AI Generation
- **Rationale**: Low-level logic verification with mocks is better suited for AI generation than browser recording.

## Test Strategy
| AC ID | Scenario | Level | Priority | Goal |
| :--- | :--- | :--- | :--- | :--- |
| AC-1 | Collision Recovery | Unit | P0 | Verify purge & retry on 'Database already exists' |
| AC-2 | Lock Handling | Unit | P0 | Verify retry with backoff on 'NoModificationAllowedError' |
| AC-3 | Snapshot Integrity | Integration/E2E | P0 | Verify full restoration with real/mocked blob |
| P1-1 | Rapid Restoration | E2E | P1 | Verify stability under concurrent restore calls |

## Acceptance Criteria Coverage (TDD RED PHASE)

✅ Failing tests generated (all marked with `skip`)

| AC ID | Scenario | Level | Test File | Status |
| :--- | :--- | :--- | :--- | :--- |
| **AC-1** | Collision Recovery | Unit | `src/tests/worker-restoration.test.ts` | 🔴 RED (Skipped) |
| **AC-2** | Lock Handling | Unit | `src/tests/worker-restoration.test.ts` | 🔴 RED (Skipped) |
| **AC-3** | Snapshot Integrity | E2E | `tests/e2e/restoration-stress.spec.ts` | 🔴 RED (Skipped) |
| **P1-1** | Rapid Restoration | E2E | `tests/e2e/restoration-stress.spec.ts` | 🔴 RED (Skipped) |

## Generated Artifacts
- **Unit/API Tests**: `src/tests/worker-restoration.test.ts`
- **E2E Tests**: `tests/e2e/restoration-stress.spec.ts`
- **Subagent API Report**: `_bmad-output/test-artifacts/tea-atdd-api-tests-20260423.json`
- **Subagent E2E Report**: `_bmad-output/test-artifacts/tea-atdd-e2e-tests-20260423.json`

## Next Steps (TDD Green Phase)

After implementing the feature:

1. Remove `it.skip()` and `test.skip()` from all test files.
2. Run tests: `npm test` and `npx playwright test`.
3. Verify tests PASS (green phase).
4. If any tests fail:
   - Either fix implementation (feature bug).
   - Or fix test (test bug).
5. Commit passing tests.

## Implementation Guidance
- **Web Worker**: Verify `existsRetryCount` and `isLockError` handling in `src/db/db.worker.ts`.
- **UI**: Ensure "Restore Snapshot" button correctly triggers file input and shows success feedback.
