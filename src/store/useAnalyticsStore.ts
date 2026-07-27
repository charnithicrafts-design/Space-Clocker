import { create } from 'zustand';
import { dbProxy } from '../db/client';

export type TelemetryData = {
  heatmap: { date: string; count: number }[];
  voidBreaches: { date: string; count: number }[];
  currentXp: number;
  currentLevel: number;
};

interface AnalyticsState {
  timeframe: 7 | 30 | 365;
  telemetry: TelemetryData | null;
  isLoading: boolean;
  error: string | null;
  
  setTimeframe: (days: 7 | 30 | 365) => void;
  fetchTelemetry: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set, get) => ({
  timeframe: 30,
  telemetry: null,
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
      set({ telemetry: data, isLoading: false });
    } catch (err: any) {
      console.error('[AnalyticsStore] Failed to fetch telemetry:', err);
      set({ error: err.message || 'Failed to load telemetry data.', isLoading: false });
    }
  }
}));
