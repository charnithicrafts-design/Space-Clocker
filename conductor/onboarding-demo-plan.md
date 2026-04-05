# Plan: Demo Data & First-Time User Experience (FTUX)

The goal is to provide a rich "Day Zero" experience for new users by importing a comprehensive set of career-focused demo data and guiding them through the application's core features via a professional UI tour.

## 1. Demo Data Strategy
Create a `src/data/demo-data.json` file containing a fully-populated application state.

### Demo Data Content
- **Profile:** "Valentina", Level 15, Title: "Cloud Architect & AWS Specialist".
- **Ambitions (Nebula):**
  - "AWS Solutions Architect Professional" (75% progress).
  - "India AI Contest - Winner 2026" (30% progress).
- **Milestones & Tasks:** Multiple deconstructed goals with varying completion statuses.
- **Skills Matrix (The Void):** Advanced proficiency in "Cloud Architecture", "AI Modeling", and "Data Engineering".
- **Future Deadline:** "Principal AI Researcher" application deadline set in late 2027.
- **Internship Data:** Completed periods at "AWS - Cloud Infrastructure" and "Google - DeepMind AI Lab".
- **Daily Scheduler:** A balanced mix of daily tasks, including "Void Protocol" items like "Social Media Doomscrolling" (to avoid).

## 2. FTUX Implementation (Professional Onboarding)

### New User Detection
1. Check `localStorage` for a `hasSeenOnboarding` flag.
2. If `false` (and DB is empty), trigger the onboarding flow.

### Onboarding Flow (The "Career Briefing" Tour)
A multi-step guided tour using a professional-themed modal/overlay.

#### Step 1: Career Briefing (Introduction)
- **Visual:** Holographic overlay of "Career Hub".
- **Content:** "Welcome, Valentina. You've been assigned to the Professional Trajectory program. We've initialized a demo profile to show you how to navigate your career trajectory."
- **Action:** Click "Initialize Systems".

#### Step 2: Momentum Engine (Dashboard)
- **Highlight:** Navigation to `/`.
- **Content:** "This is your Momentum Engine. It tracks your overall progress and macro ambitions. Notice how your level increases as you complete trajectories."
- **Action:** Click "Next Sector".

#### Step 3: Architect Mode (Nebula)
- **Highlight:** Navigation to `/nebula`.
- **Content:** "In Architect Mode, you deconstruct macro ambitions into de-coupled milestones. Examine the 'AWS Solutions Architect' trajectory to see how sub-goals are structured."
- **Action:** Click "Next Sector".

#### Step 4: Daily Scheduler (Orbit)
- **Highlight:** Navigation to `/orbit`.
- **Content:** "Manage your daily professional tasks here. Use the 'Void Protocol' to identify and avoid distractions that might derail your mission."
- **Action:** Click "Next Sector".

#### Step 5: The Void (Skills Matrix)
- **Highlight:** Navigation to `/skills`.
- **Content:** "Visualize your technical proficiency in the Skills Matrix. Your goal is to expand your reach across all critical domains required for the 2027 Principal AI Researcher role."
- **Action:** Click "Complete Onboarding".

## 3. Implementation Steps

### Phase 1: Data Preparation
1. Create `src/data/demo-data.json`.
2. Ensure the JSON structure matches the `TrackStore` and PGlite schema.

### Phase 2: Store Enhancement
1. Add `importDemoData` action to `useTrackStore.ts`.
2. This action will:
   - Clear existing data (if any).
   - Iterate through the JSON and perform `INSERT` queries for all tables.
   - Refresh the store state via `initialize()`.

### Phase 3: UI Development
1. Create a `src/components/layout/OnboardingTour.tsx` component.
2. Use `framer-motion` for holographic/glassmorphism effects.
3. Integrate the tour with the main `App.tsx` logic.
4. Set `hasSeenOnboarding` in `localStorage` upon completion.

## 4. Verification Plan
- **Automated Tests:**
  - Verify `importDemoData` correctly populates all tables.
  - Test the `hasSeenOnboarding` logic in `App.tsx`.
- **Manual Verification:**
  - Perform a "clean" start (clear site data) and verify the tour triggers and data imports correctly.
  - Verify the 2027 Principal AI Researcher deadline is visible in the Horizon/Timeline views.
