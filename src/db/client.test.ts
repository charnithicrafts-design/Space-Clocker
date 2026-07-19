import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Comlink wrap
vi.mock('comlink', () => ({
  wrap: vi.fn(() => ({
    init: vi.fn().mockResolvedValue(undefined),
    query: vi.fn().mockResolvedValue({ rows: [] }),
    exec: vi.fn().mockResolvedValue(undefined),
    close: vi.fn().mockResolvedValue(undefined),
    dumpDataDir: vi.fn().mockResolvedValue(new Blob(['nebula-dump-data'])),
  })),
  expose: vi.fn(),
  proxy: vi.fn((x) => x),
}));

import * as DbClient from './client';

describe('DbClient - Orbital Interface', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide access to the database proxy', () => {
    const db = DbClient.getDb();
    expect(db).toBeDefined();
    expect(typeof db.query).toBe('function');
  });

});
