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

interface Void {
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
  relatedId?: string;
}

interface TrackStore {
  ambitions: Ambition[];
  tasks: Task[];
  voids: Void[];
  reflections: Reflection[];
  toggleTask: (taskId: string) => void;
  updateAmbitionProgress: (id: string, amount: number) => void;
  addVoid: (text: string, impact: 'low' | 'medium' | 'high', maxAllowed: number) => void;
  engageVoid: (id: string) => void;
  addReflection: (content: string, type: Reflection['type'], relatedId?: string) => void;
}

export const useTrackStore = create<TrackStore>((set) => ({
  ambitions: [
    { id: '1', title: 'Lead Scientist at ISRO/NASA by 2027', progress: 42 }
  ],
  tasks: [
    { id: '1', title: 'Implement 3 Quantum Gates', completed: false },
    { id: '2', title: 'Train 1 Neural Network model', completed: false },
    { id: '3', title: 'Read 10 pages of Astrodynamics', completed: false }
  ],
  voids: [
    { id: '1', text: 'Doomscrolling Space News', impact: 'medium', engagedCount: 0, maxAllowed: 3 },
    { id: '2', text: 'Unplanned Debugging', impact: 'high', engagedCount: 0, maxAllowed: 2 }
  ],
  reflections: [],
  toggleTask: (taskId) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === taskId ? { ...t, completed: !t.completed } : t)
  })),
  updateAmbitionProgress: (id, amount) => set((state) => ({
    ambitions: state.ambitions.map((a) => a.id === id ? { ...a, progress: Math.min(100, a.progress + amount) } : a)
  })),
  addVoid: (text, impact, maxAllowed) => set((state) => ({
    voids: [...state.voids, { id: Date.now().toString(), text, impact, engagedCount: 0, maxAllowed }]
  })),
  engageVoid: (id) => set((state) => ({
    voids: state.voids.map((v) => v.id === id ? { ...v, engagedCount: v.engagedCount + 1 } : v)
  })),
  addReflection: (content, type, relatedId) => set((state) => ({
    reflections: [...state.reflections, { id: Date.now().toString(), date: new Date().toISOString(), content, type, relatedId }]
  }))
}));
