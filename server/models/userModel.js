import { getPool } from '../config/db.js';

const pool = getPool();

export const createUser = async ({ email, password }) => {
  const result = await pool.query(
    `INSERT INTO users (email, password)
     VALUES ($1, $2)
     RETURNING *`,
    [email, password]
  );

  return result.rows[0];
};

export const getUserByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  return result.rows[0];
};