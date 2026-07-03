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

Android's `ConstraintLayout` aligns sibling elements relative to each other (e.g., `layout_topToBottomof`, `layout_toLeftOf`). In CSS3, we can achieve identical adaptive constraint mechanisms using three strategies:

### Strategy A: CSS Grid (Constraint Mapping)
Define a responsive template grid where grid areas are constrained relative to each other, allowing items to grow, shrink, and align relative to parent grid lines.

```css
.constraint-container {
  display: grid;
  grid-template-columns: minmax(100px, 1fr) auto minmax(100px, 2fr);
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header  header  header"
    "sidebar content status"
    "footer  footer  footer";
  align-items: stretch;
  justify-items: stretch;
  gap: 1rem;
}
```

### Strategy B: CSS Anchor Positioning (CSS Level 4)
*Highly equivalent to ConstraintLayout sibling constraints.* It anchors a floating element to a target element and aligns the edges.

```css
/* Define anchor target */
.anchor-element {
  anchor-name: --my-anchor;
}

/* Constrain item to top-of / right-of anchor */
.constrained-item {
  position: absolute;
  position-anchor: --my-anchor;
  
  /* Align bottom to anchor's top boundary */
  bottom: anchor(--my-anchor top);
  /* Align left to anchor's right boundary */
  left: anchor(--my-anchor right);
}
```

### Strategy C: CSS variables + calc()
Use calculations relative to parent elements or sibling widths to enforce mathematical spacing constraints:

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
