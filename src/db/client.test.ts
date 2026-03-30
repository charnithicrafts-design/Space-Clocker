import { describe, it, expect, vi, beforeEach } from 'vitest';

// Use hoisted to define mock objects for architectural isolation
const { mockPGliteConstructor } = vi.hoisted(() => {
  const constructorMock = vi.fn().mockImplementation(function() {
    return {
      waitReady: Promise.resolve(),
      close: vi.fn().mockResolvedValue(undefined),
      dumpDataDir: vi.fn().mockResolvedValue(new Blob(['nebula-dump-data'], { type: 'application/octet-stream' })),
      query: vi.fn().mockResolvedValue({ rows: [] }),
    };
  });
  return {
    mockPGliteConstructor: constructorMock,
  };
});

// Strategic Mocking: Mock PGlite before any imports to control the singleton instance
vi.mock('@electric-sql/pglite', () => {
  return {
    PGlite: mockPGliteConstructor,
  };
});

import { PGlite } from '@electric-sql/pglite';
import * as DbClient from './client';

describe('DbClient - Orbital Interface', () => {
  beforeEach(() => {
    // Reset mocks between runs to ensure isolated state
    vi.clearAllMocks();
  });

  it('should provide access to the singleton database instance', () => {
    // Arrange & Act
    const db = DbClient.getDb();
    
    // Assert
    expect(db).toBeDefined();
    expect(typeof db.query).toBe('function');
  });

  it('should capture a binary snapshot of the stellar database', async () => {
    // Arrange
    const db = DbClient.getDb();
    const expectedDumpData = 'stellar-core-telemetry-dump';
    vi.mocked(db.dumpDataDir).mockResolvedValue(new Blob([expectedDumpData]));
    
    // Act
    const blob = await DbClient.dumpDb();
    
    // Assert
    expect(db.dumpDataDir).toHaveBeenCalled();
    expect(await blob.text()).toBe(expectedDumpData);
  });

  it('should restore database state from a telemetry blob', async () => {
    // Arrange
    const telemetryBlob = new Blob(['restored-nebula-state'], { type: 'application/octet-stream' });
    const decommissionedDb = DbClient.getDb();
    
    // Act
    await DbClient.restoreDb(telemetryBlob);
    const activeDb = DbClient.getDb();
    
    // Assert: Previous instance was closed for safety
    expect(decommissionedDb.close).toHaveBeenCalled();
    expect(activeDb).not.toBe(decommissionedDb);
    
    // Assert: New instance initialized with telemetry data dir
    expect(mockPGliteConstructor).toHaveBeenCalledWith(
      'idb://space-clocker-db', 
      expect.objectContaining({ loadDataDir: telemetryBlob })
    );
  });
});
