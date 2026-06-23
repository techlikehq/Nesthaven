import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool } from './db/pool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function run() {
  const sqlPath = join(__dirname, 'migrations', '005_reports.sql');
  const sql = readFileSync(sqlPath, 'utf-8');
  console.log('Running migration: 005_reports.sql ...');
  try {
    await pool.query(sql);
    console.log('✅ Migration 005 completed — reports table created.');
  } catch (err) {
    console.error('❌ Migration 005 failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
