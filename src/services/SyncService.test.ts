import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SyncService } from './SyncService';
import * as DbClient from '../db/client';

// Mock fetch
const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

// Mock DbClient
vi.mock('../db/client', () => ({
  getDb: vi.fn().mockReturnValue({
    query: vi.fn().mockResolvedValue({ rows: [{ last_synced_at: '2023-01-01T00:00:00Z' }] })
  }),
  dumpDb: vi.fn().mockResolvedValue(new Blob(['test-dump'])),
  restoreDb: vi.fn().mockResolvedValue(undefined),
}));

describe('SyncService', () => {
  let syncService: SyncService;

  beforeEach(() => {
    vi.clearAllMocks();
    syncService = new SyncService();
    // Set a mock token to simulate authorized state
    (syncService as any).provider.setToken('mock-token');
  });

  describe('pushUpdate', () => {
    it('should dump database, upload file and update metadata', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({ files: [] }) // getFileMetadata -> not found
      });
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({ id: 'remote-file-id' }) // uploadFile -> success
      });

      const result = await syncService.pushUpdate();

      expect(DbClient.dumpDb).toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(result.fileId).toBe('remote-file-id');
      
      const db = DbClient.getDb();
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO sync_metadata'), ['remote-file-id']);
    });
  });

  describe('pullUpdate', () => {
    it('should download file and restore database', async () => {
      const mockBlob = new Blob(['remote-data']);
      fetchMock.mockResolvedValueOnce({
        blob: () => Promise.resolve(mockBlob) // downloadFile -> success
      });

      await syncService.pullUpdate('remote-file-id');

      expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('remote-file-id'), expect.any(Object));
      expect(DbClient.restoreDb).toHaveBeenCalledWith(mockBlob);
      
      const db = DbClient.getDb();
      expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE sync_metadata'));
    });
  });

  describe('checkDivergence', () => {
    it('should detect when remote is newer', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          files: [{ id: 'f1', modifiedTime: '2023-02-01T00:00:00Z' }] 
        })
      });

      const divergence = await syncService.checkDivergence();
      expect(divergence).toBe('remote_newer');
    });

    it('should detect when synced', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({ 
          files: [{ id: 'f1', modifiedTime: '2022-01-01T00:00:00Z' }] 
        })
      });

      const divergence = await syncService.checkDivergence();
      expect(divergence).toBe('synced');
    });

    it('should return none if no remote file', async () => {
      fetchMock.mockResolvedValueOnce({
        json: () => Promise.resolve({ files: [] })
      });

      const divergence = await syncService.checkDivergence();
      expect(divergence).toBe('none');
    });
  });
});
