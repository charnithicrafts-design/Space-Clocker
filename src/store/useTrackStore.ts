import { create } from 'zustand';

interface Ambition {
  id: string;
  title: string;
  progress: number;
}

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Profile {
  name: string;
  level: number;
  title: string;
}

interface Ambition {
  id: string;
  title: string;
  progress: number;
  plannedDate?: string;
  horizon: 'daily' | 'weekly' | 'yearly';
}

interface Task {
  id: string;
  time: string;
  title: string;
  completed: boolean;
  isVoid?: boolean;
  plannedDate?: string;
  horizon: 'daily' | 'weekly' | 'yearly';
}

// ... update initial state with horizon properties ...
// (e.g. ambitions: [{..., horizon: 'yearly'}], tasks: [{..., horizon: 'daily'}])
// ... and update addAmbition/addTask to accept these properties.

interface VoidTask {
  id: string;
  text: string;
  impact: 'low' | 'medium' | 'high';
  engagedCount: number;
  maxAllowed: number;
}

interface Reflection {
  id: string;
  date: string;
  content: string;
  type: 'missed-task' | 'void-engaged' | 'daily-summary';
}

interface InternshipPeriod {
  organization: 'ISRO' | 'NASA';
  start: string;
  end: string;
}

interface TrackStore {
  profile: Profile;
  ambitions: Ambition[];
  tasks: Task[];
  voids: VoidTask[];
  reflections: Reflection[];
  internships: InternshipPeriod[];
  addAmbition: (title: string) => void;
  addTask: (time: string, title: string, ambitionId?: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  toggleTask: (taskId: string) => void;
  addReflection: (content: string, type: Reflection['type']) => void;
  addInternship: (internship: InternshipPeriod) => void;
}

export const useTrackStore = create<TrackStore>()(
  persist(
    (set) => ({
      profile: { name: 'Valentina', level: 42, title: 'Galactic Voyager' },
      ambitions: [
        { id: '1', title: 'Lead Scientist at ISRO/NASA by 2027', progress: 0, horizon: 'yearly' },
        { id: '2', title: 'Master Quantum-ML Algorithms', progress: 0, horizon: 'yearly' }
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
      addAmbition: (title: string) => set((state) => ({
        ambitions: [...state.ambitions, { id: Date.now().toString(), title, progress: 0, horizon: 'yearly' }]
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
      }))
    }),
    { name: 'space-clocker-storage' }
  )
);
