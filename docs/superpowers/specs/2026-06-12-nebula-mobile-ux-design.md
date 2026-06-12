# Design Spec: Universal Actions Menu for Nebula Screen

**Date:** 2026-06-12
**Topic:** Mobile Usability Fix for Nebula Screen Actions
**Status:** Approved

## Problem Statement
The current Nebula (Architect Mode) screen uses hover-triggered actions (Edit/Delete) for Ambitions, Milestones, and Tasks. Since mobile devices do not support hover, users on touch devices are unable to access these critical functions.

## Proposed Solution
Introduce a universal "Actions Menu" interaction pattern across all hierarchical levels in the Nebula Map. This replaces the hover-only buttons with a touch-friendly "three-dot" menu icon.

### 1. Menu Trigger
- **Icon:** `MoreVertical` (Lucide React).
- **Visibility:**
  - **Mobile:** Always visible.
  - **Desktop:** Appears on group hover (preserving the existing clean aesthetic) or optionally always visible for accessibility.
- **Placement:** Positioned in the "trailing" section of the headers (next to expansion chevrons or progress indicators).

### 2. Menu Content (Dropdown)
- **Component:** A glassmorphism dropdown menu (`glass-panel`).
- **Actions:**
  - **Edit:** Triggers the existing inline editing mode for the specific item.
  - **Delete:** Triggers the existing deletion flow (with confirmation modal if enabled in preferences).
- **Behavior:**
  - Toggles on click/tap.
  - Closes on selection of an action.
  - Closes on "click outside" (using a dedicated hook or state management).

### 3. Hierarchical Application
The menu will be implemented for:
- **Ambitions:** In the `AmbitionCard` header.
- **Milestones:** In the `MilestoneCard` header.
- **Tasks:** Next to each task item within the expanded milestone view.

## Architecture & Implementation
- **Component Changes:**
  - `src/components/nebula/NebulaMap.tsx`:
    - Refactor `AmbitionCard`, `MilestoneCard`, and task list items.
    - Create a reusable `ActionMenu` sub-component to handle the dropdown state and "click outside" logic.
- **Styling:**
  - Use Tailwind CSS for positioning and responsiveness (e.g., `lg:opacity-0 lg:group-hover:opacity-100`).
  - Use Framer Motion for the dropdown entrance/exit animations.

## Success Criteria
- [ ] Users on mobile can edit and delete Ambitions, Milestones, and Tasks.
- [ ] Desktop users retain a clean UI that reveals actions on hover.
- [ ] Interaction is consistent across all levels of the Nebula Map.
- [ ] No regressions in existing edit/delete functionality.
