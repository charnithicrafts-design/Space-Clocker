import { getDb, dumpDb, restoreDb } from '../db/client';

export interface SyncProvider {
  name: string;
  uploadFile: (name: string, blob: Blob) => Promise<string>;
  downloadFile: (fileId: string) => Promise<Blob>;
  getFileMetadata: (name: string) => Promise<{ id: string, modifiedAt: string } | null>;
}

class GoogleDriveProvider implements SyncProvider {
  name = 'Google Drive';
  private accessToken: string | null = null;

  setToken(token: string) {
    this.accessToken = token;
  }

  async uploadFile(name: string, blob: Blob): Promise<string> {
    if (!this.accessToken) throw new Error('Not authorized');

    console.log(`[GoogleDrive] Uplinking ${name}...`);
    
    // First, check if file exists to update or create
    const meta = await this.getFileMetadata(name);
    
    const metadata = {
      name: name,
      mimeType: 'application/octet-stream',
      parents: ['appDataFolder']
    };

    const formData = new FormData();
    formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    formData.append('file', blob);

    const url = meta 
      ? `https://www.googleapis.com/upload/drive/v3/files/${meta.id}?uploadType=multipart`
      : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';

    const response = await fetch(url, {
      method: meta ? 'PATCH' : 'POST',
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      },
      body: formData
    });

    const result = await response.json();
    return result.id;
  }

  async downloadFile(fileId: string): Promise<Blob> {
    if (!this.accessToken) throw new Error('Not authorized');

    const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    return await response.blob();
  }

  async getFileMetadata(name: string): Promise<{ id: string, modifiedAt: string } | null> {
    if (!this.accessToken) return null;

    const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${name}'&spaces=appDataFolder&fields=files(id,modifiedTime)`, {
      headers: {
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    const result = await response.json();
    if (result.files && result.files.length > 0) {
      return {
        id: result.files[0].id,
        modifiedAt: result.files[0].modifiedTime
      };
    }
    return null;
  }
}

export class SyncService {
  private provider: GoogleDriveProvider;

  constructor(provider: GoogleDriveProvider = new GoogleDriveProvider()) {
    this.provider = provider;
  }

  async authorize(clientId: string) {
    if (!clientId) throw new Error('Client ID required');
    
    const scope = 'https://www.googleapis.com/auth/drive.appdata';
    const redirectUri = window.location.origin;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}`;
    
    // In a real app, we'd handle the redirect. For this prototype, we'll open a popup.
    const win = window.open(authUrl, 'google-auth', 'width=500,height=600');
    
    return new Promise<string>((resolve, reject) => {
      const timer = setInterval(() => {
        try {
          if (win?.closed) {
            clearInterval(timer);
            reject(new Error('Auth window closed'));
          }
          if (win?.location.hash) {
            const params = new URLSearchParams(win.location.hash.substring(1));
            const token = params.get('access_token');
            if (token) {
              this.provider.setToken(token);
              win.close();
              clearInterval(timer);
              resolve(token);
            }
          }
        } catch (e) {
          // Cross-origin errors expected until redirect happens
        }
      }, 500);
    });
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
    const localMeta = (await db.query<{ last_synced_at: string }>('SELECT last_synced_at FROM sync_metadata WHERE id = 1')).rows[0];
    
    if (!localMeta || new Date(meta.modifiedAt) > new Date(localMeta.last_synced_at)) {
      return 'remote_newer';
    }

    return 'synced';
  }
}

export const syncService = new SyncService();
