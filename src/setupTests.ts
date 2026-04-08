import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Worker for JSDOM environment
class MockWorker {
  url: string;
  onmessage: ((ev: MessageEvent) => void) | null = null;
  constructor(url: string | URL) {
    this.url = url.toString();
  }
  postMessage(data: any) {}
  terminate() {}
  addEventListener() {}
  removeEventListener() {}
}

global.Worker = MockWorker as any;

// Mock Comlink
vi.mock('comlink', () => ({
  wrap: vi.fn((worker) => ({
    init: vi.fn().mockResolvedValue(undefined),
    query: vi.fn().mockResolvedValue({ rows: [] }),
    exec: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    dumpDataDir: vi.fn().mockResolvedValue(new Blob()),
    transaction: vi.fn((cb) => cb({ query: vi.fn(), exec: vi.fn() })),
    getProfile: vi.fn().mockResolvedValue({ rows: [] }),
    updateProfile: vi.fn().mockResolvedValue({ rows: [] }),
    getTasks: vi.fn().mockResolvedValue({ rows: [] }),
    addTask: vi.fn().mockResolvedValue({ rows: [] }),
    updateTask: vi.fn().mockResolvedValue({ rows: [] }),
    deleteTask: vi.fn().mockResolvedValue({ rows: [] }),
    toggleTask: vi.fn().mockResolvedValue({ newCompleted: true, completedAt: new Date().toISOString(), newXp: 10, newLevel: 1 }),
    bulkImport: vi.fn().mockResolvedValue(true),
    clearAllData: vi.fn().mockResolvedValue(true),
  })),
  expose: vi.fn(),
  proxy: vi.fn((x) => x),
}));
