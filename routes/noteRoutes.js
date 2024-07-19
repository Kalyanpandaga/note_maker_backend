const express = require('express');
const router = express.Router();
const {
  createTag,
  createNote,
  getUserNotes,
  getArchivedNotes,
  getTrashedNotes,
  searchNotes,
  archiveNote,
  trashNote,
  unArchiveNote,
  unTrashNote,
  updateNote
} = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/tag/create', authMiddleware, createTag);
router.post('/note/create', authMiddleware, createNote);
router.get('/notes', authMiddleware, getUserNotes);
router.get('/archived/notes', authMiddleware, getArchivedNotes);
router.get('/trashed/notes', authMiddleware, getTrashedNotes);
router.get('notes/search', authMiddleware, searchNotes);
router.put('/note/:id/archive', authMiddleware, archiveNote);
router.put('/note/:id/trash', authMiddleware, trashNote);
router.put('/note/:id/unarchive', authMiddleware, unArchiveNote);
router.put('/note/:id/untrash', authMiddleware, unTrashNote);
router.put('/note/:id/update', authMiddleware, updateNote);

module.exports = router;