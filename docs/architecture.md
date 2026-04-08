# Space-Clocker - Technical Architecture

**Date:** 2026-04-08

## Executive Summary

Space-Clocker is a React 19 web application built with Vite 6, utilizing an offline-first, browser-based PostgreSQL database (PGlite). It uses a modern, high-fidelity UI approach (Glassmorphism, Tailwind CSS 4, Framer Motion) to create an immersive productivity experience.

## Technology Stack

- **Framework:** React 19 (Functional Components, Hooks)
- **Build Tool:** Vite 6
- **Database:** PGlite (Postgres-in-the-browser)
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Styling:** Tailwind CSS 4
- **Routing:** React Router 7
- **AI Integration:** Google Gemini API (via @google/genai)
- **Testing:** Vitest

## Data Architecture

The application uses **PGlite**, a lightweight PostgreSQL database compiled to WebAssembly that runs in the browser.

### Key Data Concepts:
- **Trajectories:** High-level goals (e.g., "AWS Specialist").
- **Milestones:** Significant markers along a trajectory.
- **Tasks:** Actionable items belonging to a milestone.
- **Momentum:** Tracking of daily progress and streaks.
- **Stellar Matrix:** Skills matrix tracking proficiency levels using 'bright stars' as visual indicators.
- **Void Protocol:** Anti-habit system and distraction tracking (Not-To-Do list).

### Database Strategy:
- **Web Worker:** The database runs in a dedicated Web Worker (`db.worker.ts`) to prevent UI blocking.
- **Migrations:** Managed via `src/db/migrations.ts`, ensuring schema consistency during updates.
- **Queries:** Centralized in `src/db/queries.ts` for consistent data access.

## State Management

Global state is managed using **Zustand**, organized into several stores:
- **Momentum Store:** Handles progress tracking and streaks.
- **UI Store:** Manages current mode (Dashboard, Nebula, Orbit, Void) and theme.
- **Trajectory Store:** Manages active goals and their decomposition.

State persistence is handled either by the database for primary data or Zustand’s built-in persistence for UI preferences.

## UI/UX Architecture

- **Glass-Panel Aesthetic:** Custom Tailwind CSS utilities define translucent, blurred panels for the space theme.
- **Mode Switching:** The `App.tsx` handles navigation between the four primary modes with Framer Motion `AnimatePresence` for smooth transitions.
- **Audio Service:** `SoundManager.ts` provides a global singleton for playing feedback sounds (navigation clicks, task completions, error alerts).

## AI Integration

The `src/services/` layer includes an AI service that interfaces with the **Google Gemini API**. This is used for:
- Auto-decomposing trajectories into milestones.
- Providing productivity insights based on task completion patterns.
- Assisting in goal setting and refinement.

## Development Workflow

- **Local Development:** `npm run dev` starts the Vite server on port 3000.
- **Type Safety:** TypeScript is enforced throughout the project (`npm run lint` for checks).
- **Testing:** Vitest is used for unit and integration tests (e.g., `CommunicationArray.integration.test.ts`).

---

_Generated using BMAD Method `document-project` workflow_
