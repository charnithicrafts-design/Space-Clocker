---
stepsCompleted: ['step-01-preflight', 'step-02-select-framework']
lastStep: 'step-02-select-framework'
lastSaved: '2026-04-08'
---

# Step 1: Preflight Checks

## 1. Stack Detection
- **Configured Stack Type:** `frontend` (from `_bmad/tea/config.yaml`)
- **Detected Stack Type:** `frontend` (React 19 + Vite 6 detected in `package.json`)
- **Result:** `{detected_stack}` = `frontend`

## 2. Validate Prerequisites
- **package.json exists:** ✅ Yes
- **No existing E2E framework:** ✅ Yes (Checked for Playwright and Cypress config files)
- **Architecture context:** ✅ Yes (`_bmad-output/project-context.md` found)

## 3. Gather Project Context
- **Framework:** React 19.0.0
- **Bundler:** Vite 6.2.0
- **Primary Dependencies:** `@electric-sql/pglite`, `framer-motion`, `zustand`, `lucide-react`, `@google/genai`
- **Auth/API Requirements:** GEMINI_API_KEY required in `.env.local`. No external OAuth or complex auth detected yet.
- **Context Docs:** `_bmad-output/project-context.md`, `README.md`, `USER_GUIDE.md`

## 4. Confirmation Summary
- **Project Type:** React (Vite 6)
- **E2E Status:** Not yet initialized (Vitest unit/integration tests only)
- **Next Step:** Proceed to framework selection (Playwright vs Cypress)

# Step 2: Framework Selection
- **Selected Framework:** Playwright
- **Rationale:** 
  - **PGlite Complexity:** Playwright's multi-context support is superior for validating PGlite's Web Worker-based persistence.
  - **Storage Strategy:** Robust handling of browser-specific APIs (OPFS, IndexedDB) across Chromium and Firefox to catch "Temporal Rifts".
  - **Performance:** Native parallelism and faster execution for the "Stellar" scale test suite.
  - **Future-Proofing:** Better alignment with the project's high-fidelity trajectory and React 19 architecture.
