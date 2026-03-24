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

interface TrackStore {
  ambitions: Ambition[];
  tasks: Task[];
  toggleTask: (taskId: string) => void;
  updateAmbitionProgress: (id: string, amount: number) => void;
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
  toggleTask: (taskId) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === taskId ? { ...t, completed: !t.completed } : t)
  })),
  updateAmbitionProgress: (id, amount) => set((state) => ({
    ambitions: state.ambitions.map((a) => a.id === id ? { ...a, progress: Math.min(100, a.progress + amount) } : a)
  }))
}));
