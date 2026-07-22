import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';
// In a true TDD approach, we import the functions that we will implement next.
// We assume they will be placed in src/db/sync-engine.ts
import { exportToJson, importFromJson } from '../sync-engine';



describe('JSON Compression Sync Engine', () => {
  let db: PGlite;

  beforeEach(async () => {
    // Spin up an in-memory PGLite instance for isolated tests
    db = new PGlite();

    // Create the necessary tables based on the required schema 
    // We only create a subset of tables for testing the sync engine
    await db.exec(`
      CREATE TABLE profile (id TEXT PRIMARY KEY, name TEXT);
      CREATE TABLE preferences (id TEXT PRIMARY KEY, theme TEXT);
      CREATE TABLE stats (id TEXT PRIMARY KEY, value INTEGER);
      CREATE TABLE oracle_config (id TEXT PRIMARY KEY, setting TEXT);
      CREATE TABLE sync_metadata (id TEXT PRIMARY KEY, last_sync TEXT);
      CREATE TABLE ambitions (id TEXT PRIMARY KEY, title TEXT);
      CREATE TABLE milestones (id TEXT PRIMARY KEY, title TEXT);
      CREATE TABLE tasks (id TEXT PRIMARY KEY, title TEXT);
      CREATE TABLE void_tasks (id TEXT PRIMARY KEY, title TEXT);
      CREATE TABLE reflections (id TEXT PRIMARY KEY, content TEXT);
      CREATE TABLE skills (id TEXT PRIMARY KEY, level INTEGER);
    `);
  });

  afterEach(async () => {
    await db.close();
  });

  describe('exportToJson', () => {
    it('should export all tables into a compressed Uint8Array', async () => {
      // Arrange
      await db.exec(`
        INSERT INTO profile (id, name) VALUES ('1', 'Commander');
        INSERT INTO preferences (id, theme) VALUES ('1', 'dark');
        INSERT INTO tasks (id, title) VALUES ('t1', 'Fix hyperdrive');
      `);

      // Act
      const result = await exportToJson(db);

      // Assert
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should handle empty tables gracefully', async () => {
      // Act
      const result = await exportToJson(db);

      // Assert
      expect(result).toBeInstanceOf(Uint8Array);
      
      // We use the native DecompressionStream to decode the payload
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(result);
          controller.close();
        }
      }).pipeThrough(new DecompressionStream('gzip'));
      const text = await new Response(stream).text();
      const payload = JSON.parse(text);
      expect(payload).toHaveProperty('profile');
      expect(payload.profile).toEqual([]);
      expect(payload).toHaveProperty('tasks');
      expect(payload.tasks).toEqual([]);
    });
  });

  describe('importFromJson', () => {
    it('should correctly import compressed payload and upsert records', async () => {
      // Arrange
      // Seed with initial data
      await db.exec(`
        INSERT INTO profile (id, name) VALUES ('1', 'Old Name');
      `);

      // Create a payload that updates 'profile' and adds a 'task'
      const payload = {
        profile: [{ id: '1', name: 'New Name' }],
        tasks: [{ id: 't1', title: 'New Task' }],
        preferences: [],
        stats: [],
        oracle_config: [],
        sync_metadata: [],
        ambitions: [],
        milestones: [],
        void_tasks: [],
        reflections: [],
        skills: []
      };

      const jsonString = JSON.stringify(payload);
      const uint8Array = new TextEncoder().encode(jsonString);
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(uint8Array);
          controller.close();
        }
      }).pipeThrough(new CompressionStream('gzip'));
      const compressedBlob = await new Response(stream).blob();
      const compressedData = new Uint8Array(await compressedBlob.arrayBuffer());

      // Act
      await importFromJson(db, compressedData);

      // Assert
      const profileResult = await db.query('SELECT * FROM profile');
      expect(profileResult.rows).toHaveLength(1);
      expect((profileResult.rows[0] as any).name).toBe('New Name'); // Updated

      const tasksResult = await db.query('SELECT * FROM tasks');
      expect(tasksResult.rows).toHaveLength(1);
      expect((tasksResult.rows[0] as any).title).toBe('New Task'); // Inserted
    });

    it('should roll back if an error occurs during import', async () => {
      // Arrange
      await db.exec(`
        INSERT INTO profile (id, name) VALUES ('1', 'Original');
      `);

      // Create a payload with an invalid table or schema mismatch
      const payload = {
        profile: [{ id: '2', name: 'New Profile' }],
        invalid_table: [{ id: '1' }] // This should throw when accessed or inserted
      };

      const jsonString = JSON.stringify(payload);
      const compressedData = new TextEncoder().encode(jsonString);

      // Act
      let error: any;
      try {
        await importFromJson(db, compressedData);
      } catch (e) {
        error = e;
      }

      // Assert
      expect(error).toBeDefined();

      // Ensure the 'profile' update was rolled back
      const profileResult = await db.query('SELECT * FROM profile');
      expect(profileResult.rows).toHaveLength(1);
      expect((profileResult.rows[0] as any).id).toBe('1');
    });
  });
});
