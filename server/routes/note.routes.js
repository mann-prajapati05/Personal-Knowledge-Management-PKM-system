import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} from '../controllers/note.controller.js';
import {
  uploadFilesToNote,
  getNoteFiles,
  deleteNoteFile,
} from '../controllers/file.controller.js';
import { uploadMiddleware } from '../config/multer.js';

const router = express.Router();

router.use(authMiddleware);

router.post('/', createNote);
router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

// File upload routes
router.post('/:id/upload', uploadMiddleware.array('files', 10), uploadFilesToNote);
router.get('/:id/files', getNoteFiles);
router.delete('/:id/files/:fileId', deleteNoteFile);

export default router;
