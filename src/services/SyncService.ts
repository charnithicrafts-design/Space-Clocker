import { getDb, dbProxy } from '../db/client';


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

    console.log(`[VercelBlob] Uplinking sync payload... Size: ${blob.size} bytes (${(blob.size / 1024).toFixed(2)} KB)`);
    if (blob.size > 5 * 1024 * 1024) {
      console.warn('[VercelBlob] Payload exceeds default 5MB limit!');
    }
    
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 10000); // 10s cutoff
    
    try {
      const response = await fetch(`/api/sync/upload?clientId=${this.clientId}`, {
        method: 'POST',
        body: blob,
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server returned ${response.status}: ${errorText}`);
      }

      const newBlob = await response.json();
      clearTimeout(timeoutId);
      return newBlob.url;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError' || error.message.includes('abort')) {
        throw new Error('Upload timed out after 10 seconds. Network or CORS blocked.');
      }
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  async downloadFile(fileId: string): Promise<Blob> {
    if (!this.clientId) throw new Error('Not authorized');

    // fileId is the direct blob URL, but since the store is private, we must proxy it through our server
    const proxyUrl = `/api/sync/download?url=${encodeURIComponent(fileId)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Download failed (${response.status}): ${errorText}`);
    }
    
    return await response.blob();
  }

  async getFileMetadata(): Promise<{ id: string, modifiedAt: string } | null> {
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
    const uint8Array = await dbProxy.exportToJson();
    const blob = new Blob([uint8Array], { type: 'application/octet-stream' });
    const fileId = await this.provider.uploadFile('space-clocker-sync.json.gz', blob);
    
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
    const arrayBuffer = await blob.arrayBuffer();
    await dbProxy.importFromJson(new Uint8Array(arrayBuffer));
    
    const db = getDb();
    await db.query(`
      UPDATE sync_metadata SET last_synced_at = CURRENT_TIMESTAMP WHERE id = 1
    `);
  }

  async checkDivergence() {
    const meta = await this.provider.getFileMetadata();
    if (!meta) return 'none';

    const db = getDb();
    const localMeta = (await db.query('SELECT last_synced_at FROM sync_metadata WHERE id = 1')).rows[0];
    
    if (!localMeta || new Date(meta.modifiedAt) > new Date(localMeta.last_synced_at)) {
      return 'remote_newer';
    }

    return 'synced';
  }

  async getFileMetadata() {
    return this.provider.getFileMetadata();
  }
}

export const syncService = new SyncService();
