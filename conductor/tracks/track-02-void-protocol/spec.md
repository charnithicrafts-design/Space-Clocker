# Track 02: Void Protocol & Reflection Loop

## Goal
Implement the "Void Protocol" (anti-habit tracking) and the "Reflection Loop" (qualitative analysis of missed tasks/voids) to complete the "Micro Engine" feedback loop.

## Core Features

### 1. The Void Protocol (Anti-Habits)
- **Concept:** A list of behaviors to avoid (e.g., "Doomscrolling", "Procrastination").
- **Data Model:**
  - `Void` entity:
    - `id`: string (UUID)
    - `text`: string (e.g., "Doomscrolling Tech News")
    - `impact`: 'low' | 'medium' | 'high'
    - `engagedCount`: number (times engaged today)
    - `maxAllowed`: number (threshold before critical warning)
- **UI/UX:**
  - **Visuals:** Glitch effects, red/warning accents, "shaking" animations on interaction.
  - **Audio:** `playThud()` on interaction (engaging with a void).
  - **Interaction:** Clicking a void increments `engagedCount`. Visual intensity increases with count.

### 2. The Reflection Loop
- **Concept:** A mechanism to capture qualitative data when tasks are missed or voids are engaged.
- **Data Model:**
  - `Reflection` entity:
    - `id`: string (UUID)
    - `date`: string (ISO)
    - `content`: string (User input)
    - `type`: 'missed-task' | 'void-engaged' | 'daily-summary'
    - `relatedId`: string (Optional ID of task/void)
- **UI/UX:**
  - **Trigger:**
    - Manual "Reflect" button in Career Hub.
    - Automatic prompt when a Void reaches `maxAllowed`.
  - **Modal:**
    - Glassmorphism overlay.
    - Text area with "optimal" placeholder prompts (e.g., "What pulled you into the void?", "Course correction needed?").
    - "Log Entry" button (triggers `playSwell` or standard success sound).

## Store Updates (`useTrackStore`)
- Add `voids: Void[]` to state.
- Add `reflections: Reflection[]` to state.
- Add actions: `addVoid`, `engageVoid`, `addReflection`.

## Asset Requirements
- **Audio:** Ensure `playThud` is implemented in `SoundManager`.
- **Icons:** Warning/Error icons (Lucide React or similar).
