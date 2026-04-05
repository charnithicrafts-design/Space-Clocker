# Development Workflow: Space-Clocker

## Core Protocol: Research -> Strategy -> Execution
For every new feature or bug fix, adhere to the following iterative lifecycle:

### 1. Research
- **Analysis:** Map the codebase and identify relevant files/symbols.
- **Validation:** Use grep_search and ead_file to confirm assumptions.
- **Empirical Reproduction:** For bug fixes, always reproduce the failure state before attempting a fix.

### 2. Strategy
- **Plan Mode:** Use enter_plan_mode for complex architectural changes or new features.
- **Documentation:** Define the technical approach and testing strategy.

### 3. Execution (Iterative: Plan -> Act -> Validate)
- **Surgical Implementation:** Apply targeted changes that follow workspace standards and "Trajectory-Professional" style.
- **Automated Testing:** Every change must include a corresponding test case (Vitest).
- **Validation:** Run 
pm run lint and the Vitest suite to ensure integrity and prevent regressions.

## Commits & Version Control
- **Conventional Commits:** Use atomic, reversible commits with types like eat, ix, docs, efactor, 	est, and chore.
- **Atomic Changes:** Record each logical change in a separate commit.
- **Staging & Tracking:** Ensure all new files are tracked and staged before committing.

## Quality Standards
- **Idiomatic Code:** Follow the established patterns (e.g., React 19 hooks, Tailwind v4 theme variables).
- **Zero-Secret Policy:** Never log, print, or commit secrets (API keys, .env).
- **Audio & Visual Consistency:** Always include micro-animations and sound feedback for interactive elements.

## Testing & Finalization
- **Vitest Execution:** Run tests in non-watch mode (--run) and ensure they exit immediately.
- **Manual Verification:** Confirm the "Dopamine Fountain" effect—interactions must feel smooth and rewarding.
- **Finality:** A task is complete only when behavior is verified and structural integrity is confirmed.
