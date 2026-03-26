# Track 03: Macro Engine & Data Portability Spec

## Goal
Implement the technical skills matrix (radar chart), enhance the Macro Engine (Goal Deconstructor & Task Splitter), and enable PWA data import/export for full data portability.

## Core Features

### 1. Technical Skills Matrix
- **Visual:** A futuristic radar chart (spider chart) representing proficiency across 6 key categories.
- **Categories:**
  - Data Structures & Algorithms
  - Systems Design
  - Space Science & Orbital Mechanics
  - AI/ML Frameworks
  - Cybersecurity
  - Cloud Infrastructure (AWS/GCP)
- **Data Model:**
  - `Skill` object:
    - `id`: string
    - `name`: string
    - `currentProficiency`: number (0-100)
    - `targetProficiency`: number (0-100)
    - `recommendation`: string (AI-generated or predefined text)
- **UI:**
  - **Radar Chart:** Custom SVG-based component with glowing neon lines (Primary and Secondary colors).
  - **Gap Analysis List:** A section below the chart with progress bars showing the gap between current and target proficiency.
  - **Interaction:** Toggle between "Current" and "Target" views or overlay both.

### 2. Macro Engine (Goal Deconstructor & Task Splitter)
- **Goal Deconstructor:**
  - UI in "Nebula Map" to break high-level Ambitions into multiple Milestones.
  - Ability to name milestones and set their initial status.
- **Task Splitter:**
  - UI to break individual Milestones into smaller, actionable Tasks.
  - Integrated into the Milestone details view in "Nebula Map".
- **Integration:** Tasks created here should be available for the daily "Orbit" view.

### 3. PWA & Data Portability
- **PWA:**
  - Service Worker for offline support and manifest for home screen installation.
  - Theme colors and icons matching the "Space-Clocker" aesthetic.
- **Export/Import:**
  - **Export:** Generate a JSON blob of the entire `space-clocker-storage` (excluding transient UI state) and trigger a browser download.
  - **Import:** Allow user to select a JSON file, validate its structure, and overwrite the store (with a confirmation prompt).
  - **Data Scope:** Profile, Ambitions (with Milestones and Tasks), Voids, Reflections, and Skills.

## Assets & Styling
- **Icons:** Lucide React icons for Skills (e.g., `Brain`, `Trophy`, `Database`).
- **Styling:** Tailwind v4 utility classes + custom glassmorphism effects.
- **Animations:** Framer Motion for radar chart entry and progress bar fills.
