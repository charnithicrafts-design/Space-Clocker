import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SyncService } from './SyncService';
import * as DbClient from '../db/client';

/**
 * SyncService Test Suite: Stellar Data Synchronization
 * Aligning with Space-Clocker Engineering Standards (AAA, Isolated State, Space-Themed)
 */

vi.mock('@vercel/blob/client', () => ({
  upload: vi.fn().mockResolvedValue({ url: 'stellar-file-id-001' }),
}));

// Mock fetch for getFileMetadata
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

// Mock DbClient
vi.mock('../db/client', () => ({
  getDb: vi.fn().mockReturnValue({
    query: vi.fn().mockResolvedValue({ 
      rows: [{ last_synced_at: '2026-03-30T10:00:00Z' }] 
    })
  }),
  dbProxy: {
    exportToJson: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
    importFromJson: vi.fn().mockResolvedValue(undefined),
  },
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
    it('should uplink local database to Vercel Blob storage', async () => {
      // Arrange
      // Act
      const result = await syncService.pushUpdate();

      // Assert
      expect(DbClient.dbProxy.exportToJson).toHaveBeenCalled();
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

    it('should halt infinite retry loop and throw timeout on CORS/Network block', async () => {
      // Arrange
      const { upload } = await import('@vercel/blob/client');
      // Simulate Vercel Blob SDK throwing an AbortError due to our timeout
      const abortError = new Error('The user aborted a request.');
      abortError.name = 'AbortError';
      (upload as any).mockRejectedValueOnce(abortError);

      // Act & Assert
      await expect(syncService.pushUpdate()).rejects.toThrow('Upload timed out after 10 seconds. Network or CORS blocked.');
    });
  });

  describe('pullUpdate (Downlink)', () => {
    it('should downlink remote backup and restore local database', async () => {
      // Arrange
      const mockBlob = new Blob(['remote-nebula-data']);
      mockBlob.arrayBuffer = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]).buffer);
      fetchMock.mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(mockBlob) // downloadFile -> success
      });

      // Act
      await syncService.pullUpdate('andromeda-file-id-999');

      // Assert
      expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('andromeda-file-id-999')
      );
      expect(DbClient.dbProxy.importFromJson).toHaveBeenCalledWith(expect.any(Uint8Array));
      
      const db = DbClient.getDb();
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE sync_metadata'));
    });
  });

  describe('checkDivergence (Temporal Alignment)', () => {
    it('should detect when remote signal is newer than local logs', async () => {
      // Arrange
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ 
          found: true,
          url: 'f1',
          modifiedAt: '2026-04-01T00:00:00Z' // Newer than 2026-03-30
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
        ok: true,
        json: () => Promise.resolve({ 
          found: true,
          url: 'f1',
          modifiedAt: '2026-01-01T00:00:00Z' // Older or same
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
        ok: true,
        json: () => Promise.resolve({ found: false })
      });

      // Act
      const divergence = await syncService.checkDivergence();

      // Assert
      expect(divergence).toBe('none');
    });
  });
});
