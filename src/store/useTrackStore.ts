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

export interface Void {
  id: string;
  title: string;
  engagedCount: number;
  maxAllowed: number;
}

export interface Reflection {
  id: string;
  content: string;
  date: string;
  type: 'missed-task' | 'void-engaged' | 'daily-summary';
}

export interface OracleConfig {
  providerUrl: string;
  apiKey: string;
  model: string;
}

export interface OracleLog {
  id: string;
  prompt: string;
  response: string;
  date: string;
}

export const useTrackStore = () => {
  // --- STATE ---
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Implement 3 Quantum Gates', completed: false, category: 'orbit' },
    { id: '2', title: 'Train 1 Neural Network model', completed: true, category: 'orbit' },
    { id: '3', title: 'Read 10 pages of Astrodynamics', completed: false, category: 'orbit' },
  ]);

  const [voids, setVoids] = useState<Void[]>([
    { id: 'v1', title: 'Doomscrolling Space News', engagedCount: 0, maxAllowed: 3 },
    { id: 'v2', title: 'Unplanned Debugging', engagedCount: 1, maxAllowed: 2 },
  ]);

  const [goals] = useState<Goal[]>([
    { id: 'g1', title: 'Lead Scientist at ISRO/NASA', progress: 42, targetDate: '2027' },
  ]);

  const [reflections, setReflections] = useState<Reflection[]>([]);
  const [oracleConfig, setOracleConfig] = useState<OracleConfig>({
    providerUrl: '',
    apiKey: '',
    model: 'gpt-4o',
  });
  const [oracleLogs, setOracleLogs] = useState<OracleLog[]>([]);

  // --- ACTIONS ---
  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const engageVoid = useCallback((id: string) => {
    setVoids((prev) =>
      prev.map((v) =>
        v.id === id ? { ...v, engagedCount: v.engagedCount + 1 } : v
      )
    );
  }, []);

  const addReflection = useCallback((content: string, type: Reflection['type']) => {
    const newReflection: Reflection = {
      id: Date.now().toString(),
      content,
      date: new Date().toISOString(),
      type,
    };
    setReflections((prev) => [newReflection, ...prev]);
  }, []);

  const updateOracleConfig = useCallback((config: OracleConfig) => {
    setOracleConfig(config);
  }, []);

  const addOracleLog = useCallback((prompt: string, response: string) => {
    const newLog: OracleLog = {
      id: Date.now().toString(),
      prompt,
      response,
      date: new Date().toISOString(),
    };
    setOracleLogs((prev) => [newLog, ...prev]);
  }, []);

  // --- DERIVED STATE ---
  const stats = useMemo(() => {
    const orbitTasks = tasks.filter((t) => t.category === 'orbit');
    const completedOrbit = orbitTasks.filter((t) => t.completed).length;
    return {
      orbitProgress: orbitTasks.length > 0 ? (completedOrbit / orbitTasks.length) * 100 : 0,
      totalOrbit: orbitTasks.length,
      completedOrbit,
      totalVoidsEngaged: voids.reduce((acc, v) => acc + v.engagedCount, 0),
    };
  }, [tasks, voids]);

  return {
    tasks,
    voids,
    goals,
    reflections,
    oracleConfig,
    oracleLogs,
    toggleTask,
    engageVoid,
    addReflection,
    updateOracleConfig,
    addOracleLog,
    stats,
  };
};
