const { PGlite } = require("@electric-sql/pglite");

async function run() {
  const db = new PGlite();
  await db.query(`CREATE TABLE oracle_config (id INTEGER PRIMARY KEY, api_key TEXT, model TEXT, provider_url TEXT, client_id TEXT, sync_enabled INTEGER, sync_tier TEXT, sync_expires_at TEXT, one_time_syncs_available INTEGER)`);
  await db.query(`INSERT INTO oracle_config (id) VALUES (1)`);
  
  try {
    await db.query(`
          UPDATE oracle_config 
          SET api_key = $1, 
              model = $2, 
              provider_url = $3,
              client_id = $4,
              sync_enabled = $5,
              sync_tier = $6,
              sync_expires_at = $7,
              one_time_syncs_available = $8
          WHERE id = 1
        `, [
          'test',
          'test',
          'test',
          'test',
          true, // BOOLEAN passed to INTEGER column
          'premium',
          null,
          0
        ]);
    console.log("UPDATE SUCCESS");
  } catch (err) {
    console.error("UPDATE FAILED:", err.message);
  }
}
run();
