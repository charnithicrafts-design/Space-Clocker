# Plan: Transmission Refinement and Data Enrichment

This plan addresses the `ReferenceError: Zap is not defined` in `TransmissionDashboard`, fixes several lint errors, refines the transmission generation logic to avoid unnecessary deviations, and enriches the demo data with better skill-to-ambition mapping.

## Objective
- Fix runtime and lint errors across the project.
- Implement more focused transmission reports (daily reports focus on daily missed tasks, etc.).
- Allow targeting specific ambitions/milestones in transmissions.
- Update demo data to be more comprehensive and correctly linked.

## Key Files & Context
- `src/components/transmission/TransmissionDashboard.tsx`: Main UI for transmissions.
- `src/store/useTrackStore.ts`: Store logic and `generateTransmission` action.
- `src/components/skills/SkillsMatrix.tsx`: Skills visualization and management.
- `src/data/demo-data.json`: Initial application state for new users.
- `src/db/schema.sql`: Database definition.

## Implementation Steps

### Phase 1: Fix Existing Issues & Lint Errors
1. **`src/components/skills/SkillsMatrix.tsx`**:
    - Fix `SkillGapCard` `key` prop error by explicitly typing the component.
    - Fix `RadarChart` partial object type mismatch.
2. **`src/utils/TransmissionExporter.test.ts`**: 
    - Update `mockTransmission` to match the current `Transmission` interface (adding `missionMetrics`, `startDate`, `endDate`).
3. **`src/db/schema.sql`**: 
    - Add `start_date`, `end_date`, and `mission_metrics` columns to `transmissions` table.
4. **`src/components/reflection/ReflectionModal.tsx`**:
    - (Done) Fix `Reflection` import.
5. **`src/components/dashboard/StellarTimeline.tsx`**:
    - (Done) Fix `CategoryIcon` `className` support.

### Phase 2: Update Transmission Logic & UI
1. **`src/store/useTrackStore.ts`**:
    - Update `Transmission` metadata interface to include `targetAmbitionId?: string`.
    - Update `generateTransmission` to:
        - Accept `targetAmbitionId` parameter.
        - Filter `missed` tasks by `horizon` matching the `tier` (daily/weekly/yearly).
        - Ensure tasks without `plannedDate` are handled correctly (not showing as missed in daily reports unless explicitly planned).
2. **`src/components/transmission/TransmissionDashboard.tsx`**:
    - Update the generation modal to include an ambition selector.
    - Display the target ambition in the briefing header.

### Phase 3: Update Demo Data
1. **`src/data/demo-data.json`**:
    - Link skills to ambitions using `type: 'ambition'` and `ambitionId`.
    - Add `horizon` and `plannedDate` to milestone tasks to ensure they don't pollute daily reports unless intended.
    - Ensure relevant skill sets for all three ambitions.

## Verification & Testing
- Run `npm run lint` to ensure all TS errors are resolved.
- Run `npm run test` to verify store and exporter logic.
- Verify the transmission generation in the UI (simulated).
