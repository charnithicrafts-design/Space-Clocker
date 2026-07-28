import { create } from 'zustand';
import { dbProxy } from '../db/client';

export type TelemetryData = {
  heatmap: { date: string; count: number }[];
  voidBreaches: { date: string; count: number }[];
  currentXp: number;
  currentLevel: number;
};

export type VoidBreachStats = {
  hourlyBreaches: { hour: number; breaches: number }[];
  topVoids: { name: string; count: number; impact: string }[];
};

export type CognitiveSync = {
  score: number;
  auraState: 'aligned' | 'neutral' | 'destabilized';
  positiveTasks: number;
  voidTasks: number;
};

interface AnalyticsState {
  timeframe: 7 | 30 | 365;
  telemetry: TelemetryData | null;
  voidBreachStats: VoidBreachStats | null;
  cognitiveSync: CognitiveSync | null;
  isLoading: boolean;
  error: string | null;
  
  setTimeframe: (days: 7 | 30 | 365) => void;
  fetchTelemetry: () => Promise<void>;
  fetchVoidBreachStats: () => Promise<void>;
  fetchCognitiveSync: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  timeframe: 30,
  telemetry: null,
  voidBreachStats: null,
  cognitiveSync: null,
  isLoading: false,
  error: null,

  setTimeframe: (days) => {
    set({ timeframe: days });
    get().fetchTelemetry();
  },

  fetchTelemetry: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await dbProxy.getTelemetry(get().timeframe);
      set({ telemetry: data as TelemetryData, isLoading: false });
    } catch (err: any) {
      console.error('[AnalyticsStore] Failed to fetch telemetry:', err);
      set({ error: err.message || 'Failed to load telemetry data.', isLoading: false });
    }
  },

  fetchVoidBreachStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await dbProxy.getVoidBreachStats();
      set({ voidBreachStats: data, isLoading: false });
    } catch (err: any) {
      console.error('[AnalyticsStore] Failed to fetch void breach stats:', err);
      set({ error: err.message || 'Failed to load void breach stats.', isLoading: false });
    }
  },

  fetchCognitiveSync: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await dbProxy.getCognitiveSync();
      set({ cognitiveSync: data as CognitiveSync, isLoading: false });
    } catch (err: any) {
      console.error('[AnalyticsStore] Failed to fetch cognitive sync:', err);
      set({ error: err.message || 'Failed to load cognitive sync.', isLoading: false });
    }
  }
}));
