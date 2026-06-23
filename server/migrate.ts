import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool } from './db/pool.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function runMigration() {
  const sqlPath = join(__dirname, 'migrations', '001_init.sql');
  const sql = readFileSync(sqlPath, 'utf-8');

  console.log('Running migration: 001_init.sql ...');
  try {
    await pool.query(sql);
    console.log('✅ Migration completed successfully.');
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runMigration();
