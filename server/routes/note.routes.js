import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '../controllers/note.controller.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createNote);
router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
