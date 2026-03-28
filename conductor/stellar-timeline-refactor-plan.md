# Plan: Stellar Timeline & Reflection Horizon Refactor

This plan refactors the navigation and routing to separate the **Reflection (Horizon)** functionality from the **Stellar Timeline Tracker**.

## Objective
- Re-purpose `/horizon` to serve exclusively as the **Event Horizon** (Reflection & Recalibration) view.
- Introduce a new route and navigation entry for the **Stellar Timeline Tracker** (using the existing `CalendarShell` component).
- Update the UI of `EventHorizon.tsx` to match the "Critical Intercept" UX provided in the user's reference.

## Key Files & Context
- `src/App.tsx`: Routing configuration.
- `src/components/layout/Navigation.tsx`: Navigation sidebar items.
- `src/components/horizon/EventHorizon.tsx`: The reflection-focused view.
- `src/components/horizon/CalendarShell.tsx`: The timeline-focused view.

## Implementation Steps

### 1. Route Refactoring
- Update `src/App.tsx` to add `/timeline` and re-map `/horizon`.
  - `/horizon` -> `EventHorizon`
  - `/timeline` -> `CalendarShell`

### 2. Navigation Update
- Update `src/components/layout/Navigation.tsx` to include both items.
  - **Horizon**: Label "Horizon", Icon `Telescope` (or `AlertCircle` to match "Critical Intercept").
  - **Timeline**: Label "Timeline", Icon `CalendarDays` or `Route`.
- Since `Orbit` already uses `CalendarDays`, I'll suggest:
  - **Orbit**: `Clock`
  - **Timeline**: `CalendarDays`
  - **Horizon**: `Telescope`

### 3. Event Horizon UX Refinement
- Update `src/components/horizon/EventHorizon.tsx` to match the screenshot:
  - "Critical Intercept" badge at the top.
  - "Event Horizon" title.
  - Countdown timer for "Momentum Save".
  - Reflection Log textarea.
  - "Recalibrate Trajectory" primary button.
  - "Bypass Horizon" close button.

### 4. Stellar Timeline Refinement
- Update `src/components/horizon/CalendarShell.tsx`:
  - Ensure the header says "Stellar Timeline Tracker".
  - Maintain the daily/weekly/yearly horizon picker.

## Verification & Testing
- **Navigation Test**: Click through all sidebar links to ensure they load the correct components.
- **Reflection Test**: Verify the "Event Horizon" view handles reflection input correctly.
- **Timeline Test**: Verify the "Stellar Timeline" correctly displays the internship scheduler and other time-based views.
