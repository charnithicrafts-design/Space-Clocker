# Space-Clocker - Source Tree Analysis

**Date:** 2026-04-08

## Overview

Space-Clocker is organized as a single React-based monolith with clearly defined directories for frontend components, database logic, state management, and business services.

## Complete Directory Structure

```
project-root/
├── conductor/       # Project planning and feature specifications
├── docs/            # Generated documentation for AI context
├── public/          # Static assets (PWA icons, etc.)
├── src/             # Main source code
│   ├── components/  # React UI components (Glassmorphism theme)
│   ├── data/        # Static data and initial state
│   ├── db/          # Local PostgreSQL (PGlite) database layer
│   ├── services/    # Business logic and external API integrations
│   ├── store/       # Zustand state management stores
│   ├── utils/       # Shared utility functions (SoundManager, etc.)
│   ├── App.tsx      # Main application container and routing
│   ├── main.tsx     # Application entry point
│   └── index.css    # Tailwind CSS 4 theme and global styles
├── GEMINI.md        # Project instructional context
├── package.json     # Node.js manifest and dependencies
├── tsconfig.json    # TypeScript configuration
├── vite.config.ts   # Vite build configuration
├── vitest.config.ts # Testing configuration
└── vercel.json      # Vercel deployment configuration
```

## Critical Directories

### `src/components/`
**Purpose:** Contains all React components, including feature-specific views and shared UI elements.
**Contains:** Functional React components using Tailwind CSS and Framer Motion.

### `src/db/`
**Purpose:** Handles the local PostgreSQL-in-the-browser (PGlite) database layer.
**Contains:** Schema definitions (`schema.sql`, `schema.ts`), migrations (`migrate.ts`, `migrations.ts`), and query functions (`queries.ts`).
**Entry Points:** `db.worker.ts` for background execution.

### `src/store/`
**Purpose:** Manages global application state using Zustand.
**Contains:** Feature-specific stores for momentum, trajectories, milestones, and tasks.

### `src/services/`
**Purpose:** Provides business logic services and handles integrations with external APIs.
**Contains:** AI services, database interaction wrappers, and shared business logic.

### `src/utils/`
**Purpose:** Contains shared helper functions and core utilities.
**Contains:** `SoundManager.ts` for audio, `timeUtils.ts` for date formatting, and `cn.ts` for class merging.

### `conductor/`
**Purpose:** Acts as the "brains" of the project's evolution, containing detailed plans and specifications for each feature track.
**Contains:** Track-specific plans (e.g., `track-04-settings-refactor-plan.md`), product guidelines, and tech stack definitions.

## Entry Points

- **Main Entry:** `src/main.tsx` (Bootstraps React into the DOM)
- **App Entry:** `src/App.tsx` (Application root component and router setup)
- **Database Entry:** `src/db/db.worker.ts` (Entry for the PGlite worker thread)

## File Organization Patterns

- **Components:** Feature-based subdirectories within `src/components/`.
- **Database:** Co-located SQL and TS schema definitions in `src/db/`.
- **Styling:** Centralized Tailwind CSS configuration in `src/index.css` using the `@theme` block.

---

_Generated using BMAD Method `document-project` workflow_
