const { PGlite } = require('@electric-sql/pglite');
(async () => {
  const db = new PGlite();
  await db.query(`CREATE TABLE tasks (id serial, planned_date text, completed boolean)`);
  await db.query(`INSERT INTO tasks (planned_date, completed) VALUES ('2026-07-27', true), ('2026-07-26', true)`);
  const res = await db.query(
    `SELECT planned_date as date, COUNT(*) as count 
     FROM tasks 
     WHERE completed = true AND planned_date::date >= CURRENT_DATE - ($1 * INTERVAL '1 day')
     GROUP BY planned_date 
     ORDER BY planned_date ASC`, 
    [30]
  );
  console.log(res.rows);
})();
