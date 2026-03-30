# Implementation Plan: Skill Matrix Refactor

## Phase 1: Database & Store (The Engine)

### 1.1 Schema Migration
- Update `src/db/schema.sql` with new columns in `skills` table.
- Add `ALTER TABLE` statements to `src/db/init.ts` to update existing databases.

### 1.2 Store Enhancements
- Update `Skill` interface in `src/store/useTrackStore.ts`.
- Implement `addSkill` action with PGlite persistence.
- Implement `deleteSkill` action with PGlite persistence.
- Refactor `updateSkill` to support all skill fields (`name`, `current`, `target`, `recommendation`).
- Update `initialize` logic to map new columns from the DB.

## Phase 2: UI Foundation (The Layout)

### 2.1 Category Navigation
- Create `SkillCategoryNav` component in `SkillsMatrix.tsx`.
- Implement state to track `selectedCategoryId` ('all', 'personal', or ambitionId).

### 2.2 Filtering Logic
- Update the `skills` selection in `SkillsMatrix` to filter based on the active category.

## Phase 3: CRUD Operations (The Interaction)

### 3.1 Skill Creation
- Implement `AddSkillForm` with glassmorphism styling.
- Ensure it defaults to the currently active category.

### 3.2 Skill Editing & Deletion
- Refactor `SkillGapCard` to include "Edit" and "Delete" actions.
- Implement an "Edit Mode" within the card for inline updates.

## Phase 4: Verification & Polish
- **Testing:** Verify that adding a skill to "NASA" ambition only shows up in that category.
- **Visuals:** Ensure the Radar Chart animates smoothly when switching categories.
- **Audio:** Integrate `SoundManager` for all CRUD actions.

## Verification Steps
1. Create an ambition -> Go to Skills -> Verify new ambition category appears.
2. Add a skill to "Personal" -> Verify it doesn't appear in ambition-specific views.
3. Edit proficiency -> Verify Radar Chart updates in real-time.
4. Delete a skill -> Verify removal from both Chart and List.
