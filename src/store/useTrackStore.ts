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

interface TrackStore {
  profile: Profile;
  ambitions: Ambition[];
  tasks: Task[];
  voids: VoidTask[];
  reflections: Reflection[];
  internships: InternshipPeriod[];
  skills: Skill[];
  
  // Actions
  addAmbition: (title: string) => void;
  addTask: (time: string, title: string, ambitionId?: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTask: (taskId: string) => void;
  addReflection: (content: string, type: Reflection['type']) => void;
  addInternship: (internship: InternshipPeriod) => void;
  updateSkill: (id: string, current: number, target: number) => void;
}

export const useTrackStore = create<TrackStore>()(
  persist(
    (set) => ({
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

      addAmbition: (title: string) => set((state) => ({
        ambitions: [...state.ambitions, { id: Date.now().toString(), title, progress: 0, horizon: 'yearly', milestones: [] }]
      })),
      addTask: (time: string, title: string, ambitionId?: string) => set((state) => ({
        tasks: [...state.tasks, { id: Date.now().toString(), time, title, completed: false, horizon: 'daily', plannedDate: new Date().toISOString() }]
      })),
      deleteTask: (taskId: string) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== taskId)
      })),
      updateTask: (taskId, updates) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? { ...t, ...updates } : t)
      })),
      toggleTask: (taskId: string) => set((state) => ({
        tasks: state.tasks.map((t) => t.id === taskId ? { ...t, completed: !t.completed } : t)
      })),
      addReflection: (content: string, type: Reflection['type']) => set((state) => ({
        reflections: [...state.reflections, { id: Date.now().toString(), date: new Date().toISOString(), content, type }]
      })),
      addInternship: (internship) => set((state) => ({
        internships: [...state.internships, internship]
      })),
      updateSkill: (id, current, target) => set((state) => ({
        skills: state.skills.map((s) => s.id === id ? { ...s, currentProficiency: current, targetProficiency: target } : s)
      }))
    }),
    { 
      name: 'space-clocker-storage',
      version: 2, // Bump version for new data structure
    }
  )
);
