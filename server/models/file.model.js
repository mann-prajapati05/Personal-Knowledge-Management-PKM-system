import { getPool } from '../config/db.js';

const pool = getPool();

export const addFile = async ({ noteId, fileUrl }) => {
  const result = await pool.query(
    `INSERT INTO files (note_id, file_url)
     VALUES ($1, $2)
     RETURNING id, note_id, file_url`,
    [noteId, fileUrl]
  );

  return result.rows[0];
};

export const getFilesByNoteId = async ({ noteId, userId }) => {
  const result = await pool.query(
    `SELECT f.id, f.note_id, f.file_url
     FROM files f
     INNER JOIN notes n ON f.note_id = n.id
     WHERE f.note_id = $1 AND n.user_id = $2
     ORDER BY f.id DESC`,
    [noteId, userId]
  );

  return result.rows;
};

export const deleteFile = async ({ fileId, userId }) => {
  const result = await pool.query(
    `DELETE FROM files f
     USING notes n
     WHERE f.id = $1 AND f.note_id = n.id AND n.user_id = $2
     RETURNING id`,
    [fileId, userId]
  );

  return result.rows[0] || null;
};
