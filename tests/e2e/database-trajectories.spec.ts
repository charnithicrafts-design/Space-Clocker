import { test, expect } from '../support/fixtures';

test.describe('Database Trajectory Stabilization', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to the app to initialize the database worker
    await page.goto('/');
    // 2. Wait for the dbProxy to be available on window
    await page.waitForFunction(() => (window as any).dbProxy !== undefined);
  });

  test('should initialize PGlite and persist profile telemetry in memory', async ({ page, db }) => {
    // Act: Check the profile
    const result = await db.query('SELECT name, level FROM profile WHERE id = 1');
    const profile = result.rows[0];

    // Assert: Check default profile values
    expect(profile).toBeDefined();
    expect(profile.name).toBe('Valentina');
    expect(profile.level).toBe(1);

    // Act: Update profile
    await db.exec("UPDATE profile SET name = 'Commander Shepard', level = 50 WHERE id = 1");

    // Assert: Verify update
    const updatedResult = await db.query('SELECT name, level FROM profile WHERE id = 1');
    expect(updatedResult.rows[0].name).toBe('Commander Shepard');
    expect(updatedResult.rows[0].level).toBe(50);
  });

  test('should handle rapid restoration cycles without collision', async ({ page, db }) => {
    // This test targets the "Database already exists" error during restoration
    // We simulate a restoration by calling init() again with a dump if possible,
    // or simply multiple close/init cycles.

    await page.evaluate(async () => {
      const dump = await (window as any).dbProxy.dumpDataDir();
      // Try to re-init multiple times to stress test the memory VFS
      try {
        await (window as any).dbProxy.close();
        await (window as any).dbProxy.init(dump);
        await (window as any).dbProxy.close();
        await (window as any).dbProxy.init(dump);
      } catch (e) {
        console.error('Restoration collision detected:', e);
        throw e;
      }
    });

    const result = await db.query('SELECT count(*) as count FROM profile');
    expect(result.rows[0].count).toBe(1);
  });
});
