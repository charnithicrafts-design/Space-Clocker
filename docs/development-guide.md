# Developer Onboarding & Development Guide

Welcome to the **Space-Clocker** engineering team! This document serves as the single source of truth for onboarding new developers, understanding our coding standards, git workflows, and release cycles.

---

## 🌌 1. Developer Onboarding (New Workforce)

Follow these steps to set up your local development environment and get ready to contribute.

### Prerequisites
Before you start, ensure you have the following installed on your local machine:
- **Node.js**: Latest LTS version (v20+ recommended).
- **Git**: For version control.
- **A modern web browser**: Chrome, Firefox, or Edge (with local secure contexts enabled).

### Local Workspace Setup
1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd Space-Clocker
   ```
2. **Install Dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and configure the Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   > [!IMPORTANT]
   > Never commit `.env.local` or expose the API key. It is added to `.gitignore`.

### Verifying the Setup
1. **Run Linting:**
   Ensure the project lints successfully:
   ```bash
   npm run lint
   ```
2. **Run Test Suite:**
   Run the test suite (Vitest) in non-watch mode to verify existing features work:
   ```bash
   npm run test
   ```
3. **Start the Development Server:**
   Launch the local dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser. Verify you can access the application.

---

## 🛠 2. Coding Style & Conventions

We follow strict design patterns to keep the codebase clean, maintainable, and aligned with our sci-fi aesthetic.

### Architecture & Frameworks
- **Framework:** React 19 (TypeScript) with Vite 6.
- **Database:** PGlite (PostgreSQL running in WebAssembly) for local-first storage.
- **State Management:** Zustand stores (`src/store/`).

### Directory & Naming Conventions
- **Component File Names:** Use `PascalCase` (e.g., `UpdateModal.tsx`).
- **Feature Directories:** Use `kebab-case` (e.g., `src/components/void-protocol/`).
- **Imports:** Prefer absolute/aliased paths (e.g., `@/src/...` or relative where appropriate).

### Styling & Aesthetics (Tailwind v4)
- **Theme Variables:** All design system constants are centralized under `@theme` in `src/index.css`.
- **CSS Variables:** Use CSS variables (e.g., `var(--color-primary-container)`) to maintain style consistency.
- **Utility Classes:** Combine Tailwind utility classes with custom classes like `glass-panel` and `nebula-shadow` defined in `src/index.css`. Avoid ad-hoc utility hacks.
- **Visuals:** Maintain "glassmorphism", neon glows, and smooth transitions.

### Animations & Sound FX
- **Animations:** Use Framer Motion (`AnimatePresence` for exit animations and `layout` props for list reordering).
- **Sound Feedback:** Standard user interactions (screen transitions, task completions, and alerts) must trigger the `soundManager` from `@/src/utils/SoundManager` to ensure an immersive experience.

### Specific Metaphor Conventions
- **Stellar Matrix (Skills Matrix):** Use "bright stars" as a metaphor for high-proficiency skills. **Avoid using 'Void' terminology here.**
- **Void Protocol:** Reserve "Void" terminology exclusively for anti-habits and distraction-blocking lists.

---

## 🌿 3. Git Workflow Guide

We use a clean, atomic Git workflow to track changes reliably.

### Branching Strategy
- **Feature Development:** Create branches off `master` with descriptive names:
  - `feat/feature-name` for new features.
  - `fix/bug-name` for bug fixes.
  - `chore/task-name` for chore tasks.

### Commit Guidelines
We enforce the **Conventional Commits** specification. Each logical change must be documented in a reversible, atomic commit.

#### Commit Message Formats
- `feat(ui): add progress indicator to Orbit schedule`
- `fix(db): correct OPFS migration constraint error`
- `docs(onboarding): update development guide with Git protocols`
- `refactor(matrix): clean up radar chart rendering logic`
- `test(store): add test cases for importing demo data`
- `chore(release): v1.5.4`

> [!TIP]
> Make your commits small and focused. Each commit should represent one logical change that can be easily reverted if necessary.

---

## 🚀 4. Release Cycle Guide

Space-Clocker follows a strict **Per-Feature Release Cycle**. Every significant feature, hotfix, or architectural improvement must be accompanied by a version bump and release transmission notes.

### Versioning Rules (SemVer)
- **MAJOR (`x.0.0`)**: Incompatible API shifts or complete UI/UX overrides.
- **MINOR (`0.x.0`)**: Backward-compatible new features. Resets PATCH to 0.
- **PATCH (`0.0.x`)**: Backward-compatible bug fixes and hotfixes.

### Release Roles & Responsibilities
- **The Scribe (Role A - Notes Generator):** Summarizes changes into user-friendly "Stellar Transmissions". Updates `src/data/releases.json` with version details.
- **The Navigator (Role B - Quality Gatekeeper):** Runs `npm run lint` and `npm test` to verify database schema/migration validity.
- **The Engineer (Role C - Version Orchestrator):** Increments version in `package.json`, `package-lock.json`, and updates `CURRENT_APP_VERSION` in `src/constants.ts`.
- **The Overseer (Role D - Deployment Monitor):** Verifies the production build (Vercel) and ensures the UI displays the correct "Stellar Transmission".

### Release Execution Steps
1. Perform all pre-release quality checks (`npm run lint` & `npm test`).
2. Update the `version` field in:
   - `package.json`
   - `package-lock.json` (via `npm version --no-git-tag-version <version>`)
   - `src/constants.ts` (the `CURRENT_APP_VERSION` constant)
3. Add a new release entry at the top of the array in `src/data/releases.json`.
4. Commit only the version files and release notes in a single commit:
   ```bash
   git commit -am "chore(release): vX.Y.Z"
   ```
5. Push to the main branch to trigger the production build pipeline.
