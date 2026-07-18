const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });
async function test() {
  const client = new Client({ connectionString: process.env.POSTGRES_URL_NON_POOLING });
  await client.connect();
  const res = await client.query('SELECT NOW()');
  console.log(res.rows[0]);
  await client.end();
}
test().catch(console.error);
