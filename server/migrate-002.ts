import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool } from './db/pool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function run() {
  const sqlPath = join(__dirname, 'migrations', '002_ph_only.sql');
  const sql = readFileSync(sqlPath, 'utf-8');

  console.log('Running migration: 002_ph_only.sql ...');
  try {
    await pool.query(sql);
    console.log('✅ Migration 002 completed — site is now Port Harcourt only, 9 neighbourhoods total.');
  } catch (err) {
    console.error('❌ Migration 002 failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
