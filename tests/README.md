# Space-Clocker High-Fidelity Test Suite

This directory contains the production-ready Playwright E2E framework for Space-Clocker.

## 🚀 Setup

1.  **Install dependencies:**
    ```bash
    npm install
    npx playwright install
    ```
2.  **Configure environment:**
    Ensure `.env.local` has `BASE_URL=http://localhost:3000`.

## 🛠 Running Tests

- **Run all tests:** `npm run test:e2e`
- **Run in headed mode:** `npx playwright test --headed`
- **Debug mode:** `npx playwright test --debug`
- **Show report:** `npx playwright show-report`

## 🏗 Architecture

-   **`tests/e2e/`**: High-level functional tests (e.g., database trajectories).
-   **`tests/support/fixtures/`**: Composable Playwright fixtures. The `db` fixture allows direct interaction with the PGlite worker.
-   **`tests/support/helpers/`**: Common utilities for authentication and data manipulation.
-   **`tests/support/factories/`**: Faker-based data generators for realistic mission telemetry.

## 🌌 Best Practices

-   **Database State:** Use the `db` fixture to verify data persistence directly in tests.
-   **Selectors:** Prefer `data-testid` or user-facing locators (e.g., `getByRole`).
-   **Isolation:** Each test should start with a clean state. Use `db.purge()` if persistence across tests is an issue.

## 🤖 CI Integration

Traces and screenshots are captured on failure and retained in the `test-results/` directory. Reports are generated in HTML and JUnit formats.
