import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateCognitiveSync } from './CognitiveSyncEngine';
import { dbProxy } from '../db/client';

// Mock the dbProxy queries
vi.mock('../db/client', () => ({
  dbProxy: {
    query: vi.fn(),
  },
}));

describe('CognitiveSyncEngine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates standard trajectory for an average user', async () => {
    // Mock standard data
    (dbProxy.query as any).mockImplementation(async (sql: string) => {
      if (sql.includes('FROM stats')) return { rows: [{ streak: 3, tasksCompleted: 15 }] };
      if (sql.includes('FROM profile')) return { rows: [{ xp: 200, level: 2 }] };
      if (sql.includes('FROM void_tasks')) return { rows: [{ totalVoids: 1 }] };
      if (sql.includes('FROM tasks')) return { rows: [{ recentTasks: 5 }] };
      return { rows: [] };
    });

    const result = await calculateCognitiveSync();
    
    // Base 50
    // Streak (3 * 2 = 6)
    // Recent Tasks (5 * 1.5 = 7.5 rounded later)
    // Level (2)
    // Void Penalty (1 * 3 = 3)
    // 50 + 6 + 7.5 + 2 - 3 = 62.5 -> 63

    expect(result.syncScore).toBe(63);
    expect(result.auraState).toBe('Standard');
    expect(result.positives.streak).toBe(3);
    expect(result.negatives.voidEngagements).toBe(1);
  });

  it('reaches Flow state for highly aligned users', async () => {
    // Mock high performance data
    (dbProxy.query as any).mockImplementation(async (sql: string) => {
      if (sql.includes('FROM stats')) return { rows: [{ streak: 15, tasksCompleted: 100 }] };
      if (sql.includes('FROM profile')) return { rows: [{ xp: 900, level: 5 }] };
      if (sql.includes('FROM void_tasks')) return { rows: [{ totalVoids: 0 }] };
      if (sql.includes('FROM tasks')) return { rows: [{ recentTasks: 20 }] };
      return { rows: [] };
    });

    const result = await calculateCognitiveSync();
    
    // Base 50
    // Streak capped at 20 (15 * 2 = 30 -> 20)
    // Recent Tasks capped at 20 (20 * 1.5 = 30 -> 20)
    // Level capped at 10 (5)
    // Void Penalty (0)
    // 50 + 20 + 20 + 5 - 0 = 95

    expect(result.syncScore).toBe(95);
    expect(result.auraState).toBe('Flow');
  });

  it('drops to Clouded state for highly distracted users', async () => {
    // Mock distracted data
    (dbProxy.query as any).mockImplementation(async (sql: string) => {
      if (sql.includes('FROM stats')) return { rows: [{ streak: 0, tasksCompleted: 10 }] };
      if (sql.includes('FROM profile')) return { rows: [{ xp: 50, level: 1 }] };
      if (sql.includes('FROM void_tasks')) return { rows: [{ totalVoids: 15 }] };
      if (sql.includes('FROM tasks')) return { rows: [{ recentTasks: 0 }] };
      return { rows: [] };
    });

    const result = await calculateCognitiveSync();
    
    // Base 50
    // Streak 0
    // Recent Tasks 0
    // Level 1
    // Void Penalty capped at 30 (15 * 3 = 45 -> 30)
    // 50 + 0 + 0 + 1 - 30 = 21

    expect(result.syncScore).toBe(21);
    expect(result.auraState).toBe('Clouded');
  });

  it('clamps the sync score securely between 0 and 100', async () => {
    // Force absurdly high penalty to test clamp
    (dbProxy.query as any).mockImplementation(async (sql: string) => {
      if (sql.includes('FROM stats')) return { rows: [{ streak: 0, tasksCompleted: 0 }] };
      if (sql.includes('FROM profile')) return { rows: [{ xp: 0, level: 0 }] };
      if (sql.includes('FROM void_tasks')) return { rows: [{ totalVoids: 1000 }] };
      if (sql.includes('FROM tasks')) return { rows: [{ recentTasks: 0 }] };
      return { rows: [] };
    });

    const result = await calculateCognitiveSync();
    expect(result.syncScore).toBeGreaterThanOrEqual(0);
    expect(result.syncScore).toBeLessThanOrEqual(100);
    expect(result.auraState).toBe('Clouded');
  });
});
