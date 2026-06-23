import { pool } from './db/pool.js';

async function main() {
  const res = await pool.query('SELECT id, name FROM agents ORDER BY name');
  console.log(res.rows);
  await pool.end();
}

main();
