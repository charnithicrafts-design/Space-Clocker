# Implementation Plan: Demo Data & Guided Tour

This plan details the steps to implement the demo data and the first-time user onboarding tour.

## 1. Demo Data Strategy (`src/data/demo-data.json`)
Create a comprehensive JSON file containing:
- Profile: "Valentina", Level 12, Title: "Senior Exobiologist".
- Ambitions: "Establish Martian Colony" (75%), "Jupiter Cloud Mining" (30%).
- Skills: Astro-navigation, Quantum Mechanics, Exoplanet Analysis.
- Deadline: NASA Senior Space Scientist (Dec 2027).
- Internships: ISRO, NASA.

## 2. Store Enhancement (`src/store/useTrackStore.ts`)
Add `importDemoData` action to:
- Clear current database tables.
- Batch insert demo data into: `profile`, `preferences`, `stats`, `ambitions`, `milestones`, `tasks`, `void_tasks`, `skills`, `internships`.
- Refresh local state via `initialize()`.

## 3. UI Component: `OnboardingTour.tsx`
Create a mission-themed guided tour using `framer-motion`:
- **Step 1: Mission Briefing** - Introduction to Space-Clocker.
- **Step 2: Momentum Engine** - Dashboard overview.
- **Step 3: Architect Mode** - Nebula Map overview.
- **Step 4: Daily Orbit** - Task management and Void Protocol.
- **Step 5: The Void** - Skills Matrix visualization.
- **Step 6: Completion** - Finalize onboarding.

## 4. App Integration (`src/App.tsx`)
- Detect new users via `localStorage.getItem('hasSeenOnboarding')`.
- Conditionally render `OnboardingTour` component.
- Trigger `importDemoData` when the tour begins or ends (based on UX preference).

## 5. Atomic Commits & Conventional Messages
Each phase will be committed separately:
1. `feat(data): add comprehensive space-themed demo data`
2. `feat(store): implement importDemoData action for onboarding`
3. `feat(ui): create mission-themed onboarding tour component`
4. `feat(app): integrate onboarding flow for first-time users`

## 6. Verification
- Manual walkthrough of the tour.
- Verify data persistence in PGlite after import.
- Run `npm test` to ensure no regressions.
