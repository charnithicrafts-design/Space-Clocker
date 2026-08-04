const { PGlite } = require('@electric-sql/pglite');

async function check() {
  // Try to load the simulation DB or whatever the last one was
  // PGlite runs in memory or idb. Since we're in node, we can't access IDB from browser!
}
check();
