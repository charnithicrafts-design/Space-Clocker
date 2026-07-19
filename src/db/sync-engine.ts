import { PGlite } from '@electric-sql/pglite';

/**
 * Extracts all relevant tables, serializes to JSON, and compresses with GZIP.
 * Uses native Web Streams API to compress the JSON payload.
 */
export async function exportToJson(db: PGlite): Promise<Uint8Array> {
  const tables = [
    'profile', 'preferences', 'stats', 'oracle_config', 'sync_metadata',
    'ambitions', 'milestones', 'tasks', 'void_tasks', 'reflections', 'skills'
  ];
  
  const payload: Record<string, any[]> = {};
  
  for (const table of tables) {
    const result = await db.query(`SELECT * FROM ${table}`);
    payload[table] = result.rows;
  }
  
  const jsonString = JSON.stringify(payload);
  
  const uint8Array = new TextEncoder().encode(jsonString);
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(uint8Array);
      controller.close();
    }
  }).pipeThrough(new CompressionStream('gzip'));
    
  const compressedBlob = await new Response(stream).blob();
  return new Uint8Array(await compressedBlob.arrayBuffer());
}

/**
 * Decompresses GZIP data, deserializes JSON, and performs topological UPSERTs.
 */
export async function importFromJson(db: PGlite, compressedData: Uint8Array): Promise<void> {
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(compressedData);
      controller.close();
    }
  }).pipeThrough(new DecompressionStream('gzip'));
    
  const decompressedText = await new Response(stream).text();
  const payload = JSON.parse(decompressedText);
  
  const importOrder = [
    'profile', 'preferences', 'stats', 'oracle_config', 'sync_metadata',
    'ambitions', 'milestones', 'tasks', 'void_tasks', 'reflections', 'skills'
  ];
  
  await db.query('BEGIN');
  
  try {
    for (const table of importOrder) {
      const rows = payload[table];
      if (!rows || rows.length === 0) continue;
      
      const columns = Object.keys(rows[0]);
      
      for (const row of rows) {
        const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
        const updateSet = columns.map(col => `${col} = EXCLUDED.${col}`).join(', ');
        
        const sql = `
          INSERT INTO ${table} (${columns.join(', ')}) 
          VALUES (${placeholders}) 
          ON CONFLICT (id) DO UPDATE SET ${updateSet}
        `;
        
        const values = columns.map(col => row[col]);
        await db.query(sql, values);
      }
    }
    
    await db.query('COMMIT');
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
}
