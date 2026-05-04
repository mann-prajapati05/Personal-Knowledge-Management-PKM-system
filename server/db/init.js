// server/src/db/init.js
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

const DB_NAME = process.env.DB_NAME;

// Step 1: connect to default postgres DB
const defaultPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres',   
  password: process.env.DB_PASS,
  port: Number(process.env.DB_PORT),
});

export const initializeDatabase = async () => {
  try {
    console.log('🔄 Checking database...');

    // Step 2: check if DB exists
    const res = await defaultPool.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [DB_NAME]
    );

    if (res.rowCount === 0) {
      console.log('⚠️ Database not found. Creating...');
      await defaultPool.query(`CREATE DATABASE ${DB_NAME}`);
      console.log('✅ Database created');
    } else {
      console.log('✅ Database already exists');
    }

    await defaultPool.end();

    // Step 3: connect to actual DB
    const appPool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: DB_NAME,
      password: process.env.DB_PASS,
      port: Number(process.env.DB_PORT),
    });

    // Step 4: read schema.sql
    const schemaPath = path.resolve('db/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Step 5: run schema (safe because IF NOT EXISTS)
    await appPool.query(schema);

    console.log('✅ Tables ready');

    await appPool.end();

  } catch (err) {
    console.error('❌ DB Init Error:', err.message);
  }
};