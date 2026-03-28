import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Profile {
  name: string;
  level: number;
  title: string;
}

export interface Task {
  id: string;
  time: string;
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
}

export interface Preferences {
  confirmDelete: boolean;
}

interface TrackStore {
  profile: Profile;
  ambitions: Ambition[];
  tasks: Task[];
  voids: VoidTask[];
  reflections: Reflection[];
  internships: InternshipPeriod[];
  skills: Skill[];
  stats: {
    streak: number;
    tasksCompleted: number;
    totalFocusHours: number;
  };
  oracleConfig: OracleConfig;
  preferences: Preferences;
  
  // Actions
  addAmbition: (title: string) => Promise<void>;
  updateAmbition: (id: string, title: string) => Promise<void>;
  addTask: (time: string, title: string, ambitionId?: string) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  toggleTask: (taskId: string) => Promise<void>;
  addReflection: (content: string, type: Reflection['type']) => Promise<void>;
  addInternship: (internship: InternshipPeriod) => Promise<void>;
  updateSkill: (id: string, current: number, target: number) => Promise<void>;
  
  // Macro Engine Actions
  addMilestone: (ambitionId: string, title: string) => Promise<void>;
  updateMilestone: (ambitionId: string, milestoneId: string, title: string) => Promise<void>;
  addMilestoneTask: (ambitionId: string, milestoneId: string, title: string) => Promise<void>;
  updateMilestoneTask: (ambitionId: string, milestoneId: string, taskId: string, title: string) => Promise<void>;
  deleteMilestoneTask: (ambitionId: string, milestoneId: string, taskId: string) => Promise<void>;
  toggleMilestoneTask: (ambitionId: string, milestoneId: string, taskId: string) => Promise<void>;

  // Data Portability Actions
  importData: (data: Partial<TrackStore>) => void;

  // Oracle & Misc Actions
  updateOracleConfig: (config: Partial<OracleConfig>) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  updatePreferences: (updates: Partial<Preferences>) => void;
  addOracleLog: (log: string, response?: string) => void;
  engageVoid: (voidId: string) => void;
  initialize: () => Promise<void>;
}

export const useTrackStore = create<TrackStore>()(
  (set, get) => ({
    profile: { name: 'Valentina', level: 42, title: 'Galactic Voyager' },
      ambitions: [
        { 
          id: '1', title: 'Interstellar Colony Alpha', progress: 64, horizon: 'yearly',
          milestones: [
            { id: 'm1', title: 'Life Support Calibration', status: 'completed', tasks: [{ id: 't1', time: '08:00', title: 'Calibrate O2 levels', completed: true, horizon: 'daily' }] },
            { id: 'm2', title: 'Biometric Dome Shielding', status: 'active', tasks: [{ id: 't2', time: '10:00', title: 'Initialize field', completed: false, horizon: 'daily' }] }
          ]
        },
        { id: '2', title: 'Neural Link Optimization', progress: 0, horizon: 'yearly', milestones: [] }
      ],
      tasks: [
        { id: '1', time: '08:00', title: 'Implement 3 Quantum Gates', completed: true, horizon: 'daily' },
        { id: '2', time: '10:30', title: 'Train 1 Neural Network model', completed: false, horizon: 'daily' }
      ],
      voids: [
        { id: '1', text: 'Doomscrolling Space News', impact: 'medium', engagedCount: 0, maxAllowed: 3 },
        { id: '2', text: 'Unplanned Debugging', impact: 'high', engagedCount: 0, maxAllowed: 2 }
      ],
      reflections: [
        { id: '1', date: new Date().toISOString(), content: 'Missed ML training session due to university lab extension. Need to adjust focus window.', type: 'missed-task' }
      ],
      internships: [],
      skills: [
        { id: '1', name: 'Data Structures & Algorithms', currentProficiency: 85, targetProficiency: 95, recommendation: 'Strong Foundation. Focus on Advanced Graphs for Google.' },
        { id: '2', name: 'Systems Design', currentProficiency: 45, targetProficiency: 80, recommendation: 'Critical Gap. Master Distributed Systems for Google. Review Case Studies.' },
        { id: '3', name: 'Space Science & Orbital Mechanics', currentProficiency: 30, targetProficiency: 70, recommendation: 'Significant Effort Needed. Study Propulsion Systems for ISRO. Complete Online Courses.' },
        { id: '4', name: 'AI/ML Frameworks', currentProficiency: 60, targetProficiency: 90, recommendation: 'Good Progress. Deepen knowledge in Reinforcement Learning for both targets.' },
        { id: '5', name: 'Cybersecurity', currentProficiency: 50, targetProficiency: 75, recommendation: 'Steady Progress. Focus on Network Security and Cryptography.' },
        { id: '6', name: 'Cloud Infrastructure (AWS/GCP)', currentProficiency: 70, targetProficiency: 85, recommendation: 'On Track. Acquire Professional Certification for Google.' }
      ],
      stats: { streak: 12, tasksCompleted: 154, totalFocusHours: 420 },
      oracleConfig: {
        apiKey: '',
        model: 'gemini-1.5-pro',
        providerUrl: 'https://generativelanguage.googleapis.com/v1beta/openai'
      },
      preferences: {
        confirmDelete: true
      },

      addAmbition: async (title: string) => {
        const newAmbition: Ambition = { id: Date.now().toString(), title, progress: 0, horizon: 'yearly', milestones: [] };
        const { db } = await import('../db/client');
        await db.query(`INSERT INTO ambitions (id, title, progress, horizon) VALUES ($1, $2, $3, $4)`, [
          newAmbition.id, newAmbition.title, newAmbition.progress, newAmbition.horizon
        ]);
        set((state) => ({
          ambitions: [...state.ambitions, newAmbition]
        }));
      },
      updateAmbition: async (id, title) => {
        const { db } = await import('../db/client');
        await db.query(`UPDATE ambitions SET title = $1 WHERE id = $2`, [title, id]);
        set((state) => ({
          ambitions: state.ambitions.map((a) => a.id === id ? { ...a, title } : a)
        }));
      },
      addTask: async (time, title, ambitionId) => {
        const newTask: Task = { id: Date.now().toString(), time, title, completed: false, horizon: 'daily' as const, plannedDate: new Date().toISOString() };
        
        const { db } = await import('../db/client');
        await db.query(`INSERT INTO tasks (id, time, title, completed, horizon, planned_date, ambition_id) VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
          newTask.id, newTask.time, newTask.title, newTask.completed, newTask.horizon, newTask.plannedDate, ambitionId
        ]);

        set((state) => ({ tasks: [...state.tasks, newTask] }));
      },
      deleteTask: async (taskId: string) => {
        const { db } = await import('../db/client');
        await db.query(`DELETE FROM tasks WHERE id = $1`, [taskId]);
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId)
        }));
      },
      updateTask: async (taskId, updates) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (task) {
          const { db } = await import('../db/client');
          if (updates.title !== undefined) await db.query(`UPDATE tasks SET title = $1 WHERE id = $2`, [updates.title, taskId]);
          if (updates.completed !== undefined) await db.query(`UPDATE tasks SET completed = $1 WHERE id = $2`, [updates.completed, taskId]);
          if (updates.time !== undefined) await db.query(`UPDATE tasks SET time = $1 WHERE id = $2`, [updates.time, taskId]);
        }
        set((state) => ({
          tasks: state.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t)
        }));
      },
      toggleTask: async (taskId: string) => {
        const task = get().tasks.find(t => t.id === taskId);
        if (task) {
          const newCompleted = !task.completed;
          const { db } = await import('../db/client');
          await db.query(`UPDATE tasks SET completed = $1 WHERE id = $2`, [newCompleted, taskId]);
          set((state) => ({
            tasks: state.tasks.map((t) => t.id === taskId ? { ...t, completed: newCompleted } : t)
          }));
        }
      },
      addReflection: async (content: string, type: Reflection['type']) => {
        const newReflection = { id: Date.now().toString(), date: new Date().toISOString(), content, type };
        const { db } = await import('../db/client');
        await db.query(`INSERT INTO reflections (id, date, content, type) VALUES ($1, $2, $3, $4)`, [
          newReflection.id, newReflection.date, newReflection.content, newReflection.type
        ]);
        set((state) => ({
          reflections: [...state.reflections, newReflection]
        }));
      },
      addInternship: async (internship) => {
        const id = Date.now().toString();
        const { db } = await import('../db/client');
        await db.query(`INSERT INTO internships (id, organization, start_date, end_date) VALUES ($1, $2, $3, $4)`, [
          id, internship.organization, internship.start, internship.end
        ]);
        set((state) => ({
          internships: [...state.internships, internship]
        }));
      },
      updateSkill: async (id, current, target) => {
        const { db } = await import('../db/client');
        await db.query(`UPDATE skills SET current_proficiency = $1, target_proficiency = $2 WHERE id = $3`, [
          current, target, id
        ]);
        set((state) => ({
          skills: state.skills.map((s) => s.id === id ? { ...s, currentProficiency: current, targetProficiency: target } : s)
        }));
      },

      // Macro Engine Actions
      addMilestone: async (ambitionId, title) => {
        const newMilestone: Milestone = { id: Date.now().toString(), title, tasks: [], status: 'pending' };
        const { db } = await import('../db/client');
        await db.query(`INSERT INTO milestones (id, ambition_id, title, status) VALUES ($1, $2, $3, $4)`, [
          newMilestone.id, ambitionId, newMilestone.title, newMilestone.status
        ]);
        set((state) => ({
          ambitions: state.ambitions.map((a) => a.id === ambitionId ? {
            ...a,
            milestones: [...a.milestones, newMilestone]
          } : a)
        }));
      },

      updateMilestone: async (ambitionId, milestoneId, title) => {
        const { db } = await import('../db/client');
        await db.query(`UPDATE milestones SET title = $1 WHERE id = $2`, [title, milestoneId]);
        set((state) => ({
          ambitions: state.ambitions.map((a) => a.id === ambitionId ? {
            ...a,
            milestones: a.milestones.map((m) => m.id === milestoneId ? { ...m, title } : m)
          } : a)
        }));
      },

      addMilestoneTask: async (ambitionId, milestoneId, title) => {
        const newTask: Task = { id: Date.now().toString(), time: '00:00', title, completed: false, horizon: 'daily' };
        const { db } = await import('../db/client');
        await db.query(`INSERT INTO tasks (id, milestone_id, time, title, completed, horizon) VALUES ($1, $2, $3, $4, $5, $6)`, [
          newTask.id, milestoneId, newTask.time, newTask.title, newTask.completed, newTask.horizon
        ]);
        set((state) => ({
          ambitions: state.ambitions.map((a) => a.id === ambitionId ? {
            ...a,
            milestones: a.milestones.map((m) => m.id === milestoneId ? {
              ...m,
              tasks: [...m.tasks, newTask]
            } : m)
          } : a)
        }));
      },

      updateMilestoneTask: async (ambitionId, milestoneId, taskId, title) => {
        const { db } = await import('../db/client');
        await db.query(`UPDATE tasks SET title = $1 WHERE id = $2`, [title, taskId]);
        set((state) => ({
          ambitions: state.ambitions.map((a) => a.id === ambitionId ? {
            ...a,
            milestones: a.milestones.map((m) => m.id === milestoneId ? {
              ...m,
              tasks: m.tasks.map((t) => t.id === taskId ? { ...t, title } : t)
            } : m)
          } : a)
        }));
      },

      deleteMilestoneTask: async (ambitionId, milestoneId, taskId) => {
        const { db } = await import('../db/client');
        await db.query(`DELETE FROM tasks WHERE id = $1`, [taskId]);
        set((state) => {
          const newAmbitions = state.ambitions.map((a) => {
            if (a.id !== ambitionId) return a;
            const newMilestones = a.milestones.map((m) => {
              if (m.id !== milestoneId) return m;
              return { 
                ...m, 
                tasks: m.tasks.filter((t) => t.id !== taskId)
              };
            });
            return { ...a, milestones: newMilestones };
          });
          return { ambitions: newAmbitions };
        });
      },

      toggleMilestoneTask: async (ambitionId, milestoneId, taskId) => {
        let updatedTask: any = null;
        let newStatus: Milestone['status'] = 'pending';
        let newProgress = 0;

        const { db } = await import('../db/client');

        set((state) => {
          const newAmbitions = state.ambitions.map((a) => {
            if (a.id !== ambitionId) return a;
            const newMilestones = a.milestones.map((m) => {
              if (m.id !== milestoneId) return m;
              const newTasks = m.tasks.map((t) => {
                if (t.id === taskId) {
                  updatedTask = { ...t, completed: !t.completed };
                  return updatedTask;
                }
                return t;
              });
              const allTasksCompleted = newTasks.length > 0 && newTasks.every(t => t.completed);
              newStatus = allTasksCompleted ? 'completed' : (newTasks.some(t => t.completed) ? 'active' : 'pending');
              
              return { 
                ...m, 
                tasks: newTasks, 
                status: newStatus
              };
            });

            // Recalculate Ambition Progress
            const totalTasks = newMilestones.reduce((acc, m) => acc + m.tasks.length, 0);
            const completedTasks = newMilestones.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
            newProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : a.progress;

            return { ...a, milestones: newMilestones, progress: newProgress };
          });
          return { ambitions: newAmbitions };
        });

        // Persist changes
        if (updatedTask) {
          await db.query(`UPDATE tasks SET completed = $1 WHERE id = $2`, [updatedTask.completed, taskId]);
        }
        await db.query(`UPDATE milestones SET status = $1 WHERE id = $2`, [newStatus, milestoneId]);
        await db.query(`UPDATE ambitions SET progress = $1 WHERE id = $2`, [newProgress, ambitionId]);
      },

      // Data Portability Actions
      importData: (data) => set((state) => ({
        ...state,
        ...data,
        profile: data.profile || state.profile,
        ambitions: data.ambitions || state.ambitions,
        tasks: data.tasks || state.tasks,
        voids: data.voids || state.voids,
        reflections: data.reflections || state.reflections,
        skills: data.skills || state.skills,
        stats: data.stats || state.stats,
        oracleConfig: data.oracleConfig || state.oracleConfig
      })),

      // Oracle & Misc Actions
      updateOracleConfig: (config) => set((state) => ({
        oracleConfig: { ...state.oracleConfig, ...config }
      })),
      updateProfile: (updates) => set((state) => {
        const newProfile = { ...state.profile, ...updates };
        import('../db/client').then(({ db }) => {
          db.query(`UPDATE profile SET name = $1, level = $2, title = $3 WHERE id = 1`, [
            newProfile.name, newProfile.level, newProfile.title
          ]);
        });
        return { profile: newProfile };
      }),
      updatePreferences: (updates) => set((state) => {
        const newPrefs = { ...state.preferences, ...updates };
        import('../db/client').then(({ db }) => {
          db.query(`UPDATE preferences SET confirm_delete = $1 WHERE id = 1`, [
            newPrefs.confirmDelete
          ]);
        });
        return { preferences: newPrefs };
      }),
      addOracleLog: (log, response) => set((state) => ({
        reflections: [...state.reflections, { 
          id: Date.now().toString(), 
          date: new Date().toISOString(), 
          content: response ? `${log}\n\nOracle Response: ${response}` : log, 
          type: 'daily-summary' 
        }]
      })),
      engageVoid: (voidId) => set((state) => ({
        voids: state.voids.map((v) => v.id === voidId ? { ...v, engagedCount: v.engagedCount + 1 } : v)
      })),
      initialize: async () => {
        const { db } = await import('../db/client');
        
        const profile = (await db.query<Profile>(`SELECT name, level, title FROM profile WHERE id = 1`)).rows[0];
        const preferences = (await db.query<Preferences>(`SELECT confirm_delete as "confirmDelete" FROM preferences WHERE id = 1`)).rows[0];
        const stats = (await db.query<any>(`SELECT streak, tasks_completed as "tasksCompleted", total_focus_hours as "totalFocusHours" FROM stats WHERE id = 1`)).rows[0];
        const oracleConfig = (await db.query<OracleConfig>(`SELECT api_key as "apiKey", model, provider_url as "providerUrl" FROM oracle_config WHERE id = 1`)).rows[0];
        
        const ambitionsRaw = (await db.query<any>(`SELECT * FROM ambitions`)).rows;
        const milestonesRaw = (await db.query<any>(`SELECT * FROM milestones`)).rows;
        const tasksRaw = (await db.query<any>(`SELECT * FROM tasks`)).rows;
        
        // Build nested structure
        const ambitions: Ambition[] = ambitionsRaw.map(a => ({
          ...a,
          milestones: milestonesRaw
            .filter(m => m.ambition_id === a.id)
            .map(m => ({
              ...m,
              tasks: tasksRaw.filter(t => t.milestone_id === m.id)
            }))
        }));

        const standaloneTasks = tasksRaw.filter(t => !t.milestone_id);
        const voids = (await db.query<VoidTask>(`SELECT id, text, impact, engaged_count as "engagedCount", max_allowed as "maxAllowed" FROM void_tasks`)).rows;
        const reflections = (await db.query<Reflection>(`SELECT id, date, content, type FROM reflections`)).rows;
        const skills = (await db.query<Skill>(`SELECT id, name, current_proficiency as "currentProficiency", target_proficiency as "targetProficiency", recommendation FROM skills`)).rows;
        const internships = (await db.query<any>(`SELECT organization, start_date as "start", end_date as "end" FROM internships`)).rows;

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
          internships
        });
      }
    }),
);
