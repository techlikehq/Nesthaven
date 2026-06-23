import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool } from './db/pool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function run() {
  const sqlPath = join(__dirname, 'migrations', '004_agent_auth.sql');
  const sql = readFileSync(sqlPath, 'utf-8');

  console.log('Running migration: 004_agent_auth.sql ...');
  try {
    await pool.query(sql);
    console.log('✅ Migration 004 completed — agent_auth table created.');
  } catch (err) {
    console.error('❌ Migration 004 failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
