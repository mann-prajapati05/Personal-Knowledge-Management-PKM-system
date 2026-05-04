import { getPool } from '../config/db.js';

const pool = getPool();

export const createNote = async ({ userId, title, content, tags }) => {
  const result = await pool.query(
    `INSERT INTO notes (user_id, title, content, tags)
     VALUES ($1, $2, $3, $4)
     RETURNING id, user_id, title, content, tags, created_at`,
    [userId, title ?? null, content ?? null, tags ?? []]
  );

  return result.rows[0];
};

export const getAllNotesByUserId = async (userId) => {
  const result = await pool.query(
    `SELECT id, user_id, title, content, tags, created_at
     FROM notes
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
};

export const getNoteById = async ({ id, userId }) => {
  const result = await pool.query(
    `SELECT id, user_id, title, content, tags, created_at
     FROM notes
     WHERE id = $1 AND user_id = $2`,
    [id, userId]
  );

  return result.rows[0] || null;
};

export const updateNote = async ({ id, userId, title, content, tags }) => {
  const result = await pool.query(
    `UPDATE notes
     SET title = $1,
         content = $2,
         tags = $3
     WHERE id = $4 AND user_id = $5
     RETURNING id, user_id, title, content, tags, created_at`,
    [title ?? null, content ?? null, tags ?? [], id, userId]
  );

  return result.rows[0] || null;
};

export const deleteNote = async ({ id, userId }) => {
  const result = await pool.query(
    `DELETE FROM notes
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [id, userId]
  );

  return result.rows[0] || null;
};
