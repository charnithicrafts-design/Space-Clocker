import { getDb, dumpDb, restoreDb } from '../db/client';

export interface SyncProvider {
  name: string;
  uploadFile: (name: string, blob: Blob) => Promise<string>;
  downloadFile: (fileId: string) => Promise<Blob>;
  getFileMetadata: (name: string) => Promise<{ id: string, modifiedAt: string } | null>;
}

class VercelBlobProvider implements SyncProvider {
  name = 'Vercel Blob';
  private clientId: string | null = null;

  setToken(token: string) {
    this.clientId = token;
  }

  async uploadFile(name: string, blob: Blob): Promise<string> {
    if (!this.clientId) throw new Error('Not authorized');

    console.log(`[VercelBlob] Uplinking sync payload...`);
    
    const response = await fetch(`/api/sync/upload?clientId=${this.clientId}`, {
      method: 'POST',
      body: blob
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result.url; // Returns the public vercel blob URL
  }

  async downloadFile(fileId: string): Promise<Blob> {
    if (!this.clientId) throw new Error('Not authorized');

    // fileId is the direct blob URL
    const response = await fetch(fileId);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    return await response.blob();
  }

  async getFileMetadata(name: string): Promise<{ id: string, modifiedAt: string } | null> {
    if (!this.clientId) return null;

    const response = await fetch(`/api/sync/info?clientId=${this.clientId}`);
    if (!response.ok) return null;

    const result = await response.json();
    if (result.found) {
      return {
        id: result.url,
        modifiedAt: result.modifiedAt
      };
    }
    return null;
  }
}

export class SyncService {
  private provider: VercelBlobProvider;

  constructor(provider: VercelBlobProvider = new VercelBlobProvider()) {
    this.provider = provider;
  }

  async authorize(clientId: string) {
    if (!clientId) throw new Error('Client ID required');
    
    // Instead of Google OAuth, we just bind the User's arbitrary Unique ID
    this.provider.setToken(clientId);
    return clientId;
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

  async getFileMetadata(name: string) {
    return this.provider.getFileMetadata(name);
  }
}

export const syncService = new SyncService();
