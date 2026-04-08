# GEMINI.md - Project Instructional Context

## Working Process
you are working in a team environment

record each change in a reversible atomic commit using conventional commit message style


dont use && in command line, you are in windows environment most likely using powershell or cmd


if you are running tests, especially vitest you automatically exit the shell after test completion regardless of whether test has passed or not

## Project Overview
**Space-Clocker** is a high-fidelity, space-themed productivity and skill-tracking application. It is designed to help users (specifically oriented toward students in technical fields like MCA) manage their "trajectories" toward ambitious goals such as AWS Specialist or Data Analyst. 

The application features a modular interface with four primary modes:
- **Dashboard (Momentum Engine):** High-level progress overview, level tracking, and macro ambitions.
- **Nebula (Architect Mode):** Decomposition of ambitions into stellar milestones and sub-goals.
- **Orbit (Daily Scheduler):** Daily task management with efficiency tracking and "Void Protocol" (Not-To-Do list).
- **Stellar Matrix (Skills Matrix):** A radar chart visualization for technical proficiency and gap analysis (formerly 'The Void').

The UI is characterized by a "glassmorphism" aesthetic, rich animations, and integrated audio feedback.

## Main Technologies
- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite 6
- **Styling:** 
  - **Tailwind CSS v4:** Utilizing the new `@theme` configuration in `src/index.css`.
  - **Framer Motion:** Powering all screen transitions, modals, and interactive micro-animations.
  - **Lucide React:** Providing the icon set.
- **Audio:** Web Audio API (custom implementation in `src/utils/SoundManager.ts`).
- **AI Integration:** `@google/genai` is a core dependency, intended for AI-assisted features (API key configuration present in `vite.config.ts`).
- **Database:** PGlite (Postgres-in-WASM) for local-first data persistence.

## Building and Running
- **Installation:** `npm install`
- **Development:** `npm run dev` (Runs on `http://localhost:3000`)
- **Production Build:** `npm run build`
- **Type Checking:** `npm run lint`
- **Cleaning:** `npm run clean`
- **Environment Setup:** Create a `.env.local` file and set `GEMINI_API_KEY` to your Google Gemini API key.

## Development Conventions
- **Naming Conventions:** Use PascalCase for components. Feature-based directories should use kebab-case (e.g., `src/components/void-protocol`).
- **Stellar Matrix:** Use 'bright stars' as a metaphor for high-proficiency skills in the Skills Matrix. Avoid 'Void' terminology here.
- **Void Protocol:** Reserve 'Void' terminology exclusively for the anti-habit system and distractions.
- **Theme Constants:** Centralized in `src/index.css` under the `@theme` block. Use CSS variables (e.g., `var(--color-primary-container)`) for consistency.
- **Interactive Feedback:** User actions (navigation, task completion, errors) should trigger the `soundManager` (imported from `@/src/utils/SoundManager`) to maintain the immersive experience.
- **Component Architecture:** The current structure in `App.tsx` uses functional components for screens. As the project grows, these should be refactored into a `src/components/screens` directory.
- **Animations:** Use `AnimatePresence` for exit animations and `layout` props for smooth list reordering.
- **Styling Pattern:** Prefer Tailwind's utility classes combined with custom `glass-panel` and `nebula-shadow` utilities defined in `src/index.css`.
- **HMR Note:** Hot Module Replacement (HMR) is programmatically controlled in `vite.config.ts` based on the `DISABLE_HMR` environment variable.
