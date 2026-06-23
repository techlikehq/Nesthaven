import { pool } from './db/pool.js';

async function main() {
  const res = await pool.query('DELETE FROM conversations RETURNING id');
  console.log(`Cleared ${res.rowCount} test conversation(s) (messages cascade-deleted automatically).`);
  await pool.end();
}

main();
