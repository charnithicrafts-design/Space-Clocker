/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { PGlite } from '@electric-sql/pglite';

describe('Pglite Data Layer - Stellar Database', () => {
  let db: PGlite;

  beforeEach(async () => {
    // Arrange: Initialize a fresh in-memory database and schema for isolated state
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
        completed BOOLEAN DEFAULT false,
        completed_at TEXT
      );
    `;
    await db.exec(SCHEMA);
  }, 30000);

  it('should initialize schema and persist profile telemetry', async () => {
    // Arrange
    const commanderData = {
      id: 1,
      name: 'Commander Shepard',
      level: 50,
      title: 'Spectre'
    };

    // Act: Insert profile record into the stellar database
    await db.query(
      `INSERT INTO profile (id, name, level, title) VALUES ($1, $2, $3, $4)`,
      [commanderData.id, commanderData.name, commanderData.level, commanderData.title]
    );
    
    // Assert: Verify data integrity in the data layer
    const res = await db.query(`SELECT * FROM profile WHERE id = 1`);
    expect(res.rows[0]).toEqual(commanderData);
  });

  it('should handle stellar task CRUD lifecycle', async () => {
    // Arrange: Define mission data
    const missionId = 'mission-01';
    const missionTitle = 'Calibrate Normandy Sensors';
    
    // Act (Create): Schedule a new mission task
    await db.query(
      `INSERT INTO tasks (id, title, completed) VALUES ($1, $2, $3)`,
      [missionId, missionTitle, false]
    );
    
    // Assert (Read)
    let res = await db.query<any>(`SELECT * FROM tasks WHERE id = $1`, [missionId]);
    expect(res.rows[0].title).toBe(missionTitle);
    
    // Act (Update): Complete the mission
    await db.query(`UPDATE tasks SET completed = true WHERE id = $1`, [missionId]);
    
    // Assert (Update)
    res = await db.query<any>(`SELECT completed FROM tasks WHERE id = $1`, [missionId]);
    expect(res.rows[0].completed).toBe(true);
    
    // Act (Delete): Purge mission logs from database
    await db.query(`DELETE FROM tasks WHERE id = $1`, [missionId]);
    
    // Assert (Delete)
    res = await db.query<any>(`SELECT count(*) as count FROM tasks`);
    expect(Number(res.rows[0].count)).toBe(0);
  });
});
