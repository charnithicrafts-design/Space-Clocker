import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';

// Mock PGlite to use memory instead of idb during tests
const memoryDb = new PGlite();

vi.mock('../db/client', () => {
  return {
    getDb: () => ({
      query: (sql: string, params?: any[]) => memoryDb.query(sql, params),
      exec: (sql: string) => memoryDb.exec(sql),
      transaction: (cb: any) => memoryDb.transaction(cb),
      waitReady: Promise.resolve(),
    }),
    db: {
        query: (sql: string, params?: any[]) => memoryDb.query(sql, params),
        exec: (sql: string) => memoryDb.exec(sql),
        transaction: (cb: any) => memoryDb.transaction(cb),
        waitReady: Promise.resolve(),
        getInstance: () => memoryDb
    }
  };
});

// Mock initialize to avoid side effects
vi.mock('../utils/StellarScheduler', () => ({
  reconcileDailyTasks: vi.fn().mockResolvedValue(undefined)
}));

import { useTrackStore } from './useTrackStore';
import { initDb } from '../db/init';

describe('useTrackStore Import Reproduction', () => {
  const sampleJson = {
    "app": "Space-Clocker",
    "version": "1.3.0",
    "timestamp": "2026-04-05T06:56:30.052Z",
    "payload": {
      "profile": {
        "name": "Valentina",
        "level": 1,
        "xp": 50,
        "title": "Galactic Voyager"
      },
      "ambitions": [
        {
          "id": "1775296637077",
          "title": "Being Rich",
          "progress": 0,
          "xp": 0,
          "horizon": "yearly",
          "milestones": [
            {
              "id": "1775296699554",
              "ambition_id": "1775296637077",
              "title": "earn 1000rs",
              "status": "pending",
              "tasks": []
            }
          ]
        }
      ],
      "tasks": [
        {
          "id": "1775102242213",
          "milestone_id": null,
          "ambition_id": null,
          "time": "11:00",
          "end_time": null,
          "deadline": "2026-04-05T11:00",
          "weightage": 10,
          "title": "Develop ISRO-Interact to a reliable RAG application",
          "completed": false,
          "horizon": "weekly",
          "planned_date": "2026-04-02",
          "is_void": false,
          "completed_at": null,
          "endTime": null,
          "plannedDate": "2026-04-02",
          "isVoid": false,
          "completedAt": null,
          "ambitionId": null,
          "milestoneId": null
        }
      ],
      "voids": [
        {
          "id": "v-1775102256293",
          "text": "Late Food",
          "impact": "medium",
          "engagedCount": 0,
          "maxAllowed": 3
        }
      ],
      "reflections": [
        {
          "id": "drift-1775102137934-2026-04-05",
          "date": "2026-04-05",
          "content": "Trajectory Drift: \"Design Personal Architecture Portfolio\" shifted from 2026-04-02 to 2026-04-05 due to orbital decay.",
          "type": "missed-task"
        }
      ],
      "history": [],
      "internships": [],
      "skills": [
        {
          "id": "skill-1775296812486",
          "name": "Indian Giver",
          "currentProficiency": 20,
          "targetProficiency": 75,
          "recommendation": "i must ask what i give",
          "type": "ambition",
          "ambitionId": "1775296637077"
        }
      ],
      "transmissions": [
        {
          "id": "TX-2026-WEEKLY-1775219438619",
          "timestamp": "2026-04-03T12:30:38.619Z",
          "tier": "weekly",
          "title": "Personal Assessment",
          "startDate": "2026-04-02",
          "endDate": "2026-04-04",
          "pdaNarrative": "How i am climbing up the academic and career ladder",
          "pdaReflections": [],
          "voidAnalysis": [
            {
              "voidId": "v-1775102256293",
              "text": "Late Food",
              "count": 0,
              "impact": "medium"
            }
          ],
          "skillsReconciliation": [],
          "mission_metrics": {
            "accomplished": [],
            "missed": [],
            "milestones": []
          },
          "missionMetrics": {
            "accomplished": [],
            "missed": [],
            "milestones": []
          },
          "rawLogs": {
            "tasksCompleted": 0,
            "totalTasks": 0,
            "focusHours": 0
          },
          "metadata": {
            "securityClearance": "LEVEL-1-UNCLASSIFIED"
          }
        }
      ],
      "stats": {
        "streak": 0,
        "tasksCompleted": 0,
        "totalFocusHours": 0
      },
      "oracleConfig": {
        "apiKey": "",
        "model": "gemini-1.5-pro",
        "providerUrl": "https://generativelanguage.googleapis.com/v1beta/openai"
      },
      "preferences": {
        "confirmDelete": true,
        "uiMode": "simple"
      }
    }
  };

  beforeEach(async () => {
    await initDb();
  });

  it('should successfully import the provided trajectory JSON', async () => {
    const store = useTrackStore.getState();
    
    // We expect this NOT to throw
    try {
        await store.importData(sampleJson);
    } catch (e: any) {
        console.error('Import failed with:', e);
        throw e;
    }
    
    const updatedStore = useTrackStore.getState();
    expect(updatedStore.profile.name).toBe('Valentina');
    expect(updatedStore.ambitions.length).toBe(1);
    expect(updatedStore.ambitions[0].title).toBe('Being Rich');
    expect(updatedStore.tasks.length).toBe(1);
    expect(updatedStore.tasks[0].title).toBe('Develop ISRO-Interact to a reliable RAG application');
    expect(updatedStore.transmissions.length).toBe(1);
    expect(updatedStore.transmissions[0].title).toBe('Personal Assessment');
  });

  it('should successfully import when app name is lowercase "space-clocker"', async () => {
    const store = useTrackStore.getState();
    const lowercaseJson = { ...sampleJson, app: 'space-clocker' };
    
    await store.importData(lowercaseJson);
    
    const updatedStore = useTrackStore.getState();
    expect(updatedStore.profile.name).toBe('Valentina');
  });
});
