# Space-Clocker - Project Context

**Date:** 2026-04-08
**Version:** 1.4.1

## Core Technology Stack

- **Framework:** React 19.0.0 (TypeScript)
- **Build Tool:** Vite 6.2.0
- **Database:** PGlite 0.4.2 (Postgres-in-WASM for local-first persistence)
- **State Management:** Zustand 5.0.12 (domain-partitioned)
- **Animations:** Framer Motion 12.38.0 (interactive micro-animations)
- **Styling:** Tailwind CSS 4.1.14 (custom theme variables)
- **Testing:** Vitest 4.1.1

## Naming & Domain Conventions

- **PascalCase** for React components.
- **kebab-case** for feature-based directories (e.g., `src/components/void-protocol`).
- **Void Protocol:** Reserve "Void" terminology exclusively for the anti-habit system and distractions (Not-To-Do list).
- **Stellar Matrix:** Use "Stellar Matrix" for the Skills Matrix. Represent high-proficiency skills as "bright stars". Avoid "Void" terminology in this domain.

## Architectural Patterns

- **Monolith Frontend:** Single repository React SPA.
- **Local-First Persistence:** PGlite (PostgreSQL in Web Worker) for all user data. Schema in `src/db/schema.ts` and `src/db/schema.sql`.
- **Domain-Based State:** Zustand stores partitioned by feature (e.g., `orbitStore`, `nebulaStore`).
- **Glassmorphism Theme:** Unified visual language using Tailwind CSS 4 variables (defined in `src/index.css` `@theme` block).
- **Immersive Feedback:** Mandatory integration of `SoundManager` for user interactions (navigation, success/error states).

## Context Rules for AI

1. **React 19:** Use modern hooks and features. Avoid legacy React patterns.
2. **PGlite:** Ensure all database operations are handled via the worker-based client in `src/db`.
3. **Sound/Motion:** Every UI state change should consider motion and sound feedback.
4. **Void Protocol UX:** Implement high visual friction (red pulses, screen shake, blur) and auditory warnings (low-frequency drones, alarm sirens) when users engage with "Void Protocol" items. It should feel "dangerous" or "detrimental".
5. **Stellar Matrix UX:** Use "bright stars" (glowing particles, high-intensity gradients) to represent mastery. It should feel "aspirational" and "luminous".
6. **Safety:** Never expose API keys. The Gemini API key is loaded via `.env.local`.
