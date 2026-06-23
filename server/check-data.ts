import { pool } from './db/pool.js';

async function main() {
  const agentsCount = await pool.query('SELECT COUNT(*) FROM agents');
  const propsCount = await pool.query('SELECT COUNT(*) FROM properties');
  const neighbourhoodsCount = await pool.query('SELECT COUNT(*) FROM neighbourhoods');
  const convosCount = await pool.query('SELECT COUNT(*) FROM conversations');
  const messagesCount = await pool.query('SELECT COUNT(*) FROM messages');

  console.log('agents:', agentsCount.rows[0].count);
  console.log('properties:', propsCount.rows[0].count);
  console.log('neighbourhoods:', neighbourhoodsCount.rows[0].count);
  console.log('conversations:', convosCount.rows[0].count);
  console.log('messages:', messagesCount.rows[0].count);

  await pool.end();
}

main();
