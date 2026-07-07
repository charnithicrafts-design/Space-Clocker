---
name: space-clocker-responsiveness-testing
description: 'Validate app responsiveness, viewports, element collisions, and adapt web layouts like Android ConstraintLayout using CSS3.'
---

# Responsiveness and Layout Testing Protocol

This skill provides a systematic protocol for testing Space-Clocker responsiveness across Mobile, Tablet, and Laptop viewports, diagnosing layout collisions, and implementing adaptable layout constraints using modern CSS3.

---

## 1. Responsive Viewport Matrix

Verify the application layout, glassmorphism UI integrity, text wrapping, and interactive zones at these target breakpoints:

| Device Category | Target Resolution / Breakpoint | Key Focus Areas | Playwright Viewport Size |
| :--- | :--- | :--- | :--- |
| **Mobile Portrait** | `360px` to `480px` (`sm:`) | Bottom navigation bar tap targets, text wrapping, form inputs within narrow bounds, non-overlapping action overlays. | `{ width: 375, height: 667 }` (iPhone SE) |
| **Mobile Landscape** | `481px` to `767px` | Scrollable areas, header shrinkage, command modal sizing. | `{ width: 667, height: 375 }` |
| **Tablet Portrait** | `768px` to `1023px` (`md:`) | Transition from bottom navigation bar to left sidebar navigation, grid column adjustments. | `{ width: 768, height: 1024 }` (iPad) |
| **Laptop & Desktop**| `1024px`+ (`lg:` / `xl:`) | Full sidebar visibility, dashboard columns, radial matrices, hover states. | `{ width: 1280, height: 720 }` |

---

## 2. Common Responsiveness Anti-Patterns (Addressed by this Skill)

### A. Element & Interaction Collisions (Fixed Overlap)
- **Problem:** Fixed or absolute elements (e.g., buttons, floating panels) overlap and block interaction with other fixed controls (e.g., bottom navigation bars).
- **Example:** The `Sync Changes` button in `SettingsDashboard.tsx` placed at `fixed bottom-12 right-12 z-50` sitting directly over the timeline/settings links of the mobile navigation bar.
- **Solution:** Apply responsive positioning. Shift fixed overlays out of the mobile navigation zone (e.g., `bottom-28 right-6 lg:bottom-12 lg:right-12 z-40`).

### B. Text Cutoffs & Truncations
- **Problem:** Using `truncate` on text within a flexbox or grid container, which cuts off crucial descriptions on narrow viewports instead of letting them wrap.
- **Example:** Standalone or milestone tasks in `OrbitScheduler.tsx` clipping the title text on portrait screens.
- **Solution:** Use `break-words whitespace-normal` or `line-clamp` so long descriptions flow onto multiple lines on small screens.

### C. Z-Index Stack Pollution
- **Problem:** Interactive elements overlapping each other with inconsistent `z-index` assignments, rendering buttons unclickable.
- **Solution:** Keep z-indexes structured:
  - Base Layout / Content: `z-0`
  - Fixed floating controls: `z-40`
  - Navigation elements: `z-50`
  - Modals and Overlays: `z-[100]` to `z-[200]`

---

## 3. Adaptable Constraints: CSS3 equivalents of Android ConstraintLayout

Android's `ConstraintLayout` aligns sibling elements relative to each other (e.g., `layout_topToBottomof`, `layout_toLeftOf`), allowing highly complex flat hierarchies. For a PWA—especially on mobile portrait views where screen real estate is constrained—we can achieve identical adaptive constraint mechanisms using modern CSS3.

### A. Relative Positioning (Aligning to Parents & Siblings)
In ConstraintLayout, you anchor a view to its parent or siblings. In CSS, we map this as follows:
- **Parent Anchoring (Centering):** ConstraintLayout uses `topToTop="parent"`, `bottomToBottom="parent"`. In CSS, use Flexbox (`display: flex; align-items: center; justify-content: center;`) or Grid (`display: grid; place-items: center;`). For absolute elements, use `inset: 0; margin: auto;`.
- **Sibling Anchoring (CSS Anchor Positioning - Level 4):** This is the most direct equivalent to `layout_topToBottomOf`.
  ```css
  /* Define anchor target */
  .anchor-element { anchor-name: --my-anchor; }
  
  /* Constrain item to bottom of anchor */
  .constrained-item {
    position: absolute;
    position-anchor: --my-anchor;
    top: anchor(--my-anchor bottom); /* Equivalent to topToBottomOf */
    left: anchor(--my-anchor left);  /* Equivalent to leftToLeftOf */
  }
  ```

### B. Match Constraints (0dp) & Bias
ConstraintLayout uses `0dp` to match constraints (fill available space). It also uses bias (e.g., `layout_constraintHorizontal_bias="0.3"`) to position elements unevenly.
- **Match Constraint (0dp):** Use Flexbox `flex: 1` (or `flex-grow: 1`) to tell an element to fill all available space between other elements. In CSS Grid, use `1fr`.
- **Bias / Weighted Proportions:** If you want an element positioned 30% from the left and 70% from the right, use CSS Grid tracks.
  ```css
  .bias-container {
    display: grid;
    /* 30% / Content / 70% */
    grid-template-columns: 3fr auto 7fr; 
  }
  .content { grid-column: 2; }
  ```

### C. Chains (Horizontal & Vertical)
ConstraintLayout chains (Spread, Spread Inside, Packed) organize multiple views linearly. This maps perfectly to **CSS Flexbox**.
- **Spread Chain:** `justify-content: space-evenly;` (or `space-around;`)
- **Spread Inside Chain:** `justify-content: space-between;`
- **Packed Chain:** `justify-content: center; gap: 8px;`

### D. Guidelines and Barriers
ConstraintLayout uses Guidelines (invisible lines to align to) and Barriers (dynamic lines based on the widest/tallest of a group of views).
- **Guidelines (Percentages/Fixed):** Use **CSS Grid**. Define a grid layout with explicit percentages or fixed sizes.
  ```css
  .guideline-container {
    display: grid;
    /* Guideline at 25% of the screen width */
    grid-template-columns: 25% 1fr;
  }
  ```
- **Barriers / Max Content:** Use CSS Grid's `max-content` or `min-content`.
  ```css
  .barrier-container {
    display: grid;
    /* Column 1 scales to fit the widest element inside it (the barrier). Column 2 takes the rest. */
    grid-template-columns: max-content 1fr;
  }
  ```

### E. Aspect Ratio and Visibility
- **Aspect Ratio:** ConstraintLayout uses `layout_constraintDimensionRatio`. In CSS3, simply use the `aspect-ratio` property (e.g., `aspect-ratio: 16 / 9;`).
- **Visibility (Gone vs Invisible):** 
  - `View.GONE` (Element disappears, layout collapses): `display: none;`
  - `View.INVISIBLE` (Element is hidden but keeps its space): `visibility: hidden;`

### F. CSS variables + calc()
Use calculations relative to parent elements or sibling widths to enforce mathematical spacing constraints for highly custom layouts:
```css
.constrained-sibling {
  margin-left: calc(var(--sibling-width, 120px) + 16px);
  width: calc(100% - var(--sibling-width, 120px) - 32px);
}
```

---

## 4. Test Verification Script (Playwright E2E)

Create end-to-end regression tests to verify elements are clickable on different viewports and not overlapping:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Responsiveness and Collision Checks', () => {
  // Define mobile viewport config
  test.use({ viewport: { width: 375, height: 667 } });

  test('Sync button should not obstruct navigation links on mobile', async ({ page }) => {
    await page.goto('/settings');

    // 1. Locate mobile navigation bar and sync changes button
    const navBar = page.locator('nav[aria-label="Mobile navigation"]');
    const syncButton = page.locator('text=Sync Changes');

    // 2. Ensure both elements are visible
    await expect(navBar).toBeVisible();
    await expect(syncButton).toBeVisible();

    // 3. Confirm they do not overlap vertically (Sync button sits above navBar)
    const navBox = await navBar.boundingBox();
    const syncBox = await syncButton.boundingBox();

    if (navBox && syncBox) {
      // The Sync button's bottom should be above the nav bar's top
      expect(syncBox.y + syncBox.height).toBeLessThan(navBox.y);
    }

    // 4. Try clicking timeline navigation link in mobile nav
    const timelineLink = page.locator('a[aria-label="Timeline sector"]');
    await timelineLink.click();
    await expect(page).toHaveURL(/\/timeline/);
  });
});
```
