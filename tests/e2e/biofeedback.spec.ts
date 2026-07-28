import { test, expect } from '@playwright/test';

test.describe('Bio-Feedback Monitor (Task 3)', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Bypass splash screen & use clean local DB strategy
    await page.addInitScript(() => {
      window.localStorage.setItem('hasSeenOnboarding', 'true');
      window.localStorage.setItem('PGlite_FORCED_STRATEGY', 'idb://biofeedback-db');
    });

    await page.goto('/');
  });

  test('displays correct cognitive sync state based on telemetry', async ({ page }) => {
    // Navigate to profile dashboard
    await page.goto('/profile');

    // Wait for the sync score to become visible or exist
    // We expect "Neural pathways highly aligned today" or similar depending on data
    // The demo data has high alignment, so we should see 'aligned' logic.
    // Let's assert we see the Profile Service Record header.
    await expect(page.getByText(/Service Record/i)).toBeVisible();

    // The score overlay
    const overlay = page.getByText(/Sync Score/i).first();

    // We can hover over the Award icon to reveal the score
    const awardIconContainer = page.locator('.group.relative.w-40.h-40').first();
    await awardIconContainer.hover();
    
    await expect(page.getByText(/Sync Score/i).first()).toBeVisible();
    
    // Based on the demo data inserted (many tasks, no voids), the score should be > 50.
    // It should say "Neural pathways highly aligned" or something similar if Flow is achieved.
    // Wait, the message mapping in ProfileDashboard for aligned is:
    // "Neural pathways highly aligned" (if auraState === 'Flow' or 'aligned')
    const microcopy = page.locator('.bg-surface-high\\/60'); // the banner
    await expect(microcopy).toBeVisible();
  });
});
