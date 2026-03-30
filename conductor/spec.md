# Specification: Temporal Linkage & Navigation Refactor

## 1. Temporal Model & Synchronization

### 1.1 Daily Horizon
- **Data Source:** Tasks where `horizon = 'daily'`.
- **Linking:** Tasks are displayed in the Timeline (`CalendarShell`) under the `daily` tab for their `planned_date`.
- **UI:** A date picker in the Orbit scheduler allows setting the `planned_date` for new and existing tasks.

### 1.2 Weekly Horizon
- **Data Source:** Tasks where `horizon = 'weekly'` OR Milestones within active ambitions.
- **Linking:** Displayed in the Timeline under the `weekly` tab.
- **Scheduler:** A new "Weekly Protocol" view in Orbit for managing these objectives.

### 1.3 Yearly Horizon
- **Data Source:** Ambitions and their milestones.
- **Linking:** Displayed in the Timeline under the `yearly` tab (replacing or augmenting the `InternshipScheduler`).
- **Visuals:** A "Stellar Roadmap" showing major ambition milestones across the year.

### 1.4 Deadline Management
- Deadlines should be visual and interactive.
- If a deadline is within 24 hours, the task should have a "Critical Gravitational Pull" (visual urgency).

## 2. Navigation & UX Refactor

### 2.1 Orbit Sub-Navigation
- **Concept:** A contextual tab bar or toggle within the `/orbit` route.
- **Modes:** 
  - `Daily`: Current mission log.
  - `Weekly`: Resonance Matrix (milestones/weekly tasks).
  - `Void`: Anti-habit protocol (Void Tasks).

### 2.2 Mobile Navigation (Command Hub)
- **Problem:** The 7+ icons in the current bottom nav are too crowded and hard to tap.
- **Solution:** A 3-5 icon bottom bar with a central "Command Hub" button.
- **Command Hub:** An elevated, animated button that opens a full-screen or half-screen overlay with large, thematic tiles for all major sectors (Nebula, Orbit, Timeline, Skills, etc.).

### 2.3 Desktop Navigation
- Refine the sidebar to group sectors:
  - **Tactical:** Dashboard, Orbit (with sub-links).
  - **Strategic:** Nebula, Timeline, Skills.
  - **Communications:** Transmission, Settings.

## 3. Technical Constraints
- **State Management:** Use `useTrackStore` for all temporal filtering.
- **Persistence:** Ensure `planned_date` and `deadline` are correctly persisted in PGlite.
- **Animations:** Use Framer Motion `AnimatePresence` for all navigation transitions and the Command Hub overlay.
- **Audio:** Integrate `SoundManager` for all hub interactions.
