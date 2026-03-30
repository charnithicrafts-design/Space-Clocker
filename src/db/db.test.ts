/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';

describe('Pglite Data Layer', () => {
  let db: PGlite;

  beforeEach(async () => {
    db = new PGlite('memory://');
    const SCHEMA = `
      CREATE TABLE IF NOT EXISTS profile (
        id INTEGER PRIMARY KEY DEFAULT 1,
        name TEXT,
        level INTEGER,
        title TEXT
      );
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT false
      );
    `;
    await db.exec(SCHEMA);
  }, 30000);

  it('should initialize schema and insert profile', async () => {
    await db.query(`INSERT INTO profile (id, name, level, title) VALUES (1, 'Test Pilot', 10, 'Commander')`);
    const res = await db.query(`SELECT * FROM profile WHERE id = 1`);
    expect(res.rows[0]).toEqual({
      id: 1,
      name: 'Test Pilot',
      level: 10,
      title: 'Commander'
    });
  });

  it('should handle task CRUD', async () => {
    // Create
    await db.query(`INSERT INTO tasks (id, title, completed) VALUES ('t1', 'Test Task', false)`);
    
    // Read
    let res = await db.query<any>(`SELECT * FROM tasks WHERE id = 't1'`);
    expect(res.rows[0].title).toBe('Test Task');
    
    // Update
    await db.query(`UPDATE tasks SET completed = true WHERE id = 't1'`);
    res = await db.query<any>(`SELECT completed FROM tasks WHERE id = 't1'`);
    expect(res.rows[0].completed).toBe(true);
    
    // Delete
    await db.query(`DELETE FROM tasks WHERE id = 't1'`);
    res = await db.query<any>(`SELECT count(*) as count FROM tasks`);
    expect(res.rows[0].count).toBe(0);
  });
});
