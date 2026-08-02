# 💻 Space-Clocker Developer Guide

Welcome to the Space-Clocker codebase! This guide covers technical architecture, development conventions, state management patterns, and quality assurance standards.

---

## 🏗️ Technology Stack

- **Framework:** React 19 + TypeScript + Vite 6
- **Styling:** Tailwind CSS v4 (`@theme` block in `src/index.css`) + Framer Motion
- **Icons:** Lucide React (`lucide-react`)
- **Database:** PGlite (PostgreSQL running in WASM via Web Worker)
- **State Management:** Zustand 5
- **Audio:** Custom Web Audio API (`src/utils/SoundManager.ts`)
- **Testing:** Vitest + React Testing Library + Playwright

---

## 📁 Directory Structure Overview

```
src/
├── components/          # Feature-partitioned React components
│   ├── horizon/         # Telemetry dashboard (recharts, Eleanor's Log)
│   ├── nebula/          # Milestone architect & ambition planner
│   ├── orbit/           # Daily scheduler, backlog, and Void Protocol
│   ├── skills/          # Stellar Matrix radar chart visualization
│   └── ui/              # Reusable glassmorphic UI elements & ActionMenu
├── data/
│   ├── archetypes/      # 35 Grounded professional profiles (medical, heavy-builders, etc.)
│   └── archetypes.ts    # Base 5 initial profiles & master export
├── db/
│   ├── client.ts        # Comlink RPC proxy connecting UI to Web Worker
│   └── db.worker.ts     # PGlite WASM database worker & SQL aggregations
├── store/
│   ├── useTrackStore.ts # Core application state (tasks, ambitions, skills, profile)
│   └── useAnalyticsStore.ts # Horizon telemetry state slice
└── utils/
    ├── DateTimeUtils.ts # ISO date formatting & timezone helpers
    └── SoundManager.ts  # Web Audio API synthesizer for interface feedback
```

---

## 🛠️ Getting Started & Setup

### Prerequisites
- Node.js >= 20.0.0
- npm >= 10.0.0

### Installation & Commands
```bash
# 1. Install dependencies
npm install

# 2. Run local development server (http://localhost:3000)
npm run dev

# 3. Type-check codebase
npm run lint

# 4. Run automated test suite
npm run test

# 5. Production build
npm run build
```

---

## 🔄 State & Data Flow Conventions

### 1. WASM Local-First Persistence
All persistent state resides in local WASM PostgreSQL via `@electric-sql/pglite`.
- Web Worker code is located in `src/db/db.worker.ts`.
- The main UI thread communicates asynchronously with the worker through `Comlink` in `src/db/client.ts`.
- Never execute heavy SQL queries or aggregations on the main UI thread. Add new SQL endpoints to `db.worker.ts`.

### 2. Milestone Task Lookup Pattern
When updating, deleting, or recalibrating tasks in `OrbitScheduler.tsx`, always map both `ambitionId` and `milestoneId`:
```typescript
const getMilestoneTask = (id: string) => {
  return ambitions
    .flatMap(a => a.milestones.flatMap(m => m.tasks.map(t => ({
      ...t,
      ambitionId: a.id,
      milestoneId: m.id
    }))))
    .find(t => t.id === id);
};
```

### 3. Interactive Audio Feedback
All user interactions (task completion, recalibration, modal triggers, tab navigation) should trigger appropriate sound effects via `SoundManager`:
```typescript
import { SoundManager } from '@/src/utils/SoundManager';

// On task recalibrate
SoundManager.playSyncSuccess();

// On task toggle
SoundManager.playPop();

// On deletion / eject
SoundManager.playThud();
```

---

## 🧪 Testing Guidelines

1. **Unit & Integration Tests:** Located alongside components (`.test.tsx`) or in `tests/data-integrity/`.
2. **Data Integrity:** Run `npx vitest run tests/data-integrity/skills.test.ts` to ensure profile data complies with:
   - Minimum 7 personal soft skills per profile.
   - Minimum 3 hard skills mapped per macro-ambition.
3. **Running All Tests:** Always execute `npm run test` before committing changes.

---

*Happy coding! Keep the architecture clean and resilient.*
