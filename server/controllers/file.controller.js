import { uploadFileToMinIO } from '../config/minio.js';
import { addFile, getFilesByNoteId, deleteFile } from '../models/file.model.js';
import { getNoteById } from '../models/note.model.js';

export const uploadFilesToNote = async (req, res) => {
  try {
    const noteId = Number(req.params.id);
    if (Number.isNaN(noteId)) {
      return res.status(400).json({ error: 'Invalid note id' });
    }

    // Verify note belongs to user
    const note = await getNoteById({ id: noteId, userId: req.user.id });
    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    // Verify files were provided
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      try {
        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        const fileName = `${timestamp}-${randomString}-${file.originalname}`;

        // Upload to MinIO
        const fileUrl = await uploadFileToMinIO(
          fileName,
          file.buffer,
          file.mimetype
        );

        // Save file record to database
        const fileRecord = await addFile({
          noteId,
          fileUrl,
        });

        uploadedFiles.push(fileRecord);
      } catch (error) {
        console.error('File upload error:', error.message);
        return res.status(500).json({ error: `Failed to upload ${file.originalname}` });
      }
    }

    return res.status(201).json({ files: uploadedFiles });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const getNoteFiles = async (req, res) => {
  try {
    const noteId = Number(req.params.id);
    if (Number.isNaN(noteId)) {
      return res.status(400).json({ error: 'Invalid note id' });
    }

    const files = await getFilesByNoteId({ noteId, userId: req.user.id });
    return res.status(200).json({ files });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const deleteNoteFile = async (req, res) => {
  try {
    const fileId = Number(req.params.fileId);
    if (Number.isNaN(fileId)) {
      return res.status(400).json({ error: 'Invalid file id' });
    }

    const deleted = await deleteFile({ fileId, userId: req.user.id });
    if (!deleted) {
      return res.status(404).json({ error: 'File not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
