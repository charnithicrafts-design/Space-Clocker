const { PGlite } = require('@electric-sql/pglite');
const fs = require('fs');

async function main() {
  const db = new PGlite('./space-clocker-db'); // Wait, opfs is not in node directly by default unless we use opfs-ahp which requires browser. We might need to check how pglite stores locally. Or we can just inspect the codebase for how demo data is generated!
}
main();
