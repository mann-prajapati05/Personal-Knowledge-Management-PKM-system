import pg from 'pg';
const { Pool } = pg;

let pool;

export const getPool = () => {
  if (!pool) {
    pool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS,
      port: Number(process.env.DB_PORT),
      max: 3,
      connectionTimeoutMillis: 2000,
    });

    console.log('Pool created');
  }

  return pool;
};