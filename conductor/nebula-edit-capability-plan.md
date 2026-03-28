# Implementation Plan: Nebula Milestone & Task Editing

Add the capability to edit existing milestones and tasks within the Nebula (Architect Mode) to allow users to refine their trajectories.

## Objective
- **Refine Trajectories:** Enable users to rename milestones and tasks.
- **Interactive UX:** Implement "click-to-edit" or edit-mode toggles for a seamless editing experience.
- **Data Integrity:** Ensure store updates are correctly propagated and persisted.

## Key Files & Context
- `src/store/useTrackStore.ts`: Add `updateMilestone` and `updateMilestoneTask` actions.
- `src/components/nebula/NebulaMap.tsx`: Update `MilestoneCard` and task items to support inline editing.

## Implementation Steps

### Phase 1: Store Enhancement
1. **Update `TrackStore` Interface:**
   - Add `updateMilestone(ambitionId: string, milestoneId: string, title: string)` action.
   - Add `updateMilestoneTask(ambitionId: string, milestoneId: string, taskId: string, title: string)` action.
2. **Implement Actions in `useTrackStore.ts`:**
   - Logic to find and update the specific milestone/task title.
3. **Commit:** `refactor(store): add update actions for milestones and tasks`

### Phase 2: UI Implementation (Tasks)
1. **Update Task Item in `MilestoneCard`:**
   - Add a `Edit` state for each task.
   - On click of the task title (if not completed), switch to an input field.
   - Handle `Enter` to save and `Esc` to cancel.
   - Add a small `Edit2` (Lucide) icon on hover to signify editability.
2. **Commit:** `feat(nebula): implement inline task editing`

### Phase 3: UI Implementation (Milestones)
1. **Update `MilestoneCard` Header:**
   - Add a small `Edit2` icon next to the milestone title.
   - On click, switch the title to an input field.
   - Prevent click propagation to avoid toggling the accordion.
2. **Commit:** `feat(nebula): implement inline milestone editing`

### Phase 4: Verification & Polish
1. **Functional Check:** Verify that renaming a milestone or task updates the store and survives a page reload.
2. **UX Check:** Ensure editing feels "snappy" and follows the glassmorphism aesthetic.
3. **Sound Check:** (Optional) Add a subtle sound effect on save.

## Verification & Testing
- **Edit Task:** Rename a sub-task, reload, and verify the name is preserved.
- **Edit Milestone:** Rename a milestone, reload, and verify the name is preserved.
- **Empty Name Check:** Prevent saving empty strings or provide a default fallback.
