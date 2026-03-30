# Implementation Plan: Temporal Linkage & Navigation Refactor

## Phase 1: Temporal Model & Orbit UI (Tactical)

### 1.1 Store & Database
- Update `addTask` in `useTrackStore.ts` to accept an explicit `plannedDate`.
- Add an action `updateTaskDate(taskId, date)` to the store.
- Add filtering logic in the store to get tasks by date and horizon.

### 1.2 Orbit Scheduler Enhancements
- Integrate a thematic `DatePicker` (glassmorphism style) in the `Initialize New Task` section.
- Add an inline date/deadline editor for existing tasks.
- Implement a "Critical" visual state for tasks nearing their deadline.

### 1.3 Orbit Sub-Navigation
- Create a `OrbitSubNav` component with tabs: `Daily`, `Weekly`, `Void`.
- Refactor `OrbitScheduler.tsx` to switch between these views (or create separate components for each).

## Phase 2: Stellar Timeline Sync (Strategic)

### 2.1 Daily & Weekly Timeline
- Implement the `daily` view in `CalendarShell.tsx` to show a vertical time-blocked schedule of tasks.
- Implement the `weekly` view to show a grid of milestones and weekly tasks.

### 2.2 Yearly Stellar Roadmap
- Enhance the `yearly` view in `CalendarShell.tsx`.
- Create a horizontal scrollable timeline showing Ambition milestones.
- Integrate `InternshipScheduler` as a layer within this yearly view.

## Phase 3: Navigation Overhaul (UX)

### 3.1 Command Hub (Mobile)
- Create `src/components/layout/CommandHub.tsx`.
- Implement an animated overlay triggered by a central button in the mobile nav.
- Refactor `Navigation.tsx` to use the new mobile layout.

### 3.2 Desktop Sidebar Refinement
- Group navigation links into "Tactical", "Strategic", and "Communications" categories.
- Improve the visual hierarchy and active state styling.

## Phase 4: Verification & Polish
- **Testing:** Verify task linking across all horizons.
- **Mobile UX:** Ensure the Command Hub feels fluid and intuitive on small screens.
- **Audio/Visual:** Add specialized sounds for "Timeline Lock" and "Hub Activation".

## Verification Steps
1. Create a task with a specific date in Orbit -> Verify it appears on that date in the Timeline.
2. Set a deadline within 1 hour -> Verify the "Critical" visual state triggers.
3. Open Command Hub on mobile -> Verify all sectors are accessible and the animation is smooth.
