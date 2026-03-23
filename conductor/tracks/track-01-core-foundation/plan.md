# Track 01: Core Foundation Implementation Plan

## Phase 1: Shell & HUD Layout
1.  **MissionControl Layout:** Create src/components/layout/MissionControl.tsx. Use Tailwind v4 glassmorphism and Framer Motion for entrance animations.
2.  **Theme Setup:** Ensure index.css Tailwind variables are correctly applied for the "Cosmic Dark Mode" and neon accents.

## Phase 2: Core State & Logic
1.  **Track Store:** Create src/store/useTrackStore.ts using React Context or a simple custom hook for managing ambitions and daily tasks.
2.  **Sound Integration:** Enhance src/utils/SoundManager.ts to include a playPop() method specifically for task completions.

## Phase 3: Micro-Engine Components
1.  **OrbitScheduler:** Create src/components/micro-engine/OrbitScheduler.tsx. Include interactive checkboxes with "pop" sound and physics-based animations.
2.  **Progress Indicators:** Implement progress bars that visually link daily actions to the "Valentina" demo data (e.g., "3 Quantum Gates").

## Phase 4: Macro-Engine Preview
1.  **MacroDashboard:** Create src/components/macro-engine/MacroDashboard.tsx. A simple card-based view showing the "Lead Scientist by 2027" goal.

## Phase 5: Integration & Verification
1.  **App Main:** Update src/App.tsx to include the MissionControl layout and all core components.
2.  **Manual & Automated Tests:**
    -   Write a Vitest for SoundManager to verify audio context initialization.
    -   Verify interaction fidelity—check if "to-do click" triggers sound and motion.
    -   Confirm "Galactic-Professional" style and "Ethereal" tone in the browser.

## Success Criteria Checklist
- [ ] MissionControl layout with glassmorphism.
- [ ] OrbitScheduler with interactive checkboxes.
- [ ] SoundManager triggers "pop" sound on completion.
- [ ] Framer Motion animations applied to all interactions.
- [ ] App.tsx updated with the core foundation.
- [ ] Tests passed and exited successfully.
