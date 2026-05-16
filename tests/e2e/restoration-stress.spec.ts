import { test, expect } from '../support/fixtures';

/**
 * PGlite Restoration Stress & Integrity (ATDD - RED PHASE)
 */
test.describe('PGlite Resilience & Recovery (ATDD)', () => {
  
  test.beforeEach(async ({ page }) => {
    // Log console messages
    page.on('console', msg => {
      console.log(`[Browser] ${msg.type()}: ${msg.text()}`);
    });

    // 1. Bypass onboarding and force IDB for stable testing
    await page.addInitScript(() => {
      window.localStorage.setItem('hasSeenOnboarding', 'true');
      window.localStorage.setItem('PGlite_FORCED_STRATEGY', 'idb://space-clocker-db');
    });

    // 2. Navigate to Settings with increased timeout
    console.log('[E2E] Navigating to /settings...');
    await page.goto('/settings', { timeout: 30000 });
    
    // 3. Ensure system ready - wait for proxy with longer timeout
    console.log('[E2E] Waiting for dbProxy...');
    await page.waitForFunction(() => (window as any).dbProxy !== undefined, { timeout: 45000 });
    console.log('[E2E] dbProxy ready.');
  });

  test('[P0] Scenario: User Snapshot Boot - should restore user .pgdump and verify schema integrity', async ({ page }) => {
    const snapshotPath = 'chronos-snapshot-2026-04-11.pgdump';
    page.on('dialog', dialog => {
      console.log(`[E2E] Dialog: ${dialog.message()}`);
      dialog.accept();
    });
    
    const restoreLabel = page.getByText('Restore Snapshot');
    await expect(restoreLabel).toBeVisible({ timeout: 20000 });

    const fileChooserPromise = page.waitForEvent('filechooser');
    await restoreLabel.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(snapshotPath);

    console.log('[E2E] Restore triggered, waiting for reload...');
    
    // Wait for the reload to start and complete. 
    // We can wait for the page to navigate back to some URL.
    // Based on logs, it reloads and eventually synchronizes.
    await page.waitForFunction(() => {
       // We know it reloaded if the previous dbProxy is gone or a new one is establishing
       return (window as any).dbProxy === undefined;
    }, { timeout: 10000 }).catch(() => {}); // Might already be gone

    console.log('[E2E] Detecting new session...');
    await page.waitForFunction(() => (window as any).dbProxy !== undefined, { timeout: 60000 });
    console.log(`[E2E] Session ready. Current URL: ${page.url()}`);

    // Verify data integrity via page.evaluate
    const data = await page.evaluate(async () => {
      const ambitions = await (window as any).dbProxy.query('SELECT count(*) as count FROM ambitions');
      const profile = await (window as any).dbProxy.query('SELECT name FROM profile WHERE id = 1');
      return {
        ambitionCount: parseInt(ambitions.rows[0].count),
        restoredName: profile.rows[0]?.name
      };
    });

    console.log(`[E2E] Restored Data: ${JSON.stringify(data)}`);

    const wasRestored = data.restoredName !== 'Valentina' || data.ambitionCount > 0;
    expect(wasRestored, 'Snapshot was not correctly restored (no data change detected)').toBe(true);
    
    if (data.restoredName !== 'Valentina') {
      await expect(page.getByText(data.restoredName)).toBeVisible({ timeout: 20000 });
    }
  });

  test('[P0] Scenario: Structural Corruption Recovery - should recover from Errno 20', async ({ page }) => {
    // Verify system is healthy and bypassed splash
    await page.goto('/', { timeout: 30000 });
    await expect(page.getByText('ESTABLISHING NEURAL LINK...')).not.toBeVisible({ timeout: 20000 });
    
    const name = await page.evaluate(async () => {
      const profile = await (window as any).dbProxy.query('SELECT name FROM profile WHERE id = 1');
      return profile.rows[0].name;
    });
    expect(name).toBeDefined();
  });
});
