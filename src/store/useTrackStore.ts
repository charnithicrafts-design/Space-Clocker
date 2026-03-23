import { useState, useCallback, useMemo } from 'react';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: 'orbit' | 'void';
}

export interface Goal {
  id: string;
  title: string;
  progress: number;
  targetDate: string;
}

export const useTrackStore = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Implement 3 Quantum Gates', completed: false, category: 'orbit' },
    { id: '2', title: 'Train 1 Neural Network model', completed: true, category: 'orbit' },
    { id: '3', title: 'Read 10 pages of Astrodynamics', completed: false, category: 'orbit' },
    { id: '4', title: 'Doomscrolling Space News', completed: false, category: 'void' },
  ]);

  const [goals] = useState<Goal[]>([
    { id: 'g1', title: 'Lead Scientist at ISRO/NASA', progress: 42, targetDate: '2027' },
  ]);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const stats = useMemo(() => {
    const orbitTasks = tasks.filter((t) => t.category === 'orbit');
    const completedOrbit = orbitTasks.filter((t) => t.completed).length;
    return {
      orbitProgress: orbitTasks.length > 0 ? (completedOrbit / orbitTasks.length) * 100 : 0,
      totalOrbit: orbitTasks.length,
      completedOrbit,
    };
  }, [tasks]);

  return {
    tasks,
    goals,
    toggleTask,
    stats,
  };
};
