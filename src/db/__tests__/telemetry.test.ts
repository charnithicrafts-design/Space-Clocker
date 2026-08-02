import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { api } from '../db.worker';

describe('db.worker getTelemetry', () => {
  beforeEach(async () => {
    // Force a fresh memory database for each test
    await api.close();
    await api.init('memory://telemetry-test-' + Math.random());
    
    // The init function automatically runs migrations via schema.ts,
    // so the tables `tasks`, `stellar_history`, and `profile` will exist.
  });

  afterEach(async () => {
    await api.close();
  });

  it('should correctly aggregate heatmap data for completed tasks', async () => {
    // Insert some mock tasks, some completed recently, some old
    await api.query(`
      INSERT INTO tasks (id, title, planned_date, completed, weightage) VALUES
      ('1', 'T1', CURRENT_DATE::text, true, 10),
      ('2', 'T2', CURRENT_DATE::text, true, 10),
      ('3', 'T3', (CURRENT_DATE - INTERVAL '1 day')::date::text, true, 10),
      ('4', 'T4', (CURRENT_DATE - INTERVAL '10 days')::date::text, true, 10),
      ('5', 'T5', (CURRENT_DATE - INTERVAL '40 days')::date::text, true, 10),
      ('6', 'T6', CURRENT_DATE::text, false, 10)
    `);

    // Get telemetry for the last 30 days
    const telemetry = await api.getTelemetry(30);

    // Heatmap returns a continuous 30-day series for Recharts.
    expect(telemetry.heatmap.length).toBe(30);

    // Filter non-zero days (today, yesterday, 10 days ago)
    const nonZeroHeatmap = telemetry.heatmap.filter((h: any) => Number(h.count) > 0);
    expect(nonZeroHeatmap.length).toBe(3);

    const todayDate = new Date().toISOString().split('T')[0];
    const todayData = telemetry.heatmap.find((h: any) => h.date === todayDate);
    
    expect(todayData).toBeDefined();
    expect(Number((todayData as any)?.count)).toBe(2);
  });

  it('should correctly aggregate Gravity Well (Void) data', async () => {
    // Insert some mock void breaches into stellar_history
    await api.query(`
      INSERT INTO stellar_history (id, title, date, type, category) VALUES
      ('v1', 'Void 1', CURRENT_DATE::text, 'failure', 'distraction'),
      ('v2', 'Void 2', (CURRENT_DATE - INTERVAL '2 days')::date::text, 'failure', 'distraction'),
      ('v3', 'Success', CURRENT_DATE::text, 'achievement', 'milestone'),
      ('v4', 'Void 3', (CURRENT_DATE - INTERVAL '50 days')::date::text, 'failure', 'distraction')
    `);

    const telemetry = await api.getTelemetry(30);

    // Should return 30-day series, with 2 non-zero failure days within 30 days
    expect(telemetry.voidBreaches.length).toBe(30);
    const nonZeroVoids = telemetry.voidBreaches.filter((v: any) => Number(v.count) > 0);
    expect(nonZeroVoids.length).toBe(2);

    const todayDate = new Date().toISOString().split('T')[0];
    const todayData = telemetry.voidBreaches.find((v: any) => v.date === todayDate);
    
    expect(todayData).toBeDefined();
    expect(Number((todayData as any)?.count)).toBe(1);
  });

  it('should return current XP and Level from profile', async () => {
    await api.query(`UPDATE profile SET xp = 250, level = 5 WHERE id = 1`);

    const telemetry = await api.getTelemetry(7);

    expect(telemetry.currentXp).toBe(250);
    expect(telemetry.currentLevel).toBe(5);
  });
});
