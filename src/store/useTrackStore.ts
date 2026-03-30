import { create } from 'zustand';

export interface Profile {
  name: string;
  level: number;
  xp: number;
  title: string;
}

export interface Task {
  id: string;
  time: string;
  endTime?: string;
  deadline?: string;
  weightage?: number;
  title: string;
  completed: boolean;
  horizon: 'daily' | 'weekly' | 'yearly';
  plannedDate?: string;
  isVoid?: boolean;
}

export interface Milestone {
  id: string;
  title: string;
  tasks: Task[];
  status: 'pending' | 'active' | 'completed';
}

export interface Ambition {
  id: string;
  title: string;
  progress: number;
  xp: number; // Resonance Energy for this specific trajectory
  milestones: Milestone[];
  horizon: 'daily' | 'weekly' | 'yearly';
}

export interface VoidTask {
  id: string;
  text: string;
  impact: 'low' | 'medium' | 'high';
  engagedCount: number;
  maxAllowed: number;
}

export interface Reflection {
  id: string;
  date: string;
  content: string;
  type: 'missed-task' | 'void-engaged' | 'daily-summary';
}

export interface InternshipPeriod {
  organization: 'ISRO' | 'NASA';
  start: string;
  end: string;
}

export interface Skill {
  id: string;
  name: string;
  currentProficiency: number;
  targetProficiency: number;
  recommendation: string;
}

export interface OracleConfig {
  apiKey: string;
  model: string;
  providerUrl: string;
  clientId?: string;
  syncEnabled?: boolean;
}

export interface SyncStatus {
  isSyncing: boolean;
  lastSyncedAt?: string;
  error?: string;
}

export interface Preferences {
  confirmDelete: boolean;
  uiMode: 'simple' | 'professional';
}

export interface Transmission {
  id: string;
  timestamp: string;
  tier: 'daily' | 'weekly' | 'quarterly' | 'yearly' | 'milestone';
  title: string;
  pdaNarrative: string;
  pdaReflections: string[];
  voidAnalysis: { voidId: string; text: string; count: number; impact: string }[];
  skillsReconciliation: { skillId: string; name: string; delta: number; current: number }[];
  rawLogs: { tasksCompleted: number; totalTasks: number; focusHours: number };
  metadata: { targetOrg?: 'NASA' | 'ISRO'; securityClearance: string };
}

interface TrackStore {
  profile: Profile;
  ambitions: Ambition[];
  tasks: Task[];
  voids: VoidTask[];
  reflections: Reflection[];
  internships: InternshipPeriod[];
  skills: Skill[];
  transmissions: Transmission[];
  stats: {
    streak: number;
    tasksCompleted: number;
    totalFocusHours: number;
  };
  oracleConfig: OracleConfig;
  preferences: Preferences;
  syncStatus: SyncStatus;
  
  // Actions
  addAmbition: (title: string) => Promise<void>;
  updateAmbition: (id: string, title: string) => Promise<void>;
  addTask: (time: string, title: string, ambitionId?: string, extra?: Partial<Task>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  addReflection: (content: string, type: Reflection['type']) => Promise<void>;
  addInternship: (internship: InternshipPeriod) => Promise<void>;
  updateSkill: (id: string, current: number, target: number) => Promise<void>;
  
  // Transmission Actions
  generateTransmission: (tier: Transmission['tier'], title: string, narrative: string, targetOrg?: 'NASA' | 'ISRO') => Promise<void>;
  deleteTransmission: (id: string) => Promise<void>;

  // Macro Engine Actions
  addMilestone: (ambitionId: string, title: string) => Promise<void>;
  updateMilestone: (ambitionId: string, milestoneId: string, title: string) => Promise<void>;
  addMilestoneTask: (ambitionId: string, milestoneId: string, title: string) => Promise<void>;
  updateMilestoneTask: (ambitionId: string, milestoneId: string, taskId: string, title: string) => Promise<void>;
  deleteMilestoneTask: (ambitionId: string, milestoneId: string, taskId: string) => Promise<void>;
  toggleMilestoneTask: (ambitionId: string, milestoneId: string, taskId: string) => Promise<void>;

  // Data Portability Actions
  importData: (data: Partial<TrackStore>) => void;
  setSyncStatus: (status: Partial<SyncStatus>) => void;
  checkSync: () => Promise<'none' | 'remote_newer' | 'synced'>;
  performPull: () => Promise<void>;

  // Oracle & Misc Actions
  updateOracleConfig: (config: Partial<OracleConfig>) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  updatePreferences: (updates: Partial<Preferences>) => void;
  addOracleLog: (log: string, response?: string) => void;
  engageVoid: (voidId: string) => void;
  importDemoData: (data: any) => Promise<void>;
  initialize: () => Promise<void>;
}

const XP_PER_LEVEL = 1000;
const RESONANCE_PER_AMBITION_LEVEL = 500; // Each ambition can also "level" its resonance

export const useTrackStore = create<TrackStore>()(
  (set, get) => ({
    profile: { name: 'Valentina', level: 1, xp: 0, title: 'Galactic Voyager' },
    ambitions: [],
    tasks: [],
    voids: [],
    reflections: [],
    internships: [],
    skills: [],
    transmissions: [],
    stats: { streak: 0, tasksCompleted: 0, totalFocusHours: 0 },
    oracleConfig: {
      apiKey: '',
      model: 'gemini-1.5-pro',
      providerUrl: 'https://generativelanguage.googleapis.com/v1beta/openai'
    },
    preferences: {
      confirmDelete: true,
      uiMode: 'simple'
    },
    syncStatus: {
      isSyncing: false,
      lastSyncedAt: undefined
    },

    setSyncStatus: (status) => set((state) => ({
      syncStatus: { ...state.syncStatus, ...status }
    })),

    checkSync: async () => {
      const { syncService } = await import('../services/SyncService');
      return await syncService.checkDivergence();
    },

    performPull: async () => {
      const { syncService } = await import('../services/SyncService');
      const { getDb } = await import('../db/client');
      const db = getDb();
      const meta = (await db.query<{ remote_file_id: string }>('SELECT remote_file_id FROM sync_metadata WHERE id = 1')).rows[0];
      if (meta?.remote_file_id) {
        await syncService.pullUpdate(meta.remote_file_id);
        await get().initialize();
      }
    },

    addAmbition: async (title: string) => {
      const newAmbition: Ambition = { id: Date.now().toString(), title, progress: 0, xp: 0, horizon: 'yearly', milestones: [] };
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`INSERT INTO ambitions (id, title, progress, xp, horizon) VALUES ($1, $2, $3, $4, $5)`, [
        newAmbition.id, newAmbition.title, newAmbition.progress, newAmbition.xp, newAmbition.horizon
      ]);
      set((state) => ({ ambitions: [...state.ambitions, newAmbition] }));
    },

    updateAmbition: async (id, title) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`UPDATE ambitions SET title = $1 WHERE id = $2`, [title, id]);
      set((state) => ({
        ambitions: state.ambitions.map((a) => a.id === id ? { ...a, title } : a)
      }));
    },

    addTask: async (time, title, ambitionId, extra) => {
      const newTask: Task = { 
        id: Date.now().toString(), 
        time, 
        title, 
        completed: false, 
        horizon: 'daily', 
        plannedDate: new Date().toISOString(),
        weightage: 10,
        ...extra 
      };
      
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`INSERT INTO tasks (id, time, end_time, deadline, weightage, title, completed, horizon, planned_date, ambition_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [
        newTask.id, newTask.time, newTask.endTime, newTask.deadline, newTask.weightage, newTask.title, newTask.completed, newTask.horizon, newTask.plannedDate, ambitionId
      ]);

      set((state) => ({ tasks: [...state.tasks, newTask] }));
    },

    deleteTask: async (taskId: string) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`DELETE FROM tasks WHERE id = $1`, [taskId]);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId)
      }));
    },

    updateTask: async (taskId, updates) => {
      const task = get().tasks.find(t => t.id === taskId);
      if (task) {
        const { getDb } = await import('../db/client');
        const db = getDb();
        if (updates.title !== undefined) await db.query(`UPDATE tasks SET title = $1 WHERE id = $2`, [updates.title, taskId]);
        if (updates.completed !== undefined) await db.query(`UPDATE tasks SET completed = $1 WHERE id = $2`, [updates.completed, taskId]);
        if (updates.time !== undefined) await db.query(`UPDATE tasks SET time = $1 WHERE id = $2`, [updates.time, taskId]);
        if (updates.endTime !== undefined) await db.query(`UPDATE tasks SET end_time = $1 WHERE id = $2`, [updates.endTime, taskId]);
        if (updates.deadline !== undefined) await db.query(`UPDATE tasks SET deadline = $1 WHERE id = $2`, [updates.deadline, taskId]);
      }
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t)
      }));
    },

    toggleTask: async (taskId: string) => {
      const state = get();
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        const newCompleted = !task.completed;
        const xpGain = newCompleted ? (task.weightage || 10) : -(task.weightage || 10);
        
        let newXp = state.profile.xp + xpGain;
        let newLevel = state.profile.level;
        
        if (newXp >= XP_PER_LEVEL) {
          newLevel += 1;
          newXp -= XP_PER_LEVEL;
        } else if (newXp < 0 && newLevel > 1) {
          newLevel -= 1;
          newXp += XP_PER_LEVEL;
        } else if (newXp < 0) {
          newXp = 0;
        }

        const { getDb } = await import('../db/client');
        const db = getDb();
        await db.query(`UPDATE tasks SET completed = $1 WHERE id = $2`, [newCompleted, taskId]);
        await db.query(`UPDATE profile SET xp = $1, level = $2 WHERE id = 1`, [newXp, newLevel]);

        set((state) => ({
          tasks: state.tasks.map((t) => t.id === taskId ? { ...t, completed: newCompleted } : t),
          profile: { ...state.profile, xp: newXp, level: newLevel }
        }));
      }
    },

    addReflection: async (content: string, type: Reflection['type']) => {
      const newReflection = { id: Date.now().toString(), date: new Date().toISOString(), content, type };
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`INSERT INTO reflections (id, date, content, type) VALUES ($1, $2, $3, $4)`, [
        newReflection.id, newReflection.date, newReflection.content, newReflection.type
      ]);
      set((state) => ({ reflections: [...state.reflections, newReflection] }));
    },

    addInternship: async (internship) => {
      const id = Date.now().toString();
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`INSERT INTO internships (id, organization, start_date, end_date) VALUES ($1, $2, $3, $4)`, [
        id, internship.organization, internship.start, internship.end
      ]);
      set((state) => ({ internships: [...state.internships, internship] }));
    },

    updateSkill: async (id, current, target) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`UPDATE skills SET current_proficiency = $1, target_proficiency = $2 WHERE id = $3`, [current, target, id]);
      set((state) => ({
        skills: state.skills.map((s) => s.id === id ? { ...s, currentProficiency: current, targetProficiency: target } : s)
      }));
    },

    generateTransmission: async (tier, title, narrative, targetOrg) => {
      const state = get();
      const { getDb } = await import('../db/client');
      const db = getDb();

      const pdaReflections = state.reflections.map(r => r.content);
      const voidAnalysis = state.voids.map(v => ({ voidId: v.id, text: v.text, count: v.engagedCount, impact: v.impact }));
      const skillsReconciliation = state.skills.map(s => ({ skillId: s.id, name: s.name, delta: 0, current: s.currentProficiency }));

      const totalTasks = state.tasks.length + state.ambitions.reduce((acc, a) => acc + a.milestones.reduce((m_acc, m) => m_acc + m.tasks.length, 0), 0);
      const completedTasks = state.tasks.filter(t => t.completed).length + state.ambitions.reduce((acc, a) => acc + a.milestones.reduce((m_acc, m) => m_acc + m.tasks.filter(t => t.completed).length, 0), 0);
      
      const rawLogs = { tasksCompleted: completedTasks, totalTasks: totalTasks, focusHours: state.stats.totalFocusHours };

      const newTransmission: Transmission = {
        id: `TX-${new Date().getFullYear()}-${tier.toUpperCase()}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        tier,
        title,
        pdaNarrative: narrative,
        pdaReflections,
        voidAnalysis,
        skillsReconciliation,
        rawLogs,
        metadata: { targetOrg, securityClearance: 'LEVEL-1-UNCLASSIFIED' }
      };

      await db.query(
        `INSERT INTO transmissions (id, timestamp, tier, title, pda_narrative, pda_reflections, void_analysis, skills_reconciliation, raw_logs, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          newTransmission.id, newTransmission.timestamp, newTransmission.tier, newTransmission.title, newTransmission.pdaNarrative,
          JSON.stringify(newTransmission.pdaReflections), JSON.stringify(newTransmission.voidAnalysis), JSON.stringify(newTransmission.skillsReconciliation),
          JSON.stringify(newTransmission.rawLogs), JSON.stringify(newTransmission.metadata)
        ]
      );

      set(state => ({ transmissions: [newTransmission, ...state.transmissions] }));
    },

    deleteTransmission: async (id) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`DELETE FROM transmissions WHERE id = $1`, [id]);
      set(state => ({ transmissions: state.transmissions.filter(tx => tx.id !== id) }));
    },

    addMilestone: async (ambitionId, title) => {
      const newMilestone: Milestone = { id: Date.now().toString(), title, tasks: [], status: 'pending' };
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`INSERT INTO milestones (id, ambition_id, title, status) VALUES ($1, $2, $3, $4)`, [newMilestone.id, ambitionId, newMilestone.title, newMilestone.status]);
      set((state) => ({
        ambitions: state.ambitions.map((a) => a.id === ambitionId ? { ...a, milestones: [...a.milestones, newMilestone] } : a)
      }));
    },

    updateMilestone: async (ambitionId, milestoneId, title) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`UPDATE milestones SET title = $1 WHERE id = $2`, [title, milestoneId]);
      set((state) => ({
        ambitions: state.ambitions.map((a) => a.id === ambitionId ? { ...a, milestones: a.milestones.map((m) => m.id === milestoneId ? { ...m, title } : m) } : a)
      }));
    },

    addMilestoneTask: async (ambitionId, milestoneId, title) => {
      const newTask: Task = { id: Date.now().toString(), time: '00:00', title, completed: false, horizon: 'daily', weightage: 25 };
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`INSERT INTO tasks (id, milestone_id, time, weightage, title, completed, horizon) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
        newTask.id, milestoneId, newTask.time, newTask.weightage, newTask.title, newTask.completed, newTask.horizon
      ]);
      set((state) => ({
        ambitions: state.ambitions.map((a) => a.id === ambitionId ? {
          ...a,
          milestones: a.milestones.map((m) => m.id === milestoneId ? { ...m, tasks: [...m.tasks, newTask] } : m)
        } : a)
      }));
    },

    updateMilestoneTask: async (ambitionId, milestoneId, taskId, title) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`UPDATE tasks SET title = $1 WHERE id = $2`, [title, taskId]);
      set((state) => ({
        ambitions: state.ambitions.map((a) => a.id === ambitionId ? { ...a, milestones: a.milestones.map((m) => m.id === milestoneId ? { ...m, tasks: m.tasks.map((t) => t.id === taskId ? { ...t, title } : t) } : m) } : a)
      }));
    },

    deleteMilestoneTask: async (ambitionId, milestoneId, taskId) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`DELETE FROM tasks WHERE id = $1`, [taskId]);
      set((state) => ({
        ambitions: state.ambitions.map((a) => a.id === ambitionId ? {
          ...a,
          milestones: a.milestones.map((m) => m.id === milestoneId ? { ...m, tasks: m.tasks.filter((t) => t.id !== taskId) } : m)
        } : a)
      }));
    },

    toggleMilestoneTask: async (ambitionId, milestoneId, taskId) => {
      const state = get();
      let updatedTask: any = null;
      let newStatus: Milestone['status'] = 'pending';
      let newProgress = 0;
      let xpGain = 0;
      let ambitionXp = 0;

      const newAmbitions = state.ambitions.map((a) => {
        if (a.id !== ambitionId) return a;
        const newMilestones = a.milestones.map((m) => {
          if (m.id !== milestoneId) return m;
          const newTasks = m.tasks.map((t) => {
            if (t.id === taskId) {
              const newCompleted = !t.completed;
              updatedTask = { ...t, completed: newCompleted };
              xpGain = newCompleted ? (t.weightage || 25) : -(t.weightage || 25);
              return updatedTask;
            }
            return t;
          });
          const allTasksCompleted = newTasks.length > 0 && newTasks.every(t => t.completed);
          newStatus = allTasksCompleted ? 'completed' : (newTasks.some(t => t.completed) ? 'active' : 'pending');
          return { ...m, tasks: newTasks, status: newStatus };
        });

        const totalTasks = newMilestones.reduce((acc, m) => acc + m.tasks.length, 0);
        const completedTasks = newMilestones.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
        newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : a.progress;
        
        // Update Resonance Energy for this ambition
        ambitionXp = a.xp + xpGain;
        if (ambitionXp < 0) ambitionXp = 0;

        return { ...a, milestones: newMilestones, progress: newProgress, xp: ambitionXp };
      });

      // Global Momentum Level
      let newXp = state.profile.xp + xpGain;
      let newLevel = state.profile.level;
      if (newXp >= XP_PER_LEVEL) { newLevel += 1; newXp -= XP_PER_LEVEL; }
      else if (newXp < 0 && newLevel > 1) { newLevel -= 1; newXp += XP_PER_LEVEL; }
      else if (newXp < 0) { newXp = 0; }

      const { getDb } = await import('../db/client');
      const db = getDb();
      if (updatedTask) await db.query(`UPDATE tasks SET completed = $1 WHERE id = $2`, [updatedTask.completed, taskId]);
      await db.query(`UPDATE milestones SET status = $1 WHERE id = $2`, [newStatus, milestoneId]);
      await db.query(`UPDATE ambitions SET progress = $1, xp = $2 WHERE id = $3`, [newProgress, ambitionXp, ambitionId]);
      await db.query(`UPDATE profile SET xp = $1, level = $2 WHERE id = 1`, [newXp, newLevel]);

      set({ ambitions: newAmbitions, profile: { ...state.profile, xp: newXp, level: newLevel } });
    },

    importData: (data) => set((state) => ({ ...state, ...data })),

    updateOracleConfig: (config) => set((state) => ({ oracleConfig: { ...state.oracleConfig, ...config } })),
    
    updateProfile: (updates) => set((state) => {
      const newProfile = { ...state.profile, ...updates };
      import('../db/client').then(({ getDb }) => {
        const db = getDb();
        db.query(`UPDATE profile SET name = $1, level = $2, xp = $3, title = $4 WHERE id = 1`, [
          newProfile.name, newProfile.level, newProfile.xp, newProfile.title
        ]);
      });
      return { profile: newProfile };
    }),

    updatePreferences: (updates) => set((state) => {
      const newPrefs = { ...state.preferences, ...updates };
      import('../db/client').then(({ getDb }) => {
        const db = getDb();
        db.query(`UPDATE preferences SET confirm_delete = $1, ui_mode = $2 WHERE id = 1`, [
          newPrefs.confirmDelete, newPrefs.uiMode
        ]);
      });
      return { preferences: newPrefs };
    }),

    addOracleLog: (log, response) => set((state) => ({
      reflections: [...state.reflections, { id: Date.now().toString(), date: new Date().toISOString(), content: response ? `${log}\n\nOracle Response: ${response}` : log, type: 'daily-summary' }]
    })),

    engageVoid: (voidId) => set((state) => ({
      voids: state.voids.map((v) => v.id === voidId ? { ...v, engagedCount: v.engagedCount + 1 } : v)
    })),

    importDemoData: async (data: any) => {
      const { getDb } = await import('../db/client');
      const db = getDb();

      // Clear existing data (except metadata/config)
      await db.exec(`
        DELETE FROM ambitions;
        DELETE FROM tasks;
        DELETE FROM milestones;
        DELETE FROM void_tasks;
        DELETE FROM skills;
        DELETE FROM internships;
        DELETE FROM reflections;
        DELETE FROM transmissions;
      `);

      // Import Profile
      if (data.profile) {
        await db.query(`UPDATE profile SET name = $1, level = $2, xp = $3, title = $4 WHERE id = 1`, [
          data.profile.name, data.profile.level, data.profile.xp, data.profile.title
        ]);
      }

      // Import Preferences
      if (data.preferences) {
        await db.query(`UPDATE preferences SET confirm_delete = $1, ui_mode = $2 WHERE id = 1`, [
          data.preferences.confirmDelete, data.preferences.uiMode
        ]);
      }

      // Import Stats
      if (data.stats) {
        await db.query(`UPDATE stats SET streak = $1, tasks_completed = $2, total_focus_hours = $3 WHERE id = 1`, [
          data.stats.streak, data.stats.tasksCompleted, data.stats.totalFocusHours
        ]);
      }

      // Import Ambitions, Milestones, and Milestone Tasks
      if (data.ambitions) {
        for (const a of data.ambitions) {
          await db.query(`INSERT INTO ambitions (id, title, progress, xp, horizon) VALUES ($1, $2, $3, $4, $5)`, [
            a.id, a.title, a.progress, a.xp, a.horizon
          ]);
          if (a.milestones) {
            for (const m of a.milestones) {
              await db.query(`INSERT INTO milestones (id, ambition_id, title, status) VALUES ($1, $2, $3, $4)`, [
                m.id, a.id, m.title, m.status
              ]);
              if (m.tasks) {
                for (const t of m.tasks) {
                  await db.query(`INSERT INTO tasks (id, milestone_id, time, end_time, deadline, weightage, title, completed, horizon, planned_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [
                    t.id, m.id, t.time, t.endTime, t.deadline, t.weightage, t.title, t.completed, t.horizon || 'daily', t.plannedDate
                  ]);
                }
              }
            }
          }
        }
      }

      // Import Standalone Tasks
      if (data.tasks) {
        for (const t of data.tasks) {
          await db.query(`INSERT INTO tasks (id, time, end_time, deadline, weightage, title, completed, horizon, planned_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`, [
            t.id, t.time, t.endTime, t.deadline, t.weightage, t.title, t.completed, t.horizon || 'daily', t.plannedDate
          ]);
        }
      }

      // Import Voids
      if (data.voids) {
        for (const v of data.voids) {
          await db.query(`INSERT INTO void_tasks (id, text, impact, engaged_count, max_allowed) VALUES ($1, $2, $3, $4, $5)`, [
            v.id, v.text, v.impact, v.engagedCount, v.maxAllowed
          ]);
        }
      }

      // Import Skills
      if (data.skills) {
        for (const s of data.skills) {
          await db.query(`INSERT INTO skills (id, name, current_proficiency, target_proficiency, recommendation) VALUES ($1, $2, $3, $4, $5)`, [
            s.id, s.name, s.currentProficiency, s.targetProficiency, s.recommendation
          ]);
        }
      }

      // Import Internships
      if (data.internships) {
        for (const i of data.internships) {
          await db.query(`INSERT INTO internships (id, organization, start_date, end_date) VALUES ($1, $2, $3, $4)`, [
            Date.now().toString() + Math.random(), i.organization, i.start, i.end
          ]);
        }
      }

      await get().initialize();
    },

    initialize: async () => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      
      const profile = (await db.query<Profile>(`SELECT name, level, xp, title FROM profile WHERE id = 1`)).rows[0];
      const preferences = (await db.query<any>(`SELECT confirm_delete as "confirmDelete", ui_mode as "uiMode" FROM preferences WHERE id = 1`)).rows[0];
      const stats = (await db.query<any>(`SELECT streak, tasks_completed as "tasksCompleted", total_focus_hours as "totalFocusHours" FROM stats WHERE id = 1`)).rows[0];
      const oracleConfig = (await db.query<OracleConfig>(`SELECT api_key as "apiKey", model, provider_url as "providerUrl" FROM oracle_config WHERE id = 1`)).rows[0];
      
      const ambitionsRaw = (await db.query<any>(`SELECT * FROM ambitions`)).rows;
      const milestonesRaw = (await db.query<any>(`SELECT * FROM milestones`)).rows;
      const tasksRaw = (await db.query<any>(`SELECT * FROM tasks`)).rows;
      
      const ambitions: Ambition[] = ambitionsRaw.map(a => ({
        ...a,
        xp: a.xp || 0,
        milestones: milestonesRaw.filter(m => m.ambition_id === a.id).map(m => ({
          ...m,
          tasks: tasksRaw.filter(t => t.milestone_id === m.id).map(t => ({
            ...t,
            endTime: t.end_time,
            plannedDate: t.planned_date,
            isVoid: t.is_void === 1
          }))
        }))
      }));

      const standaloneTasks = tasksRaw.filter(t => !t.milestone_id).map(t => ({
        ...t,
        endTime: t.end_time,
        plannedDate: t.planned_date,
        isVoid: t.is_void === 1
      }));

      const voids = (await db.query<VoidTask>(`SELECT id, text, impact, engaged_count as "engagedCount", max_allowed as "maxAllowed" FROM void_tasks`)).rows;
      const reflections = (await db.query<Reflection>(`SELECT id, date, content, type FROM reflections`)).rows;
      const skills = (await db.query<Skill>(`SELECT id, name, current_proficiency as "currentProficiency", target_proficiency as "targetProficiency", recommendation FROM skills`)).rows;
      const internships = (await db.query<any>(`SELECT organization, start_date as "start", end_date as "end" FROM internships`)).rows;
      const transmissionsRaw = (await db.query<any>(`SELECT * FROM transmissions ORDER BY timestamp DESC`)).rows;
      const transmissions: Transmission[] = transmissionsRaw.map(tx => ({
        id: tx.id,
        timestamp: tx.timestamp,
        tier: tx.tier,
        title: tx.title,
        pdaNarrative: tx.pda_narrative,
        pdaReflections: JSON.parse(tx.pda_reflections || '[]'),
        voidAnalysis: JSON.parse(tx.void_analysis || '[]'),
        skillsReconciliation: JSON.parse(tx.skills_reconciliation || '[]'),
        rawLogs: JSON.parse(tx.raw_logs || '{}'),
        metadata: JSON.parse(tx.metadata || '{}')
      }));

      set({
        profile: profile || get().profile,
        preferences: preferences || get().preferences,
        stats: stats || get().stats,
        oracleConfig: oracleConfig || get().oracleConfig,
        ambitions,
        tasks: standaloneTasks,
        voids,
        reflections,
        skills,
        internships,
        transmissions
      });
    }
  }),
);
