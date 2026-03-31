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
  completedAt?: string;
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

export interface HistoricalEvent {
  id: string;
  title: string;
  date: string;
  type: 'success' | 'missed' | 'failed';
  category: 'internship' | 'hackathon' | 'certification' | 'academic' | 'project';
  description: string;
  skills: string[]; // Names of skills influenced
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
  type: 'personal' | 'ambition';
  ambitionId?: string;
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
  startDate?: string;
  endDate?: string;
  pdaNarrative: string;
  pdaReflections: string[];
  voidAnalysis: { voidId: string; text: string; count: number; impact: string }[];
  skillsReconciliation: { skillId: string; name: string; delta: number; current: number }[];
  missionMetrics: {
    accomplished: { id: string; title: string; weightage: number; horizon: 'daily' | 'weekly' | 'yearly' }[];
    missed: { id: string; title: string; weightage: number; horizon: 'daily' | 'weekly' | 'yearly' }[];
    milestones: { id: string; title: string; ambitionTitle: string }[];
  };
  rawLogs: { tasksCompleted: number; totalTasks: number; focusHours: number };
  metadata: { targetOrg?: 'NASA' | 'ISRO'; securityClearance: string; alignment2027?: string };
}

interface TrackStore {
  profile: Profile;
  ambitions: Ambition[];
  tasks: Task[];
  voids: VoidTask[];
  reflections: Reflection[];
  history: HistoricalEvent[];
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
  updateTaskDate: (taskId: string, date: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  addReflection: (content: string, type: Reflection['type']) => Promise<void>;
  addHistoricalEvent: (event: Omit<HistoricalEvent, 'id'>) => Promise<void>;
  addInternship: (internship: InternshipPeriod) => Promise<void>;
  addSkill: (name: string, current: number, target: number, recommendation: string, type: Skill['type'], ambitionId?: string) => Promise<void>;
  updateSkill: (id: string, updates: Partial<Skill>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  
  // Transmission Actions
  generateTransmission: (tier: Transmission['tier'], title: string, narrative: string, targetOrg?: 'NASA' | 'ISRO', dateRange?: { start: string; end: string }) => Promise<void>;
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
  addVoidTask: (text: string, impact: VoidTask['impact'], maxAllowed: number) => Promise<void>;
  updateVoidTask: (id: string, updates: Partial<VoidTask>) => Promise<void>;
  deleteVoidTask: (id: string) => Promise<void>;
  engageVoid: (voidId: string) => Promise<void>;
  importDemoData: (data: any) => Promise<void>;
  initialize: () => Promise<void>;
}

const XP_PER_LEVEL = 1000;
const RESONANCE_PER_AMBITION_LEVEL = 2500; // Each ambition can also "level" its resonance

export const useTrackStore = create<TrackStore>()(
  (set, get) => ({
    profile: { name: 'Valentina', level: 1, xp: 0, title: 'Galactic Voyager' },
    ambitions: [],
    tasks: [],
    voids: [],
    reflections: [],
    history: [],
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
        plannedDate: extra?.plannedDate || new Date().toISOString().split('T')[0],
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
      const { getDb } = await import('../db/client');
      const db = getDb();
      
      if (updates.title !== undefined) await db.query(`UPDATE tasks SET title = $1 WHERE id = $2`, [updates.title, taskId]);
      if (updates.completed !== undefined) await db.query(`UPDATE tasks SET completed = $1 WHERE id = $2`, [updates.completed, taskId]);
      if (updates.time !== undefined) await db.query(`UPDATE tasks SET time = $1 WHERE id = $2`, [updates.time, taskId]);
      if (updates.endTime !== undefined) await db.query(`UPDATE tasks SET end_time = $1 WHERE id = $2`, [updates.endTime, taskId]);
      if (updates.deadline !== undefined) await db.query(`UPDATE tasks SET deadline = $1 WHERE id = $2`, [updates.deadline, taskId]);
      if (updates.weightage !== undefined) await db.query(`UPDATE tasks SET weightage = $1 WHERE id = $2`, [updates.weightage, taskId]);
      if (updates.plannedDate !== undefined) await db.query(`UPDATE tasks SET planned_date = $1 WHERE id = $2`, [updates.plannedDate, taskId]);
      
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t)
      }));
    },

    updateTaskDate: async (taskId, date) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`UPDATE tasks SET planned_date = $1 WHERE id = $2`, [date, taskId]);
      set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? { ...t, plannedDate: date } : t)
      }));
    },

    toggleTask: async (taskId: string) => {
      const state = get();
      const task = state.tasks.find(t => t.id === taskId);
      if (task) {
        const newCompleted = !task.completed;
        const completedAt = newCompleted ? new Date().toISOString() : null;
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
        await db.query(`UPDATE tasks SET completed = $1, completed_at = $2 WHERE id = $3`, [newCompleted, completedAt, taskId]);
        await db.query(`UPDATE profile SET xp = $1, level = $2 WHERE id = 1`, [newXp, newLevel]);

        set((state) => ({
          tasks: state.tasks.map((t) => t.id === taskId ? { ...t, completed: newCompleted, completedAt: completedAt || undefined } : t),
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

    addHistoricalEvent: async (event) => {
      const id = `hist-${Date.now()}`;
      const newEvent = { ...event, id };
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`INSERT INTO stellar_history (id, title, date, type, category, description, skills) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
        id, newEvent.title, newEvent.date, newEvent.type, newEvent.category, newEvent.description, JSON.stringify(newEvent.skills)
      ]);
      set((state) => ({ history: [...state.history, newEvent] }));
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

    addSkill: async (name, current, target, recommendation, type, ambitionId) => {
      const id = `skill-${Date.now()}`;
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`INSERT INTO skills (id, name, current_proficiency, target_proficiency, recommendation, type, ambition_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
        id, name, current, target, recommendation, type, ambitionId
      ]);
      const newSkill: Skill = { id, name, currentProficiency: current, targetProficiency: target, recommendation, type, ambitionId };
      set((state) => ({ skills: [...state.skills, newSkill] }));
    },

    updateSkill: async (id, updates) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      
      if (updates.name !== undefined) await db.query(`UPDATE skills SET name = $1 WHERE id = $2`, [updates.name, id]);
      if (updates.currentProficiency !== undefined) await db.query(`UPDATE skills SET current_proficiency = $1 WHERE id = $2`, [updates.currentProficiency, id]);
      if (updates.targetProficiency !== undefined) await db.query(`UPDATE skills SET target_proficiency = $1 WHERE id = $2`, [updates.targetProficiency, id]);
      if (updates.recommendation !== undefined) await db.query(`UPDATE skills SET recommendation = $1 WHERE id = $2`, [updates.recommendation, id]);
      
      set((state) => ({
        skills: state.skills.map((s) => s.id === id ? { ...s, ...updates } : s)
      }));
    },

    deleteSkill: async (id) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`DELETE FROM skills WHERE id = $1`, [id]);
      set((state) => ({
        skills: state.skills.filter((s) => s.id !== id)
      }));
    },

    generateTransmission: async (tier, title, narrative, targetOrg, dateRange) => {
      const state = get();
      const { getDb } = await import('../db/client');
      const db = getDb();

      // Filter tasks based on date range if provided
      const filterByDate = (date?: string) => {
        if (!dateRange || !date) return true;
        
        // Normalize to YYYY-MM-DD for comparison
        const targetStr = date.split('T')[0];
        const startStr = dateRange.start.split('T')[0];
        const endStr = dateRange.end.split('T')[0];
        
        return targetStr >= startStr && targetStr <= endStr;
      };

      const pdaReflections = state.reflections
        .filter(r => filterByDate(r.date))
        .map(r => r.content);

      const voidAnalysis = state.voids.map(v => ({ 
        voidId: v.id, 
        text: v.text, 
        count: v.engagedCount, // In a real app, we'd filter engagements by date
        impact: v.impact 
      }));

      const skillsReconciliation = state.skills.map(s => ({ 
        skillId: s.id, 
        name: s.name, 
        delta: 0, 
        current: s.currentProficiency 
      }));

      const allTasks = [
        ...state.tasks,
        ...state.ambitions.flatMap(a => a.milestones.flatMap(m => m.tasks))
      ].filter(t => filterByDate(t.plannedDate));

      const accomplished = allTasks
        .filter(t => t.completed)
        .map(t => ({ 
          id: t.id, 
          title: t.title, 
          weightage: t.weightage || 10,
          horizon: t.horizon || 'daily'
        }));

      const missed = allTasks
        .filter(t => !t.completed)
        .map(t => ({ 
          id: t.id, 
          title: t.title, 
          weightage: t.weightage || 10,
          horizon: t.horizon || 'daily'
        }));

      // Find milestones completed in this range (all their tasks completed and at least one task in this range)
      const milestones = state.ambitions.flatMap(a => 
        a.milestones
          .filter(m => m.tasks.length > 0 && m.tasks.every(t => t.completed) && m.tasks.some(t => filterByDate(t.plannedDate)))
          .map(m => ({ id: m.id, title: m.title, ambitionTitle: a.title }))
      );

      const accomplishedWeight = accomplished.reduce((acc, t) => acc + t.weightage, 0);
      const missedWeight = missed.reduce((acc, t) => acc + t.weightage, 0);
      const totalWeight = accomplishedWeight + missedWeight;
      const reliabilityIndex = totalWeight > 0 ? Math.round((accomplishedWeight / totalWeight) * 100) : 100;

      const rawLogs = { 
        tasksCompleted: accomplished.length, 
        totalTasks: allTasks.length, 
        focusHours: state.stats.totalFocusHours 
      };

      // 2027 Alignment Check
      const has2027Goal = allTasks.some(t => t.deadline?.includes('2027') || t.plannedDate?.includes('2027')) || 
                         state.ambitions.some(a => a.title.includes('2027'));
      const alignment2027 = has2027Goal ? 'STATIONED_FOR_NASA_2027' : 'GENERAL_ORBIT';

      const newTransmission: Transmission = {
        id: `TX-${new Date().getFullYear()}-${tier.toUpperCase()}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        tier,
        title,
        startDate: dateRange?.start,
        endDate: dateRange?.end,
        pdaNarrative: narrative,
        pdaReflections,
        voidAnalysis,
        skillsReconciliation,
        missionMetrics: { accomplished, missed, milestones },
        rawLogs,
        metadata: { targetOrg, securityClearance: 'LEVEL-1-UNCLASSIFIED', alignment2027 }
      };

      await db.query(
        `INSERT INTO transmissions (id, timestamp, tier, title, start_date, end_date, pda_narrative, pda_reflections, void_analysis, skills_reconciliation, mission_metrics, raw_logs, metadata) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          newTransmission.id, newTransmission.timestamp, newTransmission.tier, newTransmission.title, 
          newTransmission.startDate, newTransmission.endDate, newTransmission.pdaNarrative,
          JSON.stringify(newTransmission.pdaReflections), JSON.stringify(newTransmission.voidAnalysis), 
          JSON.stringify(newTransmission.skillsReconciliation), JSON.stringify(newTransmission.missionMetrics),
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
              const completedAt = newCompleted ? new Date().toISOString() : null;
              updatedTask = { ...t, completed: newCompleted, completedAt: completedAt || undefined };
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
      if (updatedTask) {
        await db.query(`UPDATE tasks SET completed = $1, completed_at = $2 WHERE id = $3`, [updatedTask.completed, updatedTask.completedAt || null, taskId]);
      }
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

    addVoidTask: async (text, impact, maxAllowed) => {
      const newVoid: VoidTask = { id: `v-${Date.now()}`, text, impact, engagedCount: 0, maxAllowed };
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`INSERT INTO void_tasks (id, text, impact, engaged_count, max_allowed) VALUES ($1, $2, $3, $4, $5)`, [
        newVoid.id, newVoid.text, newVoid.impact, newVoid.engagedCount, newVoid.maxAllowed
      ]);
      set((state) => ({ voids: [...state.voids, newVoid] }));
    },

    updateVoidTask: async (id, updates) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      if (updates.text !== undefined) await db.query(`UPDATE void_tasks SET text = $1 WHERE id = $2`, [updates.text, id]);
      if (updates.impact !== undefined) await db.query(`UPDATE void_tasks SET impact = $1 WHERE id = $2`, [updates.impact, id]);
      if (updates.maxAllowed !== undefined) await db.query(`UPDATE void_tasks SET max_allowed = $1 WHERE id = $2`, [updates.maxAllowed, id]);
      
      set((state) => ({
        voids: state.voids.map((v) => v.id === id ? { ...v, ...updates } : v)
      }));
    },

    deleteVoidTask: async (id) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`DELETE FROM void_tasks WHERE id = $1`, [id]);
      set((state) => ({
        voids: state.voids.filter((v) => v.id !== id)
      }));
    },

    engageVoid: async (voidId) => {
      const state = get();
      const v = state.voids.find((v) => v.id === voidId);
      if (v) {
        const newCount = v.engagedCount + 1;
        const { getDb } = await import('../db/client');
        const db = getDb();
        await db.query(`UPDATE void_tasks SET engaged_count = $1 WHERE id = $2`, [newCount, voidId]);
        set((state) => ({
          voids: state.voids.map((v) => v.id === voidId ? { ...v, engagedCount: newCount } : v)
        }));
      }
    },

    importDemoData: async (data: any) => {
      const { getDb } = await import('../db/client');
      const db = getDb();

      try {
        await db.transaction(async (tx) => {
          // Clear existing data (except metadata/config)
          // The order of DELETE is important for FK constraints if not using CASCADE properly
          await tx.query('DELETE FROM tasks');
          await tx.query('DELETE FROM milestones');
          await tx.query('DELETE FROM ambitions');
          await tx.query('DELETE FROM void_tasks');
          await tx.query('DELETE FROM skills');
          await tx.query('DELETE FROM internships');
          await tx.query('DELETE FROM reflections');
          await tx.query('DELETE FROM transmissions');
          await tx.query('DELETE FROM stellar_history');

          // Import Profile
          if (data.profile) {
            await tx.query(`UPDATE profile SET name = $1, level = $2, xp = $3, title = $4 WHERE id = 1`, [
              data.profile.name, data.profile.level, data.profile.xp, data.profile.title
            ]);
          }

          // Import Preferences
          if (data.preferences) {
            await tx.query(`UPDATE preferences SET confirm_delete = $1, ui_mode = $2 WHERE id = 1`, [
              data.preferences.confirmDelete, data.preferences.uiMode
            ]);
          }

          // Import Stats
          if (data.stats) {
            await tx.query(`UPDATE stats SET streak = $1, tasks_completed = $2, total_focus_hours = $3 WHERE id = 1`, [
              data.stats.streak, data.stats.tasksCompleted, data.stats.totalFocusHours
            ]);
          }

          // Import Ambitions, Milestones, and Milestone Tasks
          if (data.ambitions) {
            for (const a of data.ambitions) {
              await tx.query(`INSERT INTO ambitions (id, title, progress, xp, horizon) VALUES ($1, $2, $3, $4, $5)`, [
                a.id, a.title, a.progress, a.xp, a.horizon
              ]);
              if (a.milestones) {
                for (const m of a.milestones) {
                  await tx.query(`INSERT INTO milestones (id, ambition_id, title, status) VALUES ($1, $2, $3, $4)`, [
                    m.id, a.id, m.title, m.status
                  ]);
                  if (m.tasks) {
                    for (const t of m.tasks) {
                      await tx.query(`INSERT INTO tasks (id, milestone_id, ambition_id, time, end_time, deadline, weightage, title, completed, horizon, planned_date, completed_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, [
                        t.id, m.id, a.id, t.time, t.endTime, t.deadline, t.weightage, t.title, t.completed, t.horizon || 'daily', t.plannedDate, t.completedAt
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
              await tx.query(`INSERT INTO tasks (id, time, end_time, deadline, weightage, title, completed, horizon, planned_date, completed_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [
                t.id, t.time, t.endTime, t.deadline, t.weightage, t.title, t.completed, t.horizon || 'daily', t.plannedDate, t.completedAt
              ]);
            }
          }

          // Import Voids
          if (data.voids) {
            for (const v of data.voids) {
              await tx.query(`INSERT INTO void_tasks (id, text, impact, engaged_count, max_allowed) VALUES ($1, $2, $3, $4, $5)`, [
                v.id, v.text, v.impact, v.engagedCount, v.maxAllowed
              ]);
            }
          }

          // Import Skills
          if (data.skills) {
            for (const s of data.skills) {
              await tx.query(`INSERT INTO skills (id, name, current_proficiency, target_proficiency, recommendation) VALUES ($1, $2, $3, $4, $5)`, [
                s.id, s.name, s.current_proficiency || s.currentProficiency, s.target_proficiency || s.targetProficiency, s.recommendation
              ]);
            }
          }

          // Import Internships
          if (data.internships) {
            for (const i of data.internships) {
              await tx.query(`INSERT INTO internships (id, organization, start_date, end_date) VALUES ($1, $2, $3, $4)`, [
                `intern-${Date.now()}-${Math.random()}`, i.organization, i.start, i.end
              ]);
            }
          }

          // Import History
          if (data.history) {
            for (const h of data.history) {
              await tx.query(`INSERT INTO stellar_history (id, title, date, type, category, description, skills) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
                h.id, h.title, h.date, h.type, h.category, h.description, JSON.stringify(h.skills)
              ]);
            }
          }
        });
      } catch (err) {
        console.error('Demo data import failed:', err);
        throw err;
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
            isVoid: t.is_void === 1,
            completedAt: t.completed_at
          }))
        }))
      }));

      const standaloneTasks = tasksRaw.filter(t => !t.milestone_id).map(t => ({
        ...t,
        endTime: t.end_time,
        plannedDate: t.planned_date,
        isVoid: t.is_void === 1,
        completedAt: t.completed_at
      }));

      const voids = (await db.query<VoidTask>(`SELECT id, text, impact, engaged_count as "engagedCount", max_allowed as "maxAllowed" FROM void_tasks`)).rows;
      const reflections = (await db.query<Reflection>(`SELECT id, date, content, type FROM reflections`)).rows;
      const historyRaw = (await db.query<any>(`SELECT * FROM stellar_history`)).rows;
      const history: HistoricalEvent[] = historyRaw.map(h => ({
        ...h,
        skills: JSON.parse(h.skills || '[]')
      }));
      const skills = (await db.query<any>(`SELECT id, name, current_proficiency as "currentProficiency", target_proficiency as "targetProficiency", recommendation, type, ambition_id as "ambitionId" FROM skills`)).rows;
      const internships = (await db.query<any>(`SELECT organization, start_date as "start", end_date as "end" FROM internships`)).rows;
      const transmissionsRaw = (await db.query<any>(`SELECT * FROM transmissions ORDER BY timestamp DESC`)).rows;
      const transmissions: Transmission[] = transmissionsRaw.map(tx => ({
        id: tx.id,
        timestamp: tx.timestamp,
        tier: tx.tier,
        title: tx.title,
        startDate: tx.start_date,
        endDate: tx.end_date,
        pdaNarrative: tx.pda_narrative,
        pdaReflections: JSON.parse(tx.pda_reflections || '[]'),
        voidAnalysis: JSON.parse(tx.void_analysis || '[]'),
        skillsReconciliation: JSON.parse(tx.skills_reconciliation || '[]'),
        missionMetrics: JSON.parse(tx.mission_metrics || '{"accomplished":[],"missed":[],"milestones":[]}'),
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
        history,
        skills,
        internships,
        transmissions
      });
    }
  }),
);
