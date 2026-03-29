import { getDb, dumpDb, restoreDb } from '../db/client';

export interface SyncProvider {
  name: string;
  uploadFile: (name: string, blob: Blob) => Promise<string>;
  downloadFile: (fileId: string) => Promise<Blob>;
  getFileMetadata: (name: string) => Promise<{ id: string, modifiedAt: string } | null>;
}

class GoogleDriveProvider implements SyncProvider {
  name = 'Google Drive';

  async uploadFile(name: string, blob: Blob): Promise<string> {
    // Mock implementation for now
    console.log(`[GoogleDrive] Uploading ${name}...`);
    return 'mock-file-id';
  }

  async downloadFile(fileId: string): Promise<Blob> {
    // Mock implementation
    console.log(`[GoogleDrive] Downloading ${fileId}...`);
    return new Blob([]);
  }

  async getFileMetadata(name: string): Promise<{ id: string, modifiedAt: string } | null> {
    // Mock implementation
    return null;
  }
}

export class SyncService {
  private provider: SyncProvider;

  constructor(provider: SyncProvider = new GoogleDriveProvider()) {
    this.provider = provider;
  }

  async pushUpdate() {
    const blob = await dumpDb();
    const fileId = await this.provider.uploadFile('space-clocker-sync.pgdump', blob);
    
    const db = getDb();
    await db.query(`
      INSERT INTO sync_metadata (id, last_synced_at, remote_file_id) 
      VALUES (1, CURRENT_TIMESTAMP, $1) 
      ON CONFLICT (id) DO UPDATE SET 
        last_synced_at = CURRENT_TIMESTAMP, 
        remote_file_id = $1
    `, [fileId]);

    return { fileId, syncedAt: new Date().toISOString() };
  }

  async pullUpdate(fileId: string) {
    const blob = await this.provider.downloadFile(fileId);
    await restoreDb(blob);
    
    const db = getDb();
    await db.query(`
      UPDATE sync_metadata SET last_synced_at = CURRENT_TIMESTAMP WHERE id = 1
    `);
  }

  async checkDivergence() {
    const meta = await this.provider.getFileMetadata('space-clocker-sync.pgdump');
    if (!meta) return 'none';

    const db = getDb();
    const localMeta = (await db.query('SELECT last_synced_at FROM sync_metadata WHERE id = 1')).rows[0];
    
    if (!localMeta || new Date(meta.modifiedAt) > new Date(localMeta.last_synced_at)) {
      return 'remote_newer';
    }

    return 'synced';
  }
}

export const syncService = new SyncService();
