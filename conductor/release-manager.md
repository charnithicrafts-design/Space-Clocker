# Release Manager Protocol (v1.0.0)

## Overview
Space-Clocker follows a **Per-Feature Release Cycle**. Every significant feature, hotfix, or architectural improvement must be accompanied by a formal "Stellar Transmission" (Release Note) and a version bump.

## Release Cadence
- **Frequency:** Per-feature/hotfix.
- **Trigger:** Completion and successful verification of a feature branch or significant bug fix.

## Agent Roles & Responsibilities

### Role A: Notes Generator (The Scribe)
- **Objective:** Summarize technical changes into user-friendly "Stellar Transmissions".
- **Tasks:**
  - Analyze git diffs and commit history for the current release.
  - Update `src/data/releases.json` with a new entry (version, date, transmission summary, and detail bullets).
  - Ensure the sci-fi/space theme is maintained in all release communication.

### Role B: Quality Gatekeeper (The Navigator)
- **Objective:** Ensure "Neural Link" stability and zero regressions.
- **Tasks:**
  - Execute `npm run lint` and `npm test`.
  - Verify database migrations in `src/db/migrate.ts` are sound.
  - Check `src/main.tsx` for correct environment diagnostics.

### Role C: Version Orchestrator (The Engineer)
- **Objective:** Maintain versioning integrity across the codebase.
- **Tasks:**
  - Increment version in `package.json` and `package-lock.json`.
  - Update `CURRENT_APP_VERSION` in `src/constants.ts`.
  - Coordinate with Role A to ensure version numbers match in `releases.json`.

### Role D: Deployment Monitor (The Overseer)
- **Objective:** Final production verification and health check.
- **Tasks:**
  - Monitor Vercel deployment logs for "Neural Link" failures.
  - Perform a "Smoke Test" on the production environment (HTTPS/Secure Context check).
  - Confirm the `UpdateModal` correctly displays the new "Stellar Transmission".

## Workflow Steps

1. **Pre-Jump:** Role B runs all tests.
2. **Data Prep:** Role A prepares release notes in `src/data/releases.json`.
3. **Calibrate:** Role C increments versions across all core files.
4. **Execution:** Commit changes with a conventional commit (e.g., `chore(release): jump to v1.4.2`).
5. **Post-Jump:** Role D verifies the deployment on Vercel.

## Versioning Scheme
- **Major:** Fundamental system shifts (e.g., v2.0.0 - The Galaxy Release).
- **Minor:** Significant feature additions (e.g., v1.5.0 - New Orbit Protocol).
- **Patch/Hotfix:** Stability fixes and minor refinements (e.g., v1.4.2 - Neural Pathway Fix).
