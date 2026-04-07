import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock indexedDB for node environment
global.indexedDB = {} as any;

// Use hoisted to define mock objects for architectural isolation
const { mockPGliteConstructor, mockPGliteCreate } = vi.hoisted(() => {
  const createInstance = () => ({
    waitReady: Promise.resolve(),
    close: vi.fn().mockResolvedValue(undefined),
    dumpDataDir: vi.fn().mockResolvedValue(new Blob(['nebula-dump-data'], { type: 'application/octet-stream' })),
    query: vi.fn().mockResolvedValue({ rows: [] }),
  });
  
  const constructorMock = vi.fn().mockImplementation(function() {
    return createInstance();
  });
  
  const createMock = vi.fn().mockImplementation(() => Promise.resolve(createInstance()));
  
  // Attach the static 'create' method to the constructor mock
  (constructorMock as any).create = createMock;
  
  return {
    mockPGliteConstructor: constructorMock,
    mockPGliteCreate: createMock,
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
    
    // We need to mock the underlying instance's method
    const instance = (db as any).getInstance();
    vi.mocked(instance.dumpDataDir).mockResolvedValue(new Blob([expectedDumpData]));
    
    // Act
    const blob = await DbClient.dumpDb();
    
    // Assert
    expect(instance.dumpDataDir).toHaveBeenCalled();
    expect(await blob.text()).toBe(expectedDumpData);
  });

  it('should restore database state from a telemetry blob after clearing existing data', async () => {
    // Arrange
    const telemetryBlob = new Blob(['restored-nebula-state'], { type: 'application/octet-stream' });
    const dbProxy = DbClient.getDb() as any;
    const decommissionedInstance = dbProxy.getInstance();
    
    // Mock IndexedDB globally with multi-call support
    const mockRequests: any[] = [];
    const deleteSpy = vi.fn().mockImplementation(() => {
      const req = { onsuccess: null, onerror: null, onblocked: null };
      mockRequests.push(req);
      return req;
    });
    (global as any).indexedDB = { deleteDatabase: deleteSpy };
    
    // Act
    const restorePromise = DbClient.restoreDb(telemetryBlob);
    
    // We need to flush the microtask queue to reach the first deleteDatabase call
    await Promise.resolve(); 
    await Promise.resolve();
    
    // Handle all deletion attempts sequentially
    const dbNames = [
      'space-clocker-db', 
      'pglite-space-clocker-db',
      '/pglite/space-clocker-db', 
      'pglite/space-clocker-db',
      'idb://space-clocker-db',
      '/pglite/idb://space-clocker-db',
      'pglite-idb://space-clocker-db',
      'pglite-idb-space-clocker-db'
    ];
    
    for (let i = 0; i < dbNames.length; i++) {
      // Wait for the request to be created if not already there
      while (mockRequests.length <= i) {
        await new Promise(r => setTimeout(r, 0));
      }
      // Simulate success for this deletion
      if (mockRequests[i].onsuccess) {
        mockRequests[i].onsuccess({} as any);
      }
      // Give it time to proceed to the next iteration or PGlite.create
      await Promise.resolve();
      await Promise.resolve();
    }
    
    await restorePromise;
    const activeInstance = dbProxy.getInstance();
    
    // Assert: Previous instance was closed for safety
    expect(decommissionedInstance.close).toHaveBeenCalled();
    
    // Assert: IndexedDB was cleared for all possible names
    expect(deleteSpy).toHaveBeenCalledWith('space-clocker-db');
    expect(deleteSpy).toHaveBeenCalledWith('pglite-space-clocker-db');
    expect(deleteSpy).toHaveBeenCalledWith('/pglite/space-clocker-db');
    expect(deleteSpy).toHaveBeenCalledWith('idb://space-clocker-db');
    
    expect(activeInstance).not.toBe(decommissionedInstance);
    
    // Assert: New instance initialized with telemetry data dir via create()
    expect(mockPGliteCreate).toHaveBeenCalledWith(
      'idb://space-clocker-db', 
      expect.objectContaining({ loadDataDir: telemetryBlob })
    );
  });

  it('should reject restoration if database deletion is blocked', async () => {
    // Arrange
    const telemetryBlob = new Blob(['blocked-state']);
    const dbProxy = DbClient.getDb() as any;
    const currentInstance = dbProxy.getInstance();
    
    // Mock IndexedDB to simulate a blocked deletion
    const deleteSpy = vi.fn().mockImplementation(() => {
      const req = { onsuccess: null, onerror: null, onblocked: null };
      setTimeout(() => {
        if (req.onblocked) (req as any).onblocked();
      }, 0);
      return req;
    });
    (global as any).indexedDB = { deleteDatabase: deleteSpy };
    
    // Act & Assert
    await expect(DbClient.restoreDb(telemetryBlob)).rejects.toThrow('Database deletion blocked. Please close other tabs of this application and try again.');
    
    // Current instance was closed
    expect(currentInstance.close).toHaveBeenCalled();
  });
});
