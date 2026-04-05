# Plan: Accessibility Audit & Data-Driven Reporting

## Objective
Enhance the career briefing (Transmission) with real user data from Architect Mode and Daily Scheduler, while ensuring the generated reports (and their PDF exports) meet WCAG 2.2 accessibility standards.

## Key Files & Context
- `src/store/useTrackStore.ts`: Update `Transmission` interface and `generateTransmission` logic.
- `src/components/transmission/TransmissionDashboard.tsx`: Refactor report viewer to group accomplishments by horizon and include completed milestones.
- `src/index.css`: Strengthen `@media print` styles for WCAG 2.2 compliance (contrast 4.5:1+).
- `src/components/transmission/SharedTransmission.tsx`: Mirror these accessibility and data changes.
- `USER_GUIDE.md`: Document the new reporting features.

## Implementation Steps

### 1. Data Layer: Comprehensive Progress Capture
- **`useTrackStore.ts`**:
    - Update `Transmission` interface to include `horizon` for accomplishments and a `milestones` array.
    - Refactor `generateTransmission` to:
        - Group tasks by `horizon` (Daily, Weekly, Yearly).
        - Filter `ambitions` to find `milestones` that reached 'completed' status within the specified date range.
        - Calculate "Reliability Index" based on weightage of accomplished vs missed tasks.

### 2. UI Layer: Semantic & Grouped Achievements
- **`TransmissionDashboard.tsx`**:
    - Group the "Trajectory Milestone Accomplished" and "Trajectory Milestone Missed" sections by Horizon (Daily/Weekly/Yearly).
    - Add an "Architect Mode Progress" section highlighting completed milestones.
    - Add a "Professional Summary" (Reliability Index and focus hours).
    - Ensure all icons have `aria-hidden="true"` and meaningful labels are provided.

### 3. Accessibility Layer: High Contrast & WCAG 2.2
- **`index.css`**:
    - Update `@media print` to:
        - Strip all `glass-panel` and background effects.
        - Force text to high-contrast black (#000) or deep gray (#333) on white backgrounds.
        - Ensure semantic colors (Success/Error) use high-contrast variants (e.g., `#ba1a1a` for error).
        - Remove all `blur` and `opacity` filters.
- **Component Tweak**:
    - In the viewer, ensure text on `bg-primary` uses `text-on-primary` correctly.

### 4. Documentation
- **`USER_GUIDE.md`**:
    - Explain how the "Trajectory Chronometer" selects tasks and milestones.
    - Detail the Horizon grouping in the report.

## Verification & Testing
- **Visual Contrast Check**: Use DevTools to verify text contrast ratios in both "Glossy" and Print views.
- **Print Preview**: Manually check the "Export PDF" preview to ensure no gray-on-gray or low-contrast elements remain.
- **Data Integrity**: Generate a report with known tasks and milestones in a specific range and verify they are all captured.
- **Accessibility Audit**: Run `Lighthouse` or `axe` on the report view.
