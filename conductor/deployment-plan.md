# Deployment Plan: Space-Clocker

## Objective
Automate the deployment of Space-Clocker to **Vercel** with optimized build assets and PWA capabilities.

## Key Files & Context
- `vite.config.ts`: Main build configuration.
- `package.json`: Dependency and script management.
- `.env.local` / Vercel Environment Variables: `GEMINI_API_KEY`.

## Implementation Steps

### 1. Optimize Build Assets (Vite & Rollup)
- **Problem:** `pglite` WASM file (~8.7MB) exceeds default PWA precache limits.
- **Problem:** Large chunks trigger Rollup warnings and potential performance issues.
- **Solution:** 
  - Increase `workbox.maximumFileSizeToCacheInBytes` to 10MB in `VitePWA`.
  - Implement `manualChunks` to separate vendor dependencies (React, Lucide, Framer Motion, PGlite).
  - Increase `chunkSizeWarningLimit` to 1000KB (or as needed) to acknowledge the PGlite footprint.

### 2. PWA & Service Worker Configuration
- Ensure `VitePWA` is correctly configured for `autoUpdate`.
- Verify manifest icons and theme colors align with the "Cosmic Dark Mode" aesthetic.

### 3. Vercel Integration
- **Platform:** Vercel.
- **Workflow:** Automated deployments on `git push`.
- **Environment:**
  - Set `GEMINI_API_KEY` in Vercel Dashboard.
  - Set `NODE_VERSION` to 20 or higher (required for React 19 / Vite 6).

### 4. Verification
- Monitor Vercel build logs for success.
- Use Lighthouse or Chrome DevTools to verify PWA installation and Service Worker registration.
- Verify sound and animations are functional in the production environment.

## Verification Steps (Post-Deployment)
1. Navigate to the Vercel deployment URL.
2. Confirm the "Install App" prompt appears (PWA).
3. Test a task completion to ensure `SoundManager` and `Framer Motion` animations are working.
4. Check browser console for any WASM loading or Service Worker errors.
