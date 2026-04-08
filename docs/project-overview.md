# Space-Clocker - Project Overview

**Date:** 2026-04-08
**Type:** Web Frontend
**Architecture:** Layered/Component-based (React 19, Vite 6, TypeScript, Zustand, PGlite)

## Executive Summary

Space-Clocker is a high-fidelity, space-themed productivity and skill-tracking application. It is designed to help users (specifically oriented toward students in technical fields like MCA) manage their "trajectories" toward ambitious goals such as AWS Specialist or Data Analyst. The application features a modular interface with four primary modes: Dashboard (Momentum Engine), Nebula (Architect Mode), Orbit (Daily Scheduler), and Stellar Matrix (Skills Matrix).

## Project Classification

- **Repository Type:** Monolith
- **Project Type(s):** Web Frontend (React/Vite)
- **Primary Language(s):** TypeScript
- **Architecture Pattern:** Component-based Frontend with Local Browser Database

## Technology Stack Summary

| Category | Technology | Version | Justification |
| :--- | :--- | :--- | :--- |
| Framework | React | 19.0.0 | UI rendering and component architecture |
| Build Tool | Vite | 6.2.0 | Fast HMR and development experience |
| Database | PGlite | 0.4.2 | Local browser-based PostgreSQL storage |
| State Management | Zustand | 5.0.12 | Lightweight global state management |
| Animations | Framer Motion | 12.38.0 | High-fidelity interactive micro-animations |
| Styling | Tailwind CSS | 4.1.14 | Utility-first CSS framework with theme support |
| Icons | Lucide React | 0.546.0 | Versatile icon set |
| Routing | React Router | 7.13.2 | Application routing and navigation |
| AI Integration | Gemini API | ^1.29.0 | AI-assisted features (using @google/genai) |
| Testing | Vitest | 4.1.1 | Modern test runner for Vite |

## Key Features

- **Dashboard (Momentum Engine):** High-level progress overview and momentum tracking.
- **Nebula (Architect Mode):** Decomposition of goals into milestones and tasks.
- **Orbit (Daily Scheduler):** Task management with efficiency tracking.
- **Void Protocol:** A specialized "Not-To-Do" list for tracking and avoiding distractions (e.g., social media doomscrolling).
- **Stellar Matrix:** Visualization of technical proficiency (Radar Chart) using 'bright stars' to represent mastery.
- **Audio Feedback:** Integrated sound effects for immersive experience.
- **Glassmorphism UI:** Modern aesthetics with translucent panels and space themes.

## Architecture Highlights

- **PGlite Integration:** Uses a Web Worker to run a full PostgreSQL database within the browser, enabling persistent storage without a traditional backend.
- **Zustand Stores:** Organized into domains for state persistence and reactivity.
- **SoundManager:** Custom Web Audio API implementation for high-fidelity audio feedback.
- **Vite PWA:** Support for offline use and installation as a Progressive Web App.

## Development Overview

### Prerequisites

- Node.js (Latest LTS recommended)
- npm or pnpm
- Google Gemini API Key (for AI features)

### Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up environment variables: Create `.env.local` with `GEMINI_API_KEY`.
4. Run development server: `npm run dev`

### Key Commands

- **Install:** `npm install`
- **Dev:** `npm run dev`
- **Build:** `npm run build`
- **Test:** `npm run test`
- **Lint:** `npm run lint`

## Repository Structure

- `src/components/`: UI components categorized by feature and shared elements.
- `src/db/`: Database schema, migrations, and PGlite client configuration.
- `src/services/`: Business logic and external API integrations.
- `src/store/`: Zustand state management stores.
- `src/utils/`: Shared utilities (Audio, Date formatting, etc.).
- `conductor/`: Feature specifications and planning documents.

## Documentation Map

- [index.md](./index.md) - Master documentation index
- [architecture.md](./architecture.md) - Detailed technical architecture
- [source-tree-analysis.md](./source-tree-analysis.md) - Directory structure
- [development-guide.md](./development-guide.md) - Development workflow

---

_Generated using BMAD Method `document-project` workflow_
