import { create } from 'zustand';
import { getTodayLocalISO } from '../utils/DateTimeUtils';
import { CURRENT_APP_VERSION, XP_PER_LEVEL } from '../constants';

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
  ambitionId?: string;
  milestoneId?: string;
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
  organization: string;
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
  metadata: { 
    targetOrg?: string; 
    securityClearance: string; 
    alignment2027?: string;
    targetAmbitionId?: string;
    targetMilestoneId?: string;
  };
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
  updateAvailable: boolean;
  isCheckingUpdates: boolean;
  pendingVersion?: string;
  dbAppVersion?: string;
  showUpdateModal: boolean;
  
  // Actions
  performSystemUpgrade: () => Promise<void>;
  dismissUpdate: () => void;
  setShowUpdateModal: (show: boolean) => void;
  checkForUpdates: () => Promise<void>;
  addAmbition: (title: string) => Promise<void>;
  updateAmbition: (id: string, title: string) => Promise<void>;
  addTask: (time: string, title: string, ambitionId?: string, extra?: Partial<Task>) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  updateTaskDate: (taskId: string, date: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  addReflection: (content: string, type: Reflection['type']) => Promise<void>;
  addHistoricalEvent: (event: Omit<HistoricalEvent, 'id'>) => Promise<void>;
  updateHistoricalEvent: (id: string, updates: Partial<HistoricalEvent>) => Promise<void>;
  deleteHistoricalEvent: (id: string) => Promise<void>;
  addInternship: (internship: InternshipPeriod) => Promise<void>;
  addSkill: (name: string, current: number, target: number, recommendation: string, type: Skill['type'], ambitionId?: string) => Promise<void>;
  updateSkill: (id: string, updates: Partial<Skill>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  
  // Transmission Actions
  generateTransmission: (
    tier: Transmission['tier'], 
    title: string, 
    narrative: string, 
    targetOrg?: string, 
    dateRange?: { start: string; end: string },
    targetAmbitionId?: string,
    targetMilestoneId?: string
  ) => Promise<void>;
  deleteTransmission: (id: string) => Promise<void>;

  // Macro Engine Actions
  addMilestone: (ambitionId: string, title: string) => Promise<void>;
  updateMilestone: (ambitionId: string, milestoneId: string, title: string) => Promise<void>;
  deleteMilestone: (ambitionId: string, milestoneId: string) => Promise<void>;
  addMilestoneTask: (ambitionId: string, milestoneId: string, title: string, extra?: Partial<Task>) => Promise<void>;
  updateMilestoneTask: (ambitionId: string, milestoneId: string, taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteMilestoneTask: (ambitionId: string, milestoneId: string, taskId: string) => Promise<void>;
  toggleMilestoneTask: (ambitionId: string, milestoneId: string, taskId: string) => Promise<void>;
  deleteAmbition: (id: string) => Promise<void>;

  // Data Portability Actions
  exportData: () => Promise<string>;
  importData: (json: any) => Promise<void>;
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
  clearAllData: () => Promise<void>;
  initialize: () => Promise<void>;
}

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
    stats: { streak: 0, tasks_completed: 0, total_focus_hours: 0 } as any,
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
    updateAvailable: false,
    isCheckingUpdates: false,
    pendingVersion: undefined,
    dbAppVersion: undefined,
    showUpdateModal: false,

    setShowUpdateModal: (show) => set({ showUpdateModal: show }),

    checkForUpdates: async () => {
      set({ isCheckingUpdates: true });
      
      // Simulate network/processing latency for better UX feedback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const { getDb } = await import('../db/client');
      const db = getDb();
      const systemRes = await db.query(`SELECT app_version FROM system_info WHERE id = 1`);
      const dbAppVersion = systemRes.rows[0]?.app_version;
      
      set({ dbAppVersion, isCheckingUpdates: false });
      
      if (dbAppVersion && dbAppVersion !== CURRENT_APP_VERSION) {
        set({ updateAvailable: true, pendingVersion: CURRENT_APP_VERSION, showUpdateModal: true });
      } else {
        set({ updateAvailable: false });
      }
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
      const meta = (await db.query('SELECT remote_file_id FROM sync_metadata WHERE id = 1')).rows[0];
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
        plannedDate: extra?.plannedDate || getTodayLocalISO(),
        weightage: 10,
        ...extra 
      };
      
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`INSERT INTO tasks (id, time, end_time, deadline, weightage, title, completed, horizon, planned_date, ambition_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [
        newTask.id, newTask.time, newTask.endTime || null, newTask.deadline || null, newTask.weightage, newTask.title, newTask.completed, newTask.horizon, newTask.plannedDate || null, ambitionId || null
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
      const { dbProxy } = await import('../db/client');
      const { newCompleted, completedAt, newXp, newLevel } = await dbProxy.toggleTask(taskId, XP_PER_LEVEL);

      set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? { ...t, completed: newCompleted, completedAt: completedAt || undefined } : t),
        profile: { ...state.profile, xp: newXp, level: newLevel }
      }));
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
        id, newEvent.title, newEvent.date, newEvent.type, newEvent.category, newEvent.description || null, JSON.stringify(newEvent.skills)
      ]);
      set((state) => ({ history: [...state.history, newEvent] }));
    },

    updateHistoricalEvent: async (id, updates) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      
      if (updates.title !== undefined) await db.query(`UPDATE stellar_history SET title = $1 WHERE id = $2`, [updates.title, id]);
      if (updates.date !== undefined) await db.query(`UPDATE stellar_history SET date = $1 WHERE id = $2`, [updates.date, id]);
      if (updates.type !== undefined) await db.query(`UPDATE stellar_history SET type = $1 WHERE id = $2`, [updates.type, id]);
      if (updates.category !== undefined) await db.query(`UPDATE stellar_history SET category = $1 WHERE id = $2`, [updates.category, id]);
      if (updates.description !== undefined) await db.query(`UPDATE stellar_history SET description = $1 WHERE id = $2`, [updates.description, id]);
      if (updates.skills !== undefined) await db.query(`UPDATE stellar_history SET skills = $1 WHERE id = $2`, [JSON.stringify(updates.skills), id]);
      
      set((state) => ({
        history: state.history.map((h) => h.id === id ? { ...h, ...updates } : h)
      }));
    },

    deleteHistoricalEvent: async (id) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`DELETE FROM stellar_history WHERE id = $1`, [id]);
      set((state) => ({
        history: state.history.filter((h) => h.id !== id)
      }));
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
        id, name, current, target, recommendation || null, type, ambitionId || null
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

    generateTransmission: async (tier, title, narrative, targetOrg, dateRange, targetAmbitionId, targetMilestoneId) => {
      try {
        const state = get();
        const { getDb } = await import('../db/client');
        const db = getDb();

        const filterByDate = (date?: string) => {
          if (!dateRange) return true;
          if (!date) return tier === 'milestone' || tier === 'yearly' || tier === 'quarterly';
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
          count: v.engagedCount, 
          impact: v.impact 
        }));

        let allPotentialTasks = [
          ...state.tasks,
          ...state.ambitions.flatMap(a => a.milestones.flatMap(m => m.tasks))
        ];

        if (targetAmbitionId) {
          allPotentialTasks = allPotentialTasks.filter(t => {
            const isDirect = state.tasks.find(st => st.id === t.id && st.ambitionId === targetAmbitionId);
            const isMilestoneTask = state.ambitions.find(a => a.id === targetAmbitionId)?.milestones.some(m => m.tasks.some(mt => mt.id === t.id));
            return isDirect || isMilestoneTask;
          });
        }
        
        if (targetMilestoneId) {
          allPotentialTasks = allPotentialTasks.filter(t => {
            return state.ambitions.some(a => a.milestones.find(m => m.id === targetMilestoneId)?.tasks.some(mt => mt.id === t.id));
          });
        }

        const horizonFilteredTasks = allPotentialTasks.filter(t => {
          if (tier === 'daily') return t.horizon === 'daily';
          if (tier === 'weekly') return t.horizon === 'daily' || t.horizon === 'weekly';
          return true;
        });

        const filteredTasks = horizonFilteredTasks.filter(t => filterByDate(t.plannedDate));

        const accomplished = filteredTasks
          .filter(t => t.completed)
          .map(t => ({ 
            id: t.id, 
            title: t.title, 
            weightage: t.weightage || 10,
            horizon: t.horizon || 'daily'
          }));

        const skillsReconciliation = state.skills
          .filter(s => !targetAmbitionId || s.ambitionId === targetAmbitionId)
          .map(s => {
            let delta = 0;
            if (accomplished.length > 0) {
              const relevantTasks = accomplished.filter(t => {
                const isDirect = state.tasks.find(st => st.id === t.id && st.ambitionId === s.ambitionId);
                const isMilestoneTask = state.ambitions.find(a => a.id === s.ambitionId)?.milestones.some(m => m.tasks.some(mt => mt.id === t.id));
                return isDirect || isMilestoneTask;
              });
              if (relevantTasks.length > 0) delta = relevantTasks.length + Math.floor(Math.random() * 2);
              else if (!targetAmbitionId) delta = Math.min(2, accomplished.length);
            }
            return { 
              skillId: s.id, 
              name: s.name, 
              delta, 
              current: Math.min(100, s.currentProficiency + delta)
            };
          });

        const missed = filteredTasks
          .filter(t => !t.completed)
          .map(t => ({ 
            id: t.id, 
            title: t.title, 
            weightage: t.weightage || 10,
            horizon: t.horizon || 'daily'
          }));

        const milestones = state.ambitions.flatMap(a => 
          a.milestones
            .filter(m => m.tasks.length > 0 && m.tasks.every(t => t.completed) && m.tasks.some(t => filterByDate(t.plannedDate)))
            .map(m => ({ id: m.id, title: m.title, ambitionTitle: a.title }))
        );

        let filteredMilestones = milestones;
        if (targetAmbitionId) filteredMilestones = milestones.filter(m => state.ambitions.find(a => a.id === targetAmbitionId)?.milestones.some(am => am.id === m.id));

        const rawLogs = { 
          tasksCompleted: accomplished.length, 
          totalTasks: filteredTasks.length, 
          focusHours: state.stats.totalFocusHours 
        };

        let alignment2027 = 'GENERAL_ORBIT';
        const targetAmbition = targetAmbitionId ? state.ambitions.find(a => a.id === targetAmbitionId) : null;
        if (targetAmbition) {
          if (targetAmbition.title.includes('AWS')) alignment2027 = 'STATIONED_FOR_AWS_SPECIALIST';
          else if (targetAmbition.title.includes('AI')) alignment2027 = 'STATIONED_FOR_INDIA_AI_WINNER';
          else if (targetAmbition.title.includes('Google')) alignment2027 = 'STATIONED_FOR_GOOGLE_2028';
        } else {
          const has2027Goal = filteredTasks.some(t => t.deadline?.includes('2027') || t.plannedDate?.includes('2027')) || 
                             state.ambitions.some(a => a.title.includes('2027'));
          if (has2027Goal) {
            if (state.ambitions.some(a => a.title.includes('AWS'))) alignment2027 = 'STATIONED_FOR_AWS_SPECIALIST';
            else if (state.ambitions.some(a => a.title.includes('AI'))) alignment2027 = 'STATIONED_FOR_INDIA_AI_WINNER';
            else alignment2027 = 'STATIONED_FOR_2027_TARGET';
          }
        }

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
          missionMetrics: { accomplished, missed, milestones: filteredMilestones },
          rawLogs,
          metadata: { 
            targetOrg, 
            securityClearance: 'LEVEL-1-UNCLASSIFIED', 
            alignment2027,
            targetAmbitionId,
            targetMilestoneId
          }
        };

        await db.query(
          `INSERT INTO transmissions (id, timestamp, tier, title, start_date, end_date, pda_narrative, pda_reflections, void_analysis, skills_reconciliation, mission_metrics, raw_logs, metadata) 
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [
            newTransmission.id, newTransmission.timestamp, newTransmission.tier, newTransmission.title, 
            newTransmission.startDate || null, newTransmission.endDate || null, newTransmission.pdaNarrative || null,
            JSON.stringify(newTransmission.pdaReflections), JSON.stringify(newTransmission.voidAnalysis), 
            JSON.stringify(newTransmission.skillsReconciliation), JSON.stringify(newTransmission.missionMetrics),
            JSON.stringify(newTransmission.rawLogs), JSON.stringify(newTransmission.metadata)
          ]
        );

        set(state => ({ transmissions: [newTransmission, ...state.transmissions] }));
      } catch (error) {
        console.error('Transmission generation failure:', error);
        throw error;
      }
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

    addMilestoneTask: async (ambitionId, milestoneId, title, extra) => {
      const newTask: Task = { 
        id: Date.now().toString(), 
        time: extra?.time || '00:00', 
        title, 
        completed: false, 
        horizon: extra?.horizon || 'daily', 
        weightage: 25,
        ...extra 
      };
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`INSERT INTO tasks (id, milestone_id, time, end_time, deadline, weightage, title, completed, horizon, planned_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [
        newTask.id, milestoneId, newTask.time, newTask.endTime || null, newTask.deadline || null, newTask.weightage, newTask.title, newTask.completed, newTask.horizon, newTask.plannedDate || null
      ]);
      set((state) => ({
        ambitions: state.ambitions.map((a) => a.id === ambitionId ? {
          ...a,
          milestones: a.milestones.map((m) => m.id === milestoneId ? { ...m, tasks: [...m.tasks, newTask] } : m)
        } : a)
      }));
    },

    updateMilestoneTask: async (ambitionId, milestoneId, taskId, updates) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      
      if (updates.title !== undefined) await db.query(`UPDATE tasks SET title = $1 WHERE id = $2`, [updates.title, taskId]);
      if (updates.time !== undefined) await db.query(`UPDATE tasks SET time = $1 WHERE id = $2`, [updates.time, taskId]);
      if (updates.endTime !== undefined) await db.query(`UPDATE tasks SET end_time = $1 WHERE id = $2`, [updates.endTime, taskId]);
      if (updates.deadline !== undefined) await db.query(`UPDATE tasks SET deadline = $1 WHERE id = $2`, [updates.deadline, taskId]);
      if (updates.weightage !== undefined) await db.query(`UPDATE tasks SET weightage = $1 WHERE id = $2`, [updates.weightage, taskId]);
      if (updates.horizon !== undefined) await db.query(`UPDATE tasks SET horizon = $1 WHERE id = $2`, [updates.horizon, taskId]);
      if (updates.plannedDate !== undefined) await db.query(`UPDATE tasks SET planned_date = $1 WHERE id = $2`, [updates.plannedDate, taskId]);

      set((state) => ({
        ambitions: state.ambitions.map((a) => a.id === ambitionId ? { ...a, milestones: a.milestones.map((m) => m.id === milestoneId ? { ...m, tasks: m.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t) } : m) } : a)
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

    deleteMilestone: async (ambitionId, milestoneId) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`DELETE FROM tasks WHERE milestone_id = $1`, [milestoneId]);
      await db.query(`DELETE FROM milestones WHERE id = $1`, [milestoneId]);
      set((state) => ({
        ambitions: state.ambitions.map((a) => a.id === ambitionId ? {
          ...a,
          milestones: a.milestones.filter((m) => m.id !== milestoneId)
        } : a)
      }));
    },

    deleteAmbition: async (id) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`DELETE FROM tasks WHERE milestone_id IN (SELECT id FROM milestones WHERE ambition_id = $1)`, [id]);
      await db.query(`DELETE FROM tasks WHERE ambition_id = $1`, [id]);
      await db.query(`DELETE FROM milestones WHERE ambition_id = $1`, [id]);
      await db.query(`DELETE FROM ambitions WHERE id = $1`, [id]);
      set((state) => ({
        ambitions: state.ambitions.filter((a) => a.id !== id)
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
        ambitionXp = Math.max(0, a.xp + xpGain);
        return { ...a, milestones: newMilestones, progress: newProgress, xp: ambitionXp };
      });

      let newXp = state.profile.xp + xpGain;
      let newLevel = state.profile.level;
      if (newXp >= XP_PER_LEVEL) { newLevel += 1; newXp -= XP_PER_LEVEL; }
      else if (newXp < 0 && newLevel > 1) { newLevel -= 1; newXp += XP_PER_LEVEL; }
      else if (newXp < 0) newXp = 0;

      const { getDb } = await import('../db/client');
      const db = getDb();
      if (updatedTask) await db.query(`UPDATE tasks SET completed = $1, completed_at = $2 WHERE id = $3`, [updatedTask.completed, updatedTask.completedAt || null, taskId]);
      await db.query(`UPDATE milestones SET status = $1 WHERE id = $2`, [newStatus, milestoneId]);
      await db.query(`UPDATE ambitions SET progress = $1, xp = $2 WHERE id = $3`, [newProgress, ambitionXp, ambitionId]);
      await db.query(`UPDATE profile SET xp = $1, level = $2 WHERE id = 1`, [newXp, newLevel]);
      set({ ambitions: newAmbitions, profile: { ...state.profile, xp: newXp, level: newLevel } });
    },

    exportData: async () => {
      const state = get();
      const exportObj = {
        app: 'Space-Clocker',
        version: CURRENT_APP_VERSION,
        timestamp: new Date().toISOString(),
        payload: {
          profile: state.profile,
          ambitions: state.ambitions,
          tasks: state.tasks,
          voids: state.voids,
          reflections: state.reflections,
          history: state.history,
          internships: state.internships,
          skills: state.skills,
          transmissions: state.transmissions,
          stats: state.stats,
          oracleConfig: state.oracleConfig,
          preferences: state.preferences
        }
      };
      return JSON.stringify(exportObj, null, 2);
    },

    importData: async (json: any) => {
      // Determine if this is a wrapped backup or a direct payload
      const isWrapped = json && (json.app === 'Space-Clocker' || json.app === 'space-clocker');
      const payload = isWrapped ? json.payload : json;
      
      if (!payload || (!payload.profile && !payload.ambitions && !payload.tasks)) {
        console.error('[Import] Invalid payload structure:', payload);
        throw new Error('Invalid trajectory data: Backup is corrupted, unrecognized, or missing core payload components.');
      }

      console.log('[Import] Initiating trajectory restoration...', { 
        version: json.version || 'unknown',
        isWrapped,
        collections: Object.keys(payload)
      });

      const { dbProxy } = await import('../db/client');
      
      try {
        await dbProxy.bulkImport(payload);
        await get().initialize();
        console.log('[Import] State re-initialized. Ready for launch.');
      } catch (err: any) {
        console.error('[Import] Trajectory restoration failed:', err);
        throw new Error(`Import failed: ${err.message || 'Check database constraints or file structure.'}`);
      }
    },
    updateOracleConfig: (config) => set((state) => ({ oracleConfig: { ...state.oracleConfig, ...config } })),
    updateProfile: (updates) => set((state) => {
      const newProfile = { ...state.profile, ...updates };
      import('../db/client').then(({ getDb }) => {
        const db = getDb();
        db.query(`UPDATE profile SET name = $1, level = $2, xp = $3, title = $4 WHERE id = 1`, [newProfile.name, newProfile.level, newProfile.xp, newProfile.title]);
      });
      return { profile: newProfile };
    }),
    updatePreferences: (updates) => set((state) => {
      const newPrefs = { ...state.preferences, ...updates };
      import('../db/client').then(({ getDb }) => {
        const db = getDb();
        db.query(`UPDATE preferences SET confirm_delete = $1, ui_mode = $2 WHERE id = 1`, [newPrefs.confirmDelete, newPrefs.uiMode]);
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
      await db.query(`INSERT INTO void_tasks (id, text, impact, engaged_count, max_allowed) VALUES ($1, $2, $3, $4, $5)`, [newVoid.id, newVoid.text, newVoid.impact, newVoid.engagedCount, newVoid.maxAllowed]);
      set((state) => ({ voids: [...state.voids, newVoid] }));
    },
    updateVoidTask: async (id, updates) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      if (updates.text !== undefined) await db.query(`UPDATE void_tasks SET text = $1 WHERE id = $2`, [updates.text, id]);
      if (updates.impact !== undefined) await db.query(`UPDATE void_tasks SET impact = $1 WHERE id = $2`, [updates.impact, id]);
      if (updates.maxAllowed !== undefined) await db.query(`UPDATE void_tasks SET max_allowed = $1 WHERE id = $2`, [updates.maxAllowed, id]);
      set((state) => ({ voids: state.voids.map((v) => v.id === id ? { ...v, ...updates } : v) }));
    },
    deleteVoidTask: async (id) => {
      const { getDb } = await import('../db/client');
      const db = getDb();
      await db.query(`DELETE FROM void_tasks WHERE id = $1`, [id]);
      set((state) => ({ voids: state.voids.filter((v) => v.id !== id) }));
    },
    engageVoid: async (voidId) => {
      const state = get();
      const v = state.voids.find((v) => v.id === voidId);
      if (v) {
        const newCount = v.engagedCount + 1;
        const { getDb } = await import('../db/client');
        const db = getDb();
        await db.query(`UPDATE void_tasks SET engaged_count = $1 WHERE id = $2`, [newCount, voidId]);
        set((state) => ({ voids: state.voids.map((v) => v.id === voidId ? { ...v, engagedCount: newCount } : v) }));
      }
    },

    clearAllData: async () => {
      const { dbProxy } = await import('../db/client');
      try {
        await dbProxy.clearAllData();
        await get().initialize();
      } catch (err) {
        console.error('Data clear failed:', err);
        throw err;
      }
    },
    importDemoData: async (data: any) => {
      const { dbProxy } = await import('../db/client');
      try {
        await dbProxy.bulkImport(data);
        await get().initialize();
      } catch (err) {
        console.error('Demo data import failed:', err);
        throw err;
      }
    },

    dismissUpdate: () => set({ showUpdateModal: false }),

    performSystemUpgrade: async () => {
      console.log(`[Upgrade] Initiating jump to v${CURRENT_APP_VERSION}...`);
      const { runMigrations } = await import('../db/migrate');
      const { getDb } = await import('../db/client');
      const db = getDb();

      try {
        // 1. Silent Backup (Session Storage as safety net)
        const snapshot = await get().exportData();
        sessionStorage.setItem('pre-upgrade-backup', snapshot);

        // 2. Run Database Migrations
        await runMigrations();

        // 3. Update version in DB (Robust UPSERT)
        await db.query(`
          INSERT INTO system_info (id, app_version) 
          VALUES (1, $1) 
          ON CONFLICT (id) DO UPDATE SET app_version = $1
        `, [CURRENT_APP_VERSION]);

        // 4. Refresh State
        await get().initialize();
        
        set({ updateAvailable: false, pendingVersion: undefined, showUpdateModal: false });
        console.log(`[Upgrade] Successfully upgraded to v${CURRENT_APP_VERSION}`);
      } catch (err) {
        console.error('[Upgrade] Critical failure during system jump:', err);
        throw err;
      }
    },

    initialize: async () => {
      const { dbProxy } = await import('../db/client');
      const today = getTodayLocalISO();

      try {
        console.log('[Store] Initiating momentum synchronization...');
        
        // Stage 1: Critical Momentum Data (Sequential to avoid transaction overlap)
        const profileRes = await dbProxy.getProfile();
        const prefsRes = await dbProxy.query(`SELECT confirm_delete as "confirmDelete", ui_mode as "uiMode" FROM preferences WHERE id = 1`);
        const statsRes = await dbProxy.query(`SELECT streak, tasks_completed as "tasksCompleted", total_focus_hours as "totalFocusHours" FROM stats WHERE id = 1`);
        const oracleRes = await dbProxy.query(`SELECT api_key as "apiKey", model, provider_url as "providerUrl" FROM oracle_config WHERE id = 1`);
        const ambitionsRes = await dbProxy.query(`SELECT * FROM ambitions`);
        const systemRes = await dbProxy.query(`SELECT last_startup, app_version FROM system_info WHERE id = 1`);

        // Apply critical state immediately
        set({
          profile: profileRes.rows[0] || get().profile,
          preferences: {
            confirmDelete: prefsRes.rows[0]?.confirmDelete ?? true,
            uiMode: prefsRes.rows[0]?.uiMode || 'simple'
          },
          stats: statsRes.rows[0] || get().stats,
          oracleConfig: oracleRes.rows[0] ? { ...get().oracleConfig, ...oracleRes.rows[0] } : get().oracleConfig,
          ambitions: (ambitionsRes.rows || []).map(a => ({ ...a, xp: a.xp || 0, milestones: [] })),
          dbAppVersion: systemRes.rows[0]?.app_version
        });

        // Stage 2: Background Collection Data (Sequential)
        const milestonesRes = await dbProxy.query(`SELECT * FROM milestones`);
        const tasksRes = await dbProxy.getTasks();
        const voidsRes = await dbProxy.query(`SELECT id, text, impact, engaged_count as "engagedCount", max_allowed as "maxAllowed" FROM void_tasks`);
        const reflectionsRes = await dbProxy.query(`SELECT id, date, content, type FROM reflections ORDER BY date DESC LIMIT 100`);
        const historyRes = await dbProxy.query(`SELECT * FROM stellar_history ORDER BY date DESC LIMIT 50`);
        const skillsRes = await dbProxy.query(`SELECT id, name, current_proficiency as "currentProficiency", target_proficiency as "targetProficiency", recommendation, type, ambition_id as "ambitionId" FROM skills`);
        const internshipsRes = await dbProxy.query(`SELECT organization, start_date as "start", end_date as "end" FROM internships`);
        const transmissionsRes = await dbProxy.query(`SELECT * FROM transmissions ORDER BY timestamp DESC LIMIT 20`);

      // Map and process background data
      const milestonesRaw = milestonesRes.rows;
      const tasksRaw = tasksRes.rows;

      const milestonesByAmbition = new Map<string, any[]>();
      milestonesRaw.forEach(m => {
        if (!milestonesByAmbition.has(m.ambition_id)) milestonesByAmbition.set(m.ambition_id, []);
        milestonesByAmbition.get(m.ambition_id)!.push(m);
      });

      const tasksByMilestone = new Map<string, any[]>();
      const standaloneTasks: Task[] = [];
      
      tasksRaw.forEach(t => {
        const task: Task = {
          ...t,
          endTime: t.end_time,
          plannedDate: t.planned_date,
          isVoid: t.is_void === 1 || t.is_void === true,
          completedAt: t.completed_at,
          ambitionId: t.ambition_id,
          milestoneId: t.milestone_id
        };
        
        if (t.milestone_id) {
          if (!tasksByMilestone.has(t.milestone_id)) tasksByMilestone.set(t.milestone_id, []);
          tasksByMilestone.get(t.milestone_id)!.push(task);
        } else {
          standaloneTasks.push(task);
        }
      });

      const deepAmbitions: Ambition[] = (ambitionsRes.rows || []).map(a => ({
        ...a,
        xp: a.xp || 0,
        milestones: (milestonesByAmbition.get(a.id) || []).map(m => ({
          ...m,
          tasks: tasksByMilestone.get(m.id) || []
        }))
      }));

      const history: HistoricalEvent[] = historyRes.rows.map(h => ({ ...h, skills: JSON.parse(h.skills || '[]') }));
      const transmissions: Transmission[] = transmissionsRes.rows.map(tx => ({
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
        mission_metrics: JSON.parse(tx.mission_metrics || '{"accomplished":[],"missed":[],"milestones":[]}'),
        missionMetrics: JSON.parse(tx.mission_metrics || '{"accomplished":[],"missed":[],"milestones":[]}'),
        rawLogs: JSON.parse(tx.raw_logs || '{}'),
        metadata: JSON.parse(tx.metadata || '{}')
      }));

      // Apply the rest of the data
      set({
        ambitions: deepAmbitions,
        tasks: standaloneTasks,
        voids: voidsRes.rows || [],
        reflections: reflectionsRes.rows || [],
        history,
        skills: skillsRes.rows || [],
        internships: internshipsRes.rows || [],
        transmissions,
      });

      // System startup logic
      const lastStartup = systemRes.rows[0]?.last_startup;
      const dbAppVersion = systemRes.rows[0]?.app_version;

      if (dbAppVersion && dbAppVersion !== CURRENT_APP_VERSION) {
        set({ updateAvailable: true, pendingVersion: CURRENT_APP_VERSION, showUpdateModal: true });
      }

      if (lastStartup !== today) {
        const { reconcileDailyTasks } = await import('../utils/StellarScheduler');
        await reconcileDailyTasks(dbProxy, today);
        await dbProxy.query(`UPDATE system_info SET last_startup = $1 WHERE id = 1`, [today]);
      }
      console.log('[Store] Momentum synchronization complete.');
      } catch (err) {
      console.error('[Store] Synchronization failed:', err);
      throw err;
      }
      }
      }),
      );
