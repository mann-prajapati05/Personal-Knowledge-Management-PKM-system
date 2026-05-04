import {
  createNote as createNoteQuery,
  getAllNotesByUserId,
  getNoteById as getNoteByIdQuery,
  updateNote as updateNoteQuery,
  deleteNote as deleteNoteQuery,
} from '../models/note.model.js';

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) return tags;
  if (typeof tags === 'string' && tags.trim().length > 0) {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
};

export const createNote = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    const note = await createNoteQuery({
      userId: req.user.id,
      title,
      content,
      tags: normalizeTags(tags),
    });

    return res.status(201).json(note);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const notes = await getAllNotesByUserId(req.user.id);
    return res.status(200).json(notes);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const noteId = Number(req.params.id);
    if (Number.isNaN(noteId)) {
      return res.status(400).json({ error: 'Invalid note id' });
    }

    const note = await getNoteByIdQuery({ id: noteId, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    return res.status(200).json(note);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const updateNote = async (req, res) => {
  try {
    const noteId = Number(req.params.id);
    if (Number.isNaN(noteId)) {
      return res.status(400).json({ error: 'Invalid note id' });
    }

    const { title, content, tags } = req.body;
    const updated = await updateNoteQuery({
      id: noteId,
      userId: req.user.id,
      title,
      content,
      tags: normalizeTags(tags),
    });

    if (!updated) {
      return res.status(404).json({ error: 'Note not found' });
    }

    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const noteId = Number(req.params.id);
    if (Number.isNaN(noteId)) {
      return res.status(400).json({ error: 'Invalid note id' });
    }

    const deleted = await deleteNoteQuery({ id: noteId, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ error: 'Note not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
