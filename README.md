<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/76cca9af-cc17-466d-9ed0-de9c8eb396a8

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## 🛠 Product Architecture (Developer Context)

### 🚀 Momentum & Resonance Systems
Space-Clocker employs a dual-layered gamification architecture designed for deep goal alignment:

- **Global Space Science Level:** Tracked in the `profile` table. It represents the user's overall proficiency and consistency. Achievement points (XP) are accrued from all task completions.
- **Trajectory Resonance Energy:** Tracked per-ambition in the `ambitions` table. This allows users to visualize their focus on specific high-level goals. Resonance is fueled specifically by tasks linked to that ambition's milestones.

### 🧩 Core Components
- **Stellar Scheduler:** Found in `src/utils/StellarScheduler.ts`, this utility handles temporal conflict detection and orbital density analysis.
- **Chronos Backup:** Integrated via PGlite's binary dump/restore capabilities in `src/db/client.ts`.
- **Neural Link:** A custom synchronization layer with Google Drive for cross-device trajectory continuity.
