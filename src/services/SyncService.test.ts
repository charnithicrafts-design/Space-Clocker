import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SyncService } from './SyncService';
import * as DbClient from '../db/client';

/**
 * SyncService Test Suite: Stellar Data Synchronization
 * Aligning with Space-Clocker Engineering Standards (AAA, Isolated State, Space-Themed)
 */

// Mock fetch
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

// Mock DbClient
vi.mock('../db/client', () => ({
  getDb: vi.fn().mockReturnValue({
    query: vi.fn().mockResolvedValue({ 
      rows: [{ last_synced_at: '2026-03-30T10:00:00Z' }] 
    })
  }),
  dumpDb: vi.fn().mockResolvedValue(new Blob(['nebula-database-dump'], { type: 'application/octet-stream' })),
  restoreDb: vi.fn().mockResolvedValue(undefined),
}));

describe('SyncService: Stellar Uplink Protocol', () => {
  let syncService: SyncService;

  beforeEach(() => {
    vi.clearAllMocks();
    syncService = new SyncService();
    // Authorized session with Void Token
    (syncService as any).provider.setToken('void-token-777');
  });

  describe('pushUpdate (Uplink)', () => {
    it('should uplink local database to Google Drive appDataFolder', async () => {
      // Arrange
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({ files: [] }) // getFileMetadata -> not found in this sector
      });
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({ id: 'stellar-file-id-001' }) // uploadFile -> success
      });

      // Act
      const result = await syncService.pushUpdate();

      // Assert
      expect(DbClient.dumpDb).toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledTimes(2); // Metadata check + Upload
      expect(result.fileId).toBe('stellar-file-id-001');
      
      const db = DbClient.getDb();
      expect(db.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO sync_metadata'), 
        ['stellar-file-id-001']
      );
    });

    it('should throw error if authorization signal is lost', async () => {
      // Arrange
      (syncService as any).provider.setToken(null);

      // Act & Assert
      await expect(syncService.pushUpdate()).rejects.toThrow('Not authorized');
    });
  });

  describe('pullUpdate (Downlink)', () => {
    it('should downlink remote backup and restore local database', async () => {
      // Arrange
      const mockBlob = new Blob(['remote-nebula-data']);
      fetchMock.mockResolvedValueOnce({
        blob: () => Promise.resolve(mockBlob) // downloadFile -> success
      });

      // Act
      await syncService.pullUpdate('andromeda-file-id-999');

      // Assert
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('andromeda-file-id-999'), 
        expect.any(Object)
      );
      expect(DbClient.restoreDb).toHaveBeenCalledWith(mockBlob);
      
      const db = DbClient.getDb();
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE sync_metadata'));
    });
  });

  describe('checkDivergence (Temporal Alignment)', () => {
    it('should detect when remote signal is newer than local logs', async () => {
      // Arrange
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          files: [{ id: 'f1', modifiedTime: '2026-04-01T00:00:00Z' }] // Newer than 2026-03-30
        })
      });

      // Act
      const divergence = await syncService.checkDivergence();

      // Assert
      expect(divergence).toBe('remote_newer');
    });

    it('should detect when local logs are aligned with stellar backup', async () => {
      // Arrange
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          files: [{ id: 'f1', modifiedTime: '2026-01-01T00:00:00Z' }] // Older or same
        })
      });

      // Act
      const divergence = await syncService.checkDivergence();

      // Assert
      expect(divergence).toBe('synced');
    });

    it('should return "none" if no stellar backup is found', async () => {
      // Arrange
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({ files: [] })
      });

      // Act
      const divergence = await syncService.checkDivergence();

      // Assert
      expect(divergence).toBe('none');
    });
  });
});
