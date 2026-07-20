import { dbProxy } from '../db/client';

export type AuraState = 'Flow' | 'Standard' | 'Clouded';

export interface CognitiveSyncResult {
  syncScore: number;
  auraState: AuraState;
  positives: {
    tasksCompleted: number;
    streak: number;
    xp: number;
  };
  negatives: {
    voidEngagements: number;
  };
}

/**
 * The Psychological Momentum Engine
 * Analyzes local telemetry to determine the user's current cognitive state.
 */
export async function calculateCognitiveSync(): Promise<CognitiveSyncResult> {
  let syncScore = 50; // Base score
  
  // 1. Fetch Stats & Profile (Positives)
  const statsRes = await dbProxy.query(`SELECT streak, tasks_completed as "tasksCompleted" FROM stats WHERE id = 1`);
  const profileRes = await dbProxy.query(`SELECT xp, level FROM profile WHERE id = 1`);
  
  const streak = statsRes.rows[0]?.streak || 0;
  const totalTasks = statsRes.rows[0]?.tasksCompleted || 0;
  const xp = profileRes.rows[0]?.xp || 0;
  const level = profileRes.rows[0]?.level || 1;

  // 2. Fetch Void Engagements (Negatives)
  const voidRes = await dbProxy.query(`SELECT SUM(engaged_count) as "totalVoids" FROM void_tasks`);
  const voidEngagements = parseInt(voidRes.rows[0]?.totalVoids || '0', 10);

  // 3. Fetch Recent Completed Tasks (Momentum)
  // SQLite functions in PGlite are slightly different: wait, PGlite is PostgreSQL!
  // So we use PostgreSQL syntax:
  const pgRecentTasksRes = await dbProxy.query(`
    SELECT count(id) as "recentTasks" 
    FROM tasks 
    WHERE completed = true 
    AND (
      (completed_at IS NOT NULL AND CAST(completed_at AS TIMESTAMP) >= NOW() - INTERVAL '7 days')
      OR 
      (planned_date IS NOT NULL AND CAST(planned_date AS DATE) >= CURRENT_DATE - INTERVAL '7 days')
    )
  `).catch((e) => {
    console.warn('[CognitiveSyncEngine] Failed to fetch recent tasks:', e);
    return { rows: [{ recentTasks: 0 }] };
  });

  const recentTasks = parseInt(pgRecentTasksRes.rows[0]?.recentTasks || '0', 10);

  // --- ALGORITHM ---
  
  // Positive Modifiers
  // Cap streak bonus at 20 points
  const streakBonus = Math.min(streak * 2, 20); 
  // Recent tasks give a nice boost (up to 20 points)
  const recentTaskBonus = Math.min(recentTasks * 1.5, 20);
  // Level baseline gives a slow creep (up to 10 points)
  const levelBonus = Math.min(level, 10);

  // Negative Modifiers
  // Each void engagement drops the score by 3 points (max 30 point drop)
  const voidPenalty = Math.min(voidEngagements * 3, 30);

  // Calculate final score
  syncScore = syncScore + streakBonus + recentTaskBonus + levelBonus - voidPenalty;
  
  // Clamp between 0 and 100
  syncScore = Math.max(0, Math.min(100, Math.round(syncScore)));

  // Determine Aura State
  let auraState: AuraState = 'Standard';
  if (syncScore >= 80) auraState = 'Flow';
  else if (syncScore <= 40) auraState = 'Clouded';

  return {
    syncScore,
    auraState,
    positives: {
      tasksCompleted: totalTasks,
      streak,
      xp
    },
    negatives: {
      voidEngagements
    }
  };
}
