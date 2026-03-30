# Specification: Skill Matrix Refactor

## 1. Data Model Enhancements

### 1.1 Skills Schema
- **New Columns:**
  - `ambition_id`: TEXT (References `ambitions.id`).
  - `type`: TEXT (Values: `'personal'`, `'ambition'`).
- **Logic:**
  - If `type === 'personal'`, `ambition_id` should be NULL.
  - If `type === 'ambition'`, `ambition_id` must point to a valid ambition.

### 1.2 CRUD Actions
- `addSkill(name, current, target, recommendation, type, ambitionId)`
- `updateSkill(id, updates)`
- `deleteSkill(id)`

## 2. UI & Interaction

### 2.1 Skill Category Navigation
- A sub-navigation bar within `/skills` to switch between:
  - **All Skills**: Overview of everything.
  - **Personal**: Skills not tied to an ambition.
  - **[Ambition Title]**: Dedicated view for each active ambition.

### 2.2 Radar Chart
- The Radar Chart will filter and display only the skills relevant to the selected category.
- If a category has fewer than 3 skills, the chart should handle it gracefully (e.g., show a placeholder or a simplified visualization).

### 2.3 Management Interface
- **Initialize New Skill:** A form to add skills to the currently selected category.
- **Skill Cards:** Enhanced with "Edit" and "Delete" icons.
- **Inline Editing:** Toggle between view and edit mode for proficiency and recommendations.

## 3. Technical Constraints
- **State Management:** `useTrackStore` must manage the filtered state or provide a way to filter skills easily.
- **Persistence:** All changes must be synced to PGlite.
- **Animations:** Use Framer Motion for category transitions and form expansion.
