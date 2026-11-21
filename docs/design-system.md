# Space-Clocker Design System Specification: Spatial 8pt Grid, Spacing & Typography

**Version:** 1.0.0  
**Status:** Canonical Reference  
**Applies to:** Space-Clocker Core (`src/`), Components, Modals, and Telemetry Engine  
**Aesthetic Identity:** Tactical Sci-Fi Glassmorphism & High-Fidelity Astro-Productivity  

---

## 1. Executive Vision & Core Principles

Space-Clocker is a mission-critical, high-density productivity and trajectory-tracking application designed for ambitious technical minds. The UI must feel like an advanced spacecraft instrumentation deck: tactile, luminous, precise, and rigorously structured.

To prevent visual clutter, cognitive fatigue, and layout drift, all visual elements adhere to three foundational tenets:

1. **Strict Spatial Harmony (8-Point Grid):** Every bounding box, touch target, margin, padding, and layout gutter is locked to a base-8 scale (with a disciplined 4px micro-increment for compact telemetry).
2. **Harmonious Vertical Rhythm:** Every typographic element pairs a deliberate font size with a line-height that is an exact multiple of 4px or 8px, maintaining a continuous baseline rhythm across multi-column dashboards.
3. **Tactical Contrast & Glassmorphism:** Deep space background layers (`#0b0e14` to `#32353c`) balanced with translucent frosted glass (`glass-panel`), crisp neon accents (`#00f2ff`), and high-legibility telemetry typography.

---

## 2. The 8-Point Spatial Grid

### 2.1 The Spatial Scale & Tokens

The base unit of Space-Clocker is **8px (`0.5rem`)**.
A disciplined **4px (`0.25rem`) half-step** is permitted strictly for micro-elements: inline badges, tag padding, icon-to-label gaps, and stroke offsets.

| Token | Pixels | Rem Value | Tailwind Class | Semantic Usage & Rules |
| :--- | :--- | :--- | :--- | :--- |
| **`space-0.5`** | `2px` | `0.125rem` | `p-0.5`, `gap-0.5` | Hairline offsets, indicator dots, micro-borders |
| **`space-1`** | `4px` | `0.25rem` | `p-1`, `gap-1`, `m-1` | **0.5x Micro Grid:** Inline badge padding, icon-text gap, compact pill tags |
| **`space-1.5`** | `6px` | `0.375rem` | `p-1.5`, `gap-1.5` | Specialized pill tag vertical padding, tight status pills |
| **`space-2`** | `8px` | `0.5rem` | `p-2`, `gap-2`, `m-2` | **1x Base Unit:** Tight button padding, dense list item gap, icon-only button padding |
| **`space-3`** | `12px` | `0.75rem` | `p-3`, `gap-3`, `m-3` | **1.5x Unit:** Form input horizontal padding, compact card padding, small modal headers |
| **`space-4`** | `16px` | `1.0rem` | `p-4`, `gap-4`, `m-4` | **2x Unit (Standard):** Mobile card padding, standard layout gap, default card body padding |
| **`space-5`** | `20px` | `1.25rem` | `p-5`, `gap-5`, `m-5` | Intermediate card padding, nested drawer gutters |
| **`space-6`** | `24px` | `1.5rem` | `p-6`, `gap-6`, `m-6` | **3x Unit (Medium):** Desktop card padding, section gap, modal dialog padding |
| **`space-8`** | `32px` | `2.0rem` | `p-8`, `gap-8`, `m-8` | **4x Unit (Large):** View container margins, hero card padding, major section divisions |
| **`space-10`** | `40px` | `2.5rem` | `p-10`, `gap-10` | Section dividers, large modal gutters |
| **`space-12`** | `48px` | `3.0rem` | `p-12`, `gap-12` | Major dashboard grid separation, empty state breathing room |
| **`space-16`** | `64px` | `4.0rem` | `p-16`, `gap-16` | Screen top hero spacing, major modality transitions |
| **`space-20`** | `80px` | `5.0rem` | `p-20`, `gap-20` | Panoramic canvas margins, deep space padding |

---

### 2.2 Component Dimensions & Touch Target Standards

All interactive elements must respect ergonomic touch targets and grid-aligned bounding box heights:

```
+-----------------------------------------------------------+
| Interactive Component Scale                              |
+-----------------------------------------------------------+
| Micro / Pill Badge   :  24px height  (h-6)   px-2  (8px)  |
| Compact Button       :  32px height  (h-8)   px-3  (12px) |
| Standard Button/Input:  40px height  (h-10)  px-4  (16px) |
| Primary Action / CTA :  48px height  (h-12)  px-6  (24px) |
| Top Navigation Bar   :  64px height  (h-16)  px-4/6       |
+-----------------------------------------------------------+
```

1. **Touch Targets (Mobile & Tablet):**
   - Minimum physical interactive bounding box: **44×44px** (WCAG 2.5.5).
   - Standard Space-Clocker target: **48×48px** (`min-h-[48px] min-w-[48px]`, or `h-12 w-12`).
   - If a visual icon or button is 32px or 24px, it must have an invisible padding or click-shield expanding its hit target to at least 44×44px (e.g. `p-2.5` or `-m-2 p-2`).

2. **Form Controls:**
   - Single-line Inputs (`text`, `time`, `date`): Default `h-10` (40px) with `px-3` (12px) or `h-12` (48px) for primary search/prompt bars.
   - Textareas: Multiples of 24px/32px (e.g., `min-h-[96px]` or `min-h-[128px]`).

3. **Card Containers:**
   - **Compact Card (Sidebar, Telemetry Feeds):** `p-3` (12px) or `p-4` (16px), rounded-xl (`12px` or `16px`).
   - **Standard Card (Orbit Task, Nebula Node, Milestone):** `p-4` (16px) on mobile, `p-6` (24px) on desktop, rounded-2xl (`16px`).
   - **Dialog / Modal Window:** `p-6` (24px) on mobile, `p-8` (32px) on desktop, rounded-3xl (`24px`).

---

### 2.3 Layout Breakpoints & Containers

| Breakpoint | Min-Width | Layout Gutters | Max Container Width | Column Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Mobile (`xs`)** | `< 640px` | `16px` (`px-4`) | `100%` | 1 Column, full-width cards |
| **Tablet (`sm`/`md`)** | `640px` - `1023px` | `24px` (`px-6`) | `100%` | 1 or 2 Columns, adaptive split |
| **Desktop (`lg`)** | `1024px` - `1279px` | `32px` (`px-8`) | `1024px` / `1200px` | 2 or 3 Columns |
| **Wide Desktop (`xl`)** | `1280px` - `1535px` | `32px` (`px-8`) | `1280px` | 3 or 4 Columns |
| **Ultra-Wide (`2xl`)** | `1536px+` | `48px` (`px-12`) | `1440px` (centered) | 4 Columns or Pan-Modular Cockpit |

---

## 3. Typographic System & Vertical Rhythm

### 3.1 Font Families

Space-Clocker utilizes three distinct, high-performance typographic families:

1. **`--font-sans` ("Inter", sans-serif):**
   - **Role:** Primary UI, body copy, descriptions, input labels, tooltips.
   - **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold).
   - **Characteristics:** Tall x-height, clear apertures, exceptional legibility at 12px–14px.

2. **`--font-display` ("Space Grotesk", sans-serif):**
   - **Role:** Screen titles, hero headlines, modal headings, milestone titles, rank labels.
   - **Weights:** 500 (Medium), 600 (SemiBold), 700 (Bold), 900 (Black).
   - **Characteristics:** Geometric, futuristic, sharp technical curves.

3. **`--font-mono` ("JetBrains Mono", monospace):**
   - **Role:** Telemetry readouts, timecodes, XP counters, timestamps, coordinates, system codes.
   - **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold).
   - **Characteristics:** Tabular figures (`tnum`), slashed zero, zero ambiguous glyphs (`0` vs `O`, `1` vs `l`).

---

### 3.2 Harmonious Typographic Scale Table

Every single font size is paired with a line-height that is an exact multiple of **4px or 8px**, establishing a mathematical baseline grid across the entire interface.

| Typographic Level | Font Size (px / rem) | Line Height (px / rem) | Font Family & Weight | Tracking (Letter Spacing) | Semantic Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `36px` / `2.25rem` | `44px` / `2.75rem` (div 4) | Space Grotesk Bold (700) | `-0.025em` (`tracking-tight`) | Screen hero titles, major level-up banners |
| **Title 1 (H1)** | `28px` / `1.75rem` | `36px` / `2.25rem` (div 4) | Space Grotesk Bold (700) | `-0.02em` (`tracking-tight`) | Primary view headers (Dashboard, Orbit, Nebula, Matrix) |
| **Title 2 (H2)** | `22px` / `1.375rem` | `28px` / `1.75rem` (div 4) | Space Grotesk SemiBold (600) | `-0.015em` (`tracking-tight`) | Major section headers, modal window titles |
| **Title 3 (H3)** | `18px` / `1.125rem` | `24px` / `1.5rem` (div 8) | Space Grotesk SemiBold (600) | `-0.01em` | Card headers, milestone titles, section sub-headers |
| **Headline (H4)** | `16px` / `1.0rem` | `24px` / `1.5rem` (div 8) | Inter SemiBold (600) | `0` (`tracking-normal`) | Task titles, list card titles, prominent table headers |
| **Body Large** | `16px` / `1.0rem` | `24px` / `1.5rem` (div 8) | Inter Regular (400) | `0` (`tracking-normal`) | Lead paragraphs, modal explanatory text, guides |
| **Body (Default)** | `14px` / `0.875rem` | `20px` / `1.25rem` (div 4) | Inter Regular (400) | `0` (`tracking-normal`) | Standard UI copy, input values, table data, notes |
| **Body Small** | `12px` / `0.75rem` | `16px` / `1.0rem` (div 8) | Inter Medium (500) | `+0.01em` | Helper text, secondary descriptions, metadata |
| **Caption / Overline** | `11px` / `0.6875rem` | `16px` / `1.0rem` (div 8) | Inter SemiBold (600) | `+0.06em` (`tracking-wider`, uppercase) | Category badges, column headers, pill tags |
| **Telemetry Micro** | `10px` / `0.625rem` | `12px` / `0.75rem` (div 4) | JetBrains Mono Medium (500) | `+0.02em` (tabular-nums) | Micro timestamps, orbital coordinate badges, status OK |
| **Telemetry Base** | `14px` / `0.875rem` | `20px` / `1.25rem` (div 4) | JetBrains Mono SemiBold (600) | `0` (tabular-nums) | Time pickers, daily task clock (`09:00 - 10:30`), XP badges |
| **Telemetry Large** | `24px` / `1.5rem` | `32px` / `2.0rem` (div 8) | JetBrains Mono Bold (700) | `-0.02em` (tabular-nums) | Large metric numbers (`87%`, `+350 XP`, `LVL 08`) |
| **Telemetry Hero** | `36px` / `2.25rem` | `40px` / `2.5rem` (div 8) | JetBrains Mono Bold (700) | `-0.03em` (tabular-nums) | Stopwatch timer, countdown to orbital decay |

---

## 4. Color Palette & Aura Architecture

### 4.1 Surface Tokens (Elevation Model)

Space-Clocker uses a continuous dark-space elevation model. As components rise in z-index and importance, their background luminance increases subtly:

- **`--color-surface-lowest` (`#0b0e14`):** Base canvas and deep-space background.
- **`--color-surface-low` (`#191c22`):** Sunken panels, empty state wells, inactive rails.
- **`--color-surface` (`#1d2026`):** Standard card backgrounds, container panels.
- **`--color-surface-high` (`#272a31`):** Elevated cards, dropdown menus, hover overlays.
- **`--color-surface-highest` (`#32353c`):** Floating modals, popovers, active selection states.

### 4.2 Foreground, Outline & Contrast

- **`--color-on-surface` (`#e1e2eb`):** Primary text and icons (high contrast, >12:1 against surface).
- **`--color-on-surface-variant` (`#b9cacb`):** Secondary text, helper labels, subdued icons (>5.5:1 contrast).
- **`--color-outline` (`#899394`):** Active borders, dividers, subtle separators.
- **`--color-outline-variant` (`#3a494b`):** Inactive borders, hairline card perimeters.

### 4.3 Brand & Semantic Colors

- **Primary Container (`--color-primary-container`):** `#00f2ff` (Neon Cyan) - Primary accents, active indicators, XP bars.
- **On Primary Container (`--color-on-primary-container`):** `#00373a` - High-contrast text on cyan fills.
- **Secondary (`--color-secondary`):** `#dab9ff` (Nebula Lavender) - Secondary trajectories, milestone markers.
- **Success (`--color-success`):** `#3ef39b` (Emerald Quantum) - Completed tasks, active streaks, synced status.
- **Error / Decay (`--color-error`):** `#ffb4ab` (Solar Flare Red) - Orbital decay, overdue tasks, critical alerts.

### 4.4 Dynamic Cognitive Aura States

The ambient atmosphere transitions dynamically based on user focus and system resonance:

- **Flow State (`body[data-aura="Flow"]`):**
  - `--color-primary-container: #43f3de;` (Deep Teal Cyan)
  - Encourages sustained concentration, cooling ambient glows.
- **Clouded State (`body[data-aura="Clouded"]`):**
  - `--color-primary-container: #ff8e8b;` (Desaturated Coral)
  - Indicates cognitive overload or excessive orbital decay.

---

## 5. Elevation, Surface & Glassmorphism Tokens

### 5.1 Glassmorphism Formula

The signature Space-Clocker frosted glass aesthetic must remain performant on low-spec mobile GPUs:

```css
.glass-panel {
  background-color: rgba(50, 53, 60, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(58, 73, 75, 0.4);
}

.glass-panel-subtle {
  background-color: rgba(29, 32, 38, 0.5);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(58, 73, 75, 0.25);
}

.glass-panel-elevated {
  background-color: rgba(50, 53, 60, 0.8);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(0, 242, 255, 0.2);
  box-shadow: 0px 16px 36px rgba(0, 0, 0, 0.4);
}
```

### 5.2 Border Radius Scale

All corner radiuses follow the harmonious power-of-2 / 8pt hierarchy:

- **`rounded-sm` (4px):** Micro tags, inline progress indicators, tick marks.
- **`rounded-md` (6px - 8px):** Compact buttons, badges, input inner elements.
- **`rounded-lg` (8px - 10px):** Form fields, action buttons, dropdown items.
- **`rounded-xl` (12px):** Sub-cards, task items, tooltips.
- **`rounded-2xl` (16px):** Primary cards (Orbit tasks, Nebula milestones, Matrix panels).
- **`rounded-3xl` (24px):** Modal dialogs, floating action sheets.
- **`rounded-full` (9999px):** Pills, avatars, circular icon triggers.

---

## 6. Developer Guidelines & Usage Rules

### 6.1 Strict "Do & Don't" Checklist

| Category | Do ✅ | Don't ❌ |
| :--- | :--- | :--- |
| **Grid Multiples** | Use `p-2` (8px), `p-4` (16px), `p-6` (24px), `gap-4` | Don't use arbitrary paddings like `p-[11px]`, `p-5.5`, or `gap-[13px]` |
| **Micro Gaps** | Use `gap-1` (4px) or `gap-2` (8px) between icon and text | Don't use uneven spacing like `gap-0.5` on large buttons |
| **Touch Targets** | Ensure all mobile touchable buttons have `min-h-[44px]` or `min-h-[48px]` | Don't create tiny naked icon buttons with 20px hit areas |
| **Typography Classes** | Use semantic classes (`type-h2`, `type-body`, `type-telemetry`) | Don't scatter arbitrary font sizes like `text-[9px]`, `text-[13px]`, `text-[15px]` |
| **Line Heights** | Always pair font sizes with harmonious line heights (`leading-4`, `leading-5`, `leading-6`, `leading-7`, `leading-9`) | Don't leave multiline headers without explicit leading or rely on unpredictable defaults |
| **Tabular Numbers** | Always use `font-mono tabular-nums` or `font-telemetry` for metrics, timers, and XP values | Don't display variable-width numbers in counters where digits jump horizontally |

### 6.2 Pre-defined Tailwind CSS Utility Classes

The following utility classes are integrated into `src/index.css`:

```html
<!-- Page Title -->
<h1 class="type-title-1 text-on-surface">Momentum Engine</h1>

<!-- Section Heading -->
<h2 class="type-title-2 text-on-surface">Active Orbit Sequence</h2>

<!-- Card Title -->
<h3 class="type-title-3 text-on-surface">Stellar Architecture</h3>

<!-- Standard Body Text -->
<p class="type-body text-on-surface-variant">Calibrate your orbital trajectory toward Cloud Solutions Architect.</p>

<!-- Telemetry Pill / Counter -->
<span class="type-telemetry text-primary-container font-mono">1,450 / 2,000 XP</span>

<!-- Micro Badge -->
<span class="type-overline text-on-surface-variant bg-surface-high px-2 py-0.5 rounded">TELEMETRY OK</span>
```

---

## 7. Verification & Audit Checklist

Before committing any UI component or view:
1. [ ] **Grid Alignment:** Are all padding, margin, and gap values divisible by 4px (micro) or 8px (standard)?
2. [ ] **Touch Target:** Does every clickable element offer at least 44×44px interactive area on mobile?
3. [ ] **Type Hierarchy:** Does the component utilize the standard type scale without ad-hoc `text-[Npx]` overrides?
4. [ ] **Line Heights:** Do multi-line text elements maintain vertical rhythm?
5. [ ] **Color Contrast:** Does text meet at least 4.5:1 (normal) or 3:1 (large) contrast against its surface?
6. [ ] **Tabular Numerals:** Are numeric metrics, timecodes, and XP indicators formatted with `tabular-nums`?
