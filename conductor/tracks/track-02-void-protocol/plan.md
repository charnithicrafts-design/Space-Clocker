# Track 02 Implementation Plan

## Phase 1: Store & Data Layer
- [x] Add `Void` and `Reflection` types to `useTrackStore.ts`.
- [x] Add initial state for `voids` (demo data: "Social Media Doomscrolling", "Unplanned Debugging").
- [x] Add initial state for `reflections`.
- [x] Implement `addVoid`, `engageVoid`, and `addReflection` actions.
- [x] Add unit tests for store updates (create `useTrackStore.test.ts` or extend existing).

## Phase 2: Audio & Assets
- [x] Verify `SoundManager.ts` implements `playThud()` (or add if missing).
- [x] Verify `SoundManager.ts` implements `playSwell()` (or add if missing).
- [x] Add mock implementations for new sounds in `SoundManager.test.ts`.

## Phase 3: The Void Protocol (UI)
- [x] Create `src/components/void-protocol/VoidList.tsx`.
- [x] Create `src/components/void-protocol/VoidTask.tsx`.
- [x] Implement glitch/shaking animations (Framer Motion).
- [x] Wire up `playThud` on interaction.
- [x] Integrate `VoidList` into `Career Hub` layout (e.g., right sidebar or bottom panel).

## Phase 4: Reflection Loop (UI)
- [x] Create `src/components/reflection/ReflectionModal.tsx`.
- [x] Implement modal visibility state in `useTrackStore` or local state.
- [x] Wire up "Log Entry" to `addReflection` and `playSwell` (or `playLevelUp`).
- [x] Add "Reflect" button to `Career Hub` header/footer.

## Phase 5: Integration & Polish
- [x] Ensure "Void" interactions update the store correctly.
- [x] Ensure "Reflection" logs are saved.
- [x] Verify all sounds play correctly.
- [x] Check responsive layout (ensure `VoidList` doesn't break mobile view).
