const { PGlite } = require("@electric-sql/pglite");

async function run() {
  const db = new PGlite();
  await db.query(`CREATE TABLE test_bool (id INTEGER PRIMARY KEY, b BOOLEAN)`);
  await db.query(`INSERT INTO test_bool (id, b) VALUES (1, false)`);
  
  try {
    await db.query(`UPDATE test_bool SET b = $1 WHERE id = 1`, [1]);
    console.log("UPDATE SUCCESS WITH 1");
  } catch (err) {
    console.error("UPDATE FAILED WITH 1:", err.message);
  }
}
run();
