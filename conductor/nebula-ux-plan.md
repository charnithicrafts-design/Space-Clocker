# Implementation Plan: Nebula UX Enhancement

Enable users to create new high-level Trajectories (Ambitions) and improve the reward feedback loop for milestone and task creation.

## Objective
- **Launch Trajectory:** Provide a clear entry point for creating new top-level ambitions in "Architect Mode".
- **Dopamine Feedback:** Integrate audio feedback (`SoundManager`) into the creation workflows.
- **Empty State Readiness:** Ensure the UI remains functional and inviting even with zero ambitions.

## Key Files & Context
- `src/components/nebula/NebulaMap.tsx`: Main UI for Architect Mode.
- `src/utils/SoundManager.ts`: Audio utility for interaction rewards.

## Implementation Steps

### Phase 1: Nebula Map Header Enhancement
1. **State Management:** Add `isLaunching` and `newAmbitionTitle` state to `NebulaMap`.
2. **Launch UI:** Add a "Launch New Trajectory" button in the header that expands into a sleek input field.
3. **Sound Integration:** Trigger `SoundManager.playSwell()` upon successful launch.

### Phase 2: Milestone & Task Reward Loop
1. **Milestone Creation:** Add `SoundManager.playPop()` to `handleAddMilestone` in `AmbitionCard`.
2. **Task Creation:** Add `SoundManager.playPop()` to `handleAddTask` in `MilestoneCard`.
3. **Task Toggle:** Ensure `SoundManager.playPop()` (or a subtle toggle sound) is triggered on completion toggle.

### Phase 3: Empty State UI
1. **Placeholder:** Display a "No Trajectories Detected" message with a prominent "Initiate Launch" button if the `ambitions` array is empty.

## Verification & Testing
- **Visual Check:** Confirm the "Launch" button fits the glassmorphism aesthetic.
- **Audio Check:** Verify `playSwell` triggers on new Trajectory and `playPop` triggers on Milestones/Tasks.
- **Empty State Check:** Wipe local data and verify the invitation to create the first trajectory is clear.
