# Implementation Plan: Unified Settings & Data Portability

Implement a dedicated Settings screen to centralize configuration (Oracle, Profile, UI) and consolidate Data Portability (Import/Export) for consistent Desktop and Mobile UX.

## Objective
- **Unified Settings:** A central hub for managing AI Oracle config, user profile, and system preferences.
- **Consistent UX:** Move Import/Export from the Sidebar to the Settings screen to clean up the navigation and ensure feature parity across devices.
- **Mobile Optimization:** Ensure the Settings screen is easily accessible and fully responsive on small screens.

## Key Files & Context
- `src/store/useTrackStore.ts`: Update store with `updateProfile` action.
- `src/components/settings/SettingsDashboard.tsx`: New component for the settings view.
- `src/components/layout/Navigation.tsx`: Refactor to remove direct Import/Export and link to Settings.
- `src/App.tsx`: Add routing for `/settings`.

## Implementation Steps

### Phase 1: Store & Actions
1. **Update `TrackStore` Interface:** Add `updateProfile(updates: Partial<Profile>)` action.
2. **Implement `updateProfile`:** Update the profile state in the store.
3. **Commit:** `refactor(store): add updateProfile action`

### Phase 2: Settings Dashboard UI
1. **Create `src/components/settings/SettingsDashboard.tsx`:**
    - **Profile Section:** Editable fields for Name, Level (manual adjust for testing), and Title.
    - **Oracle Section:** Configuration for API Key, Model, and Provider URL.
    - **Data Portability Section:** Relocate the Export/Import logic from `Navigation.tsx`.
    - **UI Preferences:** Placeholder for theme/audio toggles.
2. **Commit:** `feat(settings): implement unified settings dashboard`

### Phase 3: Navigation & Routing Refactor
1. **Update `src/App.tsx`:** Add `<Route path="/settings" element={<SettingsDashboard />} />`.
2. **Update `src/components/layout/Navigation.tsx`:**
    - Remove `handleExport` and `handleImport` logic (relocated to Settings).
    - Remove the bottom buttons in Desktop Nav.
    - Update the `Settings` link to navigate to `/settings`.
    - Ensure Mobile Nav has a consistent path to Settings.
3. **Commit:** `refactor(nav): consolidate data portability into settings screen`

### Phase 4: Verification & Polish
1. **Mobile Check:** Verify the settings screen is usable and aesthetic on mobile breakpoints.
2. **Functional Check:** Verify Profile updates, Oracle config updates, and Import/Export all work from the new screen.
3. **Build Check:** Run `npm run lint` and `npm run build`.

## Verification & Testing
- **Persistence:** Verify settings persist after page reload (Zustand persist).
- **Import/Export:** Export data from Settings, refresh/reset, and import it back—confirm full recovery.
- **Responsive:** Confirm layout transitions smoothly from Desktop Sidebar link to Mobile Bottom Nav link.
